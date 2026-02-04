import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// منصة نور الذكية - Noor Smart Marketing
// ========================================

/**
 * جدول الحسابات الموحدة
 * Unified accounts for social media platforms
 */
export const unifiedAccounts = mysqlTable("unified_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessDescription: text("businessDescription"),
  businessPhone: varchar("businessPhone", { length: 20 }),
  businessEmail: varchar("businessEmail", { length: 320 }),
  businessAddress: text("businessAddress"),
  businessServices: text("businessServices"),
  targetAudience: text("targetAudience"),
  dialect: varchar("dialect", { length: 100 }).default("خليجية"),
  focusServices: text("focusServices"),
  language: mysqlEnum("language", ["ar", "en", "both"]).default("both"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UnifiedAccount = typeof unifiedAccounts.$inferSelect;
export type InsertUnifiedAccount = typeof unifiedAccounts.$inferInsert;

/**
 * جدول المحتوى المولد
 * Generated content posts
 */
export const generatedContent = mysqlTable("generated_content", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull().references(() => unifiedAccounts.id),
  contentType: varchar("contentType", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  captionLong: text("captionLong"),
  storyCaption: text("storyCaption"),
  reelIdea: text("reelIdea"),
  cta: text("cta"),
  hashtags: text("hashtags"),
  googlePost: text("googlePost"),
  postDate: varchar("postDate", { length: 10 }),
  postTime: varchar("postTime", { length: 10 }),
  language: mysqlEnum("language", ["ar", "en"]).default("ar"),
  status: mysqlEnum("status", ["draft", "scheduled", "published", "archived"]).default("draft"),
  platforms: varchar("platforms", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = typeof generatedContent.$inferInsert;

/**
 * جدول الصور المولدة
 * Generated images
 */
export const generatedImages = mysqlTable("generated_images", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").references(() => generatedContent.id),
  accountId: int("accountId").notNull().references(() => unifiedAccounts.id),
  imageUrl: text("imageUrl").notNull(),
  prompt: text("prompt"),
  imageType: varchar("imageType", { length: 100 }),
  platform: varchar("platform", { length: 100 }),
  dimensions: varchar("dimensions", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = typeof generatedImages.$inferInsert;

/**
 * جدول الحملات التسويقية
 * Marketing campaigns
 */
export const marketingCampaigns = mysqlTable("marketing_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull().references(() => unifiedAccounts.id),
  campaignName: varchar("campaignName", { length: 255 }).notNull(),
  campaignDescription: text("campaignDescription"),
  campaignType: varchar("campaignType", { length: 100 }),
  startDate: varchar("startDate", { length: 10 }),
  endDate: varchar("endDate", { length: 10 }),
  budget: int("budget").default(0),
  status: mysqlEnum("status", ["planning", "active", "paused", "completed"]).default("planning"),
  contentIds: text("contentIds"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = typeof marketingCampaigns.$inferInsert;

/**
 * جدول إحصائيات الأداء
 * Performance statistics
 */
export const performanceStats = mysqlTable("performance_stats", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull().references(() => generatedContent.id),
  platform: varchar("platform", { length: 100 }).notNull(),
  views: int("views").default(0),
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  engagementRate: varchar("engagementRate", { length: 10 }),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type PerformanceStat = typeof performanceStats.$inferSelect;
export type InsertPerformanceStat = typeof performanceStats.$inferInsert;

/**
 * جدول التقارير والإشعارات
 * Reports and notifications
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  accountId: int("accountId").notNull().references(() => unifiedAccounts.id),
  reportType: varchar("reportType", { length: 100 }),
  reportData: text("reportData"),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
  status: mysqlEnum("status", ["pending", "sent", "viewed"]).default("pending"),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * جدول قوالب المحتوى
 * Content templates
 */
export const contentTemplates = mysqlTable("content_templates", {
  id: int("id").autoincrement().primaryKey(),
  templateName: varchar("templateName", { length: 255 }).notNull(),
  templateType: varchar("templateType", { length: 100 }).notNull(),
  templatePrompt: text("templatePrompt"),
  templateStructure: text("templateStructure"),
  language: mysqlEnum("language", ["ar", "en"]).default("ar"),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentTemplate = typeof contentTemplates.$inferSelect;
export type InsertContentTemplate = typeof contentTemplates.$inferInsert;

/**
 * جدول حسابات وسائل التواصل
 * Social media accounts
 */
export const socialMediaAccounts = mysqlTable("social_media_accounts", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull().references(() => unifiedAccounts.id),
  platform: varchar("platform", { length: 100 }).notNull(),
  platformUsername: varchar("platformUsername", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiry: timestamp("tokenExpiry"),
  isConnected: int("isConnected").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SocialMediaAccount = typeof socialMediaAccounts.$inferSelect;
export type InsertSocialMediaAccount = typeof socialMediaAccounts.$inferInsert;

/**
 * جدول جدولة النشر
 * Publishing schedule
 */
export const publishingSchedule = mysqlTable("publishing_schedule", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull().references(() => generatedContent.id),
  platform: varchar("platform", { length: 100 }).notNull(),
  scheduledTime: timestamp("scheduledTime").notNull(),
  status: mysqlEnum("status", ["pending", "published", "failed"]).default("pending"),
  errorMessage: text("errorMessage"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PublishingSchedule = typeof publishingSchedule.$inferSelect;
export type InsertPublishingSchedule = typeof publishingSchedule.$inferInsert;

/**
 * جدول تحسين محركات البحث
 * SEO optimization data
 */
export const seoOptimization = mysqlTable("seo_optimization", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull().references(() => generatedContent.id),
  keywords: text("keywords"),
  metaDescription: text("metaDescription"),
  metaTitle: varchar("metaTitle", { length: 255 }),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: text("ogDescription"),
  ogImage: text("ogImage"),
  seoScore: int("seoScore").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeoOptimization = typeof seoOptimization.$inferSelect;
export type InsertSeoOptimization = typeof seoOptimization.$inferInsert;
