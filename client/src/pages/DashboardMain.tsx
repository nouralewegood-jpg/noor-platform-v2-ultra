import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sparkles, Image, Share2, TrendingUp, Users, Eye, Heart, MessageSquare, Share, FileText, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// بيانات وهمية للإحصائيات
const contentStats = [
  { month: "يناير", posts: 35, engagement: 2400, reach: 9400 },
  { month: "فبراير", posts: 38, engagement: 2210, reach: 9800 },
  { month: "مارس", posts: 40, engagement: 2290, reach: 10300 },
  { month: "أبريل", posts: 36, engagement: 2000, reach: 9200 },
];

const platformStats = [
  { name: "Instagram", value: 35, color: "#E4405F" },
  { name: "Facebook", value: 25, color: "#1877F2" },
  { name: "TikTok", value: 20, color: "#000000" },
  { name: "Google Business", value: 15, color: "#4285F4" },
  { name: "YouTube", value: 5, color: "#FF0000" },
];

const recentContent = [
  {
    id: 1,
    title: "نصيحة صيانة سريعة",
    platforms: ["Instagram", "Facebook"],
    engagement: 1250,
    date: "2026-02-03",
  },
  {
    id: 2,
    title: "صورة قبل وبعد",
    platforms: ["Instagram", "TikTok"],
    engagement: 2100,
    date: "2026-02-02",
  },
  {
    id: 3,
    title: "عرض خاص ديكور",
    platforms: ["Facebook", "Google Business"],
    engagement: 890,
    date: "2026-02-01",
  },
];

export default function DashboardMain() {
  const { user } = useAuth();
  const sendReportMutation = trpc.notification.sendWeeklyReport.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("تم إرسال التقرير الأسبوعي إلى بريدك الإلكتروني بنجاح");
      } else {
        toast.error("فشل إرسال التقرير: " + (data.error || "خطأ غير معروف"));
      }
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إرسال التقرير: " + error.message);
    },
  });

  const handleSendReport = () => {
    sendReportMutation.mutate({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">مرحباً بك في منصة نور الذكية</h1>
            <p className="text-gray-600">
              منصة متكاملة لإدارة وأتمتة التسويق الرقمي المتخصصة في الصيانة العامة والديكور
            </p>
          </div>
          <Button 
            onClick={handleSendReport} 
            disabled={sendReportMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            {sendReportMutation.isPending ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <FileText className="w-4 h-4" />
            )}
            إرسال التقرير الأسبوعي
          </Button>
        </div>

        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                المحتوى المولد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">149</div>
              <p className="text-xs text-gray-500 mt-1">منشور هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-500" />
                المشاهدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">38.5K</div>
              <p className="text-xs text-gray-500 mt-1">↑ 12% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                التفاعل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2.4K</div>
              <p className="text-xs text-gray-500 mt-1">إعجابات وتعليقات</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Share className="w-4 h-4 text-purple-500" />
                المشاركات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">856</div>
              <p className="text-xs text-gray-500 mt-1">مشاركة ومتابعة</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analytics">الإحصائيات</TabsTrigger>
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="platforms">المنصات</TabsTrigger>
          </TabsList>

          {/* تبويب الإحصائيات */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>نمو المحتوى والتفاعل</CardTitle>
                <CardDescription>إحصائيات الأداء على مدار الأشهر الماضية</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={contentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="التفاعل" strokeWidth={2} />
                    <Line type="monotone" dataKey="reach" stroke="#10b981" name="الوصول" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>توزيع المحتوى حسب الشهر</CardTitle>
                <CardDescription>عدد المنشورات المولدة شهرياً</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="posts" fill="#8b5cf6" name="عدد المنشورات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب المحتوى */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>أحدث المحتوى المولد</CardTitle>
                <CardDescription>آخر المنشورات والصور المُنشأة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{content.title}</h4>
                        <div className="flex gap-2 mt-2">
                          {content.platforms.map((platform) => (
                            <span key={platform} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{content.engagement.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{content.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-24 bg-blue-600 hover:bg-blue-700 text-white text-lg" size="lg">
                <Sparkles className="w-6 h-6 mr-2" />
                ولّد محتوى جديد
              </Button>
              <Button className="h-24 bg-green-600 hover:bg-green-700 text-white text-lg" size="lg">
                <Image className="w-6 h-6 mr-2" />
                ولّد صوراً
              </Button>
              <Button className="h-24 bg-purple-600 hover:bg-purple-700 text-white text-lg" size="lg">
                <Share2 className="w-6 h-6 mr-2" />
                انشر الآن
              </Button>
            </div>
          </TabsContent>

          {/* تبويب المنصات */}
          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>توزيع المحتوى حسب المنصة</CardTitle>
                <CardDescription>نسبة المنشورات على كل منصة</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={platformStats} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {platformStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>حالة المنصات</CardTitle>
                <CardDescription>حالة الاتصال والمزامنة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformStats.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium text-gray-900">{platform.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">متصل ✓</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
