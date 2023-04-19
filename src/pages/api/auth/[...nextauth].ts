import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { createTransport } from "nodemailer";
import { SiweMessage } from "siwe";
import { prisma } from "../../../server/db";

function html(params: { token: string }) {
  const { token } = params;

  return `
        <body>
          <div>[dagen] Verification Code</div>

          <br />
          <br />
          <br />
          
          <div>Here is your dagen verification code. Please enter it soon before it expires in 10 minutes:</div>
          <br />
          <div style="font-size: 22px;">
            <strong>${token}</strong>
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
  return `Sign in to ${host}\n${url}\n${token}\n`;
}

export async function sendVerificationRequest(params) {
  const { identifier, url, token } = params

  const { host } = new URL(url)
  const transport = createTransport({
    // @ts-ignore
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
      user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD
    }
  })
  const result = await transport.sendMail({
    to: identifier,
    from: process.env.EMAIL_FROM,
    subject: `Sign in to ${host}`,
    text: text({ url, host, token }),
    html: html({ token }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}

export function generateVerificationToken() {
  const n = Math.floor(Math.random() * 1000000).toString()
  if (n.length < 6) return '0'.repeat(6 - n.length) + n
  else return n
}

async function linkWallet3Business(accountId: string) {
  const myHeaders = new Headers();
  myHeaders.set("apikey", process.env.API_KEY as string);
  const myRequest = new Request(
    `http://wallet3.net/api/address?accountId=${accountId}`,
    {
      method: "GET",
      headers: myHeaders,
    },
  );

  try {
    const res = await fetch(myRequest);
    const json = await res.json();
    return json.address
  } catch (error) {
    console.error("🚀 ~ file: auth.ts:119 ~ linkWallet3Business ~ error:", error)
    return null
  }
}

export default async function auth(req: any, res: any) {
  const providers = [CredentialsProvider({
    // ! Don't add this
    // - it will assume more than one auth provider 
    // - and redirect to a sign-in page meant for oauth
    // - id: 'siwe', 
    name: "Ethereum",
    type: "credentials", // default for Credentials
    // Default values if it was a form
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
    authorize: async (credentials) => {
      try {
        const siwe = new SiweMessage(JSON.parse(credentials?.message as string ?? "{}") as Partial<SiweMessage>);
        const fields = await siwe.validate(credentials?.signature || "")

        // Check if user exists
        let user = await prisma.user.findUnique({
          where: {
            walletAddress: fields.address
          }
        });
        // Create new user if doesn't exist
        if (!user) {
          user = await prisma.user.create({
            data: {
              walletAddress: fields.address
            }
          });
        }

        return user
      } catch (error) {
        // Uncomment or add logging if needed
        console.error({ error });
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
    generateVerificationToken,
    sendVerificationRequest
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
      async session({ session, token, user }) {
        if (session.user) {
          if (token.walletAddress) session.user.walletAddress = token.walletAddress as string
          else session.user.walletAddress = await linkWallet3Business(token.sub!)
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user && user.walletAddress) {
          token.walletAddress = user.walletAddress
        }
        return token
      },
    },
  });
}







