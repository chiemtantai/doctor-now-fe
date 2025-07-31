import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login } from '../lib/api';
import { loginDoctor as loginDoctorApi } from '../lib/DoctorApi';

interface User {
  userId: string;
  email: string;
  name: string;
  roleId: number;
  token: string;
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

  const decodeToken = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("❌ Error decoding token:", error);
      return null;
    }
  };

  const getUserFromToken = (token: string): User | null => {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    const isDoctor = decoded.role === "Doctor";
    return {
      userId: decoded.id || decoded.userId || decoded.sub || decoded.nameid || '',
      email: decoded.email || decoded.unique_name || '',
      name: decoded.name || decoded.unique_name || 'User',
      roleId: isDoctor ? 3 : 2,
      token: token
    };
  };

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenUser = getUserFromToken(token);
        if (tokenUser?.userId && !isNaN(tokenUser.roleId)) {
          setUser(tokenUser);
          console.log("✅ User restored from token:", tokenUser);
        } else {
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
      if (!response?.token) throw new Error('No token received');

      localStorage.setItem('token', response.token);

      const tokenUser = getUserFromToken(response.token);
      const finalUserData: User = {
        userId: response.userId || tokenUser?.userId || '',
        email: response.email || tokenUser?.email || email,
        name: response.name || tokenUser?.name || '',
        roleId: response.roleId || tokenUser?.roleId || 0,
        token: response.token
      };

      localStorage.setItem('userId', finalUserData.userId);
      localStorage.setItem('roleId', finalUserData.roleId.toString());
      localStorage.setItem('name', finalUserData.name);
      localStorage.setItem('email', finalUserData.email);

      setUser(finalUserData);
      return finalUserData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginDoctor = async (email: string, password: string) => {
    try {
      const response = await loginDoctorApi({ email, password });
      if (!response?.token) throw new Error('No token received');

      localStorage.setItem('token', response.token);

      const doctor = getUserFromToken(response.token);
      if (!doctor || doctor.roleId !== 3) throw new Error("Invalid doctor token");

      localStorage.setItem('userId', doctor.userId);
      localStorage.setItem('roleId', doctor.roleId.toString());
      localStorage.setItem('name', doctor.name);
      localStorage.setItem('email', doctor.email);

      setUser(doctor);
      return doctor;
    } catch (error) {
      console.error("❌ Doctor login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const getToken = (): string | null => localStorage.getItem('token');

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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
