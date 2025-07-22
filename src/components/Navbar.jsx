import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Calendar, History, LogOut } from "lucide-react";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Doctor Now
        </Link>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm">
                <User className="w-4 h-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
            
            <Link to="/book-appointment">
              <Button variant={isActive("/book-appointment") ? "default" : "ghost"} size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Đặt lịch
              </Button>
            </Link>
            
            <Link to="/history">
              <Button variant={isActive("/history") ? "default" : "ghost"} size="sm">
                <History className="w-4 h-4 mr-2" />
                Lịch sử
              </Button>
            </Link>
            
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant={isActive("/login") ? "default" : "ghost"} size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button variant={isActive("/register") ? "default" : "outline"} size="sm">
                Đăng ký
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;