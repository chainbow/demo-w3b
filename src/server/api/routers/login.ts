import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const loginRouter = createTRPCRouter({
  signMessage: publicProcedure
    .input(z.object({text: z.string()}))
    .query(async ({input}) => {
      const address = input.text;
      return {success: true, result: address};
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
