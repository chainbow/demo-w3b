import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import Email from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db";

function html(params: { token: string }) {
  const {token} = params;

  return `
        <body>
          <div>[dagen] Verification Code</div>

          <br />
          <br />
          <br />
          
          <div>Here is your dagen verification code. Please enter it soon before it expires in 10 minutes:</div>
          <br />
          <div style="font-size: 22px;">
            <strong>${ token }</strong>
          </div>
          <br />
          <div>If you did not initiate this operation, please ignore it.</div>
          <div>dagen Team</div>
        </body>
        `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({
  url,
  host,
  token,
}: {
  url: string;
  host: string;
  token: string;
}) {
  return `Sign in to ${ host }\n${ url }\n${ token }\n`;
}


export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({req}),
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Twitter({
      clientId: process.env.TWITTER_ID ?? "",
      clientSecret: process.env.TWITTER_SECRET ?? "",
      version: "2.0",
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        const {identifier, url, provider, theme, token} = params;
        const {host} = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${ host }`,
          text: text({url, host, token}),
          html: html({token}),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${ failed.join(", ") }) could not be sent`);
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({session, token, user}) {
        const userInfo = {accountId: "", type: "email"};
        if (token.sub) {
          session.address = token.sub
          session.user.name = token.sub
          session.user.image = "https://www.fillmurray.com/128/128"
          userInfo.accountId = token.sub;
          userInfo.type = "wallet";
          session.user.walletAddress = token.sub;
        }
        if (session.user && user?.id) {
          session.user.id = user.id;
          userInfo.accountId = user.id;
          // session.user.role = user.role; <-- put other properties on the session here
        }
        console.info(`[session session]`, session, user, token);

        const myHeaders = new Headers();
        myHeaders.set("apikey", process.env.API_KEY as string);
        const myRequest = new Request(
          `http://wallet3.net/api/address?accountId=${ userInfo.accountId }&provider=${ userInfo.type }`,
          {
            method: "GET",
            headers: myHeaders,
          },
        );

        const res = await fetch(myRequest);
        const json = await res.json();
        console.log(json);
        if (userInfo.type !== "wallet") {
          session.user.walletAddress = json.address;
        }
        return session;
      },
    },
  });
}







