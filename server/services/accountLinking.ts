/**
 * خدمة ربط الحسابات للمنصات الاجتماعية
 * توفر OAuth URLs وإدارة التوكنات
 */

export interface LinkedAccount {
  platform: string;
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

// OAuth Configurations for each platform
const oauthConfigs: Record<string, OAuthConfig> = {
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/facebook/callback`,
    scope: ["pages_manage_posts", "pages_read_engagement", "pages_manage_metadata"],
  },
  instagram: {
    clientId: process.env.INSTAGRAM_APP_ID || "",
    clientSecret: process.env.INSTAGRAM_APP_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/instagram/callback`,
    scope: ["instagram_basic", "instagram_content_publish"],
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID || "",
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/tiktok/callback`,
    scope: ["user.info.basic", "video.upload"],
  },
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID || "",
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/youtube/callback`,
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  },
  snapchat: {
    clientId: process.env.SNAPCHAT_CLIENT_ID || "",
    clientSecret: process.env.SNAPCHAT_CLIENT_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/snapchat/callback`,
    scope: ["snapchat-marketing-api"],
  },
  pinterest: {
    clientId: process.env.PINTEREST_APP_ID || "",
    clientSecret: process.env.PINTEREST_APP_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/pinterest/callback`,
    scope: ["boards:read", "pins:create"],
  },
  "google-business": {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/google/callback`,
    scope: ["https://www.googleapis.com/auth/business.manage"],
  },
  blogger: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.APP_URL}/api/oauth/blogger/callback`,
    scope: ["https://www.googleapis.com/auth/blogger"],
  },
};

/**
 * الحصول على OAuth URL لمنصة معينة
 */
export function getOAuthUrl(platform: string, state: string): string {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`Platform ${platform} not supported`);
  }

  const oauthUrls: Record<string, string> = {
    facebook: "https://www.facebook.com/v18.0/dialog/oauth",
    instagram: "https://api.instagram.com/oauth/authorize",
    tiktok: "https://www.tiktok.com/v1/oauth/authorize",
    youtube: "https://accounts.google.com/o/oauth2/v2/auth",
    snapchat: "https://accounts.snapchat.com/accounts/oauth2/authorize",
    pinterest: "https://api.pinterest.com/oauth/",
    "google-business": "https://accounts.google.com/o/oauth2/v2/auth",
    blogger: "https://accounts.google.com/o/oauth2/v2/auth",
  };

  const baseUrl = oauthUrls[platform];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope.join(" "),
    state,
    response_type: "code",
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * تبديل رمز التفويض بـ Access Token
 */
export async function exchangeCodeForToken(
  platform: string,
  code: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`Platform ${platform} not supported`);
  }

  const tokenUrls: Record<string, string> = {
    facebook: "https://graph.instagram.com/v18.0/oauth/access_token",
    instagram: "https://graph.instagram.com/v18.0/oauth/access_token",
    tiktok: "https://open.tiktokapis.com/v1/oauth/token",
    youtube: "https://oauth2.googleapis.com/token",
    snapchat: "https://accounts.snapchat.com/accounts/oauth2/token",
    pinterest: "https://api.pinterest.com/v1/oauth/token",
    "google-business": "https://oauth2.googleapis.com/token",
    blogger: "https://oauth2.googleapis.com/token",
  };

  const tokenUrl = tokenUrls[platform];

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error(`Error exchanging code for ${platform}:`, error);
    throw error;
  }
}

/**
 * الحصول على معلومات الحساب من المنصة
 */
export async function getAccountInfo(
  platform: string,
  accessToken: string
): Promise<{ accountId: string; accountName: string }> {
  const apiEndpoints: Record<string, string> = {
    facebook: "https://graph.facebook.com/me",
    instagram: "https://graph.instagram.com/me",
    tiktok: "https://open.tiktokapis.com/v1/user/info/",
    youtube: "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    snapchat: "https://adsapi.snapchat.com/v1/me",
    pinterest: "https://api.pinterest.com/v1/user/",
    "google-business": "https://www.googleapis.com/business/v4/accounts",
    blogger: "https://www.googleapis.com/blogger/v3/users/self",
  };

  const endpoint = apiEndpoints[platform];
  if (!endpoint) {
    throw new Error(`Platform ${platform} not supported`);
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get account info: ${response.statusText}`);
    }

    const data = await response.json();

    // استخراج معلومات الحساب حسب المنصة
    let accountId = "";
    let accountName = "";

    switch (platform) {
      case "facebook":
      case "instagram":
        accountId = data.id;
        accountName = data.name || data.username;
        break;
      case "tiktok":
        accountId = data.data.user.id;
        accountName = data.data.user.display_name;
        break;
      case "youtube":
        accountId = data.items[0].id;
        accountName = data.items[0].snippet.title;
        break;
      case "snapchat":
        accountId = data.data.id;
        accountName = data.data.display_name;
        break;
      case "pinterest":
        accountId = data.data.id;
        accountName = data.data.username;
        break;
      case "google-business":
        accountId = data.accounts[0].name;
        accountName = data.accounts[0].displayName;
        break;
      case "blogger":
        accountId = data.id;
        accountName = data.displayName;
        break;
    }

    return { accountId, accountName };
  } catch (error) {
    console.error(`Error getting account info for ${platform}:`, error);
    throw error;
  }
}

/**
 * حفظ الحساب المرتبط
 */
export async function saveLinkedAccount(
  userId: number,
  platform: string,
  accountInfo: { accountId: string; accountName: string },
  tokens: { accessToken: string; refreshToken?: string; expiresIn?: number }
): Promise<LinkedAccount> {
  // في الإنتاج، سيتم حفظ الحساب في قاعدة البيانات
  const linkedAccount: LinkedAccount = {
    platform,
    accountId: accountInfo.accountId,
    accountName: accountInfo.accountName,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : undefined,
    isActive: true,
  };

  console.log(`Account linked: ${platform} - ${accountInfo.accountName}`);

  return linkedAccount;
}

/**
 * فصل حساب مرتبط
 */
export async function unlinkAccount(userId: number, platform: string): Promise<boolean> {
  try {
    // في الإنتاج، سيتم حذف الحساب من قاعدة البيانات
    console.log(`Account unlinked: ${platform}`);
    return true;
  } catch (error) {
    console.error(`Error unlinking account for ${platform}:`, error);
    return false;
  }
}

/**
 * الحصول على جميع الحسابات المرتبطة
 */
export async function getLinkedAccounts(userId: number): Promise<LinkedAccount[]> {
  // في الإنتاج، سيتم جلب الحسابات من قاعدة البيانات
  return [];
}

/**
 * تحديث Access Token باستخدام Refresh Token
 */
export async function refreshAccessToken(
  platform: string,
  refreshToken: string
): Promise<{ accessToken: string; expiresIn?: number }> {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`Platform ${platform} not supported`);
  }

  const tokenUrls: Record<string, string> = {
    facebook: "https://graph.instagram.com/v18.0/oauth/access_token",
    instagram: "https://graph.instagram.com/v18.0/oauth/access_token",
    tiktok: "https://open.tiktokapis.com/v1/oauth/token",
    youtube: "https://oauth2.googleapis.com/token",
    snapchat: "https://accounts.snapchat.com/accounts/oauth2/token",
    pinterest: "https://api.pinterest.com/v1/oauth/token",
    "google-business": "https://oauth2.googleapis.com/token",
    blogger: "https://oauth2.googleapis.com/token",
  };

  const tokenUrl = tokenUrls[platform];

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error(`Error refreshing token for ${platform}:`, error);
    throw error;
  }
}
