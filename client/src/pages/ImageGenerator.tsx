import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Image,
  Download,
  RefreshCw,
  Loader2,
  Zap,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const platformDimensions: Record<string, { width: number; height: number }[]> = {
  instagram: [
    { width: 1080, height: 1080 },
    { width: 1080, height: 1350 },
    { width: 1080, height: 566 },
  ],
  facebook: [
    { width: 1200, height: 628 },
    { width: 1200, height: 1500 },
  ],
  twitter: [
    { width: 1200, height: 675 },
    { width: 506, height: 506 },
  ],
  linkedin: [
    { width: 1200, height: 627 },
    { width: 1200, height: 1500 },
  ],
  pinterest: [
    { width: 1000, height: 1500 },
    { width: 600, height: 900 },
  ],
};

export default function ImageGenerator() {
  const [platform, setPlatform] = useState("instagram");
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>(
    platformDimensions.instagram[0]
  );
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);

  const styles = [
    { value: "modern", label: "حديث" },
    { value: "minimalist", label: "بسيط" },
    { value: "luxury", label: "فاخر" },
    { value: "playful", label: "مرح" },
    { value: "professional", label: "احترافي" },
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("يرجى إدخال وصف الصورة");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate image generation with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockImageUrl = `https://via.placeholder.com/${dimensions.width}x${dimensions.height}?text=Generated+Image`;
      const newImage = {
        url: mockImageUrl,
        platform,
        dimensions: `${dimensions.width}x${dimensions.height}`,
        prompt,
      };
      
      setGeneratedImages([...generatedImages, newImage]);
      toast.success("تم توليد الصورة بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ في توليد الصورة");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `صورة_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تحميل الصورة!");
  };

  const handleCopyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    toast.success("تم نسخ رابط الصورة!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-gradient">مولد الصور الاحترافي</h1>
          </div>
          <p className="text-muted-foreground">إنشاء صور احترافية للتسويق باستخدام الذكاء الاصطناعي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium">
              <h2 className="text-xl font-bold mb-4">إعدادات الصورة</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">المنصة</Label>
                  <Select
                    value={platform}
                    onValueChange={(value) => {
                      setPlatform(value);
                      setDimensions(platformDimensions[value][0]);
                    }}
                  >
                    <SelectTrigger id="platform" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(platformDimensions).map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">الأبعاد</Label>
                  <Select
                    value={`${dimensions.width}x${dimensions.height}`}
                    onValueChange={(value) => {
                      const [w, h] = value.split("x").map(Number);
                      setDimensions({ width: w, height: h });
                    }}
                  >
                    <SelectTrigger id="dimensions" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platformDimensions[platform].map((dim) => (
                        <SelectItem
                          key={`${dim.width}x${dim.height}`}
                          value={`${dim.width}x${dim.height}`}
                        >
                          {dim.width} × {dim.height}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">الأسلوب</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style" className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">وصف الصورة</Label>
                  <Textarea
                    id="prompt"
                    placeholder="اكتب وصفاً مفصلاً للصورة التي تريد توليدها..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-premium min-h-24"
                  />
                </div>

                <Button
                  onClick={handleGenerateImage}
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
                      توليد الصورة
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                💡 <strong>نصيحة:</strong> استخدم كلمات وصفية دقيقة وحدد الأسلوب المفضل للحصول على صور أفضل.
              </p>
            </div>
          </div>

          {/* Generated Images Panel */}
          <div className="lg:col-span-2 space-y-6">
            {generatedImages.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">الصور المولدة ({generatedImages.length})</h3>
                  <Badge variant="secondary">{generatedImages.length} صورة</Badge>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="card-premium">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">الصورة {index + 1}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyImageUrl(image.url)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-4 h-4" />
                            نسخ الرابط
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadImage(image.url, index)}
                            className="flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            تحميل
                          </Button>
                        </div>
                      </div>

                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`صورة مولدة ${index + 1}`}
                          className="w-full h-auto object-cover"
                        />
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground space-y-1">
                        <p>
                          <strong>الأبعاد:</strong> {image.dimensions}
                        </p>
                        <p>
                          <strong>المنصة:</strong> {image.platform}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card-premium text-center py-12">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  قم بإدخال وصف الصورة واختر المنصة والأبعاد لبدء التوليد
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
