import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Copy, Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const contentTypes = [
  { value: "tip", label: "نصيحة سريعة" },
  { value: "before-after", label: "قبل وبعد" },
  { value: "offer", label: "عرض خاص" },
  { value: "service", label: "تعريف الخدمة" },
  { value: "testimonial", label: "شهادة عميل" },
  { value: "question", label: "سؤال تفاعلي" },
  { value: "google-business", label: "منشور Google Business" },
  { value: "reel-idea", label: "فكرة Reel" },
  { value: "tiktok-idea", label: "فكرة TikTok" },
];

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "youtube", label: "YouTube" },
  { value: "pinterest", label: "Pinterest" },
  { value: "blogger", label: "Blogger" },
  { value: "google-business", label: "Google Business" },
];

export default function ContentGeneratorAdvanced() {
  const [contentType, setContentType] = useState("tip");
  const [language, setLanguage] = useState("both");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "facebook"]);
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  const handleGenerateSingle = async () => {
    setIsLoading(true);
    try {
      // محاكاة توليد المحتوى
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockContent = {
        contentType,
        language,
        platforms: selectedPlatforms,
        arabicText: "نصيحة ذهبية: استخدم منتجات التنظيف الآمنة للحفاظ على جودة الأرضيات والديكور 🏠✨",
        englishText: "Golden Tip: Use safe cleaning products to maintain the quality of your floors and decoration 🏠✨",
        hashtags: "#صيانة #ديكور #نصائح #تنظيف #منزل #جودة #احترافي",
        cta: "اتصل بنا الآن للحصول على استشارة مجانية",
        createdAt: new Date().toLocaleString("ar-EG"),
      };

      setGeneratedContent([mockContent]);
      toast.success("تم توليد المحتوى بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ في توليد المحتوى");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMonthly = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockContents = Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        contentType: contentTypes[i % contentTypes.length].value,
        arabicText: `محتوى ${i + 1}: نصيحة مهمة لصيانة منزلك بشكل احترافي`,
        englishText: `Content ${i + 1}: Important tip for maintaining your home professionally`,
        hashtags: "#صيانة #ديكور #نصائح",
        cta: "اتصل بنا الآن",
        createdAt: new Date().toLocaleString("ar-EG"),
      }));

      setGeneratedContent(mockContents);
      toast.success(`تم توليد ${mockContents.length} منشور شهري!`);
    } catch (error) {
      toast.error("حدث خطأ في توليد المحتوى الشهري");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("تم نسخ المحتوى!");
  };

  const handleDownloadContent = () => {
    const csv = generatedContent
      .map((item) => `"${item.contentType}","${item.arabicText}","${item.englishText}","${item.hashtags}","${item.cta}"`)
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    element.setAttribute("download", `noor-content-${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("تم تحميل المحتوى!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            مولد المحتوى الذكي
          </h1>
          <p className="text-gray-600">توليد محتوى تسويقي احترافي باستخدام الذكاء الاصطناعي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* لوحة الإعدادات */}
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>إعدادات التوليد</CardTitle>
              <CardDescription>اختر نوع المحتوى والمنصات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* نوع المحتوى */}
              <div className="space-y-2">
                <Label htmlFor="content-type">نوع المحتوى</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اللغة */}
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية فقط</SelectItem>
                    <SelectItem value="en">الإنجليزية فقط</SelectItem>
                    <SelectItem value="both">كلا اللغتين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* المنصات */}
              <div className="space-y-3">
                <Label>المنصات المستهدفة</Label>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <div key={platform.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.value}
                        checked={selectedPlatforms.includes(platform.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlatforms([...selectedPlatforms, platform.value]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform.value));
                          }
                        }}
                      />
                      <Label htmlFor={platform.value} className="cursor-pointer">
                        {platform.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* بيانات النشاط */}
              <div className="space-y-3 pt-4 border-t">
                <Label>بيانات النشاط (اختياري)</Label>
                <Input placeholder="اسم النشاط" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                <Input placeholder="رقم الهاتف" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} />
                <Input placeholder="البريد الإلكتروني" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} />
              </div>

              {/* أزرار التوليد */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleGenerateSingle}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {isLoading ? "جاري التوليد..." : "ولّد محتوى واحد"}
                </Button>
                <Button
                  onClick={handleGenerateMonthly}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {isLoading ? "جاري التوليد..." : "ولّد محتوى شهري (40)"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* عرض المحتوى المولد */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>المحتوى المولد</CardTitle>
              <CardDescription>{generatedContent.length} منشور جاهز للنشر</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ابدأ بتوليد المحتوى من خلال الإعدادات على اليسار</p>
                </div>
              ) : (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">معاينة</TabsTrigger>
                    <TabsTrigger value="list">قائمة</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4 mt-4">
                    {generatedContent.slice(0, 1).map((content, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500">النص بالعربية</Label>
                          <p className="text-gray-900 mt-1 leading-relaxed">{content.arabicText}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyContent(content.arabicText)}
                            className="mt-2"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            نسخ
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">النص بالإنجليزية</Label>
                          <p className="text-gray-900 mt-1 leading-relaxed">{content.englishText}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyContent(content.englishText)}
                            className="mt-2"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            نسخ
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">الهاشتاقات</Label>
                          <p className="text-blue-600 mt-1 text-sm">{content.hashtags}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">دعوة للعمل</Label>
                          <p className="text-gray-900 mt-1">{content.cta}</p>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Share2 className="w-4 h-4 mr-2" />
                            انشر الآن
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            حفظ
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="list" className="space-y-2 mt-4">
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {generatedContent.map((content, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <p className="font-medium text-sm text-gray-900">{content.arabicText.substring(0, 50)}...</p>
                          <p className="text-xs text-gray-500 mt-1">{content.createdAt}</p>
                        </div>
                      ))}
                    </div>

                    {generatedContent.length > 0 && (
                      <Button onClick={handleDownloadContent} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل جميع المحتوى (CSV)
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
