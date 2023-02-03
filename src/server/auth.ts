import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { prisma } from "./db";
import { createTransport } from "nodemailer";

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

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      walletAddress: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }

      const myHeaders = new Headers();
      myHeaders.set("apikey", process.env.API_KEY as string);

      const myRequest = new Request(
        `http://wallet3.net/api/address?accountId=${user.id}&provider=email`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      const res = await fetch(myRequest);
      const json = await res.json();
      console.log(json);
      session.user.walletAddress = json.address;

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
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
        const { identifier, url, provider, theme, token } = params;
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: text({ url, host, token }),
          html: html({ token }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
