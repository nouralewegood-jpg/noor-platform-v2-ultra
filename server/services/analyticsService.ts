export interface AnalyticsMetrics {
  totalViews: number;
  totalEngagement: number;
  totalConversions: number;
  totalReach: number;
  averageEngagementRate: number;
  conversionRate: number;
  roi: number;
}

export interface PlatformAnalytics {
  platform: string;
  views: number;
  engagement: number;
  conversions: number;
  reach: number;
  engagementRate: number;
  topPost: {
    title: string;
    engagement: number;
  };
}

export interface ContentPerformance {
  contentId: number;
  contentType: string;
  title: string;
  platform: string;
  views: number;
  engagement: number;
  conversions: number;
  engagementRate: number;
  roi: number;
  publishedAt: Date;
}

export interface DailyMetrics {
  date: Date;
  views: number;
  engagement: number;
  conversions: number;
  reach: number;
}

export interface WeeklyTrends {
  week: string;
  views: number;
  engagement: number;
  conversions: number;
  growth: number; // نسبة النمو مقارنة بالأسبوع السابق
}

export class AnalyticsService {
  async getOverallMetrics(userId: number, startDate: Date, endDate: Date): Promise<AnalyticsMetrics> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    return {
      totalViews: 15420,
      totalEngagement: 2150,
      totalConversions: 85,
      totalReach: 25000,
      averageEngagementRate: 8.5,
      conversionRate: 3.2,
      roi: 245,
    };
  }

  async getPlatformAnalytics(userId: number, startDate: Date, endDate: Date): Promise<PlatformAnalytics[]> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    return [
      {
        platform: "Instagram",
        views: 5200,
        engagement: 850,
        conversions: 35,
        reach: 8500,
        engagementRate: 16.3,
        topPost: {
          title: "صورة قبل وبعد",
          engagement: 250,
        },
      },
      {
        platform: "Facebook",
        views: 4800,
        engagement: 650,
        conversions: 28,
        reach: 7200,
        engagementRate: 13.5,
        topPost: {
          title: "عرض خاص",
          engagement: 180,
        },
      },
      {
        platform: "TikTok",
        views: 3500,
        engagement: 450,
        conversions: 15,
        reach: 6000,
        engagementRate: 12.9,
        topPost: {
          title: "فيديو نصيحة سريعة",
          engagement: 120,
        },
      },
    ];
  }

  async getContentPerformance(
    userId: number,
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<ContentPerformance[]> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    return [
      {
        contentId: 1,
        contentType: "before-after",
        title: "مشروع صيانة رخام فاخر",
        platform: "Instagram",
        views: 2100,
        engagement: 250,
        conversions: 12,
        engagementRate: 11.9,
        roi: 450,
        publishedAt: new Date(),
      },
      {
        contentId: 2,
        contentType: "offer",
        title: "عرض خاص محدود الوقت",
        platform: "Facebook",
        views: 1800,
        engagement: 180,
        conversions: 8,
        engagementRate: 10,
        roi: 320,
        publishedAt: new Date(),
      },
    ];
  }

  async getDailyMetrics(userId: number, days: number = 30): Promise<DailyMetrics[]> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    const metrics: DailyMetrics[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      metrics.push({
        date,
        views: Math.floor(Math.random() * 500) + 100,
        engagement: Math.floor(Math.random() * 100) + 20,
        conversions: Math.floor(Math.random() * 20) + 2,
        reach: Math.floor(Math.random() * 1000) + 300,
      });
    }
    return metrics.reverse();
  }

  async getWeeklyTrends(userId: number, weeks: number = 12): Promise<WeeklyTrends[]> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    const trends: WeeklyTrends[] = [];
    let previousConversions = 50;

    for (let i = 0; i < weeks; i++) {
      const conversions = Math.floor(Math.random() * 40) + 20;
      const growth = ((conversions - previousConversions) / previousConversions) * 100;

      trends.push({
        week: `الأسبوع ${i + 1}`,
        views: Math.floor(Math.random() * 3000) + 1000,
        engagement: Math.floor(Math.random() * 500) + 100,
        conversions,
        growth,
      });

      previousConversions = conversions;
    }

    return trends;
  }

  async getContentTypeAnalytics(userId: number): Promise<Record<string, AnalyticsMetrics>> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    return {
      tip: {
        totalViews: 3200,
        totalEngagement: 450,
        totalConversions: 15,
        totalReach: 5000,
        averageEngagementRate: 14.1,
        conversionRate: 3.3,
        roi: 180,
      },
      "before-after": {
        totalViews: 4500,
        totalEngagement: 680,
        totalConversions: 35,
        totalReach: 7200,
        averageEngagementRate: 15.1,
        conversionRate: 5.1,
        roi: 420,
      },
      offer: {
        totalViews: 2800,
        totalEngagement: 380,
        totalConversions: 25,
        totalReach: 4500,
        averageEngagementRate: 13.6,
        conversionRate: 6.6,
        roi: 350,
      },
    };
  }

  async getAudienceDemographics(userId: number): Promise<{
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
  }> {
    // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
    return {
      ageGroups: {
        "18-24": 15,
        "25-34": 35,
        "35-44": 30,
        "45-54": 15,
        "55+": 5,
      },
      genders: {
        male: 55,
        female: 45,
      },
      locations: {
        "الرياض": 40,
        "جدة": 25,
        "الدمام": 15,
        "أخرى": 20,
      },
    };
  }

  async getCompetitorComparison(userId: number): Promise<{
    yourMetrics: AnalyticsMetrics;
    competitors: Array<{
      name: string;
      metrics: AnalyticsMetrics;
    }>;
  }> {
    // في التطبيق الحقيقي، سيتم جلب بيانات المنافسين من API خارجي
    return {
      yourMetrics: {
        totalViews: 15420,
        totalEngagement: 2150,
        totalConversions: 85,
        totalReach: 25000,
        averageEngagementRate: 8.5,
        conversionRate: 3.2,
        roi: 245,
      },
      competitors: [
        {
          name: "منافس 1",
          metrics: {
            totalViews: 12000,
            totalEngagement: 1800,
            totalConversions: 60,
            totalReach: 20000,
            averageEngagementRate: 7.5,
            conversionRate: 3.3,
            roi: 200,
          },
        },
        {
          name: "منافس 2",
          metrics: {
            totalViews: 18000,
            totalEngagement: 2400,
            totalConversions: 95,
            totalReach: 28000,
            averageEngagementRate: 9.2,
            conversionRate: 3.9,
            roi: 280,
          },
        },
      ],
    };
  }

  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  calculateEngagementRate(engagement: number, reach: number): number {
    if (reach === 0) return 0;
    return (engagement / reach) * 100;
  }

  calculateConversionRate(conversions: number, reach: number): number {
    if (reach === 0) return 0;
    return (conversions / reach) * 100;
  }

  calculateROI(revenue: number, cost: number): number {
    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
  }

  async generatePerformanceReport(userId: number, startDate: Date, endDate: Date): Promise<string> {
    const metrics = await this.getOverallMetrics(userId, startDate, endDate);
    const platformMetrics = await this.getPlatformAnalytics(userId, startDate, endDate);

    let report = `
📊 تقرير الأداء الشامل
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 الإحصائيات العامة:
• إجمالي المشاهدات: ${metrics.totalViews.toLocaleString("ar-EG")}
• إجمالي التفاعل: ${metrics.totalEngagement.toLocaleString("ar-EG")}
• إجمالي التحويلات: ${metrics.totalConversions.toLocaleString("ar-EG")}
• معدل التفاعل: ${metrics.averageEngagementRate.toFixed(2)}%
• معدل التحويل: ${metrics.conversionRate.toFixed(2)}%
• العائد على الاستثمار: ${metrics.roi}%

📱 أداء المنصات:
`;

    for (const platform of platformMetrics) {
      report += `
${platform.platform}:
• المشاهدات: ${platform.views.toLocaleString("ar-EG")}
• التفاعل: ${platform.engagement.toLocaleString("ar-EG")}
• التحويلات: ${platform.conversions.toLocaleString("ar-EG")}
• معدل التفاعل: ${platform.engagementRate.toFixed(2)}%
• أفضل منشور: ${platform.topPost.title} (${platform.topPost.engagement} تفاعل)
`;
    }

    return report;
  }
}

export const analyticsService = new AnalyticsService();
