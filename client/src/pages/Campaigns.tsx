import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  {
    id: 1,
    name: "حملة الصيف 2024",
    type: "تسويق اجتماعي",
    status: "نشطة",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    budget: 5000,
    reach: 45200,
  },
  {
    id: 2,
    name: "عرض الديكور الخاص",
    type: "SEO",
    status: "مكتملة",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    budget: 3000,
    reach: 32100,
  },
  {
    id: 3,
    name: "حملة الرخام الفاخر",
    type: "تسويق اجتماعي",
    status: "قيد التخطيط",
    startDate: "2024-09-01",
    endDate: "2024-10-31",
    budget: 7000,
    reach: 0,
  },
];

export default function Campaigns() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشطة":
        return "bg-green-100 text-green-800";
      case "مكتملة":
        return "bg-blue-100 text-blue-800";
      case "قيد التخطيط":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">الحملات التسويقية</h1>
          <p className="text-muted-foreground mt-2">إدارة وتتبع حملات التسويق</p>
        </div>
        <Button>+ إنشاء حملة جديدة</Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{campaign.type}</CardDescription>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ البداية</p>
                  <p className="font-medium">{campaign.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ النهاية</p>
                  <p className="font-medium">{campaign.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الميزانية</p>
                  <p className="font-medium">${campaign.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الوصول</p>
                  <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">تعديل</Button>
                <Button variant="outline" size="sm">عرض التفاصيل</Button>
                <Button variant="outline" size="sm" className="text-red-600">حذف</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
