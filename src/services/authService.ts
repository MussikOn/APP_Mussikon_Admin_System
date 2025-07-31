import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Tipos para autenticación
export interface LoginData {
  userEmail: string;
  userPassword: string;
}

export interface RegisterData {
  name: string;
  lastName: string;
  userEmail: string;
  userPassword: string;
  roll: string;
  phone?: string;
  location?: string;
}

export interface User {
  _id: string;
  name: string;
  lastName: string;
  userEmail: string;
  roll: string;
  status: boolean;
  phone?: string;
  location?: string;
  profileImage?: string;
  bio?: string;
  instruments?: string[];
  experience?: string;
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  msg?: string; // Campo que devuelve el backend
  user?: User;
  token?: string;
  refreshToken?: string;
  userEmail?: string; // Para respuestas de recuperación de contraseña
}

export interface RefreshTokenData {
  refreshToken: string;
}

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Usar axios directamente para obtener la respuesta del backend
      const { api } = await import('./api');
      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, loginData);
      
      // El backend devuelve { msg, token, user }
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Usar los datos del usuario que devuelve el backend
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Si el backend no devuelve user, extraer del token JWT
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const user: User = {
              _id: payload._id || 'unknown',
              name: payload.name || '',
              lastName: payload.lastName || '',
              userEmail: payload.userEmail || '',
              roll: payload.roll || 'admin',
              status: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(user));
          } catch (parseError) {
            console.warn('No se pudo parsear el token JWT:', parseError);
          }
        }
        
        return {
          success: true,
          message: data.msg || 'Login exitoso',
          token: data.token,
          user: data.user || JSON.parse(localStorage.getItem('user') || 'null')
        };
      }
      
      // Si no hay token, es un error
      return { 
        success: false, 
        message: data.msg || 'Error en la respuesta del servidor' 
      };
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      // Manejar errores específicos del backend
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Error de conexión con el servidor');
      }
    }
  },

  // Registrar usuario
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.REGISTER, registerData);
      
      // El backend devuelve { msg, token, user }
      const data = response.data;
      
      if (data?.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return {
          success: true,
          message: data.msg || 'Usuario registrado exitosamente',
          token: data.token,
          user: data.user
        };
      }
      
      return { 
        success: false, 
        message: data?.msg || 'Error en la respuesta del servidor' 
      };
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Error de conexión con el servidor');
      }
    }
  },

  // Refrescar token
  async refreshToken(refreshTokenData: RefreshTokenData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, refreshTokenData);
      
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data || { success: false, message: 'Error en la respuesta del servidor' };
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      // Limpiar tokens del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Opcional: llamar al endpoint de logout del backend
      // await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así limpiar el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        return null;
      }
    }
    return null;
  },

  // Verificar si el token ha expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Si el token no tiene campo exp, no expira
      if (!payload.exp) {
        return false;
      }
      
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  },

  // Renovar token automáticamente si es necesario
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isTokenExpired()) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          await this.refreshToken({ refreshToken });
          return true;
        } catch (error) {
          console.error('Error al renovar token:', error);
          await this.logout();
          return false;
        }
      } else {
        await this.logout();
        return false;
      }
    }
    return true;
  },

  // Verificar permisos de administrador
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const adminRoles = ['adminJunior', 'adminMidLevel', 'adminSenior', 'superAdmin'];
    return adminRoles.includes(user.roll);
  },

  // Verificar si es super admin
  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roll === 'superAdmin';
  },

  // Verificar si es admin senior o superior
  isSeniorAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const seniorRoles = ['adminSenior', 'superAdmin'];
    return seniorRoles.includes(user.roll);
  },

  // Obtener nivel de permisos
  getPermissionLevel(): number {
    const user = this.getCurrentUser();
    if (!user) return 0;
    
    switch (user.roll) {
      case 'superAdmin':
        return 5;
      case 'adminSenior':
        return 4;
      case 'adminMidLevel':
        return 3;
      case 'adminJunior':
        return 2;
      case 'eventCreator':
        return 1;
      default:
        return 0;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const {
  login,
  register,
  refreshToken,
  logout,
  isAuthenticated,
  getToken,
  getRefreshToken,
  getCurrentUser,
  isTokenExpired,
  refreshTokenIfNeeded,
  isAdmin,
  isSuperAdmin,
  isSeniorAdmin,
  getPermissionLevel
} = authService; 

// Interfaces para recuperación de contraseña
export interface ForgotPasswordData {
  userEmail: string;
}

export interface VerifyCodeData {
  userEmail: string;
  code: string;
}

export interface ResetPasswordData {
  userEmail: string;
  code: string;
  newPassword: string;
}

// Función para solicitar recuperación de contraseña
export async function forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
  try {
    console.log('📧 Solicitando recuperación de contraseña:', data.userEmail);
    const { api } = await import('./api');
    const response = await api.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, data);
    
    console.log('✅ Código de verificación enviado');
    return {
      success: true,
      message: response.data.msg || 'Código de verificación enviado',
      userEmail: response.data.userEmail
    };
  } catch (error: any) {
    console.error('❌ Error al solicitar recuperación:', error);
    const errorMessage = error.response?.data?.msg || 'Error al solicitar recuperación de contraseña';
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Función para verificar código
export async function verifyCode(data: VerifyCodeData): Promise<AuthResponse> {
  try {
    console.log('🔍 Verificando código para:', data.userEmail);
    const { api } = await import('./api');
    const response = await api.post(API_CONFIG.ENDPOINTS.VERIFY_CODE, data);
    
    console.log('✅ Código verificado correctamente');
    return {
      success: true,
      message: response.data.msg || 'Código verificado correctamente',
      userEmail: response.data.userEmail
    };
  } catch (error: any) {
    console.error('❌ Error al verificar código:', error);
    const errorMessage = error.response?.data?.msg || 'Error al verificar código';
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Función para restablecer contraseña
export async function resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
  try {
    console.log('🔐 Restableciendo contraseña para:', data.userEmail);
    const { api } = await import('./api');
    const response = await api.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, data);
    
    console.log('✅ Contraseña restablecida correctamente');
    return {
      success: true,
      message: response.data.msg || 'Contraseña restablecida correctamente',
      userEmail: response.data.userEmail
    };
  } catch (error: any) {
    console.error('❌ Error al restablecer contraseña:', error);
    const errorMessage = error.response?.data?.msg || 'Error al restablecer contraseña';
    return {
      success: false,
      message: errorMessage
    };
  }
} 