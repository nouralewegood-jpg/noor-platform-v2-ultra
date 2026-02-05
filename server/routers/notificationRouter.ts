import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  sendWeeklyReport,
  generateWeeklyReport,
  sendContentGenerationNotification,
  sendCampaignLaunchNotification,
  sendPerformanceAlertNotification,
  sendDailyDigestNotification,
} from "../services/reportsAndNotifications";

export const notificationRouter = router({
  /**
   * إرسال تقرير أسبوعي يدوي
   */
  sendWeeklyReport: protectedProcedure
    .input(
      z.object({
        weekStart: z.string().optional(),
        weekEnd: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const start = input.weekStart ? new Date(input.weekStart) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const end = input.weekEnd ? new Date(input.weekEnd) : new Date();
        
        const report = await generateWeeklyReport(start, end, ctx.user.id);
        const success = await sendWeeklyReport(ctx.user.id, report);
        
        return {
          success,
          message: success ? "تم إرسال التقرير الأسبوعي بنجاح" : "فشل إرسال التقرير الأسبوعي",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * إرسال إشعار توليد محتوى
   */
  notifyContentGenerated: protectedProcedure
    .input(
      z.object({
        count: z.number(),
        types: z.array(z.string()),
        platforms: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await sendContentGenerationNotification(
          input.count,
          input.types,
          input.platforms
        );
        return { success };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /**
   * إرسال إشعار إطلاق حملة
   */
  notifyCampaignLaunched: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        targetAudience: z.string(),
        expectedReach: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await sendCampaignLaunchNotification(
          input.name,
          input.targetAudience,
          input.expectedReach
        );
        return { success };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /**
   * إرسال تنبيه أداء
   */
  notifyPerformanceAlert: protectedProcedure
    .input(
      z.object({
        metric: z.string(),
        currentValue: z.number(),
        threshold: z.number(),
        status: z.enum(["high", "low"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await sendPerformanceAlertNotification(
          input.metric,
          input.currentValue,
          input.threshold,
          input.status
        );
        return { success };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /**
   * إرسال ملخص يومي
   */
  sendDailyDigest: protectedProcedure
    .input(
      z.object({
        postsPublished: z.number(),
        engagementTotal: z.number(),
        topPost: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await sendDailyDigestNotification(
          input.postsPublished,
          input.engagementTotal,
          input.topPost
        );
        return { success };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),
});
