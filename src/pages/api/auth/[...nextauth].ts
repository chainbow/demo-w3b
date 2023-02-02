import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AuthOptions } from "next-auth/core/types";
import Twitter from "next-auth/providers/twitter";
import Email from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import { useSession } from "next-auth/react";

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
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
function text({url, host, token}: { url: string; host: string; token: string }) {
  return `Sign in to ${ host }\n${ url }\n${ token }\n`;
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // Configure one or more authentication providers
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
      async generateVerificationToken() {
        return String(Math.floor(Math.random() * 899999) + 100000);
      },
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
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {


      console.info("signIn====", user, account, profile, email, credentials);

      return true;
    },
    async redirect({url, baseUrl}) {
      console.info("redirect====", url, baseUrl);
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${ baseUrl }${ url }`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({session, user, token}) {
      console.info("session====", session);

      return session;
    },
    async jwt({token, user, account, profile, isNewUser}) {
      return token;
    },
  },
};

export default NextAuth(authOptions);
