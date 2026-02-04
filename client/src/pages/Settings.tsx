import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [businessName, setBusinessName] = useState("نور الوجود");
  const [businessPhone, setBusinessPhone] = useState("971500000000");
  const [businessEmail, setBusinessEmail] = useState("info@noor.ae");
  const [language, setLanguage] = useState("ar");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success("تم حفظ الإعدادات بنجاح!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground mt-2">إدارة إعدادات المنصة والحساب</p>
      </div>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات النشاط</CardTitle>
          <CardDescription>معلومات النشاط والاتصال</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="business-name">اسم النشاط</Label>
            <Input 
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="أدخل اسم النشاط"
            />
          </div>

          <div>
            <Label htmlFor="business-phone">رقم الهاتف (واتساب)</Label>
            <Input 
              id="business-phone"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="أدخل رقم الهاتف"
            />
          </div>

          <div>
            <Label htmlFor="business-email">البريد الإلكتروني</Label>
            <Input 
              id="business-email"
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div>
            <Label htmlFor="description">وصف النشاط</Label>
            <Textarea 
              id="description"
              placeholder="اكتب وصفاً مختصراً لنشاطك"
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSave}>💾 حفظ البيانات</Button>
        </CardContent>
      </Card>

      {/* Language & Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>التفضيلات</CardTitle>
          <CardDescription>إعدادات اللغة والإشعارات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">اللغة المفضلة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">تفعيل الإشعارات</Label>
            <Switch 
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-report">التقرير الأسبوعي</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="monthly-report">التقرير الشهري</Label>
            <Switch defaultChecked />
          </div>

          <Button onClick={handleSave}>💾 حفظ التفضيلات</Button>
        </CardContent>
      </Card>

      {/* Social Media Accounts */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-900">🔗 ربط حسابات التواصل الاجتماعي</CardTitle>
          <CardDescription>قم بربط حساباتك على منصات التواصل الاجتماعي لبدء النشر الآلي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Facebook...')}
            >
              <span className="text-2xl">📘</span>
              <span className="text-xs font-semibold">Facebook</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Instagram...')}
            >
              <span className="text-2xl">📷</span>
              <span className="text-xs font-semibold">Instagram</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط TikTok...')}
            >
              <span className="text-2xl">👻</span>
              <span className="text-xs font-semibold">TikTok</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط YouTube...')}
            >
              <span className="text-2xl">▶️</span>
              <span className="text-xs font-semibold">YouTube</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Snapchat...')}
            >
              <span className="text-2xl">👻</span>
              <span className="text-xs font-semibold">Snapchat</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Pinterest...')}
            >
              <span className="text-2xl">📌</span>
              <span className="text-xs font-semibold">Pinterest</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Google Business...')}
            >
              <span className="text-2xl">🌐</span>
              <span className="text-xs font-semibold">Google</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all hover:shadow-lg"
              onClick={() => toast.success('جاري ربط Blogger...')}
            >
              <span className="text-2xl">✍️</span>
              <span className="text-xs font-semibold">Blogger</span>
            </Button>
          </div>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-semibold">📱 نصيحة:</p>
            <p className="text-xs text-blue-800 mt-1">
              اضغط على أي منصة لربط حسابك. ستتم إعادة توجيهك لتسجيل الدخول بأمان عبر المنصة الرسمية.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات API</CardTitle>
          <CardDescription>مفاتيح API والتكاملات الخارجية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input 
              id="openai-key"
              type="password"
              placeholder="أدخل مفتاح OpenAI API"
            />
            <p className="text-xs text-muted-foreground mt-1">
              لا تشارك مفتاحك مع أحد. <a href="#" className="text-blue-600 hover:underline">تعرف على المزيد</a>
            </p>
          </div>

          <div>
            <Label htmlFor="flux-key">Flux API Key</Label>
            <Input 
              id="flux-key"
              type="password"
              placeholder="أدخل مفتاح Flux API"
            />
          </div>

          <Button onClick={handleSave}>💾 حفظ مفاتيح API</Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">إعدادات الحساب</CardTitle>
          <CardDescription>إجراءات حساسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">تغيير كلمة المرور</Button>
          <Button variant="outline" className="w-full">تحميل بيانات الحساب</Button>
          <Button variant="destructive" className="w-full">حذف الحساب</Button>
        </CardContent>
      </Card>
    </div>
  );
}
