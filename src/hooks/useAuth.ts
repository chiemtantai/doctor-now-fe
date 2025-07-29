
import { login } from '../lib/api';

export function useAuth() {
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      // Lưu token vào localStorage
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  return { loginUser, getToken, logout };
}
