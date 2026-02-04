import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateContent,
  generateMonthlyContent,
  generateSEOKeywords,
  optimizeContentForSEO,
  type ContentGenerationRequest,
  type GeneratedContent,
} from "./openaiIntegration";

// Mock the invokeLLM function
vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "../_core/llm";

describe("OpenAI Integration Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateContent", () => {
    it("should generate single content successfully", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "نصيحة ذهبية: استخدم منتجات التنظيف الآمنة",
                englishText: "Golden Tip: Use safe cleaning products",
                hashtags: "#صيانة #ديكور #نصائح",
                cta: "اتصل بنا الآن",
                imagePrompt: "A professional cleaning service image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "both",
        platforms: ["instagram", "facebook"],
        businessName: "نور الوجود",
        count: 1,
      };

      const result = await generateContent(request);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("arabicText");
      expect(result[0]).toHaveProperty("englishText");
      expect(result[0]).toHaveProperty("hashtags");
      expect(result[0]).toHaveProperty("cta");
      expect(result[0].contentType).toBe("tip");
      expect(vi.mocked(invokeLLM)).toHaveBeenCalled();
    });

    it("should handle multiple content generation", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "محتوى تجريبي",
                englishText: "Test content",
                hashtags: "#test",
                cta: "Call now",
                imagePrompt: "Test image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "offer",
        language: "ar",
        count: 3,
      };

      const result = await generateContent(request);

      expect(result).toHaveLength(3);
      expect(vi.mocked(invokeLLM)).toHaveBeenCalledTimes(3);
    });

    it("should handle different content types", async () => {
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

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "محتوى",
                englishText: "Content",
                hashtags: "#test",
                cta: "Call",
                imagePrompt: "Image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      for (const contentType of contentTypes) {
        const request: ContentGenerationRequest = {
          contentType,
          language: "both",
          count: 1,
        };

        const result = await generateContent(request);
        expect(result[0].contentType).toBe(contentType);
      }
    });

    it("should handle language options correctly", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "نص عربي",
                englishText: "English text",
                hashtags: "#test",
                cta: "Call",
                imagePrompt: "Image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const languages: Array<ContentGenerationRequest["language"]> = ["ar", "en", "both"];

      for (const language of languages) {
        const request: ContentGenerationRequest = {
          contentType: "tip",
          language,
          count: 1,
        };

        const result = await generateContent(request);
        expect(result).toHaveLength(1);
      }
    });

    it("should include business information in prompt", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "محتوى",
                englishText: "Content",
                hashtags: "#test",
                cta: "Call",
                imagePrompt: "Image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "ar",
        businessName: "نور الوجود",
        businessPhone: "0501234567",
        businessEmail: "info@noor.com",
        count: 1,
      };

      await generateContent(request);

      const callArgs = vi.mocked(invokeLLM).mock.calls[0]?.[0];
      expect(callArgs?.messages[1]?.content).toContain("نور الوجود");
    });
  });

  describe("generateMonthlyContent", () => {
    it("should generate 35 posts for monthly content", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "محتوى شهري",
                englishText: "Monthly content",
                hashtags: "#monthly",
                cta: "Call now",
                imagePrompt: "Monthly image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "both",
      };

      const result = await generateMonthlyContent(request);

      expect(result.length).toBeLessThanOrEqual(35);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should generate diverse content types", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                arabicText: "محتوى متنوع",
                englishText: "Diverse content",
                hashtags: "#diverse",
                cta: "Call",
                imagePrompt: "Image",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "ar",
      };

      const result = await generateMonthlyContent(request);

      const contentTypes = new Set(result.map((c) => c.contentType));
      expect(contentTypes.size).toBeGreaterThan(0);
    });
  });

  describe("generateSEOKeywords", () => {
    it("should generate SEO keywords in Arabic", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "صيانة المنزل, تنظيف الأرضيات, ديكور حديث, صيانة الرخام, تصميم داخلي",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const result = await generateSEOKeywords("الصيانة والديكور", "ar");

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeTruthy();
    });

    it("should generate SEO keywords in English", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "home maintenance, floor cleaning, modern decoration, marble maintenance, interior design",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const result = await generateSEOKeywords("maintenance and decoration", "en");

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should trim and filter keywords", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "  صيانة  ,  ديكور  , , تنظيف , ",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const result = await generateSEOKeywords("test", "ar");

      expect(result).not.toContain("");
      expect(result.every((k) => k.trim() === k)).toBe(true);
    });
  });

  describe("optimizeContentForSEO", () => {
    it("should optimize content with keywords", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "محتوى محسّن يتضمن كلمات مفتاحية ذات صلة بشكل طبيعي",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const content = "محتوى أصلي";
      const keywords = ["صيانة", "ديكور", "تنظيف"];

      const result = await optimizeContentForSEO(content, keywords);

      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(vi.mocked(invokeLLM)).toHaveBeenCalled();
    });

    it("should include keywords in optimization prompt", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "محتوى محسّن",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse);

      const content = "محتوى";
      const keywords = ["صيانة", "ديكور"];

      await optimizeContentForSEO(content, keywords);

      const callArgs = vi.mocked(invokeLLM).mock.calls[0]?.[0];
      expect(callArgs?.messages[1]?.content).toContain("صيانة");
      expect(callArgs?.messages[1]?.content).toContain("ديكور");
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("API Error"));

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "ar",
        count: 1,
      };

      await expect(generateContent(request)).rejects.toThrow();
    });

    it("should handle invalid JSON response", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "Invalid JSON",
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const request: ContentGenerationRequest = {
        contentType: "tip",
        language: "ar",
        count: 1,
      };

      await expect(generateContent(request)).rejects.toThrow();
    });
  });
});
