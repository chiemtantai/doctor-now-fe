import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { login } from "../lib/api"; // Giả sử bạn có một hàm Login trong api/auth
import { useAuth } from "../hooks/useAuth";

const Login = ({ onLogin }) => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast({
      title: "Lỗi",
      description: "Vui lòng điền đầy đủ thông tin",
      variant: "destructive"
    });
    return;
  }

  try {
    console.log("🟡 Sending login with:", formData);

    const result = await loginUser(formData.email, formData.password); 

    console.log("🟢 API login result:", result);

    if (!result || !result.roleId) {
      console.warn("⚠️ Không có roleId trong response");
    }

    if (result.roleId !== 2) {
      console.warn("🔴 Blocked user with roleId:", result.roleId);

      toast({
        title: "Truy cập bị từ chối",
        description: "Tài khoản không có quyền truy cập Dashboard bệnh nhân",
        variant: "destructive"
      });

      navigate("/"); // hoặc redirect khác nếu muốn

      return;
    }

    console.log("✅ User hợp lệ - login thành công");

    onLogin({ token: result.token, roleId: result.roleId, name: result.name });

    toast({
      title: "Đăng nhập thành công",
      description: `Chào mừng, ${result.name || "bạn"}!`
    });

    navigate("/dashboard");

  } catch (err) {
    console.error("🔥 Login error:", err);

    toast({
      title: "Đăng nhập thất bại",
      description: err.message || "Tài khoản hoặc mật khẩu không đúng",
      variant: "destructive"
    });
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-medical-light px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập để đặt lịch khám bác sĩ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Chưa có tài khoản? </span>
            <Link to="/register" className="text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;