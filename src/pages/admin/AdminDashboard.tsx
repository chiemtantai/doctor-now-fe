import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp,
  CalendarDays,
  UserCheck,
  Activity,
  AlertCircle
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng Bác sĩ",
      value: "24",
      change: "+2 từ tháng trước",
      icon: Stethoscope,
      trend: "up"
    },
    {
      title: "Lịch hẹn hôm nay",
      value: "48",
      change: "+12% so với hôm qua",
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Bệnh nhân mới",
      value: "156",
      change: "+8 hôm nay",
      icon: Users,
      trend: "up"
    },
    {
      title: "Doanh thu tháng",
      value: "₫125,000,000",
      change: "+15% so với tháng trước",
      icon: TrendingUp,
      trend: "up"
    }
  ]

  const recentAppointments = [
    {
      id: 1,
      patient: "Nguyễn Văn A",
      doctor: "BS. Trần Thị B",
      time: "09:00",
      status: "confirmed",
      department: "Tim mạch"
    },
    {
      id: 2,
      patient: "Lê Thị C",
      doctor: "BS. Phạm Văn D",
      time: "10:30",
      status: "pending",
      department: "Nội khoa"
    },
    {
      id: 3,
      patient: "Hoàng Minh E",
      doctor: "BS. Đỗ Thị F",
      time: "14:00",
      status: "completed",
      department: "Ngoại khoa"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="secondary">Đã xác nhận</Badge>
      case "pending":
        return <Badge variant="warning">Chờ xác nhận</Badge>
      case "completed":
        return <Badge variant="success">Hoàn thành</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Chào mừng đến Admin Dashboard</h1>
        <p className="text-white/90">Quản lý hệ thống đặt lịch khám hiệu quả</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Lịch hẹn gần đây
            </CardTitle>
            <CardDescription>
              Các cuộc hẹn được đặt hôm nay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor} • {appointment.department}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Xem tất cả lịch hẹn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>
              Các tính năng thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="medical" className="justify-start h-12">
                <Stethoscope className="h-5 w-5 mr-3" />
                Thêm bác sĩ mới
              </Button>
              <Button variant="secondary" className="justify-start h-12">
                <Calendar className="h-5 w-5 mr-3" />
                Tạo lịch hẹn
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Users className="h-5 w-5 mr-3" />
                Quản lý bệnh nhân
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <TrendingUp className="h-5 w-5 mr-3" />
                Xem báo cáo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Thông báo hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">• Hệ thống sẽ bảo trì vào 2:00 AM ngày mai</p>
            <p className="text-sm">• 3 bác sĩ chưa cập nhật lịch làm việc tuần này</p>
            <p className="text-sm">• 12 lịch hẹn đang chờ xác nhận</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}