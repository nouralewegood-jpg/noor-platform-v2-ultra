import axios from "axios";

export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  format?: "jpeg" | "png" | "webp";
  quality?: "draft" | "standard" | "high";
  style?: "realistic" | "artistic" | "minimalist" | "professional";
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  width: number;
  height: number;
  format: string;
  createdAt: Date;
  taskId?: string;
}

// Platform-specific image dimensions
const PLATFORM_DIMENSIONS = {
  instagram: { width: 1080, height: 1080 }, // Square
  instagram_story: { width: 1080, height: 1920 }, // Story
  facebook: { width: 1200, height: 628 }, // Recommended
  tiktok: { width: 1080, height: 1920 }, // Full screen
  pinterest: { width: 1000, height: 1500 }, // Recommended
  youtube_thumbnail: { width: 1280, height: 720 }, // Thumbnail
  google_business: { width: 1200, height: 800 }, // Cover photo
  twitter: { width: 1024, height: 512 }, // Recommended
};

export async function generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
  const apiKey = process.env.BFL_API_KEY;
  if (!apiKey) {
    throw new Error("BFL_API_KEY environment variable is not set");
  }

  const width = request.width || 1024;
  const height = request.height || 1024;
  const format = request.format || "jpeg";
  const quality = request.quality || "standard";

  try {
    // FLUX API endpoint for image generation
    const response = await axios.post(
      "https://api.bfl.ai/v1/flux-pro-1.0",
      {
        prompt: request.prompt,
        width,
        height,
        format,
        quality,
      },
      {
        headers: {
          "x-key": apiKey,
          "Content-Type": "application/json",
        },
        timeout: 120000, // 2 minutes timeout
      }
    );

    if (!response.data.result?.url) {
      throw new Error("No image URL in response");
    }

    return {
      url: response.data.result.url,
      prompt: request.prompt,
      width,
      height,
      format,
      createdAt: new Date(),
      taskId: response.data.result.task_id,
    };
  } catch (error) {
    console.error("Error generating image with FLUX:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function generateBeforeAfterImages(
  beforePrompt: string,
  afterPrompt: string,
  platform: keyof typeof PLATFORM_DIMENSIONS = "instagram"
): Promise<{ before: GeneratedImage; after: GeneratedImage }> {
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const [beforeImage, afterImage] = await Promise.all([
    generateImage({
      prompt: beforePrompt,
      width: dimensions.width,
      height: dimensions.height,
      quality: "high",
      style: "realistic",
    }),
    generateImage({
      prompt: afterPrompt,
      width: dimensions.width,
      height: dimensions.height,
      quality: "high",
      style: "realistic",
    }),
  ]);

  return { before: beforeImage, after: afterImage };
}

export async function generatePromotionalImages(
  businessName: string,
  service: string,
  platform: keyof typeof PLATFORM_DIMENSIONS = "instagram"
): Promise<GeneratedImage[]> {
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const prompts = [
    `Professional promotional image for ${businessName} offering ${service} services. Modern, clean design with high quality. Arabic text: "${businessName}". High resolution.`,
    `Attractive promotional banner for ${businessName} ${service} service. Professional design with modern aesthetic. Arabic text: "${businessName}". High quality.`,
    `Eye-catching promotional image for ${businessName} featuring ${service}. Modern design, professional appearance. Arabic text: "${businessName}". High resolution.`,
  ];

  const images = await Promise.all(
    prompts.map((prompt) =>
      generateImage({
        prompt,
        width: dimensions.width,
        height: dimensions.height,
        quality: "high",
        style: "professional",
      })
    )
  );

  return images;
}

export async function generateServiceImages(
  services: Array<{ name: string; description: string }>,
  platform: keyof typeof PLATFORM_DIMENSIONS = "instagram"
): Promise<GeneratedImage[]> {
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const images = await Promise.all(
    services.map((service) =>
      generateImage({
        prompt: `Professional image for ${service.name} service. ${service.description}. High quality, modern design, professional appearance. Suitable for social media.`,
        width: dimensions.width,
        height: dimensions.height,
        quality: "high",
        style: "professional",
      })
    )
  );

  return images;
}

export async function generateMaintenanceImages(
  maintenanceType: string,
  platform: keyof typeof PLATFORM_DIMENSIONS = "instagram"
): Promise<GeneratedImage[]> {
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const prompts = [
    `Professional before image of ${maintenanceType}. Showing the initial condition. High quality, realistic. Suitable for social media.`,
    `Professional after image of ${maintenanceType}. Showing the completed work. High quality, realistic. Suitable for social media.`,
    `Professional detail image of ${maintenanceType} work. Showing craftsmanship and quality. High resolution, realistic.`,
  ];

  const images = await Promise.all(
    prompts.map((prompt) =>
      generateImage({
        prompt,
        width: dimensions.width,
        height: dimensions.height,
        quality: "high",
        style: "realistic",
      })
    )
  );

  return images;
}

export async function generateDecorImages(
  decorStyle: string,
  room: string,
  platform: keyof typeof PLATFORM_DIMENSIONS = "instagram"
): Promise<GeneratedImage[]> {
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const prompts = [
    `Beautiful ${decorStyle} interior design for ${room}. Modern, professional, high quality. Suitable for social media and portfolio.`,
    `Elegant ${decorStyle} decoration in ${room}. Professional photography style, high resolution. Suitable for marketing.`,
    `Stunning ${decorStyle} design concept for ${room}. Professional appearance, modern aesthetic. High quality image.`,
  ];

  const images = await Promise.all(
    prompts.map((prompt) =>
      generateImage({
        prompt,
        width: dimensions.width,
        height: dimensions.height,
        quality: "high",
        style: "artistic",
      })
    )
  );

  return images;
}

export function getPlatformDimensions(platform: keyof typeof PLATFORM_DIMENSIONS) {
  return PLATFORM_DIMENSIONS[platform] || PLATFORM_DIMENSIONS.instagram;
}

export function getAllPlatforms(): string[] {
  return Object.keys(PLATFORM_DIMENSIONS);
}

export async function generateImageForAllPlatforms(
  prompt: string,
  quality: "draft" | "standard" | "high" = "standard"
): Promise<Record<string, GeneratedImage>> {
  const results: Record<string, GeneratedImage> = {};

  for (const [platform, dimensions] of Object.entries(PLATFORM_DIMENSIONS)) {
    try {
      const image = await generateImage({
        prompt,
        width: dimensions.width,
        height: dimensions.height,
        quality,
      });
      results[platform] = image;
    } catch (error) {
      console.error(`Failed to generate image for ${platform}:`, error);
    }
  }

  return results;
}

export async function batchGenerateImages(
  requests: ImageGenerationRequest[]
): Promise<GeneratedImage[]> {
  const images = await Promise.all(requests.map((req) => generateImage(req)));
  return images;
}

export function buildImagePrompt(
  contentType: string,
  businessName: string,
  details: string
): string {
  const prompts: Record<string, string> = {
    tip: `Professional infographic for maintenance tip from ${businessName}. ${details}. High quality, modern design, suitable for social media.`,
    "before-after": `Professional before and after image for ${businessName}. ${details}. High quality, realistic, suitable for portfolio.`,
    offer: `Attractive promotional image for special offer from ${businessName}. ${details}. Eye-catching, professional design.`,
    service: `Professional service showcase image for ${businessName}. ${details}. High quality, modern aesthetic.`,
    testimonial: `Professional testimonial image for ${businessName}. ${details}. Friendly, professional appearance.`,
    question: `Engaging interactive image for ${businessName} social media. ${details}. Modern design, suitable for engagement.`,
    "google-business": `Professional cover image for ${businessName} Google Business. ${details}. High quality, professional appearance.`,
    "reel-idea": `Professional thumbnail/cover image for ${businessName} Reel video. ${details}. Eye-catching, modern design.`,
    "tiktok-idea": `Professional thumbnail/cover image for ${businessName} TikTok video. ${details}. Trending, eye-catching design.`,
  };

  return prompts[contentType] || prompts.tip;
}
