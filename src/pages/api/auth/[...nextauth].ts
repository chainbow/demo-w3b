import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AuthOptions } from "next-auth/core/types";
import Twitter from "next-auth/providers/twitter";

export const authOptions: AuthOptions = {
  // adapter: MongoDBAdapter(clientPromise),
  // Configure one or more authentication providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Twitter({
      clientId: process.env.TWITTER_ID ?? "",
      clientSecret: process.env.TWITTER_SECRET ?? "",
      version: '2.0',
    }),
    // ...add more providers here
  ],
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
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
      return session;
    },
    async jwt({token, user, account, profile, isNewUser}) {
      return token;
    },
  },
};

export default NextAuth(authOptions);
