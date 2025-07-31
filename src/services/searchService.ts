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
  async globalSearch(filters: SearchFilters): Promise<SearchResponse> {
    const response = await apiService.get('/search/global', { params: filters });
    return response.data;
  },

  // Búsqueda de eventos
  async searchEvents(filters: SearchFilters): Promise<SearchResponse> {
    const response = await apiService.get('/search/events', { params: filters });
    return response.data;
  },

  // Búsqueda de usuarios
  async searchUsers(filters: SearchFilters): Promise<SearchResponse> {
    const response = await apiService.get('/search/users', { params: filters });
    return response.data;
  },

  // Búsqueda de solicitudes de músicos
  async searchMusicianRequests(filters: SearchFilters): Promise<SearchResponse> {
    const response = await apiService.get('/search/musician-requests', { params: filters });
    return response.data;
  },

  // Búsqueda por ubicación
  async searchByLocation(filters: SearchFilters): Promise<SearchResponse> {
    const response = await apiService.get('/search/location', { params: filters });
    return response.data;
  },
};

// Servicio de analytics
export const analyticsService = {
  // Analytics del dashboard principal
  async getDashboardAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/dashboard', { params: filters });
    return response.data;
  },

  // Analytics de eventos
  async getEventsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/events', { params: filters });
    return response.data;
  },

  // Analytics de solicitudes
  async getRequestsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/requests', { params: filters });
    return response.data;
  },

  // Analytics de usuarios
  async getUsersAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/users', { params: filters });
    return response.data;
  },

  // Analytics de la plataforma
  async getPlatformAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/platform', { params: filters });
    return response.data;
  },

  // Reportes de tendencias
  async getTrendsAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/trends', { params: filters });
    return response.data;
  },

  // Reportes de rendimiento por ubicación
  async getLocationPerformanceAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/location-performance', { params: filters });
    return response.data;
  },

  // Reportes de usuarios más activos
  async getTopUsersAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    const response = await apiService.get('/analytics/top-users', { params: filters });
    return response.data;
  },

  // Exportación de reportes
  async exportAnalytics(filters?: AnalyticsFilters, format: 'csv' | 'json' = 'json'): Promise<Blob> {
    const response = await apiService.get('/analytics/export', { 
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  },
}; 