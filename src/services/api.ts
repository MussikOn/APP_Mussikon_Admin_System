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

  // Interceptor para manejar respuestas y errores
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log específico para Analytics
      if (response.config.url?.includes('/analytics/')) {
        console.log(`📊 Analytics Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        console.log('📊 Response data:', response.data);
      } else {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      }
      return response;
    },
    async (error: AxiosError) => {
      // Log específico para Analytics
      if (error.config?.url?.includes('/analytics/')) {
        console.error(`📊 Analytics Error: ${error.config.method?.toUpperCase()} ${error.config.url} - ${error.response?.status}`);
        console.error('📊 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
      } else {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
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

// Exportar tipos útiles
export type { AxiosRequestConfig, AxiosResponse, AxiosError }; 