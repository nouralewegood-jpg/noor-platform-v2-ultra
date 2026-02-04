import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Share2,
  BarChart3,
  Rocket,
  Shield,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Sparkles,
      title: "مولد محتوى ذكي",
      description: "أنشئ محتوى احترافي باستخدام الذكاء الاصطناعي",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "مولد صور متقدم",
      description: "إنشاء صور تسويقية جميلة بلا حدود",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Share2,
      title: "نشر تلقائي",
      description: "انشر على جميع المنصات بضغطة زر واحدة",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "تحليلات شاملة",
      description: "تابع أداء حملاتك بتفاصيل دقيقة",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Users,
      title: "إدارة الحسابات",
      description: "ربط وإدارة حسابات وسائل التواصل",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "تحسين SEO",
      description: "حسّن ظهور محتواك في محركات البحث",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "مستخدم نشط" },
    { number: "1M+", label: "منشور شهري" },
    { number: "98%", label: "رضا العملاء" },
    { number: "24/7", label: "دعم فني" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Noor</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="btn-premium-primary"
                >
                  لوحة التحكم
                </Button>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button className="btn-premium-primary">
                    تسجيل الدخول
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm font-semibold">
              🚀 منصة تسويق ذكية متكاملة
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              منصة <span className="text-gradient">نور الذكية</span>
              <br />
              للتسويق الرقمي
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              أنشئ محتوى احترافي، أدر حملاتك، وحلل أداءك - كل شيء في مكان واحد
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="btn-premium-primary text-lg px-8 py-6"
              >
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ الآن
              </Button>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="btn-premium-primary text-lg px-8 py-6">
                  <Rocket className="w-5 h-5 mr-2" />
                  ابدأ مجاناً
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-slate-300 dark:border-slate-700"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              تعرف على المزيد
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="card-premium p-4">
                <p className="text-2xl md:text-3xl font-bold text-gradient">
                  {stat.number}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ✨ المميزات الرئيسية
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            كل ما تحتاجه لإدارة حملاتك التسويقية بكفاءة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="card-premium p-8 hover-lift group"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              لماذا تختار منصة نور؟
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "توليد محتوى احترافي بالذكاء الاصطناعي",
                "جدولة النشر على جميع المنصات",
                "تحليلات تفصيلية للأداء",
                "دعم اللغة العربية الكامل",
                "ربط آمن مع وسائل التواصل",
                "واجهة سهلة وسهلة الاستخدام",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="card-premium p-12 text-center bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900">
          <h2 className="text-4xl font-bold text-white mb-4">
            هل أنت مستعد للبدء؟
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المسوقين الذين يستخدمون منصة نور لإدارة حملاتهم بكفاءة
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/dashboard")}
              className="btn-premium-primary text-lg px-8 py-6"
            >
              <Rocket className="w-5 h-5 mr-2" />
              اذهب إلى لوحة التحكم
            </Button>
          ) : (
            <a href={getLoginUrl()}>
              <Button className="btn-premium-primary text-lg px-8 py-6">
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ مجاناً الآن
              </Button>
            </a>
          )}
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">Noor</span>
              </div>
              <p className="text-sm">منصة تسويق ذكية متكاملة</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">المميزات</a></li>
                <li><a href="#" className="hover:text-white">التسعير</a></li>
                <li><a href="#" className="hover:text-white">الأمان</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">عن نا</a></li>
                <li><a href="#" className="hover:text-white">المدونة</a></li>
                <li><a href="#" className="hover:text-white">الاتصال</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">الخصوصية</a></li>
                <li><a href="#" className="hover:text-white">الشروط</a></li>
                <li><a href="#" className="hover:text-white">الملفات</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2026 منصة نور. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
