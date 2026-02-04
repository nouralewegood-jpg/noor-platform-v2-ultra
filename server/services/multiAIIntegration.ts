import { invokeLLM } from "../_core/llm";

/**
 * متكامل خدمات الذكاء الاصطناعي المتعددة
 * يستخدم أفضل نموذج متاح لكل مهمة
 */

export interface ContentGenerationRequest {
  businessType: string;
  contentType: "tip" | "before-after" | "offer" | "definition" | "video-idea" | "testimonial" | "story" | "announcement" | "question";
  language: "ar" | "en";
  tone?: "professional" | "casual" | "friendly" | "formal";
}

export interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  platform: string;
  estimatedEngagement: number;
}

/**
 * توليد محتوى تسويقي ذكي باستخدام Claude
 */
export async function generateMarketingContent(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const systemPrompt = `أنت خبير تسويق رقمي متخصص في مجال الصيانة العامة والديكور والرخام.
تقوم بإنشاء محتوى تسويقي احترافي وجذاب للمنصات الاجتماعية.
اللغة: ${request.language === "ar" ? "العربية" : "English"}
نوع النشاط: ${request.businessType}`;

  const contentTypePrompts = {
    tip: "أنشئ نصيحة سريعة وعملية مفيدة للعملاء",
    "before-after": "أنشئ وصف لمشروع قبل وبعد مع التفاصيل",
    offer: "أنشئ عرض خاص جذاب مع حد زمني",
    definition: "أنشئ تعريف مفيد لمصطلح متعلق بالمجال",
    "video-idea": "أنشئ فكرة فيديو قصير جذاب",
    testimonial: "أنشئ شهادة عميل إيجابية ومقنعة",
    story: "أنشئ قصة نجاح مشروع",
    announcement: "أنشئ إعلان عن خدمة جديدة",
    question: "أنشئ سؤال تفاعلي يشجع التعليقات",
  };

  const userPrompt = `${contentTypePrompts[request.contentType]}
الإخراج يجب أن يكون بصيغة JSON مع الحقول التالية:
{
  "title": "عنوان المنشور",
  "content": "محتوى المنشور (150-300 كلمة)",
  "hashtags": ["هاشتاج1", "هاشتاج2", "هاشتاج3"],
  "callToAction": "عبارة تحفيز على الإجراء",
  "platform": "المنصة المناسبة (Instagram/Facebook/TikTok/YouTube)",
  "estimatedEngagement": 85
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "marketing_content",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              hashtags: { type: "array", items: { type: "string" } },
              callToAction: { type: "string" },
              platform: { type: "string" },
              estimatedEngagement: { type: "number" },
            },
            required: [
              "title",
              "content",
              "hashtags",
              "callToAction",
              "platform",
              "estimatedEngagement",
            ],
          },
        },
      },
    });

  const messageContent = response.choices[0]?.message.content;
  if (!messageContent) {
    throw new Error("No content generated");
  }

  const contentStr = typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent);
  return JSON.parse(contentStr);
  } catch (error) {
    console.error("Error generating marketing content:", error);
    throw error;
  }
}

/**
 * توليد 30 منشور شهري متنوع
 */
export async function generateMonthlyContent(
  businessType: string,
  language: "ar" | "en" = "ar"
): Promise<GeneratedContent[]> {
  const contentTypes: ContentGenerationRequest["contentType"][] = [
    "tip",
    "before-after",
    "offer",
    "definition",
    "video-idea",
    "testimonial",
    "story",
    "announcement",
    "question",
  ];

  const contents: GeneratedContent[] = [];

  // توليد 30 منشور (3-4 من كل نوع)
  for (let i = 0; i < 30; i++) {
    const contentType = contentTypes[i % contentTypes.length];
    const tone = ["professional", "casual", "friendly"][i % 3] as
      | "professional"
      | "casual"
      | "friendly";

    try {
      const content = await generateMarketingContent({
        businessType,
        contentType,
        language,
        tone,
      });
      contents.push(content);
    } catch (error) {
      console.error(`Failed to generate content ${i + 1}:`, error);
    }
  }

  return contents;
}

/**
 * توليد كلمات مفتاحية SEO
 */
export async function generateSEOKeywords(
  topic: string,
  language: "ar" | "en" = "ar"
): Promise<string[]> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت خبير SEO متخصص. قم بإنشاء قائمة بكلمات مفتاحية ذات صلة عالية.
اللغة: ${language === "ar" ? "العربية" : "English"}`,
      },
      {
        role: "user",
        content: `أنشئ 15 كلمة مفتاحية ذات صلة بـ: ${topic}
الإخراج يجب أن يكون JSON array من الكلمات المفتاحية فقط.`,
      },
    ],
  });

  const messageContent = response.choices[0]?.message.content;
  if (!messageContent) {
    return [];
  }

  const contentStr = typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent);
  try {
    return JSON.parse(contentStr);
  } catch {
    return contentStr.split("\n").filter((k) => k.trim());
  }
}

/**
 * تحسين محتوى موجود باستخدام AI
 */
export async function improveContent(
  content: string,
  language: "ar" | "en" = "ar"
): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت محرر محتوى احترافي. قم بتحسين المحتوى لجعله أكثر جاذبية وفعالية.
اللغة: ${language === "ar" ? "العربية" : "English"}`,
      },
      {
        role: "user",
        content: `حسّن هذا المحتوى لجعله أكثر جاذبية للعملاء:
${content}

قدم النسخة المحسّنة فقط بدون تعليقات.`,
      },
    ],
  });

  const messageContent = response.choices[0]?.message.content;
  if (typeof messageContent === "string") {
    return messageContent;
  }
  return content;
}

/**
 * تحليل أداء المحتوى والتوصيات
 */
export async function analyzeContentPerformance(
  content: string,
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  },
  language: "ar" | "en" = "ar"
): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت محلل محتوى متقدم. قم بتحليل أداء المحتوى وتقديم توصيات.
اللغة: ${language === "ar" ? "العربية" : "English"}`,
      },
      {
        role: "user",
        content: `حلل أداء هذا المحتوى:
المحتوى: ${content}
الإحصائيات:
- الإعجابات: ${metrics.likes}
- التعليقات: ${metrics.comments}
- المشاركات: ${metrics.shares}
- المشاهدات: ${metrics.views}

قدم التحليل بصيغة JSON مع الحقول: score, strengths, improvements, recommendations`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "content_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: ["score", "strengths", "improvements", "recommendations"],
        },
      },
    },
  });

  const messageContent = response.choices[0]?.message.content;
  if (!messageContent) {
    return {
      score: 0,
      strengths: [],
      improvements: [],
      recommendations: [],
    };
  }

  const contentStr = typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent);
  return JSON.parse(contentStr);
}

/**
 * توليد نص إعلاني احترافي
 */
export async function generateAdCopy(
  product: string,
  targetAudience: string,
  language: "ar" | "en" = "ar"
): Promise<{
  headline: string;
  body: string;
  cta: string;
}> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت كاتب إعلانات محترف. قم بكتابة نصوص إعلانية جذابة وفعالة.
اللغة: ${language === "ar" ? "العربية" : "English"}`,
      },
      {
        role: "user",
        content: `اكتب نص إعلاني لـ:
المنتج: ${product}
الجمهور المستهدف: ${targetAudience}

الإخراج بصيغة JSON مع: headline, body, cta`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ad_copy",
        strict: true,
        schema: {
          type: "object",
          properties: {
            headline: { type: "string" },
            body: { type: "string" },
            cta: { type: "string" },
          },
          required: ["headline", "body", "cta"],
        },
      },
    },
  });

  const messageContent = response.choices[0]?.message.content;
  if (!messageContent) {
    return {
      headline: "",
      body: "",
      cta: "",
    };
  }

  const contentStr = typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent);
  return JSON.parse(contentStr);
}
