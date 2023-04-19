import type { GetServerSidePropsContext } from "next";
import type { DefaultSession, DefaultUser } from "next-auth";
import { getServerSession } from "next-auth";
import auth from "../pages/api/auth/[...nextauth]";


/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    address?: string;
    user: {
      id: string;
      walletAddress: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    walletAddress?: string | null;
  }
}

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const authOptions = await auth(ctx.req, ctx.res);
  return getServerSession(ctx.req, ctx.res, authOptions);
};
