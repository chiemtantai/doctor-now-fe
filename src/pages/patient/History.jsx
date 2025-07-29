import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User2, Search, Filter } from "lucide-react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const appointments = [
    {
      id: 1,
      doctor: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      date: "2024-01-25",
      time: "09:00",
      status: "confirmed",
      reason: "Khám định kỳ",
      result: "Chưa có kết quả"
    },
    {
      id: 2,
      doctor: "BS. Trần Thị B",
      specialty: "Da liễu",
      date: "2024-01-20",
      time: "14:30",
      status: "completed",
      reason: "Viêm da",
      result: "Đã cấp thuốc, tái khám sau 1 tuần"
    },
    {
      id: 3,
      doctor: "BS. Lê Văn C",
      specialty: "Nội khoa",
      date: "2024-01-15",
      time: "10:00",
      status: "completed",
      reason: "Đau bụng",
      result: "Viêm dạ dày nhẹ, đã điều trị"
    },
    {
      id: 4,
      doctor: "BS. Phạm Thị D",
      specialty: "Nhi khoa",
      date: "2024-01-10",
      time: "08:30",
      status: "cancelled",
      reason: "Sốt cao",
      result: "Đã hủy"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "confirmed":
        return "bg-primary text-primary-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã hoàn thành";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-medical-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lịch sử khám bệnh
          </h1>
          <p className="text-muted-foreground">
            Xem lại tất cả các lịch hẹn và kết quả khám bệnh
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Tìm kiếm và lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên bác sĩ hoặc chuyên khoa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User2 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                        <Badge variant="outline">{appointment.specialty}</Badge>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Lý do khám: </span>
                          <span className="text-muted-foreground">{appointment.reason}</span>
                        </div>
                        
                        {appointment.result && (
                          <div>
                            <span className="font-medium">Kết quả: </span>
                            <span className="text-muted-foreground">{appointment.result}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {appointment.status === "confirmed" && (
                        <Button variant="outline" size="sm">
                          Hủy lịch hẹn
                        </Button>
                      )}
                      
                      {appointment.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        Đặt lại lịch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Không tìm thấy lịch hẹn</h3>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary */}
        {filteredAppointments.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {appointments.filter(a => a.status === "completed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {appointments.filter(a => a.status === "confirmed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã xác nhận</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {appointments.filter(a => a.status === "cancelled").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã hủy</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {appointments.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Tổng cộng</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;