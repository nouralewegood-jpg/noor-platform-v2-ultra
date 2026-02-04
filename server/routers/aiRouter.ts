import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  generateMarketingContent,
  generateMonthlyContent,
  generateSEOKeywords,
  improveContent,
  analyzeContentPerformance,
  generateAdCopy,
} from "../services/multiAIIntegration";

export const aiRouter = router({
  /**
   * توليد محتوى تسويقي واحد
   */
  generateContent: protectedProcedure
    .input(
      z.object({
        businessType: z.string(),
        contentType: z.enum([
          "tip",
          "before-after",
          "offer",
          "definition",
          "video-idea",
          "testimonial",
          "story",
          "announcement",
          "question",
        ]),
        language: z.enum(["ar", "en"]).default("ar"),
        tone: z
          .enum(["professional", "casual", "friendly", "formal"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const content = await generateMarketingContent(input);
        return {
          success: true,
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
   * توليد 30 منشور شهري
   */
  generateMonthlyPosts: protectedProcedure
    .input(
      z.object({
        businessType: z.string(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const contents = await generateMonthlyContent(
          input.businessType,
          input.language
        );
        return {
          success: true,
          count: contents.length,
          data: contents,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * توليد كلمات مفتاحية SEO
   */
  generateKeywords: protectedProcedure
    .input(
      z.object({
        topic: z.string(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const keywords = await generateSEOKeywords(input.topic, input.language);
        return {
          success: true,
          count: keywords.length,
          data: keywords,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * تحسين محتوى موجود
   */
  improveContent: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const improved = await improveContent(input.content, input.language);
        return {
          success: true,
          data: improved,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * تحليل أداء المحتوى
   */
  analyzePerformance: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        metrics: z.object({
          likes: z.number(),
          comments: z.number(),
          shares: z.number(),
          views: z.number(),
        }),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const analysis = await analyzeContentPerformance(
          input.content,
          input.metrics,
          input.language
        );
        return {
          success: true,
          data: analysis,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * توليد نص إعلاني
   */
  generateAd: protectedProcedure
    .input(
      z.object({
        product: z.string(),
        targetAudience: z.string(),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const adCopy = await generateAdCopy(
          input.product,
          input.targetAudience,
          input.language
        );
        return {
          success: true,
          data: adCopy,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
});
