import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Interfaces para búsqueda y analytics
export interface SearchFilters {
  query: string;
  types?: string[];
  page?: number;
  limit?: number;
}

export interface SearchResults {
  users?: any[];
  events?: any[];
  requests?: any[];
  total: number;
}

export interface AnalyticsFilters {
  period?: 'day' | 'week' | 'month' | 'quarter';
  groupBy?: 'role' | 'status' | 'category' | 'instrument';
  startDate?: string;
  endDate?: string;
}

export interface DashboardAnalytics {
  users: {
    total: number;
    active: number;
    recent: number;
    growth: string;
  };
  events: {
    total: number;
    active: number;
    recent: number;
    growth: string;
  };
  requests: {
    total: number;
    pending: number;
    completionRate: string;
  };
  images: {
    total: number;
  };
  system: {
    uptime: number;
    memory: any;
    timestamp: string;
  };
}

export interface UserAnalytics {
  byRole?: Record<string, number>;
  byStatus?: Record<string, number>;
  total: number;
  active: number;
  inactive: number;
  recent: number;
  period: string;
}

export interface EventAnalytics {
  byStatus?: Record<string, number>;
  byCategory?: Record<string, number>;
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  recent: number;
  period: string;
}

export interface RequestAnalytics {
  byInstrument?: Record<string, number>;
  byStatus?: Record<string, number>;
  total: number;
  pending: number;
  assigned: number;
  completed: number;
  cancelled: number;
  recent: number;
  period: string;
  completionRate: string;
}

export interface ExportFilters {
  type: 'users' | 'events' | 'requests';
  filters?: Record<string, any>;
  format?: 'csv' | 'json';
}

// Servicio de búsqueda y analytics
export const searchService = {
  /**
   * Búsqueda global en toda la plataforma
   */
  async globalSearch(filters: SearchFilters): Promise<SearchResults> {
    try {
      const params = new URLSearchParams();
      params.append('query', filters.query);
      
      if (filters.types) {
        params.append('types', filters.types.join(','));
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.ADMIN_SEARCH_GLOBAL}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      throw error;
    }
  },

  /**
   * Obtener analytics del dashboard
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_DASHBOARD
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo analytics del dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtener analytics de usuarios
   */
  async getUserAnalytics(filters: AnalyticsFilters): Promise<UserAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.groupBy) {
        params.append('groupBy', filters.groupBy);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_USERS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo analytics de usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener analytics de eventos
   */
  async getEventAnalytics(filters: AnalyticsFilters): Promise<EventAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.groupBy) {
        params.append('groupBy', filters.groupBy);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_EVENTS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo analytics de eventos:', error);
      throw error;
    }
  },

  /**
   * Obtener analytics de solicitudes
   */
  async getRequestAnalytics(filters: AnalyticsFilters): Promise<RequestAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.groupBy) {
        params.append('groupBy', filters.groupBy);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_REQUESTS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo analytics de solicitudes:', error);
      throw error;
    }
  },

  /**
   * Exportar reportes
   */
  async exportReport(filters: ExportFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('type', filters.type);
      
      if (filters.filters) {
        params.append('filters', JSON.stringify(filters.filters));
      }
      
      if (filters.format) {
        params.append('format', filters.format);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_EXPORT}?${params.toString()}`,
        {
          responseType: 'blob'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error exportando reporte:', error);
      throw error;
    }
  },

  /**
   * Descargar reporte como archivo
   */
  async downloadReport(filters: ExportFilters, filename?: string): Promise<void> {
    try {
      const blob = await this.exportReport(filters);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${filters.type}_report.${filters.format || 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      throw error;
    }
  }
}; 