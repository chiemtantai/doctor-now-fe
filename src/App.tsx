import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
const queryClient = new QueryClient();

const App = () => {
 const [user, setUser] = useState(() => {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");
  return token && roleId === "1" ? { token, roleId: 1 } : null;
});

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar isLoggedIn={!!user} onLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/book-appointment"
              element={user ? <BookAppointment /> : <Navigate to="/login" />}
            />
            <Route
              path="/history"
              element={user ? <History /> : <Navigate to="/login" />}
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={<AdminLayout><AdminDashboard /></AdminLayout>}
            />
            <Route
              path="/admin/doctors"
              element={<AdminLayout><DoctorsManagement /></AdminLayout>}
            />

            {/* Doctor Dashboard */}
            <Route
              path="/doctor"
              element={<DoctorDashboard />}
            />
            <Route
              path="/doctor/schedule"
              element={<Schedule />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
