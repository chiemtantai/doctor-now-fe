import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, User2 } from "lucide-react";
import { getAllDoctors, getAvailableSlots } from "../lib/api"; // Giả sử bạn có một hàm lấy danh sách bác sĩ
import { useEffect } from "react";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    reason: ""
  });
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  


useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err) {
      toast({
        title: "Lỗi tải danh sách bác sĩ",
        description: "Không thể kết nối tới máy chủ",
        variant: "destructive",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  fetchDoctors();
}, []);
useEffect(() => {
  const fetchSlots = async () => {
    if (!formData.doctor || !formData.date) return;

    console.log("📅 Fetching slots for:", formData);

    setLoadingSlots(true);
    try {
      const raw = await getAvailableSlots(formData.doctor, formData.date);
      const mapped = raw.map(s => ({
        id: s.slotId,
        label: s.startTime.split(" ")[1],
        ...s
      }));
      setTimeSlots(mapped);
    } catch (err) {
      console.error("❌ Lỗi tải khung giờ:", err);
      toast({ title: "Lỗi", description: "Không tải được khung giờ" });
    } finally {
      setLoadingSlots(false);
    }
  };

  fetchSlots();
}, [formData.doctor, formData.date]);



const handleChange = (field, value) => {
  if (field === "time") {
    const selectedSlot = timeSlots.find(s => s.label === value);
    setFormData(prev => ({
      ...prev,
      time: value,
      slotId: selectedSlot?.id || ""
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === "doctor" || field === "date" ? { time: "", slotId: "" } : {})
    }));
  }
};
 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.doctor || !formData.date || !formData.time) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    // Mock booking - in real app, this would call an API
    toast({
      title: "Đặt lịch thành công",
      description: "Lịch khám đã được đặt. Bạn sẽ nhận được xác nhận sớm."
    });
    
    navigate("/history");
  };

  const selectedDoctor = doctors.find(d => d.id === formData.doctor);

  return (
    <div className="min-h-screen bg-medical-light">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đặt lịch khám
          </h1>
          <p className="text-muted-foreground">
            Chọn bác sĩ và thời gian phù hợp để đặt lịch khám
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thông tin đặt lịch
                </CardTitle>
                <CardDescription>
                  Điền thông tin để đặt lịch khám
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Chọn bác sĩ *</Label>
                     <Select onValueChange={(value) => handleChange("doctor", value)}>
  <SelectTrigger>
    <SelectValue placeholder="Chọn bác sĩ" />
  </SelectTrigger>
  <SelectContent>
    {loadingDoctors ? (
      <p className="text-sm text-muted-foreground px-4 py-2">Đang tải...</p>
    ) : (
      doctors.map((doctor) => (
        <SelectItem key={doctor.id} value={doctor.id}>
          {doctor.fullName} - {doctor.specialty}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>

                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày khám *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                 {formData.doctor && formData.date && (
  <div className="space-y-2">
    <Label>Giờ khám *</Label>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {timeSlots.map((slot) => (
  <Button
    key={slot.id}
    type="button"
    variant={formData.time === slot.label ? "default" : "outline"}
    size="sm"
    onClick={() => handleChange("time", slot.label)}
  >
    {slot.label}
  </Button>
))}

    </div>
  </div>
)}


                  <div className="space-y-2">
                    <Label htmlFor="reason">Lý do khám</Label>
                    <Textarea
                      id="reason"
                      placeholder="Mô tả triệu chứng hoặc lý do khám..."
                      value={formData.reason}
                      onChange={(e) => handleChange("reason", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Đặt lịch khám
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="w-5 h-5" />
                  Thông tin bác sĩ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDoctor ? (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{selectedDoctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Chuyên khoa: {selectedDoctor.specialty}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Thời gian làm việc:</h4>
                      <p className="text-sm text-muted-foreground">
                        Thứ 2 - Thứ 6: 08:00 - 11:00, 14:00 - 17:00<br />
                        Thứ 7: 08:00 - 11:00
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Kinh nghiệm:</h4>
                      <p className="text-sm text-muted-foreground">
                        Hơn 10 năm kinh nghiệm trong lĩnh vực {selectedDoctor.specialty.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Vui lòng chọn bác sĩ để xem thông tin
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Lưu ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Vui lòng đến sớm 15 phút trước giờ hẹn</li>
                  <li>• Mang theo các giấy tờ cần thiết</li>
                  <li>• Có thể hủy lịch hẹn trước 24h</li>
                  <li>• Liên hệ hotline nếu cần hỗ trợ</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;