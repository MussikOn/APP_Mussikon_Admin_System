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
  completionRate: number;
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
const analyticsService = {
  // Dashboard completo de analytics
  async getDashboard(filters: AnalyticsFilters = {}): Promise<DashboardAnalytics> {
    try {
      const response = await apiService.get('/analytics/dashboard', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  // Analytics de eventos
  async getEventAnalytics(filters: AnalyticsFilters = {}): Promise<EventAnalytics> {
    try {
      const response = await apiService.get('/analytics/events', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      throw error;
    }
  },

  // Analytics de solicitudes
  async getRequestAnalytics(filters: AnalyticsFilters = {}): Promise<RequestAnalytics> {
    try {
      const response = await apiService.get('/analytics/requests', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching request analytics:', error);
      throw error;
    }
  },

  // Analytics de usuarios
  async getUserAnalytics(filters: AnalyticsFilters = {}): Promise<UserAnalytics> {
    try {
      const response = await apiService.get('/analytics/users', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  },

  // Analytics de plataforma
  async getPlatformAnalytics(filters: AnalyticsFilters = {}): Promise<PlatformAnalytics> {
    try {
      const response = await apiService.get('/analytics/platform', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      throw error;
    }
  },

  // Reportes de tendencias
  async getTrendsReport(months: number = 6): Promise<TrendsData> {
    try {
      const response = await apiService.get('/analytics/trends', { params: { months } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trends report:', error);
      throw error;
    }
  },

  // Reportes de rendimiento por ubicación
  async getLocationPerformance(): Promise<LocationPerformance[]> {
    try {
      const response = await apiService.get('/analytics/location-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching location performance:', error);
      throw error;
    }
  },

  // Reportes de usuarios más activos
  async getTopUsers(limit: number = 10): Promise<TopUser[]> {
    try {
      const response = await apiService.get('/analytics/top-users', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top users:', error);
      throw error;
    }
  },

  // Exportación de reportes
  async exportReport(
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format: 'csv' | 'json' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    try {
      const response = await apiService.get('/analytics/export', {
        params: { type, format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  // Analytics avanzados del admin
  async getAdminUserAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      const response = await apiService.get('/admin/analytics/users', {
        params: { period, groupBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin user analytics:', error);
      throw error;
    }
  },

  async getAdminEventAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      const response = await apiService.get('/admin/analytics/events', {
        params: { period, groupBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin event analytics:', error);
      throw error;
    }
  },

  async getAdminRequestAnalytics(period: string, groupBy: string): Promise<any> {
    try {
      const response = await apiService.get('/admin/analytics/requests', {
        params: { period, groupBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin request analytics:', error);
      throw error;
    }
  },

  async exportAdminReport(
    type: 'users' | 'events' | 'requests',
    format: 'csv' | 'json' = 'csv',
    filters: Record<string, any> = {}
  ): Promise<Blob> {
    try {
      const response = await apiService.get('/admin/analytics/export', {
        params: { type, format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting admin report:', error);
      throw error;
    }
  }
};

export { analyticsService };
export default analyticsService; 