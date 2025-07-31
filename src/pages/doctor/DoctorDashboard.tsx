import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import { getBookedSlotsByDoctor } from "../../lib/DoctorApi";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    const fetchTodaySlots = async () => {
      try {
        const doctorId = localStorage.getItem("userId");
        const today = new Date().toISOString().split("T")[0];
        if (!doctorId) return;

        const slots = await getBookedSlotsByDoctor(doctorId, today);

        const formatted = slots.map((slot, index) => {
          const start = new Date(slot.startTime.seconds * 1000);
          return {
            id: slot.slotId || index,
            patientName: slot.patientName,
            time: start.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        setTodaySchedule(formatted);
      } catch (err) {
        console.error("Failed to fetch today's schedule:", err);
      }
    };

    fetchTodaySlots();
  }, []);

  const stats = [
    {
      title: "Lịch hôm nay",
      value: todaySchedule.length.toString(),
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Bệnh nhân đã khám",
      value: "0",
      icon: Users,
      color: "text-success",
    },
    {
      title: "Bệnh nhân chờ khám",
      value: "0",
      icon: Clock,
      color: "text-warning",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/doctor/schedule")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Quản lý lịch làm việc
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{slot.patientName}</p>
                      <p className="text-sm text-muted-foreground">Khám tổng quát</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{slot.time}</p>
                      <p className="text-sm text-success">Đã đặt</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tổng bệnh nhân trong tháng:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Lịch còn trống hôm nay:</span>
                  <span className="font-medium">2 slot</span>
                </div>
                <div className="flex justify-between">
                  <span>Lịch tuần tới:</span>
                  <span className="font-medium">0 lịch hẹn</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
