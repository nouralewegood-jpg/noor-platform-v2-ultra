import { invokeLLM } from "../_core/llm";

export interface ContentGenerationRequest {
  contentType: "tip" | "before-after" | "offer" | "service" | "testimonial" | "question" | "google-business" | "reel-idea" | "tiktok-idea";
  language: "ar" | "en" | "both";
  platforms?: string[];
  businessName?: string;
  businessPhone?: string;
  businessEmail?: string;
  count?: number;
}

export interface GeneratedContent {
  contentType: string;
  arabicText: string;
  englishText: string;
  hashtags: string;
  cta: string;
  imagePrompt: string;
  platforms: string[];
  createdAt: Date;
}

const contentTypePrompts = {
  tip: "اكتب نصيحة قيمة وعملية عن الصيانة العامة أو الديكور",
  "before-after": "اكتب وصفاً جذاباً لمشروع صيانة أو ديكور قبل وبعد",
  offer: "اكتب عرضاً خاصاً ومحدوداً الوقت لخدمات الصيانة أو الديكور",
  service: "اكتب تعريفاً احترافياً لخدمة من خدمات الصيانة أو الديكور",
  testimonial: "اكتب شهادة عميل راضٍ عن خدمات الصيانة أو الديكور",
  question: "اكتب سؤالاً تفاعلياً يشجع المتابعين على التعليق والمشاركة",
  "google-business": "اكتب منشوراً احترافياً لـ Google Business عن خدمات الصيانة",
  "reel-idea": "اقترح فكرة فيديو Reel جذابة عن الصيانة أو الديكور",
  "tiktok-idea": "اقترح فكرة فيديو TikTok فيروسية عن الصيانة أو الديكور",
};

export async function generateContent(request: ContentGenerationRequest): Promise<GeneratedContent[]> {
  const results: GeneratedContent[] = [];
  const count = request.count || 1;

  for (let i = 0; i < count; i++) {
    try {
      const prompt = buildPrompt(request);
      
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `أنت مساعد متخصص في التسويق الرقمي للشركات المتخصصة في الصيانة العامة والديكور والرخام. 
            تقوم بإنشاء محتوى تسويقي احترافي وجذاب يناسب منصات التواصل الاجتماعي المختلفة.
            يجب أن يكون المحتوى:
            - احترافي وجذاب
            - مناسب للمنصات الاجتماعية
            - يتضمن دعوة واضحة للعمل (CTA)
            - يستخدم هاشتاقات ذات صلة`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "social_media_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                arabicText: {
                  type: "string",
                  description: "المحتوى بالعربية",
                },
                englishText: {
                  type: "string",
                  description: "المحتوى بالإنجليزية",
                },
                hashtags: {
                  type: "string",
                  description: "الهاشتاقات المناسبة",
                },
                cta: {
                  type: "string",
                  description: "دعوة واضحة للعمل",
                },
                imagePrompt: {
                  type: "string",
                  description: "وصف الصورة المناسبة لـ FLUX API",
                },
              },
              required: ["arabicText", "englishText", "hashtags", "cta", "imagePrompt"],
              additionalProperties: false,
            },
          },
        },
      });

      const messageContent = response.choices[0].message.content;
      const contentString = typeof messageContent === "string" ? messageContent : "";
      const content = JSON.parse(contentString);
      
      results.push({
        contentType: request.contentType,
        arabicText: content.arabicText,
        englishText: content.englishText,
        hashtags: content.hashtags,
        cta: content.cta,
        imagePrompt: content.imagePrompt,
        platforms: request.platforms || [],
        createdAt: new Date(),
      });
    } catch (error) {
      console.error(`Error generating content ${i + 1}:`, error);
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return results;
}

function buildPrompt(request: ContentGenerationRequest): string {
  const contentTypeDescription = contentTypePrompts[request.contentType];
  const languageInstruction = 
    request.language === "ar" ? "اكتب المحتوى بالعربية فقط" :
    request.language === "en" ? "اكتب المحتوى بالإنجليزية فقط" :
    "اكتب المحتوى بالعربية والإنجليزية";

  const businessInfo = request.businessName 
    ? `اسم النشاط: ${request.businessName}. رقم الهاتف: ${request.businessPhone || "غير محدد"}. البريد: ${request.businessEmail || "غير محدد"}`
    : "نشاط متخصص في الصيانة العامة والديكور والرخام";

  const platformsInfo = request.platforms?.length 
    ? `المنصات المستهدفة: ${request.platforms.join(", ")}`
    : "المنصات المستهدفة: جميع منصات التواصل الاجتماعي";

  return `
${languageInstruction}

${contentTypeDescription}

معلومات النشاط: ${businessInfo}

${platformsInfo}

المتطلبات:
1. اكتب محتوى جذاب وفعال
2. أضف هاشتاقات ذات صلة
3. أضف دعوة واضحة للعمل (اتصل، اطلب عرض سعر، احجز الآن، إلخ)
4. اقترح وصفاً للصورة المناسبة
5. تأكد من أن المحتوى مناسب للمنصات الاجتماعية
  `;
}

export async function generateMonthlyContent(request: ContentGenerationRequest): Promise<GeneratedContent[]> {
  const contentTypes: Array<ContentGenerationRequest["contentType"]> = [
    "tip",
    "before-after",
    "offer",
    "service",
    "testimonial",
    "question",
    "google-business",
    "reel-idea",
    "tiktok-idea",
  ];

  const results: GeneratedContent[] = [];
  const postsPerType = Math.ceil(35 / contentTypes.length); // 35 منشور شهري

  for (const contentType of contentTypes) {
    const contentRequest = {
      ...request,
      contentType,
      count: postsPerType,
    };

    try {
      const generated = await generateContent(contentRequest);
      results.push(...generated);
    } catch (error) {
      console.error(`Error generating ${contentType} content:`, error);
    }
  }

  return results.slice(0, 35); // تأكد من عدم تجاوز 35 منشور
}

export async function generateSEOKeywords(topic: string, language: "ar" | "en" = "ar"): Promise<string[]> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت متخصص في تحسين محركات البحث (SEO) للشركات المتخصصة في الصيانة والديكور.
        قم بإنشاء قائمة بكلمات مفتاحية ذات صلة وعالية القيمة.`,
      },
      {
        role: "user",
        content: `اقترح 10 كلمات مفتاحية ${language === "ar" ? "بالعربية" : "بالإنجليزية"} ذات صلة بـ: ${topic}
        الكلمات يجب أن تكون:
        - ذات صلة بالصيانة والديكور
        - عالية البحث
        - منخفضة المنافسة نسبياً
        اعطِ الكلمات كقائمة مفصولة بفواصل`,
      },
    ],
  });

  const messageContent = response.choices[0].message.content;
  const contentString = typeof messageContent === "string" ? messageContent : "";
  const keywords = contentString
    .split(",")
    .map((k: string) => k.trim())
    .filter((k: string) => k.length > 0);

  return keywords;
}

export async function optimizeContentForSEO(content: string, keywords: string[]): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت متخصص في تحسين محركات البحث (SEO).
        قم بتحسين المحتوى المعطى لتضمين الكلمات المفتاحية بشكل طبيعي.`,
      },
      {
        role: "user",
        content: `حسّن هذا المحتوى لتضمين الكلمات المفتاحية التالية بشكل طبيعي:
        ${keywords.join(", ")}
        
        المحتوى الأصلي:
        ${content}
        
        المتطلبات:
        - احتفظ بالمعنى الأصلي
        - أضف الكلمات المفتاحية بشكل طبيعي
        - لا تكرر الكلمات بشكل مفرط
        - حافظ على جودة المحتوى`,
      },
    ],
  });

  const messageContent = response.choices[0].message.content;
  return typeof messageContent === "string" ? messageContent : "";
}
