import { useEffect, useState } from 'react';
import { login as loginService, verifyToken } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await verifyToken(token);
        setUser(data.user || data);
      } catch (err: any) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginService(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user || {});
      } else {
        setError('Respuesta inesperada del servidor.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, error, login, logout };
} 