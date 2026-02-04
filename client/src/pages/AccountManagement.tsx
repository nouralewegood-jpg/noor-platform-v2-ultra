import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Link,
  Unlink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5 text-blue-600" />,
  instagram: <Instagram className="w-5 h-5 text-pink-600" />,
  twitter: <Twitter className="w-5 h-5 text-sky-500" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
  "google-business": <MapPin className="w-5 h-5 text-blue-500" />,
};

const platformNames: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  "google-business": "Google Business",
};

export default function AccountManagement() {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessDescription: "",
    businessPhone: "",
    businessEmail: "",
    businessAddress: "",
    businessServices: "",
    targetAudience: "",
    dialect: "خليجية",
    focusServices: "",
    language: "both",
  });

  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getLinkedAccountsQuery = trpc.accountLinking.getLinkedAccounts.useQuery();
  const unlinkAccountMutation = trpc.accountLinking.unlinkAccount.useMutation();

  useEffect(() => {
    if (getLinkedAccountsQuery.data?.success) {
      setLinkedAccounts(getLinkedAccountsQuery.data.accounts || []);
    }
  }, [getLinkedAccountsQuery.data]);

  const handleSaveBusinessInfo = async () => {
    setIsSaving(true);
    try {
      toast.success("تم حفظ معلومات العمل بنجاح");
    } catch (error) {
      toast.error("فشل حفظ المعلومات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkAccount = (platform: string) => {
    toast.info(`جاري إعادة توجيهك لربط حساب ${platformNames[platform]}...`);
    window.location.href = `/api/oauth/${platform}`;
  };

  const handleUnlinkAccount = async (platform: string) => {
    try {
      const result = await unlinkAccountMutation.mutateAsync({ platform });
      if (result.success) {
        toast.success(result.message);
        getLinkedAccountsQuery.refetch();
      } else {
        toast.error(result.error || "فشل فصل الحساب");
      }
    } catch (error) {
      toast.error("حدث خطأ في فصل الحساب");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">إدارة الحسابات</h1>
          <p className="text-muted-foreground">إدارة معلومات عملك وربط حسابات وسائل التواصل الاجتماعي</p>
        </div>

        {/* Business Information Section */}
        <div className="card-premium">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold">معلومات العمل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">اسم العمل</Label>
              <Input
                id="businessName"
                placeholder="أدخل اسم عملك"
                value={businessInfo.businessName}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEmail">البريد الإلكتروني</Label>
              <Input
                id="businessEmail"
                type="email"
                placeholder="your@email.com"
                value={businessInfo.businessEmail}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessEmail: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone">رقم الهاتف</Label>
              <Input
                id="businessPhone"
                placeholder="+966 50 000 0000"
                value={businessInfo.businessPhone}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessPhone: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">العنوان</Label>
              <Input
                id="businessAddress"
                placeholder="أدخل عنوان العمل"
                value={businessInfo.businessAddress}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="businessDescription">وصف العمل</Label>
              <Textarea
                id="businessDescription"
                placeholder="اكتب وصفاً مفصلاً عن عملك..."
                value={businessInfo.businessDescription}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessDescription: e.target.value })
                }
                className="input-premium min-h-24"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="businessServices">الخدمات والمنتجات</Label>
              <Textarea
                id="businessServices"
                placeholder="اكتب الخدمات والمنتجات التي تقدمها..."
                value={businessInfo.businessServices}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, businessServices: e.target.value })
                }
                className="input-premium min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
              <Input
                id="targetAudience"
                placeholder="مثال: رجال الأعمال، الشباب، العائلات"
                value={businessInfo.targetAudience}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, targetAudience: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialect">اللهجة المفضلة</Label>
              <select
                id="dialect"
                value={businessInfo.dialect}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, dialect: e.target.value })
                }
                className="input-premium"
              >
                <option value="خليجية">خليجية</option>
                <option value="مصرية">مصرية</option>
                <option value="سورية">سورية</option>
                <option value="فلسطينية">فلسطينية</option>
                <option value="فصحى">فصحى</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">اللغة المفضلة</Label>
              <select
                id="language"
                value={businessInfo.language}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, language: e.target.value })
                }
                className="input-premium"
              >
                <option value="ar">العربية</option>
                <option value="en">الإنجليزية</option>
                <option value="both">كلاهما</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveBusinessInfo}
              disabled={isSaving}
              className="btn-premium-primary"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ المعلومات
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Social Media Accounts Section */}
        <div className="card-premium">
          <div className="flex items-center gap-2 mb-6">
            <Link className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold">حسابات وسائل التواصل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(platformNames).map(([platform, name]) => {
              const isLinked = linkedAccounts.some((acc) => acc.platform === platform);
              return (
                <div
                  key={platform}
                  className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {platformIcons[platform]}
                    <div>
                      <p className="font-semibold">{name}</p>
                      {isLinked && (
                        <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          متصل
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isLinked ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnlinkAccount(platform)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleLinkAccount(platform)}
                        className="btn-premium-primary"
                      >
                        <Link className="w-4 h-4 mr-1" />
                        ربط
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>نصيحة:</strong> ربط حسابات وسائل التواصل الاجتماعي يسمح لك بنشر المحتوى تلقائياً على جميع المنصات في نفس الوقت.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
