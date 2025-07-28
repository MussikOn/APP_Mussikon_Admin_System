import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

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
        // Verificar si el token es válido usando el servicio de auth
        if (authService.isAuthenticated() && !authService.isTokenExpired()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        } else {
          throw new Error('Token inválido o expirado');
        }
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
      const data = await authService.login({ userEmail: email, userPassword: password });
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setError(data.message || 'Respuesta inesperada del servidor.');
      }
    } catch (err: any) {
      setError(err.message || 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, error, login, logout };
} 