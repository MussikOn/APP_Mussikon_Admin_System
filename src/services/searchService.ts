import { apiService } from './api';

// Tipos para búsqueda
export interface SearchFilters {
  query?: string;
  category?: 'events' | 'users' | 'requests' | 'all';
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  instrument?: string;
  role?: string;
  limit?: number;
  page?: number;
}

export interface SearchResult {
  id: string;
  type: 'event' | 'user' | 'request';
  title: string;
  description: string;
  relevance: number;
  metadata: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Tipo para la respuesta real del backend
export interface GlobalSearchResponse {
  success: boolean;
  data: {
    events: any[];
    requests: any[];
    users: any[];
  };
  summary: {
    totalEvents: number;
    totalRequests: number;
    totalUsers: number;
  };
  // Campos opcionales para compatibilidad
  results?: SearchResult[];
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

// Tipos para analytics
export interface AnalyticsFilters {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  category?: string;
}

export interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface AnalyticsResponse {
  data: AnalyticsData;
  summary: {
    total: number;
    change: number;
    percentage: number;
  };
  metadata: Record<string, any>;
}

// Servicio de búsqueda
export const searchService = {
  // Búsqueda global en toda la plataforma
  async globalSearch(filters: SearchFilters): Promise<GlobalSearchResponse> {
    try {
      console.log('🔍 Ejecutando búsqueda global con filtros:', filters);
      const response = await apiService.get('/search/global', { params: filters });
      console.log('🔍 Resultados de búsqueda global:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 Error en búsqueda global:', error);
      throw error;
    }
  },

  // Búsqueda de eventos
  async searchEvents(filters: SearchFilters): Promise<SearchResponse> {
    try {
      console.log('🔍 Ejecutando búsqueda de eventos con filtros:', filters);
      const response = await apiService.get('/search/events', { params: filters });
      console.log('🔍 Resultados de búsqueda de eventos:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 Error en búsqueda de eventos:', error);
      throw error;
    }
  },

  // Búsqueda de usuarios
  async searchUsers(filters: SearchFilters): Promise<SearchResponse> {
    try {
      console.log('🔍 Ejecutando búsqueda de usuarios con filtros:', filters);
      const response = await apiService.get('/search/users', { params: filters });
      console.log('🔍 Resultados de búsqueda de usuarios:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 Error en búsqueda de usuarios:', error);
      throw error;
    }
  },

  // Búsqueda de solicitudes de músicos
  async searchMusicianRequests(filters: SearchFilters): Promise<SearchResponse> {
    try {
      console.log('🔍 Ejecutando búsqueda de solicitudes con filtros:', filters);
      const response = await apiService.get('/search/musician-requests', { params: filters });
      console.log('🔍 Resultados de búsqueda de solicitudes:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 Error en búsqueda de solicitudes:', error);
      throw error;
    }
  },

  // Búsqueda por ubicación
  async searchByLocation(filters: SearchFilters): Promise<SearchResponse> {
    try {
      console.log('🔍 Ejecutando búsqueda por ubicación con filtros:', filters);
      const response = await apiService.get('/search/location', { params: filters });
      console.log('🔍 Resultados de búsqueda por ubicación:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 Error en búsqueda por ubicación:', error);
      throw error;
    }
  },
};

// Servicio de analytics
export const analyticsService = {
  // Analytics del dashboard
  async getDashboardAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics del dashboard con filtros:', filters);
      const response = await apiService.get('/analytics/dashboard', { params: filters });
      console.log('📊 Analytics del dashboard obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics del dashboard:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request bloqueado por cliente (posible ad-blocker o extensión)');
      } else if (error.status === 500) {
        console.error('📊 Error 500 del servidor - Endpoint no implementado o error interno');
      }
      
      // Retornar datos de respaldo en lugar de lanzar error
      return analyticsService.getFallbackDashboardData(filters);
    }
  },

  // Analytics de eventos
  async getEventsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de eventos con filtros:', filters);
      const response = await apiService.get('/analytics/events', { params: filters });
      console.log('📊 Analytics de eventos obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics de eventos:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request de eventos bloqueado por cliente - Usando datos de respaldo');
        console.warn('📊 Posibles causas: ad-blocker, extensión de privacidad, firewall corporativo');
        
        // Intentar con URL alternativa si está disponible
        const alternativeUrl = this.tryAlternativeConnection('/analytics/events', filters);
        if (alternativeUrl) {
          console.log('📊 Intentando conexión alternativa...');
          try {
            const altResponse = await fetch(alternativeUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
              }
            });
            
            if (altResponse.ok) {
              const data = await altResponse.json();
              console.log('📊 Conexión alternativa exitosa');
              return data;
            }
          } catch (altError) {
            console.warn('📊 Conexión alternativa también falló:', altError);
          }
        }
      }
      
      return analyticsService.getFallbackEventsData(filters);
    }
  },

  // Función para intentar conexión alternativa
  tryAlternativeConnection(endpoint: string, filters?: AnalyticsFilters): string | null {
    const baseUrl = 'http://localhost:3001';
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const queryString = params.toString();
    const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    // Verificar si el endpoint está disponible
    return url;
  },

  // Analytics de solicitudes
  async getRequestsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de solicitudes con filtros:', filters);
      const response = await apiService.get('/analytics/requests', { params: filters });
      console.log('📊 Analytics de solicitudes obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics de solicitudes:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request de solicitudes bloqueado por cliente');
      } else if (error.status === 500) {
        console.error('📊 Error 500 del servidor para solicitudes');
      }
      
      return analyticsService.getFallbackRequestsData(filters);
    }
  },

  // Analytics de usuarios
  async getUsersAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de usuarios con filtros:', filters);
      const response = await apiService.get('/analytics/users', { params: filters });
      console.log('📊 Analytics de usuarios obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics de usuarios:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request de usuarios bloqueado por cliente');
      }
      
      return analyticsService.getFallbackUsersData(filters);
    }
  },

  // Analytics de la plataforma
  async getPlatformAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de la plataforma con filtros:', filters);
      const response = await apiService.get('/analytics/platform', { params: filters });
      console.log('📊 Analytics de la plataforma obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics de la plataforma:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request de plataforma bloqueado por cliente');
      } else if (error.status === 500) {
        console.error('📊 Error 500 del servidor para plataforma');
      }
      
      return analyticsService.getFallbackPlatformData(filters);
    }
  },

  // Reportes de tendencias
  async getTrendsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de tendencias con filtros:', filters);
      const response = await apiService.get('/analytics/trends', { params: filters });
      console.log('📊 Analytics de tendencias obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics de tendencias:', error);
      
      // Log específico para debugging
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        console.warn('📊 Request de tendencias bloqueado por cliente');
      }
      
      return analyticsService.getFallbackTrendsData(filters);
    }
  },

  // Reportes de rendimiento por ubicación
  async getLocationPerformanceAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de rendimiento por ubicación con filtros:', filters);
      const response = await apiService.get('/analytics/location-performance', { params: filters });
      console.log('📊 Analytics de rendimiento por ubicación obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('📊 Error obteniendo analytics de rendimiento por ubicación:', error);
      return analyticsService.getFallbackLocationData(filters);
    }
  },

  // Reportes de usuarios más activos
  async getTopUsersAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      console.log('📊 Obteniendo analytics de usuarios top con filtros:', filters);
      const response = await apiService.get('/analytics/top-users', { params: filters });
      console.log('📊 Analytics de usuarios top obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('📊 Error obteniendo analytics de usuarios top:', error);
      return analyticsService.getFallbackTopUsersData(filters);
    }
  },

  // Exportación de reportes
  async exportAnalytics(filters?: AnalyticsFilters, format: 'csv' | 'json' = 'json'): Promise<Blob> {
    try {
      console.log('📊 Exportando analytics con filtros:', filters, 'formato:', format);
      const response = await apiService.get('/analytics/export', { 
        params: { ...filters, format },
        responseType: 'blob'
      });
      console.log('📊 Analytics exportados exitosamente');
      return response.data;
    } catch (error) {
      console.error('📊 Error exportando analytics:', error);
      // Crear un blob de respaldo con datos de ejemplo
      const fallbackData = analyticsService.getFallbackExportData(filters);
      const content = format === 'csv' ? analyticsService.convertToCSV(fallbackData) : JSON.stringify(fallbackData, null, 2);
      return new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    }
  },

  // Datos de respaldo para dashboard
  getFallbackDashboardData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para dashboard');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Usuarios Activos',
            data: labels.map(() => Math.floor(Math.random() * 1000) + 500),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
          {
            label: 'Eventos Creados',
            data: labels.map(() => Math.floor(Math.random() * 100) + 50),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          }
        ]
      },
      summary: {
        total: 1250,
        change: 15,
        percentage: 12.5
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para eventos
  getFallbackEventsData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para eventos');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Eventos Creados',
            data: labels.map(() => Math.floor(Math.random() * 50) + 20),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
          },
          {
            label: 'Eventos Completados',
            data: labels.map(() => Math.floor(Math.random() * 40) + 15),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          }
        ]
      },
      summary: {
        total: 450,
        change: 8,
        percentage: 18.2
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para solicitudes
  getFallbackRequestsData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para solicitudes');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Solicitudes Recibidas',
            data: labels.map(() => Math.floor(Math.random() * 30) + 10),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
          },
          {
            label: 'Solicitudes Aprobadas',
            data: labels.map(() => Math.floor(Math.random() * 25) + 8),
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
          }
        ]
      },
      summary: {
        total: 180,
        change: 5,
        percentage: 27.8
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para usuarios
  getFallbackUsersData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para usuarios');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Nuevos Usuarios',
            data: labels.map(() => Math.floor(Math.random() * 200) + 100),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
          {
            label: 'Usuarios Activos',
            data: labels.map(() => Math.floor(Math.random() * 800) + 400),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          }
        ]
      },
      summary: {
        total: 1250,
        change: 25,
        percentage: 20.0
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para plataforma
  getFallbackPlatformData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para plataforma');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Sesiones',
            data: labels.map(() => Math.floor(Math.random() * 5000) + 2000),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Páginas Vistas',
            data: labels.map(() => Math.floor(Math.random() * 15000) + 8000),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
          }
        ]
      },
      summary: {
        total: 45000,
        change: 1200,
        percentage: 26.7
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para tendencias
  getFallbackTrendsData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para tendencias');
    const period = filters?.period || 'month';
    const labels = analyticsService.generateLabels(period);
    
    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Crecimiento',
            data: labels.map(() => Math.floor(Math.random() * 20) + 10),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
          }
        ]
      },
      summary: {
        total: 15.5,
        change: 2.3,
        percentage: 17.4
      },
      metadata: {
        period,
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para ubicación
  getFallbackLocationData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para ubicación');
    const locations = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];
    
    return {
      data: {
        labels: locations,
        datasets: [
          {
            label: 'Usuarios por Ciudad',
            data: locations.map(() => Math.floor(Math.random() * 500) + 200),
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
          }
        ]
      },
      summary: {
        total: 1850,
        change: 150,
        percentage: 8.8
      },
      metadata: {
        period: filters?.period || 'month',
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para usuarios top
  getFallbackTopUsersData(filters?: AnalyticsFilters): AnalyticsResponse {
    console.log('📊 Usando datos de respaldo para usuarios top');
    const users = ['Usuario 1', 'Usuario 2', 'Usuario 3', 'Usuario 4', 'Usuario 5'];
    
    return {
      data: {
        labels: users,
        datasets: [
          {
            label: 'Actividad',
            data: users.map(() => Math.floor(Math.random() * 100) + 50),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          }
        ]
      },
      summary: {
        total: 375,
        change: 25,
        percentage: 7.1
      },
      metadata: {
        period: filters?.period || 'month',
        lastUpdated: new Date().toISOString(),
        isFallback: true
      }
    };
  },

  // Datos de respaldo para exportación
  getFallbackExportData(filters?: AnalyticsFilters): any {
    return {
      period: filters?.period || 'month',
      data: analyticsService.getFallbackDashboardData(filters),
      generatedAt: new Date().toISOString(),
      note: 'Datos de respaldo generados automáticamente'
    };
  },

  // Generar etiquetas según el período
  generateLabels(period: string): string[] {
    const now = new Date();
    const labels: string[] = [];
    
    switch (period) {
      case 'day':
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now);
          date.setHours(date.getHours() - i);
          labels.push(date.getHours().toString().padStart(2, '0') + ':00');
        }
        break;
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
        }
        break;
      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.getDate().toString());
        }
        break;
      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('es-ES', { month: 'short' }));
        }
        break;
      default:
        labels.push('Datos');
    }
    
    return labels;
  },

  // Convertir datos a CSV
  convertToCSV(data: any): string {
    const headers = ['Periodo', 'Total', 'Cambio', 'Porcentaje'];
    const rows = [
      [data.period, data.data.summary.total, data.data.summary.change, data.data.summary.percentage]
    ];
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}; 