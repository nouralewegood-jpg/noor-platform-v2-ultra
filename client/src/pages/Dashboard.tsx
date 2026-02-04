import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
  Eye,
  Heart,
  Zap,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

// بيانات تجريبية
const chartData = [
  { name: "يناير", views: 4000, engagement: 2400, conversions: 2400 },
  { name: "فبراير", views: 3000, engagement: 1398, conversions: 2210 },
  { name: "مارس", views: 2000, engagement: 9800, conversions: 2290 },
  { name: "أبريل", views: 2780, engagement: 3908, conversions: 2000 },
  { name: "مايو", views: 1890, engagement: 4800, conversions: 2181 },
  { name: "يونيو", views: 2390, engagement: 3800, conversions: 2500 },
];

const platformData = [
  { name: "Instagram", value: 35, color: "#E1306C" },
  { name: "Facebook", value: 25, color: "#1877F2" },
  { name: "TikTok", value: 20, color: "#000000" },
  { name: "YouTube", value: 15, color: "#FF0000" },
  { name: "LinkedIn", value: 5, color: "#0A66C2" },
];

const stats = [
  {
    label: "إجمالي المشاهدات",
    value: "24,580",
    change: "+12.5%",
    isPositive: true,
    icon: Eye,
    color: "from-blue-600 to-blue-700",
  },
  {
    label: "التفاعلات",
    value: "8,240",
    change: "+8.2%",
    isPositive: true,
    icon: Heart,
    color: "from-red-600 to-red-700",
  },
  {
    label: "المتابعون الجدد",
    value: "1,520",
    change: "+5.1%",
    isPositive: true,
    icon: Users,
    color: "from-green-600 to-green-700",
  },
  {
    label: "معدل التحويل",
    value: "3.24%",
    change: "-2.3%",
    isPositive: false,
    icon: TrendingUp,
    color: "from-purple-600 to-purple-700",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          مرحباً بك، {user?.name || "المستخدم"}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          إليك نظرة عامة على أداء حملاتك التسويقية
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="card-premium p-6 hover-lift group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  className={`${
                    stat.isPositive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="card-premium p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              📊 الأداء على مدار الوقت
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              عرض المشاهدات والتفاعلات والتحويلات
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: "#4F46E5" }}
                name="المشاهدات"
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: "#EC4899" }}
                name="التفاعلات"
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981" }}
                name="التحويلات"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="card-premium p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              🎯 توزيع المنصات
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              نسبة الأداء لكل منصة
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    {platform.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {platform.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="card-premium p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            📈 مقارنة الأداء
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            مقارنة المشاهدات والتفاعلات عبر الأشهر
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
            <YAxis stroke="rgba(0,0,0,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="views"
              fill="#4F46E5"
              radius={[8, 8, 0, 0]}
              name="المشاهدات"
            />
            <Bar
              dataKey="engagement"
              fill="#EC4899"
              radius={[8, 8, 0, 0]}
              name="التفاعلات"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-premium p-6 hover-lift cursor-pointer" onClick={() => navigate("/content-generator")}>
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <Badge className="bg-yellow-100 text-yellow-800">جديد</Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            إنشاء محتوى جديد
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            استخدم مولد المحتوى الذكي لإنشاء محتوى احترافي
          </p>
          <Button className="w-full btn-premium-primary">
            ابدأ الآن
          </Button>
        </Card>

        <Card className="card-premium p-6 hover-lift cursor-pointer" onClick={() => navigate("/campaigns")}>
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
            <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            جدولة المحتوى
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            جدول نشر المحتوى على جميع المنصات
          </p>
          <Button className="w-full btn-premium-primary">
            اذهب إلى الجدولة
          </Button>
        </Card>

        <Card className="card-premium p-6 hover-lift cursor-pointer" onClick={() => navigate("/account-management")}>
          <div className="flex items-center justify-between mb-4">
            <Share2 className="w-8 h-8 text-green-500" />
            <Badge className="bg-green-100 text-green-800">نشط</Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            ربط الحسابات
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            ربط حسابات وسائل التواصل الاجتماعي
          </p>
          <Button className="w-full btn-premium-primary">
            إدارة الحسابات
          </Button>
        </Card>
      </div>
    </div>
  );
}
