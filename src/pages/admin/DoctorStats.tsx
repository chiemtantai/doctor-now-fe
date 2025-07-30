import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

export const DoctorStats = ({ doctors }: { doctors: any[] }) => {
  const total = doctors.length;
  const active = doctors.filter((d) => d.status === "active").length;
  const inactive = total - active;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Tổng bác sĩ</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div>
            <p className="text-sm font-medium">Đang hoạt động</p>
            <p className="text-2xl font-bold">{active}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warning" />
            <div>
              <p className="text-sm font-medium">Tạm ngưng</p>
              <p className="text-2xl font-bold">{inactive}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};