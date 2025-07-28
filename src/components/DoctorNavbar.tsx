// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { User, Calendar, Clock, LogOut, Stethoscope, Users } from "lucide-react";

// interface LayoutProps {
//   children: React.ReactNode;
//   onLogout?: () => void;
// }

// const Layout = ({ children, onLogout }: LayoutProps) => {
//   const location = useLocation();
  
//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Doctor Navbar */}
//       <nav className="bg-card border-b border-border px-4 py-3">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <Link to="/doctor" className="text-xl font-bold text-primary flex items-center gap-2">
//             <Stethoscope className="w-6 h-6" />
//             Doctor Panel
//           </Link>
          
//           <div className="flex items-center gap-4">
//             <Link to="/doctor">
//               <Button variant={isActive("/doctor") ? "default" : "ghost"} size="sm">
//                 <User className="w-4 h-4 mr-2" />
//                 Trang chủ
//               </Button>
//             </Link>
            
//             <Link to="/doctor/schedule">
//               <Button variant={isActive("/doctor/schedule") ? "default" : "ghost"} size="sm">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Lịch làm việc
//               </Button>
//             </Link>
            
//             <Button onClick={onLogout} variant="outline" size="sm">
//               <LogOut className="w-4 h-4 mr-2" />
//               Đăng xuất
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto p-4">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;