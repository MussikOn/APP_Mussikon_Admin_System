import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { 
  getApiConfig, 
  getApiTimeout, 
  getDefaultHeaders, 
  getRetryConfig 
} from '../config/apiConfig';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Clase para manejo de errores de la API
export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Configuración base de axios
const createApiInstance = (): AxiosInstance => {
  const apiConfig = getApiConfig();
  const instance = axios.create({
    baseURL: apiConfig.BASE_URL,
    timeout: getApiTimeout(),
    headers: getDefaultHeaders(),
  });

  // Interceptor para agregar token a todas las peticiones
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log específico para Analytics
        if (config.url?.includes('/analytics/')) {
          console.log(`📊 Analytics Request: ${config.method?.toUpperCase()} ${config.url}`);
          console.log('📊 Token presente:', !!token);
          console.log('📊 Headers:', config.headers);
        } else {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      } catch (error) {
        console.error('Error en interceptor de request:', error);
        return config;
      }
    },
    (error) => {
      console.error('Error en interceptor de request:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta para manejo de errores mejorado
  instance.interceptors.response.use(
    (response) => {
      // Log de respuesta exitosa para analytics
      if (response.config.url?.includes('/analytics/')) {
        console.log('✅ Analytics Response:', response.config.method?.toUpperCase(), response.config.url);
      }
      return response;
    },
    (error) => {
      // Log detallado de errores para analytics
      if (error.config?.url?.includes('/analytics/')) {
        console.log('❌ Analytics Error:', error.config.method?.toUpperCase(), error.config.url);
        console.log('❌ Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        // Detectar errores específicos
        const specificErrors = detectSpecificErrors(error);
        if (specificErrors.length > 0) {
          console.log('🔍 Errores detectados:', specificErrors);
          
          // Obtener sugerencias
          const suggestions = getErrorSuggestions(specificErrors);
          if (suggestions.length > 0) {
            console.log('💡 Sugerencias de solución:');
            suggestions.forEach(suggestion => console.log('   ', suggestion));
          }
        }
        
        // Log específico para ERR_BLOCKED_BY_CLIENT
        if (specificErrors.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.warn('🚨 ERR_BLOCKED_BY_CLIENT detectado!');
          console.warn('🔧 Posibles causas:');
          console.warn('   - Extensiones del navegador (ad blockers, privacy extensions)');
          console.warn('   - Firewall o antivirus');
          console.warn('   - Configuración de red corporativa');
          console.warn('🔧 Soluciones:');
          console.warn('   - Desactiva temporalmente las extensiones');
          console.warn('   - Verifica la configuración de firewall');
          console.warn('   - Intenta con otro navegador');
        }
      }

      // Manejar errores específicos
      if (error.response?.status === 401) {
        const errorMessage = (error.response?.data as any)?.message || '';
        if (errorMessage.includes('Token inválido') || errorMessage.includes('expirado')) {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🔐 Token expirado, datos limpiados');
          } catch (logoutError) {
            console.error('Error al limpiar datos de sesión:', logoutError);
          }
        }
      } else if (error.response?.status === 403) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('🚫 Error 403 - Acceso denegado. Rol del usuario:', user.roll);
        console.log('🚫 Respuesta del servidor:', error.response?.data);
      } else if (error.response?.status === 500) {
        console.error('💥 Error 500 - Error interno del servidor');
        console.error('💥 Detalles:', error.response?.data);
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        console.error('🌐 Error de red - Verificar conectividad');
        console.error('🌐 URL intentada:', error.config?.url);
        console.error('🌐 Base URL:', getApiConfig().BASE_URL);
      }

      // Detectar específicamente ERR_BLOCKED_BY_CLIENT (independiente del tipo de error)
      if (error.message?.includes('ERR_BLOCKED_BY_CLIENT') || 
          error.message?.includes('blocked by client') ||
          error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.warn('🚫 Request bloqueado por cliente - Posible ad-blocker o extensión');
        console.warn('🚫 Soluciones: Desactivar extensiones, usar modo incógnito, configurar excepciones');
      }

      // Crear error personalizado
      const apiError = new ApiError(
        (error.response?.data as any)?.msg || 
        (error.response?.data as any)?.message || 
        error.message || 'Error de red',
        error.response?.status,
        error.code,
        error.response?.data
      );

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// Instancia de API
export const api = createApiInstance();

// Función para reintentar requests fallidos
const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries?: number,
  delay?: number
): Promise<any> => {
  const retryConfig = getRetryConfig();
  const retries = maxRetries || retryConfig.maxRetries;
  const retryDelay = delay || retryConfig.retryDelay;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempt === retries) {
        throw error;
      }

      // Solo reintentar en ciertos tipos de errores
      if (error.status === 500 || error.status === 502 || error.status === 503 || error.status === 504) {
        console.log(`🔄 Reintento ${attempt}/${retries} para ${error.config?.url || 'request'}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      } else {
        throw error;
      }
    }
  }
};

// Servicio de API con métodos HTTP
export const apiService = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(() => api.get(url, config));
  },

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(() => api.post(url, data, config));
  },

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(() => api.put(url, data, config));
  },

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(() => api.delete(url, config));
  },

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(() => api.patch(url, data, config));
  },

  async postFormData<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const formConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return retryRequest(() => api.post(url, formData, formConfig));
  },
};

// Función para detectar errores específicos
const detectSpecificErrors = (error: any): string[] => {
  const errors: string[] = [];
  
  // Detectar ERR_BLOCKED_BY_CLIENT
  if (error.code === 'ERR_BLOCKED_BY_CLIENT' || 
      error.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
      error.message?.includes('blocked by client')) {
    errors.push('ERR_BLOCKED_BY_CLIENT');
  }
  
  // Detectar errores de red
  if (error.code === 'ERR_NETWORK' || 
      error.message?.includes('Network Error') ||
      error.message?.includes('ERR_NETWORK')) {
    errors.push('ERR_NETWORK');
  }
  
  // Detectar errores de CORS
  if (error.code === 'ERR_CORS' || 
      error.message?.includes('CORS') ||
      error.message?.includes('Access-Control-Allow-Origin')) {
    errors.push('ERR_CORS');
  }
  
  // Detectar errores de timeout
  if (error.code === 'ECONNABORTED' || 
      error.message?.includes('timeout') ||
      error.message?.includes('ECONNABORTED')) {
    errors.push('ERR_TIMEOUT');
  }
  
  return errors;
};

// Función para obtener sugerencias de solución
const getErrorSuggestions = (errors: string[]): string[] => {
  const suggestions: string[] = [];
  
  if (errors.includes('ERR_BLOCKED_BY_CLIENT')) {
    suggestions.push('🔒 Desactiva temporalmente las extensiones del navegador (ad blockers, privacy extensions)');
    suggestions.push('🌐 Verifica que el backend esté corriendo en http://localhost:3001');
    suggestions.push('🔄 Intenta recargar la página con Ctrl+F5 (hard refresh)');
    suggestions.push('🔧 Verifica la configuración de firewall/antivirus');
  }
  
  if (errors.includes('ERR_NETWORK')) {
    suggestions.push('🌐 Verifica tu conexión a internet');
    suggestions.push('🔌 Asegúrate de que el backend esté corriendo');
    suggestions.push('🔧 Verifica la URL del backend en la configuración');
  }
  
  if (errors.includes('ERR_CORS')) {
    suggestions.push('🔧 El backend necesita configurar CORS correctamente');
    suggestions.push('🌐 Verifica que el backend esté configurado para aceptar peticiones desde el frontend');
  }
  
  if (errors.includes('ERR_TIMEOUT')) {
    suggestions.push('⏱️ La petición tardó demasiado, verifica la conexión');
    suggestions.push('🔧 Considera aumentar el timeout en la configuración');
  }
  
  return suggestions;
};

// Exportar tipos útiles
export type { AxiosRequestConfig, AxiosResponse, AxiosError }; 