import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User2, Plus } from "lucide-react";

const Dashboard = ({ user }) => {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      date: "2024-01-25",
      time: "09:00",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "BS. Trần Thị B",
      specialty: "Da liễu",
      date: "2024-01-28",
      time: "14:30",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Xin chào, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Quản lý lịch khám và theo dõi sức khỏe của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lịch hẹn sắp tới</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Trong tuần này
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng lịch khám</CardTitle>
              <User2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Tổng cộng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lần khám gần nhất</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Ngày trước
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn sắp tới</CardTitle>
              <CardDescription>
                Các cuộc hẹn trong tuần này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} lúc {appointment.time}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded ${
                    appointment.status === 'confirmed' 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
              <CardDescription>
                Các chức năng thường dùng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/book-appointment">
                <Button className="w-full justify-start" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Đặt lịch khám mới
                </Button>
              </Link>
              
              <Link to="/history">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Xem lịch sử khám
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start" size="lg">
                <User2 className="w-4 h-4 mr-2" />
                Cập nhật thông tin cá nhân
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;