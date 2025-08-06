// Servicio de Analytics - MussikOn Admin System
// Este servicio maneja todas las llamadas a la API de analytics

import { apiService } from './api';


// Tipos para Analytics
export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  eventType?: string;
  status?: string;
  userRole?: string;
  location?: string;
  period?: 'day' | 'week' | 'month' | 'quarter';
  groupBy?: string;
  limit?: number;
  offset?: number;
}

export interface EventAnalytics {
  totalEvents: number;
  eventsByStatus: Record<string, number>;
  eventsByType: Record<string, number>;
  eventsByMonth: Record<string, number>;
  averageBudget: number;
  totalBudget: number;
  completionRate: number;
  cancellationRate: number;
}

export interface RequestAnalytics {
  totalRequests: number;
  requestsByStatus: Record<string, number>;
  requestsByType: Record<string, number>;
  requestsByMonth: Record<string, number>;
  averageBudget: number;
  totalBudget: number;
  acceptanceRate: number;
  averageResponseTime: number;
}

export interface UserAnalytics {
  totalUsers: number;
  usersByRole: Record<string, number>;
  usersByMonth: Record<string, number>;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
}

export interface PlatformAnalytics {
  totalRevenue: number;
  averageEventValue: number;
  topEventTypes: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
    revenue: number;
  }>;
  userEngagement: {
    eventsPerUser: number;
    requestsPerUser: number;
    averageSessionDuration: number;
  };
  performance: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

export interface TrendsData {
  eventTrends: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  requestTrends: Array<{
    month: string;
    count: number;
    acceptanceRate: number;
  }>;
  userTrends: Array<{
    month: string;
    newUsers: number;
    activeUsers: number;
  }>;
}

export interface LocationPerformance {
  location: string;
  totalEvents: number;
  totalRequests: number;
  totalRevenue: number;
  averageEventValue: number;
  acceptanceRate: number;
}

export interface TopUser {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  eventsCreated: number;
  requestsCreated: number;
  eventsCompleted: number;
  requestsAccepted: number;
  totalRevenue: number;
}

export interface DashboardAnalytics {
  events: EventAnalytics;
  requests: RequestAnalytics;
  users: UserAnalytics;
  platform: PlatformAnalytics;
  trends: TrendsData;
}

// Servicio de Analytics
export const analyticsService = {
  // CORREGIDO: Obtener dashboard completo
  async getDashboard(filters: AnalyticsFilters = {}): Promise<DashboardAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      console.log('📊 Obteniendo dashboard analytics...');
      const response = await apiService.get<DashboardAnalytics>(`/analytics/dashboard?${params.toString()}`);
      console.log('✅ Dashboard analytics obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener dashboard analytics:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener analytics de eventos
  async getEventAnalytics(filters: AnalyticsFilters = {}): Promise<EventAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      console.log('📊 Obteniendo analytics de eventos...');
      const response = await apiService.get<EventAnalytics>(`/analytics/events?${params.toString()}`);
      console.log('✅ Analytics de eventos obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener analytics de eventos:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener analytics de solicitudes
  async getRequestAnalytics(filters: AnalyticsFilters = {}): Promise<RequestAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      console.log('📊 Obteniendo analytics de solicitudes...');
      const response = await apiService.get<RequestAnalytics>(`/analytics/requests?${params.toString()}`);
      console.log('✅ Analytics de solicitudes obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener analytics de solicitudes:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener analytics de usuarios
  async getUserAnalytics(filters: AnalyticsFilters = {}): Promise<UserAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.userRole) params.append('userRole', filters.userRole);
      if (filters.location) params.append('location', filters.location);
      
      console.log('📊 Obteniendo analytics de usuarios...');
      const response = await apiService.get<UserAnalytics>(`/analytics/users?${params.toString()}`);
      console.log('✅ Analytics de usuarios obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener analytics de usuarios:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener analytics de plataforma
  async getPlatformAnalytics(filters: AnalyticsFilters = {}): Promise<PlatformAnalytics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.period) params.append('period', filters.period);
      
      console.log('📊 Obteniendo analytics de plataforma...');
      const response = await apiService.get<PlatformAnalytics>(`/analytics/platform?${params.toString()}`);
      console.log('✅ Analytics de plataforma obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener analytics de plataforma:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener reporte de tendencias
  async getTrendsReport(months: number = 6): Promise<TrendsData> {
    try {
      console.log('📊 Obteniendo reporte de tendencias...');
      const response = await apiService.get<TrendsData>(`/analytics/trends?months=${months}`);
      console.log('✅ Reporte de tendencias obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener reporte de tendencias:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener rendimiento por ubicación
  async getLocationPerformance(): Promise<LocationPerformance[]> {
    try {
      console.log('📊 Obteniendo rendimiento por ubicación...');
      const response = await apiService.get<LocationPerformance[]>(`/analytics/location-performance`);
      console.log('✅ Rendimiento por ubicación obtenido:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener rendimiento por ubicación:', error);
      throw error;
    }
  },

  // CORREGIDO: Obtener usuarios top
  async getTopUsers(limit: number = 10): Promise<TopUser[]> {
    try {
      console.log('📊 Obteniendo usuarios top...');
      const response = await apiService.get<TopUser[]>(`/analytics/top-users?limit=${limit}`);
      console.log('✅ Usuarios top obtenidos:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener usuarios top:', error);
      throw error;
    }
  },

  // CORREGIDO: Exportar reporte
  async exportReport(
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format: 'csv' | 'json' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      params.append('format', format);
      
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      
      console.log(`📊 Exportando reporte ${type} en formato ${format}...`);
      const response = await apiService.get(`/analytics/export?${params.toString()}`, {
        responseType: 'blob'
      });
      console.log('✅ Reporte exportado:', response);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al exportar reporte:', error);
      throw error;
    }
  },

  // CORREGIDO: Analytics específicos para admin
  async getAdminUserAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      console.log('📊 Obteniendo analytics de usuarios para admin...');
      const response = await apiService.get<any>(`/analytics/users?period=${period}&groupBy=${groupBy}`);
      console.log('✅ Analytics de usuarios para admin obtenido:', response);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener analytics de usuarios para admin:', error);
      throw error;
    }
  },

  async getAdminEventAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      console.log('📊 Obteniendo analytics de eventos para admin...');
      const response = await apiService.get<any>(`/analytics/events?period=${period}&groupBy=${groupBy}`);
      console.log('✅ Analytics de eventos para admin obtenido:', response);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener analytics de eventos para admin:', error);
      throw error;
    }
  },

  async getAdminRequestAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      console.log('📊 Obteniendo analytics de solicitudes para admin...');
      const response = await apiService.get<any>(`/analytics/requests?period=${period}&groupBy=${groupBy}`);
      console.log('✅ Analytics de solicitudes para admin obtenido:', response);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener analytics de solicitudes para admin:', error);
      throw error;
    }
  },

  async exportAdminReport(
    type: 'users' | 'events' | 'requests',
    format: 'csv' | 'json' = 'csv',
    filters: Record<string, any> = {}
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      params.append('format', format);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      console.log(`📊 Exportando reporte admin ${type} en formato ${format}...`);
      const response = await apiService.get(`/analytics/export?${params.toString()}`, {
        responseType: 'blob'
      });
      console.log('✅ Reporte admin exportado:', response);
      
      return response.data || response;
    } catch (error) {
      console.error('❌ Error al exportar reporte admin:', error);
      throw error;
    }
  }
}; 