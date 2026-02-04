import { generateImage } from "../_core/imageGeneration";

/**
 * خدمة توليد الصور الاحترافية
 * Professional Image Generation Service
 */

export interface ImageGenerationRequest {
  prompt: string;
  style?: "realistic" | "artistic" | "minimalist" | "modern" | "classic";
  size?: "1080x1080" | "1200x628" | "1080x1920" | "1024x1024" | "1920x1080";
  language?: "ar" | "en";
  businessName?: string;
  watermark?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  size: string;
  style: string;
  createdAt: Date;
  businessName?: string;
}

/**
 * خدمة توليد الصور
 * Image Generation Service
 */
export class ImageGenerationService {
  /**
   * توليد صورة احترافية
   * Generate professional image
   */
  static async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    try {
      const enhancedPrompt = this.enhancePrompt(request);

      const result = await generateImage({
        prompt: enhancedPrompt,
      });

      return {
        url: result.url || "",
        prompt: request.prompt,
        size: request.size || "1080x1080",
        style: request.style || "modern",
        createdAt: new Date(),
        businessName: request.businessName,
      };
    } catch (error) {
      console.error("[ImageGenerationService] Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  }

  /**
   * توليد صور قبل وبعد
   * Generate before and after images
   */
  static async generateBeforeAfterImages(
    project: string,
    style?: string
  ): Promise<{ before: GeneratedImage; after: GeneratedImage }> {
    try {
      const beforePrompt = `صورة قبل: ${project} - حالة سيئة، تحتاج إلى صيانة وتحسين`;
      const afterPrompt = `صورة بعد: ${project} - محسّنة بشكل احترافي، نتائج رائعة`;

      const [before, after] = await Promise.all([
        this.generateImage({
          prompt: beforePrompt,
          style: (style as any) || "realistic",
          size: "1080x1080",
        }),
        this.generateImage({
          prompt: afterPrompt,
          style: (style as any) || "realistic",
          size: "1080x1080",
        }),
      ]);

      return { before, after };
    } catch (error) {
      console.error("[ImageGenerationService] Error generating before/after images:", error);
      throw new Error("Failed to generate before/after images");
    }
  }

  /**
   * توليد صور ترويجية
   * Generate promotional images
   */
  static async generatePromotionalImages(
    businessName: string,
    offer: string,
    discount?: number
  ): Promise<GeneratedImage[]> {
    try {
      const prompts = [
        `صورة ترويجية احترافية لـ ${businessName}: ${offer}${discount ? ` - خصم ${discount}%` : ""}`,
        `بنر ترويجي جذاب: ${offer} من ${businessName}`,
        `صورة عرض خاص: ${offer} - جودة عالية احترافية`,
      ];

      const images = await Promise.all(
        prompts.map((prompt) =>
          this.generateImage({
            prompt,
            style: "modern",
            businessName,
          })
        )
      );

      return images;
    } catch (error) {
      console.error("[ImageGenerationService] Error generating promotional images:", error);
      throw new Error("Failed to generate promotional images");
    }
  }

  /**
   * توليد صور متخصصة للديكور
   * Generate decoration-specific images
   */
  static async generateDecorationImages(
    type: "interior" | "exterior" | "marble" | "maintenance",
    style?: string
  ): Promise<GeneratedImage[]> {
    try {
      const descriptions: Record<string, string> = {
        interior: "صورة ديكور داخلي حديث واحترافي - تصميم عصري جميل",
        exterior: "صورة ديكور خارجي فاخر - واجهة منزل أنيقة",
        marble: "صورة أرضيات رخام فاخرة - تصميم كلاسيكي راقي",
        maintenance: "صورة صيانة احترافية - عمل ماهر وجودة عالية",
      };

      const prompts = [
        descriptions[type],
        `${descriptions[type]} - زاوية مختلفة`,
        `${descriptions[type]} - تفاصيل قريبة`,
      ];

      const images = await Promise.all(
        prompts.map((prompt) =>
          this.generateImage({
            prompt,
            style: (style as any) || "realistic",
          })
        )
      );

      return images;
    } catch (error) {
      console.error("[ImageGenerationService] Error generating decoration images:", error);
      throw new Error("Failed to generate decoration images");
    }
  }

  /**
   * توليد صور بأحجام مختلفة
   * Generate images in different sizes
   */
  static async generateMultipleSizes(
    prompt: string,
    sizes?: ImageGenerationRequest["size"][]
  ): Promise<GeneratedImage[]> {
    try {
      const defaultSizes: ImageGenerationRequest["size"][] = [
        "1080x1080",
        "1200x628",
        "1080x1920",
        "1024x1024",
      ];

      const targetSizes = sizes || defaultSizes;

      const images = await Promise.all(
        targetSizes.map((size) =>
          this.generateImage({
            prompt,
            size,
          })
        )
      );

      return images;
    } catch (error) {
      console.error("[ImageGenerationService] Error generating multiple sizes:", error);
      throw new Error("Failed to generate images in multiple sizes");
    }
  }

  /**
   * تحسين النص الوصفي للصورة
   * Enhance image prompt
   */
  private static enhancePrompt(request: ImageGenerationRequest): string {
    let enhanced = request.prompt;

    // إضافة معلومات النمط
    // Add style information
    if (request.style) {
      const styleDescriptions: Record<string, string> = {
        realistic: "واقعية عالية الجودة، تفاصيل دقيقة",
        artistic: "فنية جميلة، إبداعية",
        minimalist: "بسيطة وأنيقة، تصميم بسيط",
        modern: "حديثة ومعاصرة، تصميم عصري",
        classic: "كلاسيكية فاخرة، تقليدية راقية",
      };

      enhanced += `, ${styleDescriptions[request.style]}`;
    }

    // إضافة معلومات الجودة
    // Add quality information
    enhanced += ", جودة احترافية عالية جداً، 4K";

    // إضافة معلومات الإضاءة
    // Add lighting information
    enhanced += ", إضاءة احترافية طبيعية";

    // إضافة معلومات الألوان
    // Add color information
    enhanced += ", ألوان زاهية وجذابة";

    return enhanced;
  }

  /**
   * توليد صور متعددة لحملة تسويقية
   * Generate multiple images for marketing campaign
   */
  static async generateCampaignImages(
    campaignName: string,
    businessName: string,
    numberOfImages: number = 5
  ): Promise<GeneratedImage[]> {
    try {
      const prompts = [
        `صورة ترويجية رئيسية لحملة ${campaignName} من ${businessName}`,
        `صورة ثانوية للحملة: ${campaignName} - تصميم جذاب`,
        `صورة منتج/خدمة: ${campaignName} - جودة احترافية`,
        `صورة عرض خاص: ${campaignName} - تصميم مميز`,
        `صورة دعوة للعمل: ${campaignName} - تحفيز العملاء`,
      ];

      const selectedPrompts = prompts.slice(0, numberOfImages);

      const images = await Promise.all(
        selectedPrompts.map((prompt) =>
          this.generateImage({
            prompt,
            style: "modern",
            businessName,
          })
        )
      );

      return images;
    } catch (error) {
      console.error("[ImageGenerationService] Error generating campaign images:", error);
      throw new Error("Failed to generate campaign images");
    }
  }

  /**
   * إضافة علامة مائية للصورة
   * Add watermark to image
   */
  static async addWatermark(imageUrl: string, businessName: string): Promise<string> {
    try {
      // محاكاة إضافة العلامة المائية - يتم استبدالها بـ API حقيقي لاحقاً
      // Simulating watermark - will be replaced with real API later
      console.log(`[ImageGenerationService] Adding watermark: ${businessName} to ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error("[ImageGenerationService] Error adding watermark:", error);
      return imageUrl;
    }
  }
}
