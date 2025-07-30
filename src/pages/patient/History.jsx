import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User2, Search, Filter, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { appointmentService } from '../../services/appointmentService';

const History = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      // Debug: Log user object
      console.log("User object:", user);
      console.log("User ID:", user?.userId);
      
      if (!user?.userId) {
        console.log("No userId found");
        setError("Không tìm thấy thông tin bệnh nhân");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Debug: Log API call
        console.log("Calling API with userId:", user.userId);
        
        const data = await appointmentService.getPatientAppointments(user.userId);
        
        // Debug: Log response
        console.log("API response:", data);
        
        setAppointments(data);
      } catch (err) {
        // Debug: Log full error
        console.error("Full error object:", err);
        console.error("Error message:", err.message);
        
        setError("Không thể tải lịch sử khám bệnh. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.userId]); 

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "booked":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "booked":
        return "Đã đặt lịch";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-light">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Đang tải lịch sử khám bệnh...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-medical-light">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-destructive text-lg font-medium mb-2">Có lỗi xảy ra</div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                  placeholder="Tìm theo tên bác sĩ..."
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
                  <SelectItem value="booked">Đã đặt lịch</SelectItem>
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
              <Card key={appointment.slotId}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User2 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.startTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Mã lịch hẹn: </span>
                          <span className="text-muted-foreground text-xs font-mono">
                            {appointment.slotId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {appointment.status.toLowerCase() === "booked" && (
                        <Button variant="outline" size="sm">
                          Hủy lịch hẹn
                        </Button>
                      )}
                      
                      {appointment.status.toLowerCase() === "completed" && (
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      )}
                      
                   
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
        {appointments.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {appointments.filter(a => a.status.toLowerCase() === "booked").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã đặt lịch</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {appointments.filter(a => a.status.toLowerCase() === "completed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
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