import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, TrendingDown, Eye, Heart, MessageSquare, Share, Calendar } from "lucide-react";
import { toast } from "sonner";

const analyticsData = [
  { date: "2026-01-01", views: 1200, engagement: 240, conversions: 24 },
  { date: "2026-01-05", views: 1908, engagement: 221, conversions: 29 },
  { date: "2026-01-10", views: 2000, engagement: 229, conversions: 20 },
  { date: "2026-01-15", views: 2181, engagement: 200, conversions: 18 },
  { date: "2026-01-20", views: 2500, engagement: 208, conversions: 39 },
  { date: "2026-01-25", views: 2100, engagement: 224, conversions: 25 },
  { date: "2026-02-01", views: 2780, engagement: 200, conversions: 34 },
];

const platformPerformance = [
  { platform: "Instagram", reach: 8500, engagement: 1200, conversions: 85 },
  { platform: "Facebook", reach: 6200, engagement: 890, conversions: 62 },
  { platform: "TikTok", reach: 12000, engagement: 2100, conversions: 120 },
  { platform: "Google Business", reach: 4500, engagement: 450, conversions: 45 },
  { platform: "YouTube", reach: 3200, engagement: 320, conversions: 32 },
];

const contentPerformance = [
  { type: "نصيحة سريعة", posts: 12, avgEngagement: 450, avgReach: 2100 },
  { type: "قبل وبعد", posts: 8, avgEngagement: 890, avgReach: 4200 },
  { type: "عرض خاص", posts: 6, avgEngagement: 650, avgReach: 2800 },
  { type: "تعريف الخدمة", posts: 5, avgEngagement: 320, avgReach: 1500 },
  { type: "شهادة عميل", posts: 4, avgEngagement: 720, avgReach: 3100 },
];

const weeklyReports = [
  { week: "الأسبوع 1", revenue: 4200, leads: 24, roi: 320 },
  { week: "الأسبوع 2", revenue: 3800, leads: 20, roi: 280 },
  { week: "الأسبوع 3", revenue: 5200, leads: 31, roi: 380 },
  { week: "الأسبوع 4", revenue: 6100, leads: 38, roi: 420 },
];

export default function AnalyticsAndReports() {
  const [dateRange, setDateRange] = useState("month");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const handleDownloadReport = () => {
    toast.success("تم تحميل التقرير بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            التحليلات والتقارير
          </h1>
          <p className="text-gray-600">تحليل شامل لأداء المحتوى والحملات التسويقية</p>
        </div>

        {/* أزرار التصفية */}
        <div className="flex gap-4 mb-6">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المنصات</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="google">Google Business</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleDownloadReport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            تحميل التقرير
          </Button>
        </div>

        {/* مؤشرات الأداء الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                إجمالي المشاهدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">38.5K</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ↑ 12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                معدل التفاعل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">6.2%</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ↑ 2.1% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                التحويلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">156</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ↑ 8.5% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Share className="w-4 h-4 text-purple-500" />
                العائد على الاستثمار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">320%</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ↑ 45% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
            <TabsTrigger value="platforms">المنصات</TabsTrigger>
            <TabsTrigger value="content">نوع المحتوى</TabsTrigger>
            <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          </TabsList>

          {/* الخط الزمني */}
          <TabsContent value="timeline">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>نمو المشاهدات والتفاعل</CardTitle>
                <CardDescription>إحصائيات يومية للأداء</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" name="المشاهدات" />
                    <Area type="monotone" dataKey="engagement" stroke="#10b981" fillOpacity={1} fill="url(#colorEngagement)" name="التفاعل" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* أداء المنصات */}
          <TabsContent value="platforms">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>مقارنة أداء المنصات</CardTitle>
                <CardDescription>الوصول والتفاعل والتحويلات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={platformPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reach" fill="#3b82f6" name="الوصول" />
                    <Bar dataKey="engagement" fill="#10b981" name="التفاعل" />
                    <Bar dataKey="conversions" fill="#f59e0b" name="التحويلات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* أداء نوع المحتوى */}
          <TabsContent value="content">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>أداء أنواع المحتوى</CardTitle>
                <CardDescription>متوسط التفاعل والوصول لكل نوع</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={contentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="posts" name="عدد المنشورات" />
                    <YAxis dataKey="avgEngagement" name="متوسط التفاعل" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="أنواع المحتوى" data={contentPerformance} fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإيرادات والعائد */}
          <TabsContent value="revenue">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>الإيرادات والعائد على الاستثمار</CardTitle>
                <CardDescription>أداء الحملات التسويقية أسبوعياً</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" name="الإيرادات ($)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#f59e0b" name="العائد (%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* جدول التفاصيل */}
        <Card className="bg-white shadow-lg mt-8">
          <CardHeader>
            <CardTitle>تفاصيل الأداء</CardTitle>
            <CardDescription>أفضل المحتوى أداءً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المحتوى</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المشاهدات</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">التفاعل</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">التحويلات</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">معدل التحويل</th>
                  </tr>
                </thead>
                <tbody>
                  {contentPerformance.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{item.type}</td>
                      <td className="py-3 px-4 text-gray-600">{item.avgReach.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{item.avgEngagement}</td>
                      <td className="py-3 px-4 text-gray-600">{Math.round((item.avgEngagement / item.avgReach) * 100)}</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {((item.avgEngagement / item.avgReach) * 100).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
