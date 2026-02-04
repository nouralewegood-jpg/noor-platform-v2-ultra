import { describe, it, expect } from "vitest";

describe("OpenAI API Integration", () => {
  it("should validate OpenAI API key is set", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it("should have valid OpenAI API key format", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    // OpenAI keys typically start with 'sk-'
    expect(apiKey).toMatch(/^sk-/);
  });

  it("should test OpenAI API connectivity", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    } catch (error) {
      throw new Error(`Failed to connect to OpenAI API: ${error}`);
    }
  });
});
