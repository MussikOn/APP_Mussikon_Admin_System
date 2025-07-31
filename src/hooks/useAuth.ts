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
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Si no hay usuario en localStorage pero hay token, intentar obtenerlo del token
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const userFromToken = {
                _id: payload._id || 'unknown',
                name: payload.name || '',
                lastName: payload.lastName || '',
                userEmail: payload.userEmail || '',
                roll: payload.roll || 'admin',
                status: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              localStorage.setItem('user', JSON.stringify(userFromToken));
              setUser(userFromToken);
            } catch (parseError) {
              console.warn('No se pudo parsear el token JWT:', parseError);
              setUser(null);
              localStorage.removeItem('token');
            }
          }
        } else {
          throw new Error('Token inválido o expirado');
        }
      } catch (err: any) {
        console.warn('Error al verificar sesión:', err.message);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
        return { success: true };
      } else {
        setError(data.message || 'Respuesta inesperada del servidor.');
        return { success: false, error: data.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de autenticación.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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