import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { AuthUser, AuthUserModel } from "../../model";

export const exampleRouter = createTRPCRouter({
  address: publicProcedure
    .input(z.object({text: z.string()}))
    .query(async ({input}) => {
      const user: AuthUser = await AuthUserModel.findOne({userName: input.text}).lean();
      return {address: user?.userAddress ?? ""};
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
