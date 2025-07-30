// pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { loginUser, loginDoctor } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🟡 Đăng nhập qua UserService...");
      const result = await loginUser(formData.email, formData.password);

      if (!result || typeof result.roleId === 'undefined') {
        throw new Error("Không thể xác định role từ UserService");
      }

      console.log("🟢 Đăng nhập thành công (user):", result);
      toast({ title: "Đăng nhập thành công", description: `Xin chào ${result.name}` });
      return;
    } catch (userError) {
      console.warn("🔁 Thử đăng nhập qua DoctorService...");

      try {
        const result = await loginDoctor(formData.email, formData.password);
        console.log(result)
        if (!result || typeof result.roleId === 'undefined') {
          throw new Error("Không thể xác định role từ DoctorService");
        }

        console.log("🟢 Đăng nhập thành công (doctor):", result);
        toast({ title: "Đăng nhập thành công", description: `Xin chào ${result.name}` });
        return;
      } catch (doctorError) {
        console.error("🔥 Đăng nhập thất bại:", doctorError);

        toast({
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không đúng",
          variant: "destructive"
        });
      }
      
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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