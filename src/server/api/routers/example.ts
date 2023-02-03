import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  address: publicProcedure
    .input(z.object({text: z.string()}))
    .query(async ({input}) => {
      return {address: ""};
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});


