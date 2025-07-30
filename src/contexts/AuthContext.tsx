// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login } from '../lib/api';
import { loginDoctor as loginDoctorApi } from '../lib/DoctorApi';

// Types
interface User {
  userId: string;
  email: string;
  name: string;
  roleId: number;
}

interface DoctorTokenPayload {
  sub: string;
  unique_name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<any>;
  loginDoctor: (email: string, password: string) => Promise<any>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function để decode JWT token và lấy user info
  const getUserFromToken = (token: string): User | null => {
    try {
      // Simple JWT decode (không cần thư viện nếu chỉ cần payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded token:", decoded);

      // Xử lý role claim đặc biệt của Microsoft
      const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roleValue = decoded[roleClaimKey] || decoded.role || decoded.roleId || decoded.roleid;

      return {
        userId: decoded.id || decoded.userId || decoded.sub || decoded.nameid,
        email: decoded.email || decoded.unique_name || '',
        name: decoded.name || decoded.given_name || decoded.fullName || 'User',
        roleId: parseInt(roleValue) || 0,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getDoctorFromToken = (token: string): User | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded: DoctorTokenPayload = JSON.parse(jsonPayload);
      console.log("🔍 Decoded doctor token:", decoded);

      if (decoded.role !== "Doctor") {
        console.warn("❌ Token is not from a doctor");
        return null;
      }

      return {
        userId: decoded.nameid || '',
        email: decoded.email || '',
        name: decoded.unique_name || 'Doctor',
        roleId: 3
      };
    } catch (error) {
      console.error("❌ Error decoding doctor token:", error);
      return null;
    }
  };

  // Khôi phục user từ localStorage khi app load
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        let tokenUser = getUserFromToken(token);

        if (!tokenUser) {
          tokenUser = getDoctorFromToken(token);
        }

        if (tokenUser) {
          setUser(tokenUser);
          console.log("✅ User restored from token:", tokenUser);

          if (!tokenUser.userId || isNaN(tokenUser.roleId)) {
            console.error("❌ Invalid user data from token:", tokenUser);
            localStorage.clear();
            setUser(null);
          }
        } else {
          console.warn("⚠️ Token invalid or unsupported");
          localStorage.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      console.log("Login API response:", response);

      if (response?.token) {
        // Lưu token
        localStorage.setItem('token', response.token);

        // Thử decode token để lấy user info
        const tokenUser = getUserFromToken(response.token);

        // Tạo user data từ API response hoặc token
        const finalUserData: User = {
          userId: response.userId || tokenUser?.userId || '',
          email: response.email || tokenUser?.email || email,
          name: response.name || tokenUser?.name || '',
          roleId: response.roleId || tokenUser?.roleId || 0,
        };

        // Lưu thông tin user vào localStorage (backup)
        localStorage.setItem('userId', finalUserData.userId);
        localStorage.setItem('roleId', finalUserData.roleId.toString());
        localStorage.setItem('name', finalUserData.name);
        localStorage.setItem('email', finalUserData.email);

        setUser(finalUserData);
        console.log("User set after login:", finalUserData);

        return response;
      }

      throw new Error('No token received');
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginDoctor = async (email: string, password: string) => {
    try {
      const response = await loginDoctorApi({ email, password });
      console.log("LoginDoctor API response:", response);

      if (response?.token) {
        localStorage.setItem('token', response.token);

        const doctor = getDoctorFromToken(response.token);
        console.log("👨‍⚕️ Decoded doctor:", doctor);

        if (!doctor) throw new Error("Invalid doctor token");

        console.log(doctor)
        // Chuyển về đúng kiểu `User`
        const finalDoctorData: User = {
          userId: doctor.userId,
          email: doctor.email,
          name: doctor.name,
          roleId: doctor.roleId,
        };

        // Lưu vào localStorage
        localStorage.setItem('userId', finalDoctorData.userId);
        localStorage.setItem('roleId', finalDoctorData.roleId.toString());
        localStorage.setItem('name', finalDoctorData.name);
        localStorage.setItem('email', finalDoctorData.email);

        setUser(finalDoctorData);
        console.log("✅ Doctor user set after login:", finalDoctorData);

        return finalDoctorData;
      }

      throw new Error('No token received');
    } catch (error) {
      console.error("❌ Doctor login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const value: AuthContextType = {
    user,
    loading,
    loginUser,
    loginDoctor,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};