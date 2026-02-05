import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { accountLinkingRouter } from "./routers/accountLinkingRouter";
import { aiRouter } from "./routers/aiRouter";
import { publishingRouter } from "./routers/publishingRouter";
import { notificationRouter } from "./routers/notificationRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  accountLinking: accountLinkingRouter,
  ai: aiRouter,
  publishing: publishingRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
