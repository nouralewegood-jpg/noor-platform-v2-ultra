import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Music,
  Youtube,
  Zap,
  MapPin,
  BookOpen,
  Link,
  Unlink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-6 h-6 text-blue-600" />,
  instagram: <Instagram className="w-6 h-6 text-pink-600" />,
  tiktok: <Music className="w-6 h-6 text-black" />,
  youtube: <Youtube className="w-6 h-6 text-red-600" />,
  snapchat: <Zap className="w-6 h-6 text-yellow-400" />,
  pinterest: <MapPin className="w-6 h-6 text-red-500" />,
  "google-business": <Globe className="w-6 h-6 text-blue-500" />,
  blogger: <BookOpen className="w-6 h-6 text-orange-600" />,
};

const platformNames: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  "google-business": "Google Business",
  blogger: "Blogger",
};

const platforms = [
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "snapchat",
  "pinterest",
  "google-business",
  "blogger",
];

export default function SocialMediaLinking() {
  const [linkedAccounts, setLinkedAccounts] = useState<Record<string, boolean>>({});
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });

  const handleLinkAccount = (platform: string) => {
    toast.info(`جاري إعادة توجيهك لربط حساب ${platformNames[platform]}...`);
    // في الإنتاج، سيتم الحصول على OAuth URL من الخادم
    setTimeout(() => {
      setLinkedAccounts((prev) => ({
        ...prev,
        [platform]: true,
      }));
      toast.success(`تم ربط حساب ${platformNames[platform]} بنجاح`);
    }, 1500);
  };

  const handleUnlinkAccount = (platform: string) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [platform]: false,
    }));
    toast.success(`تم فصل حساب ${platformNames[platform]} بنجاح`);
  };

  const handleTestConnection = (platform: string) => {
    toast.success(`الاتصال مع ${platformNames[platform]} يعمل بشكل صحيح`);
  };

  const handleSaveBusinessInfo = () => {
    if (!businessInfo.name || !businessInfo.email) {
      toast.error("يرجى ملء البيانات المطلوبة");
      return;
    }
    toast.success("تم حفظ بيانات النشاط التجاري بنجاح");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          🔗 ربط حسابات وسائل التواصل
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          ربط وإدارة حسابات التواصل الاجتماعي والمنصات الرقمية
        </p>
      </div>

      {/* Business Information Section */}
      <Card className="card-premium p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          📋 معلومات النشاط التجاري
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              اسم النشاط التجاري
            </label>
            <Input
              placeholder="أدخل اسم النشاط التجاري"
              value={businessInfo.name}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, name: e.target.value })
              }
              className="input-premium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              value={businessInfo.email}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, email: e.target.value })
              }
              className="input-premium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              رقم الهاتف
            </label>
            <Input
              placeholder="أدخل رقم الهاتف"
              value={businessInfo.phone}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, phone: e.target.value })
              }
              className="input-premium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              الموقع الإلكتروني
            </label>
            <Input
              placeholder="أدخل الموقع الإلكتروني"
              value={businessInfo.website}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, website: e.target.value })
              }
              className="input-premium"
            />
          </div>
        </div>
        <Button
          onClick={handleSaveBusinessInfo}
          className="mt-6 btn-premium-primary"
        >
          💾 حفظ المعلومات
        </Button>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-premium p-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            الحسابات المرتبطة
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {Object.values(linkedAccounts).filter(Boolean).length}
          </p>
          <p className="text-xs text-slate-500 mt-2">من أصل 8 منصات</p>
        </Card>

        <Card className="card-premium p-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            المنصات المتاحة
          </h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-xs text-slate-500 mt-2">منصات اجتماعية</p>
        </Card>

        <Card className="card-premium p-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            الحسابات المتبقية
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {8 - Object.values(linkedAccounts).filter(Boolean).length}
          </p>
          <p className="text-xs text-slate-500 mt-2">للربط</p>
        </Card>
      </div>

      {/* Linked Accounts */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          ✅ الحسابات المرتبطة
        </h2>

        {Object.values(linkedAccounts).filter(Boolean).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map(
              (platform) =>
                linkedAccounts[platform] && (
                  <Card
                    key={platform}
                    className="card-premium p-6 hover-lift border-l-4 border-l-green-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {platformIcons[platform]}
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {platformNames[platform]}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            مرتبط ✓
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        نشط
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleTestConnection(platform)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        اختبار
                      </Button>
                      <Button
                        onClick={() => handleUnlinkAccount(platform)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        <Unlink className="w-4 h-4 mr-1" />
                        فصل
                      </Button>
                    </div>
                  </Card>
                )
            )}
          </div>
        ) : (
          <Card className="card-premium p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              لم تقم بربط أي حسابات بعد
            </p>
          </Card>
        )}
      </div>

      {/* Available Platforms */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          ➕ ربط حسابات جديدة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform}
              className={`card-premium p-6 hover-lift transition-all ${
                linkedAccounts[platform]
                  ? "bg-slate-50 dark:bg-slate-800/50 opacity-60"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {platformIcons[platform]}
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {platformNames[platform]}
                  </h3>
                </div>
                {linkedAccounts[platform] && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>

              <Badge
                className={
                  linkedAccounts[platform]
                    ? "bg-green-100 text-green-800 mb-4"
                    : "bg-slate-100 text-slate-800 mb-4"
                }
              >
                {linkedAccounts[platform] ? "مرتبط" : "غير مرتبط"}
              </Badge>

              {!linkedAccounts[platform] && (
                <Button
                  onClick={() => handleLinkAccount(platform)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold"
                >
                  <Link className="w-4 h-4 mr-2" />
                  ربط الحساب
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <Card className="card-premium p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-l-blue-600">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">
          ℹ️ معلومات مهمة
        </h3>
        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>جميع بيانات الحسابات محمية وآمنة بالكامل</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>لن نطلب كلمة المرور مباشرة أبداً</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>يمكنك فصل أي حساب في أي وقت</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>سيتم تحديث التوكنات تلقائياً</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
