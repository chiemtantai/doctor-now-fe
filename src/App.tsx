import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import History from "./pages/patient/History";
import { AdminLayout } from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorsManagement from "./pages/admin/DoctorsManagement";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Schedule from "./pages/doctor/Schedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-medical-light">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Đang tải...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: number[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if roleId is valid
  if (isNaN(user.roleId) || user.roleId === 0) {
    console.error("❌ Invalid roleId detected:", user.roleId);
    return <Navigate to="/login" replace />;
  }

  // Nếu có quy định về roles và user không có quyền
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.roleId)) {
    console.warn("🚫 Access denied for roleId:", user.roleId, "Required:", allowedRoles);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (chỉ cho phép truy cập khi chưa login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    // Redirect based on role
    switch (user.roleId) {
      case 1:
        return <Navigate to="/admin" replace />;
      case 2:
        return <Navigate to="/dashboard" replace />;
      case 3:
        return <Navigate to="/doctor" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// App Routes Component (cần được wrap trong AuthProvider)
const AppRoutes = () => {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={!!user} onLogout={logout} />
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            user ? (
              user.roleId === 1 ? <Navigate to="/admin" replace /> :
              user.roleId === 2 ? <Navigate to="/dashboard" replace /> :
              user.roleId === 3 ? <Navigate to="/doctor" replace /> :
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Patient routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminLayout>
                <DoctorsManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <Schedule />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;