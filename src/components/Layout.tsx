import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("doctorName");
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
    navigate("/");
  };

  const doctorName = localStorage.getItem("doctorName") || "Bác sĩ";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-primary">
                Hệ thống quản lý lịch khám
              </h1>
              <nav className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/doctor")}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/doctor/schedule")}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Lịch làm việc
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Xin chào, {doctorName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;