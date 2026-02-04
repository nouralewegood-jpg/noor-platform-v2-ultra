import axios from "axios";

export interface PublishSchedule {
  contentId: number;
  platform: string;
  scheduledTime: Date;
  status: "pending" | "published" | "failed";
  retries: number;
}

export interface BufferPublishRequest {
  text: string;
  media?: {
    link: string;
    description?: string;
  }[];
  sharedNow?: boolean;
  scheduleTime?: number; // Unix timestamp
}

export interface GoogleBusinessPost {
  summary: string;
  description?: string;
  media?: {
    url: string;
    type: "IMAGE" | "VIDEO";
  }[];
  callToAction?: {
    actionType: "LEARN_MORE" | "BOOK" | "CALL" | "ORDER" | "SIGN_UP";
    url: string;
  };
}

export async function publishToBuffer(
  accessToken: string,
  profileId: string,
  request: BufferPublishRequest
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const response = await axios.post(
      "https://api.bufferapp.com/1/updates/create.json",
      {
        profile_ids: [profileId],
        text: request.text,
        media: request.media,
        sharedNow: request.sharedNow || false,
        scheduleTime: request.scheduleTime,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        postId: response.data.buffer_id,
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to publish to Buffer",
      };
    }
  } catch (error) {
    console.error("Error publishing to Buffer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishToGoogleBusiness(
  accessToken: string,
  accountId: string,
  locationId: string,
  post: GoogleBusinessPost
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const response = await axios.post(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts/${accountId}/locations/${locationId}/posts`,
      {
        summary: post.summary,
        description: post.description,
        media: post.media,
        callToAction: post.callToAction,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      postId: response.data.name,
    };
  } catch (error) {
    console.error("Error publishing to Google Business:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishToInstagram(
  accessToken: string,
  igUserId: string,
  caption: string,
  imageUrl: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // أولاً: إنشاء container
    const containerResponse = await axios.post(
      `https://graph.instagram.com/${igUserId}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }
    );

    if (!containerResponse.data.id) {
      throw new Error("Failed to create media container");
    }

    // ثانياً: نشر الcontainer
    const publishResponse = await axios.post(
      `https://graph.instagram.com/${igUserId}/media_publish`,
      {
        creation_id: containerResponse.data.id,
        access_token: accessToken,
      }
    );

    return {
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishToFacebook(
  accessToken: string,
  pageId: string,
  message: string,
  imageUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const payload: Record<string, unknown> = {
      message: message,
      access_token: accessToken,
    };

    if (imageUrl) {
      payload.url = imageUrl;
    }

    const response = await axios.post(`https://graph.facebook.com/${pageId}/feed`, payload);

    return {
      success: true,
      postId: response.data.id,
    };
  } catch (error) {
    console.error("Error publishing to Facebook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishToTikTok(
  accessToken: string,
  videoUrl: string,
  caption: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // ملاحظة: TikTok API محدود ويتطلب موافقة خاصة
    const response = await axios.post(
      "https://open.tiktok.com/v1/post/publish/action/publish/",
      {
        video_url: videoUrl,
        caption: caption,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      postId: response.data.data.publish_id,
    };
  } catch (error) {
    console.error("Error publishing to TikTok:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function schedulePublish(
  platform: string,
  contentId: number,
  scheduledTime: Date,
  publishData: Record<string, unknown>
): Promise<PublishSchedule> {
  return {
    contentId,
    platform,
    scheduledTime,
    status: "pending",
    retries: 0,
  };
}

export async function retryFailedPublish(
  schedule: PublishSchedule,
  maxRetries: number = 3
): Promise<boolean> {
  if (schedule.retries >= maxRetries) {
    console.error(`Max retries reached for content ${schedule.contentId} on ${schedule.platform}`);
    return false;
  }

  schedule.retries += 1;
  // في التطبيق الحقيقي، سيتم إعادة محاولة النشر
  return true;
}

export async function batchPublish(
  platforms: string[],
  contentId: number,
  publishData: Record<string, unknown>,
  scheduleTime?: Date
): Promise<Record<string, { success: boolean; error?: string }>> {
  const results: Record<string, { success: boolean; error?: string }> = {};

  for (const platform of platforms) {
    try {
      // في التطبيق الحقيقي، سيتم النشر على كل منصة
      results[platform] = { success: true };
    } catch (error) {
      results[platform] = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  return results;
}

export function getOptimalPublishTime(platform: string): Date {
  // أوقات النشر المثالية لكل منصة بناءً على الدراسات
  const optimalTimes: Record<string, { hour: number; minute: number }> = {
    instagram: { hour: 19, minute: 0 }, // 7 PM
    facebook: { hour: 13, minute: 0 }, // 1 PM
    tiktok: { hour: 18, minute: 0 }, // 6 PM
    twitter: { hour: 9, minute: 0 }, // 9 AM
    linkedin: { hour: 8, minute: 0 }, // 8 AM
    pinterest: { hour: 14, minute: 0 }, // 2 PM
    youtube: { hour: 16, minute: 0 }, // 4 PM
  };

  const time = optimalTimes[platform] || { hour: 12, minute: 0 };
  const now = new Date();
  const publishTime = new Date(now);
  publishTime.setHours(time.hour, time.minute, 0, 0);

  // إذا كان الوقت قد مضى اليوم، اجعله غداً
  if (publishTime < now) {
    publishTime.setDate(publishTime.getDate() + 1);
  }

  return publishTime;
}

export function formatContentForPlatform(
  content: string,
  platform: string,
  maxLength?: number
): string {
  const platformLimits: Record<string, number> = {
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    tiktok: 2200,
    linkedin: 3000,
    pinterest: 500,
    youtube: 5000,
  };

  const limit = maxLength || platformLimits[platform] || 1000;

  if (content.length <= limit) {
    return content;
  }

  // قص المحتوى وأضف "..." في النهاية
  return content.substring(0, limit - 3) + "...";
}

export function addHashtagsForPlatform(content: string, hashtags: string[], platform: string): string {
  // بعض المنصات تفضل الهاشتاقات في النهاية، والبعض في البداية
  const hashtagString = hashtags.join(" ");

  switch (platform) {
    case "instagram":
    case "twitter":
      return `${content}\n\n${hashtagString}`;
    case "facebook":
      return `${content} ${hashtagString}`;
    case "linkedin":
      return `${content}\n\n${hashtagString}`;
    default:
      return `${content}\n${hashtagString}`;
  }
}
