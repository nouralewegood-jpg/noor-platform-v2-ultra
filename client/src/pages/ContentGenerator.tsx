import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function ContentGenerator() {
  const [contentType, setContentType] = useState("نصيحة سريعة");
  const [language, setLanguage] = useState("ar");
  const [tone, setTone] = useState("professional");
  const [businessType, setBusinessType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>("");
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  const contentTypes = [
    "نصيحة سريعة",
    "قبل وبعد",
    "عرض/خصم",
    "تعريف بخدمة",
    "شهادة عميل",
    "سؤال تفاعلي",
    "فكرة فيديو",
    "إعلان",
  ];

  const tones = [
    { value: "professional", label: "احترافي" },
    { value: "casual", label: "ودي" },
    { value: "friendly", label: "ودود" },
    { value: "formal", label: "رسمي" },
  ];

  const generateContentMutation = trpc.ai.generateContent.useMutation();
  const generateMonthlyMutation = trpc.ai.generateMonthlyPosts.useMutation();

  const handleGenerateSingle = async () => {
    if (!businessType.trim()) {
      toast.error("يرجى إدخال نوع العمل");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateContentMutation.mutateAsync({
        businessType,
        contentType: contentType as any,
        language: language as "ar" | "en",
        tone: tone as "professional" | "casual" | "friendly" | "formal",
      });

      if (result.success) {
        setGeneratedContent(result.data);
        toast.success("تم توليد المحتوى بنجاح!");
      } else {
        toast.error(result.error || "فشل توليد المحتوى");
      }
    } catch (error) {
      toast.error("حدث خطأ في توليد المحتوى");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMonthly = async () => {
    if (!businessType.trim()) {
      toast.error("يرجى إدخال نوع العمل");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMonthlyMutation.mutateAsync({
        businessType,
        language: language as "ar" | "en",
      });

      if (result.success) {
        setGeneratedPosts(Array.isArray(result.data) ? result.data : []);
        toast.success(`تم توليد ${result.count} منشور شهري بنجاح!`);
      } else {
        toast.error(result.error || "فشل توليد المنشورات");
      }
    } catch (error) {
      toast.error("حدث خطأ في توليد المنشورات");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("تم نسخ المحتوى!");
  };

  const handleDownloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "محتوى_مولد.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("تم تحميل المحتوى!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-gradient">مولد المحتوى الذكي</h1>
          </div>
          <p className="text-muted-foreground">توليد محتوى احترافي للتسويق بالذكاء الاصطناعي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium">
              <h2 className="text-xl font-bold mb-4">إعدادات التوليد</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-type">نوع العمل</Label>
                  <Input
                    id="business-type"
                    placeholder="مثال: صيانة منازل، تصميم جرافيك"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="input-premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-type">نوع المحتوى</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">النبرة</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleGenerateSingle}
                    disabled={isGenerating}
                    className="w-full btn-premium-primary"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        توليد منشور واحد
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateMonthly}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        توليد 30 منشور شهري
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                💡 <strong>نصيحة:</strong> استخدم كلمات وصفية دقيقة لنوع عملك للحصول على محتوى أفضل.
              </p>
            </div>
          </div>

          {/* Content Display Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Single Generated Content */}
            {generatedContent && (
              <div className="card-premium">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold">المحتوى المولد</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyContent}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      نسخ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadContent}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      تحميل
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {generatedContent}
                </div>
              </div>
            )}

            {/* Monthly Posts Grid */}
            {generatedPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">المنشورات الشهرية ({generatedPosts.length})</h3>
                  <Badge variant="secondary">{generatedPosts.length} منشور</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {generatedPosts.map((post, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">منشور {index + 1}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(post);
                            toast.success("تم نسخ المنشور!");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{post}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!generatedContent && generatedPosts.length === 0 && (
              <div className="card-premium text-center py-12">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  قم بإدخال معلومات عملك واختر نوع المحتوى لبدء التوليد
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
