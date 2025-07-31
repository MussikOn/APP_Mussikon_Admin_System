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
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
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
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      return response;
    },
    async (error: AxiosError) => {
      // const originalRequest = error.config as any; // Variable no utilizada
      
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);

      // Si el token expiró (401), intentar logout
      if (error.response?.status === 401) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirigir al login
          window.location.href = '/login';
          console.log('🔐 Token expirado, usuario deslogueado');
        } catch (logoutError) {
          console.error('Error al hacer logout:', logoutError);
        }
      }

      // Crear error personalizado
      const apiError = new ApiError(
        (error.response?.data as any)?.msg || 
        (error.response?.data as any)?.message || 
        error.message || 
        'Error de conexión',
        error.response?.status,
        error.code,
        error.response?.data
      );

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// Instancia principal de la API
export const api = createApiInstance();

// Función para reintentos automáticos
const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries?: number,
  delay?: number
): Promise<any> => {
  const retryConfig = getRetryConfig();
  const maxRetriesValue = maxRetries || retryConfig.maxRetries;
  const delayValue = delay || retryConfig.retryDelay;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetriesValue; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetriesValue) {
        throw error;
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delayValue * attempt));
      console.log(`🔄 Reintento ${attempt}/${maxRetriesValue} para ${requestFn.name}`);
    }
  }

  throw lastError;
};

// Funciones helper para métodos HTTP
export const apiService = {
  // GET
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.get(url, config);
      return response.data;
    });
  },

  // POST
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.post(url, data, config);
      return response.data;
    });
  },

  // PUT
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.put(url, data, config);
      return response.data;
    });
  },

  // DELETE
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.delete(url, config);
      return response.data;
    });
  },

  // PATCH
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.patch(url, data, config);
      return response.data;
    });
  },

  // POST con FormData (para subida de archivos)
  async postFormData<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    });
  },
};

// Exportar tipos útiles
export type { AxiosRequestConfig, AxiosResponse, AxiosError }; 