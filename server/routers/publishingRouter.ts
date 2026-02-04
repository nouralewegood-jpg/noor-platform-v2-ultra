import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  publishToAllPlatforms,
  scheduleContent,
  getPublishedContent,
  getScheduledContent,
} from "../services/autoPublishingSystem";

export const publishingRouter = router({
  /**
   * نشر محتوى فوراً على المنصات المختارة
   */
  publishNow: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
        hashtags: z.array(z.string()),
        platforms: z.array(
          z.enum([
            "facebook",
            "instagram",
            "tiktok",
            "youtube",
            "snapchat",
            "pinterest",
            "google-business",
            "blogger",
          ])
        ),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await publishToAllPlatforms({
          userId: ctx.user.id,
          ...input,
        });

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.filter((r) => !r.success).length;

        return {
          success: true,
          totalPlatforms: results.length,
          successCount,
          failureCount,
          results,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * جدولة محتوى للنشر في وقت محدد
   */
  schedulePost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
        hashtags: z.array(z.string()),
        platforms: z.array(
          z.enum([
            "facebook",
            "instagram",
            "tiktok",
            "youtube",
            "snapchat",
            "pinterest",
            "google-business",
            "blogger",
          ])
        ),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        scheduledTime: z.date(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await scheduleContent({
          userId: ctx.user.id,
          ...input,
        });

        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * الحصول على المحتوى المنشور
   */
  getPublished: protectedProcedure.query(async ({ ctx }) => {
    try {
      const content = await getPublishedContent(ctx.user.id);
      return {
        success: true,
        count: content.length,
        data: content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  /**
   * الحصول على المحتوى المجدول
   */
  getScheduled: protectedProcedure.query(async ({ ctx }) => {
    try {
      const content = await getScheduledContent(ctx.user.id);
      return {
        success: true,
        count: content.length,
        data: content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),
});
