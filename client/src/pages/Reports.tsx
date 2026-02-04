import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const reportData = [
  { date: "1 يناير", views: 1200, engagement: 400, conversions: 24 },
  { date: "8 يناير", views: 2100, engagement: 1398, conversions: 221 },
  { date: "15 يناير", views: 2000, engagement: 9800, conversions: 229 },
  { date: "22 يناير", views: 2780, engagement: 3908, conversions: 200 },
  { date: "29 يناير", views: 1890, engagement: 4800, conversions: 221 },
];

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">التقارير والإحصائيات</h1>
          <p className="text-muted-foreground mt-2">تحليل شامل لأداء المنصة</p>
        </div>
        <Button>⬇️ تحميل تقرير PDF</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select defaultValue="month">
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">هذا الأسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="quarter">هذا الربع</SelectItem>
            <SelectItem value="year">هذا العام</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المشاهدات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-green-600 mt-1">↑ 12% من الفترة السابقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">معدل التفاعل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7%</div>
            <p className="text-xs text-green-600 mt-1">↑ 2.1% من الفترة السابقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">التحويلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">895</div>
            <p className="text-xs text-green-600 mt-1">↑ 18% من الفترة السابقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:45</div>
            <p className="text-xs text-muted-foreground mt-1">دقيقة: ثانية</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>أداء المنصة على مدار الشهر</CardTitle>
          <CardDescription>المشاهدات والتفاعل والتحويلات</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" name="المشاهدات" />
              <Line type="monotone" dataKey="engagement" stroke="#10b981" name="التفاعل" />
              <Line type="monotone" dataKey="conversions" stroke="#f59e0b" name="التحويلات" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنشورات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "نصيحة الرخام الفاخر", views: 2450, engagement: "12.5%" },
              { title: "قبل وبعد: تجديد الديكور", views: 1890, engagement: "9.8%" },
              { title: "عرض خاص: خصم 20%", views: 1650, engagement: "8.3%" },
            ].map((post, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.views} مشاهدة</p>
                </div>
                <p className="text-sm font-medium text-green-600">{post.engagement}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المنصات الأكثر أداءً</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: "Instagram", reach: 4500, conversion: "12%" },
              { platform: "TikTok", reach: 3200, conversion: "8%" },
              { platform: "Facebook", reach: 2800, conversion: "6%" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.platform}</p>
                  <p className="text-sm text-muted-foreground">{item.reach} وصول</p>
                </div>
                <p className="text-sm font-medium text-blue-600">{item.conversion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
