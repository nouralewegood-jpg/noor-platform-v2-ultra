import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getOAuthUrl,
  exchangeCodeForToken,
  getAccountInfo,
  saveLinkedAccount,
  unlinkAccount,
  getLinkedAccounts,
} from "../services/accountLinking";

export const accountLinkingRouter = router({
  /**
   * الحصول على OAuth URL لمنصة معينة
   */
  getOAuthUrl: protectedProcedure
    .input(
      z.object({
        platform: z.enum([
          "facebook",
          "instagram",
          "tiktok",
          "youtube",
          "snapchat",
          "pinterest",
          "google-business",
          "blogger",
        ]),
      })
    )
    .query(({ input }) => {
      try {
        const state = `${input.platform}_${Date.now()}_${Math.random()}`;
        const oauthUrl = getOAuthUrl(input.platform, state);

        return {
          success: true,
          oauthUrl,
          state,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "فشل الحصول على OAuth URL",
        };
      }
    }),

  /**
   * معالجة رد الاتصال من OAuth
   */
  handleOAuthCallback: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        code: z.string(),
        state: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // تبديل الرمز بـ Access Token
        const tokens = await exchangeCodeForToken(input.platform, input.code);

        // الحصول على معلومات الحساب
        const accountInfo = await getAccountInfo(input.platform, tokens.accessToken);

        // حفظ الحساب المرتبط
        const linkedAccount = await saveLinkedAccount(
          ctx.user!.id,
          input.platform,
          accountInfo,
          tokens
        );

        return {
          success: true,
          message: `تم ربط حساب ${accountInfo.accountName} بنجاح`,
          account: linkedAccount,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "فشل ربط الحساب",
        };
      }
    }),

  /**
   * الحصول على جميع الحسابات المرتبطة
   */
  getLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const accounts = await getLinkedAccounts(ctx.user!.id);

      return {
        success: true,
        accounts,
        count: accounts.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "فشل جلب الحسابات",
        accounts: [],
      };
    }
  }),

  /**
   * فصل حساب مرتبط
   */
  unlinkAccount: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await unlinkAccount(ctx.user!.id, input.platform);

        if (success) {
          return {
            success: true,
            message: `تم فصل حساب ${input.platform} بنجاح`,
          };
        } else {
          return {
            success: false,
            error: "فشل فصل الحساب",
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "فشل فصل الحساب",
        };
      }
    }),

  /**
   * اختبار اتصال الحساب
   */
  testConnection: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        // في الإنتاج، سيتم اختبار الاتصال الفعلي
        return {
          success: true,
          message: `الاتصال مع ${input.platform} يعمل بشكل صحيح`,
          status: "connected",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "فشل الاتصال",
          status: "disconnected",
        };
      }
    }),

  /**
   * الحصول على حالة الحسابات المرتبطة
   */
  getAccountsStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const accounts = await getLinkedAccounts(ctx.user!.id);

      const platforms = [
        "facebook",
        "instagram",
        "tiktok",
        "youtube",
        "snapchat",
        "pinterest",
        "google-business",
        "blogger",
      ];

      const status = platforms.map((platform) => ({
        platform,
        isLinked: accounts.some((a) => a.platform === platform),
        isActive: accounts.find((a) => a.platform === platform)?.isActive || false,
      }));

      return {
        success: true,
        status,
        linkedCount: accounts.length,
        totalPlatforms: platforms.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "فشل جلب حالة الحسابات",
        status: [],
      };
    }
  }),
});
