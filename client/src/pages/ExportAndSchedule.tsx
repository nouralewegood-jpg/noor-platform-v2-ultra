import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Download, Share2, FileJson, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const exportFormats = [
  { value: "csv", label: "CSV (Excel)", icon: FileText },
  { value: "json", label: "JSON", icon: FileJson },
  { value: "pdf", label: "PDF Report", icon: FileText },
  { value: "images", label: "صور مع نصوص", icon: ImageIcon },
];

const schedulingOptions = [
  { value: "immediate", label: "نشر فوري" },
  { value: "scheduled", label: "جدولة للنشر" },
  { value: "buffer", label: "إضافة إلى Buffer" },
  { value: "metricool", label: "إضافة إلى Metricool" },
];

export default function ExportAndSchedule() {
  const [exportFormat, setExportFormat] = useState("csv");
  const [schedulingType, setSchedulingType] = useState("scheduled");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedContent, setSelectedContent] = useState<number[]>([1, 2, 3]);

  const mockContent = [
    { id: 1, title: "نصيحة صيانة", date: "2026-02-03", status: "جاهز" },
    { id: 2, title: "صورة قبل وبعد", date: "2026-02-03", status: "جاهز" },
    { id: 3, title: "عرض خاص", date: "2026-02-02", status: "جاهز" },
    { id: 4, title: "تعريف الخدمة", date: "2026-02-02", status: "جاهز" },
    { id: 5, title: "شهادة عميل", date: "2026-02-01", status: "جاهز" },
  ];

  const handleExport = (format: string) => {
    toast.success(`تم تحميل المحتوى بصيغة ${format.toUpperCase()}`);
    // محاكاة التحميل
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent("Mock export data")}`);
    element.setAttribute("download", `noor-content.${format}`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSchedulePost = () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }
    toast.success(`تم جدولة ${selectedContent.length} منشور للنشر في ${scheduledDate} الساعة ${scheduledTime}`);
  };

  const handlePublishNow = () => {
    toast.success(`تم نشر ${selectedContent.length} منشور الآن على جميع المنصات`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Download className="w-8 h-8 text-blue-600" />
            التصدير والجدولة
          </h1>
          <p className="text-gray-600">تصدير المحتوى بصيغ مختلفة وجدولة النشر على المنصات</p>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="export">التصدير</TabsTrigger>
            <TabsTrigger value="schedule">الجدولة والنشر</TabsTrigger>
          </TabsList>

          {/* تبويب التصدير */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* خيارات التصدير */}
              <Card className="lg:col-span-1 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>صيغ التصدير</CardTitle>
                  <CardDescription>اختر صيغة التصدير المناسبة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <Button
                        key={format.value}
                        onClick={() => handleExport(format.value)}
                        className="w-full justify-start h-auto p-4 border-2 hover:border-blue-600"
                        variant={exportFormat === format.value ? "default" : "outline"}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <p className="font-semibold">{format.label}</p>
                          <p className="text-xs text-gray-500">
                            {format.value === "csv" && "جدول بيانات قابل للتحرير"}
                            {format.value === "json" && "صيغة JSON للتطبيقات"}
                            {format.value === "pdf" && "تقرير شامل بصيغة PDF"}
                            {format.value === "images" && "صور مع النصوص"}
                          </p>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* معاينة التصدير */}
              <Card className="lg:col-span-2 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>معاينة التصدير</CardTitle>
                  <CardDescription>المحتوى الذي سيتم تصديره</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {mockContent.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>ملخص التصدير:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>✓ عدد المنشورات: {mockContent.length}</li>
                      <li>✓ الصيغة: {exportFormat.toUpperCase()}</li>
                      <li>✓ تاريخ التصدير: {new Date().toLocaleDateString("ar-EG")}</li>
                    </ul>
                  </div>

                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل الآن
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* تبويب الجدولة والنشر */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* إعدادات الجدولة */}
              <Card className="lg:col-span-1 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>إعدادات النشر</CardTitle>
                  <CardDescription>حدد طريقة النشر والوقت</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* نوع الجدولة */}
                  <div className="space-y-2">
                    <Label htmlFor="schedule-type">طريقة النشر</Label>
                    <Select value={schedulingType} onValueChange={setSchedulingType}>
                      <SelectTrigger id="schedule-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {schedulingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* التاريخ والوقت */}
                  {schedulingType === "scheduled" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="schedule-date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          التاريخ
                        </Label>
                        <Input
                          id="schedule-date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schedule-time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          الوقت
                        </Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* أزرار الإجراء */}
                  <div className="space-y-2 pt-4">
                    {schedulingType === "immediate" && (
                      <Button onClick={handlePublishNow} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                        <Share2 className="w-4 h-4 mr-2" />
                        نشر الآن على جميع المنصات
                      </Button>
                    )}
                    {schedulingType === "scheduled" && (
                      <Button onClick={handleSchedulePost} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        جدولة النشر
                      </Button>
                    )}
                    {(schedulingType === "buffer" || schedulingType === "metricool") && (
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                        <Share2 className="w-4 h-4 mr-2" />
                        إضافة إلى {schedulingType === "buffer" ? "Buffer" : "Metricool"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* قائمة المحتوى المراد نشره */}
              <Card className="lg:col-span-2 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>المحتوى المراد نشره</CardTitle>
                  <CardDescription>{selectedContent.length} منشور محدد</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {mockContent.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedContent.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContent([...selectedContent, item.id]);
                            } else {
                              setSelectedContent(selectedContent.filter((id) => id !== item.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{item.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>ملخص النشر:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>✓ عدد المنشورات المحددة: {selectedContent.length}</li>
                      <li>✓ طريقة النشر: {schedulingOptions.find((o) => o.value === schedulingType)?.label}</li>
                      {schedulingType === "scheduled" && (
                        <>
                          <li>✓ التاريخ المجدول: {scheduledDate}</li>
                          <li>✓ الوقت المجدول: {scheduledTime}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
