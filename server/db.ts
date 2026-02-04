import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  unifiedAccounts,
  generatedContent,
  generatedImages,
  marketingCampaigns,
  performanceStats,
  socialMediaAccounts,
  publishingSchedule,
  seoOptimization,
  contentTemplates,
  reports,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==========================================
// Unified Accounts
// ==========================================

export async function createUnifiedAccount(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(unifiedAccounts).values(data);
  return result;
}

export async function getUnifiedAccount(accountId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(unifiedAccounts).where(eq(unifiedAccounts.id, accountId)).limit(1);
  return result[0];
}

export async function getUserUnifiedAccounts(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(unifiedAccounts).where(eq(unifiedAccounts.userId, userId));
}

export async function updateUnifiedAccount(accountId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(unifiedAccounts).set(data).where(eq(unifiedAccounts.id, accountId));
}

// ==========================================
// Generated Content
// ==========================================

export async function createGeneratedContent(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(generatedContent).values(data);
  return result;
}

export async function getGeneratedContent(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(generatedContent).where(eq(generatedContent.id, contentId)).limit(1);
  return result[0];
}

export async function getAccountContent(accountId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(generatedContent)
    .where(eq(generatedContent.accountId, accountId))
    .orderBy(desc(generatedContent.createdAt))
    .limit(limit);
}

export async function updateGeneratedContent(contentId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(generatedContent).set(data).where(eq(generatedContent.id, contentId));
}

// ==========================================
// Generated Images
// ==========================================

export async function createGeneratedImage(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(generatedImages).values(data);
  return result;
}

export async function getContentImages(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(generatedImages).where(eq(generatedImages.contentId, contentId));
}

// ==========================================
// Marketing Campaigns
// ==========================================

export async function createMarketingCampaign(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(marketingCampaigns).values(data);
  return result;
}

export async function getMarketingCampaign(campaignId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(marketingCampaigns).where(eq(marketingCampaigns.id, campaignId)).limit(1);
  return result[0];
}

export async function getAccountCampaigns(accountId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(marketingCampaigns)
    .where(eq(marketingCampaigns.accountId, accountId))
    .orderBy(desc(marketingCampaigns.createdAt));
}

export async function updateMarketingCampaign(campaignId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(marketingCampaigns).set(data).where(eq(marketingCampaigns.id, campaignId));
}

// ==========================================
// Performance Statistics
// ==========================================

export async function createPerformanceStat(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(performanceStats).values(data);
}

export async function getContentStats(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(performanceStats).where(eq(performanceStats.contentId, contentId));
}

// ==========================================
// Social Media Accounts
// ==========================================

export async function createSocialMediaAccount(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(socialMediaAccounts).values(data);
}

export async function getAccountSocialMediaAccounts(accountId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(socialMediaAccounts).where(eq(socialMediaAccounts.accountId, accountId));
}

export async function updateSocialMediaAccount(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(socialMediaAccounts).set(data).where(eq(socialMediaAccounts.id, id));
}

// ==========================================
// Publishing Schedule
// ==========================================

export async function createPublishingSchedule(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(publishingSchedule).values(data);
}

export async function getPendingPublishes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(publishingSchedule)
    .where(eq(publishingSchedule.status, "pending"))
    .orderBy(publishingSchedule.scheduledTime);
}

export async function updatePublishingSchedule(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(publishingSchedule).set(data).where(eq(publishingSchedule.id, id));
}

// ==========================================
// SEO Optimization
// ==========================================

export async function createSeoOptimization(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(seoOptimization).values(data);
}

export async function getSeoOptimization(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(seoOptimization).where(eq(seoOptimization.contentId, contentId)).limit(1);
  return result[0];
}

export async function updateSeoOptimization(contentId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(seoOptimization).set(data).where(eq(seoOptimization.contentId, contentId));
}

// ==========================================
// Content Templates
// ==========================================

export async function getContentTemplates(language: "ar" | "en" = "ar") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(contentTemplates)
    .where(and(eq(contentTemplates.language, language), eq(contentTemplates.isActive, 1)));
}

// ==========================================
// Reports
// ==========================================

export async function createReport(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reports).values(data);
}

export async function getUserReports(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.generatedAt));
}
