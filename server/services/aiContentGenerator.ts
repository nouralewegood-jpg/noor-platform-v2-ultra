import { invokeLLM } from "../_core/llm";
import { sendContentGenerationNotification } from "./reportsAndNotifications";

/**
 * محتوى تسويقي متخصص في الصيانة والديكور والرخام
 * Specialized marketing content for maintenance, decoration, and marble
 */

export interface ContentGenerationRequest {
  contentType: "tip" | "before-after" | "offer" | "service" | "testimonial" | "question" | "google-business" | "reel-idea" | "tiktok-idea";
  language: "ar" | "en" | "both";
  platforms?: ("instagram" | "facebook" | "tiktok" | "snapchat" | "youtube" | "pinterest" | "blogger" | "google-business")[];
  businessName?: string;
  businessPhone?: string;
  businessEmail?: string;
  additionalContext?: string;
}

export interface GeneratedContent {
  contentType: string;
  language: string;
  arabicText: string;
  englishText: string;
  hashtags: string;
  cta: string;
  platforms: string[];
  createdAt: Date;
}

/**
 * نظام توليد المحتوى الذكي
 * AI-powered content generation system
 */
export class AIContentGenerator {
  /**
   * توليد محتوى تسويقي متخصص
   * Generate specialized marketing content
   */
  static async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema" as const,
          json_schema: {
            name: "marketing_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                arabicText: { type: "string", description: "المحتوى بالعربية" },
                englishText: { type: "string", description: "المحتوى بالإنجليزية" },
                hashtags: { type: "string", description: "الهاشتاقات المناسبة" },
                cta: { type: "string", description: "دعوة للعمل (Call to Action)" },
              },
              required: ["arabicText", "englishText", "hashtags", "cta"],
              additionalProperties: false,
            },
          },
        } as any,
      });

      const content = JSON.parse((response.choices[0].message.content as string) || "{}");

      return {
        contentType: request.contentType,
        language: request.language,
        arabicText: content.arabicText || "",
        englishText: content.englishText || "",
        hashtags: content.hashtags || "",
        cta: content.cta || "",
        platforms: request.platforms || [],
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("[AIContentGenerator] Error generating content:", error);
      throw new Error("Failed to generate content");
    }
  }

  /**
   * توليد 30-40 منشور شهري
   * Generate 30-40 monthly posts
   */
  static async generateMonthlyContent(request: Omit<ContentGenerationRequest, "contentType">): Promise<GeneratedContent[]> {
    const contentTypes: ContentGenerationRequest["contentType"][] = [
      "tip",
      "before-after",
      "offer",
      "service",
      "testimonial",
      "question",
      "google-business",
      "reel-idea",
    ];

    const contents: GeneratedContent[] = [];
    const postsPerType = Math.ceil(35 / contentTypes.length);

    for (const contentType of contentTypes) {
      for (let i = 0; i < postsPerType; i++) {
        try {
          const content = await this.generateContent({
            ...request,
            contentType,
          });
          contents.push(content);
        } catch (error) {
          console.error(`[AIContentGenerator] Error generating ${contentType}:`, error);
        }
      }
    }

    // إرسال إشعار عند الانتهاء من توليد المحتوى الشهري
    if (contents.length > 0) {
      const types = [...new Set(contents.map(c => c.contentType))];
      const platforms = [...new Set(contents.flatMap(c => c.platforms))];
      await sendContentGenerationNotification(contents.length, types, platforms);
    }

    return contents;
  }

  /**
   * بناء نص النظام
   * Build system prompt
   */
  private static buildSystemPrompt(request: ContentGenerationRequest): string {
    return `أنت متخصص في التسويق الرقمي للشركات المتخصصة في الصيانة العامة والديكور والرخام. 
    
مهمتك هي إنشاء محتوى تسويقي احترافي وجذاب يهدف إلى:
1. جذب العملاء المحتملين
2. زيادة الوعي بالعلامة التجارية
3. تحفيز التفاعل والمشاركة
4. تحويل المتابعين إلى عملاء فعليين

يجب أن يكون المحتوى:
- احترافي وعالي الجودة
- متخصص في مجال الصيانة والديكور والرخام
- يتضمن دعوة واضحة للعمل (CTA)
- يستخدم هاشتاقات ذات صلة
- مناسب للمنصات الاجتماعية المختلفة
- يشمل أرقام الاتصال والواتساب عند الحاجة

${request.businessName ? `اسم النشاط: ${request.businessName}` : ""}
${request.businessPhone ? `رقم الاتصال: ${request.businessPhone}` : ""}
${request.businessEmail ? `البريد الإلكتروني: ${request.businessEmail}` : ""}`;
  }

  /**
   * بناء نص المستخدم
   * Build user prompt
   */
  private static buildUserPrompt(request: ContentGenerationRequest): string {
    const contentTypeDescriptions: Record<string, string> = {
      tip: "نصيحة سريعة وعملية عن الصيانة أو الديكور",
      "before-after": "صورة قبل وبعد مع وصف المشروع والنتائج",
      offer: "عرض خاص أو خصم على الخدمات",
      service: "تعريف بإحدى الخدمات المقدمة",
      testimonial: "شهادة عميل راضٍ عن الخدمة",
      question: "سؤال تفاعلي يشجع المتابعين على التعليق",
      "google-business": "منشور متخصص لـ Google Business Profile",
      "reel-idea": "فكرة لفيديو قصير (Reel أو TikTok)",
    };

    const description = contentTypeDescriptions[request.contentType] || "محتوى تسويقي عام";

    return `أنشئ ${description}.

المتطلبات:
1. اللغة: ${request.language === "ar" ? "العربية فقط" : request.language === "en" ? "الإنجليزية فقط" : "العربية والإنجليزية"}
2. الطول: مناسب للمنصات الاجتماعية (150-300 حرف للعربية)
3. التفاعل: يجب أن يشجع على التفاعل والمشاركة
4. الهاشتاقات: أضف 5-8 هاشتاقات ذات صلة
5. CTA: أضف دعوة واضحة للعمل (اتصل، واتساب، زيارة الموقع، إلخ)

${request.additionalContext ? `معلومات إضافية: ${request.additionalContext}` : ""}

أرجع الإجابة بصيغة JSON تتضمن:
- arabicText: النص الكامل بالعربية
- englishText: النص الكامل بالإنجليزية
- hashtags: الهاشتاقات المناسبة
- cta: دعوة العمل`;
  }

  /**
   * توليد أفكار محتوى متقدمة
   * Generate advanced content ideas
   */
  static async generateContentIdeas(request: ContentGenerationRequest): Promise<string[]> {
    const prompt = `اقترح 5 أفكار محتوى تسويقية مبتكرة ومتخصصة في مجال الصيانة والديكور والرخام:
    
${request.businessName ? `للنشاط: ${request.businessName}` : ""}
${request.additionalContext ? `سياق إضافي: ${request.additionalContext}` : ""}

يجب أن تكون الأفكار:
- جديدة ومبتكرة
- جذابة وتشجع على التفاعل
- مناسبة للمنصات الاجتماعية
- متخصصة في المجال`;

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "أنت متخصص في التسويق الرقمي والمحتوى الإبداعي" },
          { role: "user", content: prompt },
        ],
      });

      const ideas = (response.choices[0].message.content as string)
        ?.split("\n")
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^[\d\-\*•]+\s*/, "").trim())
        .filter((line: string) => line.length > 0) || [];

      return ideas;
    } catch (error) {
      console.error("[AIContentGenerator] Error generating ideas:", error);
      throw new Error("Failed to generate content ideas");
    }
  }

  /**
   * تحسين النص الموجود
   * Improve existing text
   */
  static async improveContent(text: string, language: "ar" | "en"): Promise<string> {
    const prompt =
      language === "ar"
        ? `حسّن النص التسويقي التالي ليكون أكثر جاذبية واحترافية:\n\n${text}`
        : `Improve the following marketing text to be more engaging and professional:\n\n${text}`;

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              language === "ar"
                ? "أنت متخصص في تحسين النصوص التسويقية"
                : "You are an expert in improving marketing texts",
          },
          { role: "user", content: prompt },
        ],
      });

      return (response.choices[0].message.content as string) || text;
    } catch (error) {
      console.error("[AIContentGenerator] Error improving content:", error);
      return text;
    }
  }
}
