import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Users, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { getBookedSlotsByDoctor } from "../../lib/DoctorApi";
import * as signalR from "@microsoft/signalr";

const Schedule = () => {
  const [todaySchedule, setTodaySchedule] = useState([]);
  const { toast } = useToast();
  const fetchSchedule = async () => {
    try {
      const doctorId = localStorage.getItem("userId");
      const today = new Date().toISOString().split("T")[0];
      if (!doctorId) return;

      const slots = await getBookedSlotsByDoctor(doctorId, today);

      const formattedSlots = slots.map((slot, index) => ({
        id: slot.slotId || index + 1,
        time: new Date(slot.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        patient: slot.patientName || "Bệnh nhân chưa xác định",
        type: "Khám bệnh",
        status: slot.isBooked ? "booked" : "available",
      }));

      setTodaySchedule(formattedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy lịch đã đặt",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (!doctorId) return;

    fetchSchedule();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7075/notificationhub?userId=${doctorId}&role=Doctor`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message: string) => {
      const t = toast({
        title: "📥 Có lịch khám mới!",
        description: message,
        duration: Infinity, // Không tự tắt
        action: (
          <Button
            variant="ghost"
            onClick={() => t.dismiss()}
          >
            Đã hiểu
          </Button>
        ),
      });

      fetchSchedule();
    });

    connection.start()
      .then(() => console.log("🟢 Kết nối SignalR thành công"))
      .catch(err => console.error("❌ Lỗi kết nối SignalR:", err));

    return () => {
      connection.stop();
    };
  }, []);

  const createTodaySchedule = () => {
    const newSchedule = [
      { id: 1, time: "08:00", patient: "", type: "", status: "available" },
      { id: 2, time: "09:00", patient: "", type: "", status: "available" },
      { id: 3, time: "10:00", patient: "", type: "", status: "available" },
      { id: 4, time: "11:00", patient: "", type: "", status: "available" },
      { id: 5, time: "14:00", patient: "", type: "", status: "available" },
      { id: 6, time: "15:00", patient: "", type: "", status: "available" },
      { id: 7, time: "16:00", patient: "", type: "", status: "available" },
      { id: 8, time: "17:00", patient: "", type: "", status: "available" },
    ];

    setTodaySchedule(newSchedule);
    toast({
      title: "Tạo lịch thành công",
      description: "Đã tạo lịch làm việc cho hôm nay với 8 slot thời gian",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã khám";
      case "waiting":
        return "Chờ khám";
      case "booked":
        return "Đã đặt";
      default:
        return "Trống";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý lịch làm việc</h1>
          <div className="flex gap-2">
            <Button onClick={createTodaySchedule} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo lịch hôm nay
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng slot</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySchedule.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã có bệnh nhân</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todaySchedule.filter(s => ["completed", "waiting", "booked"].includes(s.status)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Slot trống</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todaySchedule.filter(s => s.status === "available").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch làm việc hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-lg">{slot.time}</div>
                    <div>
                      <p className="font-medium">{slot.patient || "Chưa có bệnh nhân"}</p>
                      <p className="text-sm text-muted-foreground">{slot.type || "Slot trống"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                      {getStatusText(slot.status)}
                    </span>
                    {slot.status === "available" && (
                      <Button variant="outline" size="sm">
                        Đặt lịch
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Schedule;