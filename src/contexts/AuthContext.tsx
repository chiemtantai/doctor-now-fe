// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login } from '../lib/api';

// Types
interface User {
  userId: string;
  email: string;
  name: string;
  roleId: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<any>;
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
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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

  // Khôi phục user từ localStorage khi app load
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const storedRoleId = localStorage.getItem('roleId');
      const storedUserId = localStorage.getItem('userId');
      const storedName = localStorage.getItem('name');
      const storedEmail = localStorage.getItem('email');

      if (token) {
        // Thử decode token trước
        const tokenUser = getUserFromToken(token);
        
        if (tokenUser) {
          setUser(tokenUser);
          console.log("User restored from token:", tokenUser);
          
          // Validate that we have all required fields
          if (!tokenUser.userId || isNaN(tokenUser.roleId)) {
            console.error("❌ Invalid user data from token:", tokenUser);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('roleId');
            localStorage.removeItem('userId');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            setUser(null);
          }
        } else if (storedUserId && storedRoleId) {
          // Fallback: sử dụng dữ liệu từ localStorage
          const userData: User = {
            userId: storedUserId,
            email: storedEmail || '',
            name: storedName || '',
            roleId: parseInt(storedRoleId),
          };
          setUser(userData);
          console.log("User restored from localStorage:", userData);
        } else {
          // Token không hợp lệ và không có dữ liệu backup
          localStorage.removeItem('token');
          localStorage.removeItem('roleId');
          localStorage.removeItem('userId');
          localStorage.removeItem('name');
          localStorage.removeItem('email');
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