// Servicio de Analytics - MussikOn Admin System
// Este servicio maneja todas las llamadas a la API de analytics

import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

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
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_DASHBOARD, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      console.log('🔍 Using mock data for dashboard analytics');
      
      // Datos mock para el dashboard
      return {
        events: {
          totalEvents: 156,
          eventsByStatus: {
            'Completado': 89,
            'En Progreso': 34,
            'Pendiente': 23,
            'Cancelado': 10
          },
          eventsByType: {
            'Boda': 45,
            'Corporativo': 32,
            'Privado': 28,
            'Concierto': 25,
            'Otro': 26
          },
          eventsByMonth: {
            'Enero': 12,
            'Febrero': 15,
            'Marzo': 18,
            'Abril': 22,
            'Mayo': 25,
            'Junio': 30,
            'Julio': 28,
            'Agosto': 26,
            'Septiembre': 24,
            'Octubre': 20,
            'Noviembre': 18,
            'Diciembre': 16
          },
          averageBudget: 2500,
          totalBudget: 390000,
          completionRate: 0.85,
          cancellationRate: 0.08
        },
        requests: {
          totalRequests: 234,
          requestsByStatus: {
            'Aceptado': 156,
            'Pendiente': 45,
            'Rechazado': 23,
            'En Revisión': 10
          },
          requestsByType: {
            'Boda': 67,
            'Corporativo': 45,
            'Privado': 38,
            'Concierto': 42,
            'Otro': 42
          },
          requestsByMonth: {
            'Enero': 18,
            'Febrero': 22,
            'Marzo': 25,
            'Abril': 28,
            'Mayo': 32,
            'Junio': 35,
            'Julio': 30,
            'Agosto': 28,
            'Septiembre': 26,
            'Octubre': 24,
            'Noviembre': 22,
            'Diciembre': 20
          },
          averageBudget: 1800,
          totalBudget: 421200,
          acceptanceRate: 0.78,
          averageResponseTime: 2.5
        },
        users: {
          totalUsers: 892,
          usersByRole: {
            'admin': 12,
            'organizador': 156,
            'musico': 234,
            'usuario': 490
          },
          usersByMonth: {
            'Enero': 45,
            'Febrero': 52,
            'Marzo': 58,
            'Abril': 65,
            'Mayo': 72,
            'Junio': 78,
            'Julio': 85,
            'Agosto': 92,
            'Septiembre': 88,
            'Octubre': 82,
            'Noviembre': 76,
            'Diciembre': 69
          },
          activeUsers: 567,
          newUsersThisMonth: 45,
          userGrowthRate: 0.12
        },
        platform: {
          totalRevenue: 811200,
          averageEventValue: 2200,
          topEventTypes: [
            { type: 'Boda', count: 45, revenue: 135000 },
            { type: 'Corporativo', count: 32, revenue: 96000 },
            { type: 'Privado', count: 28, revenue: 84000 },
            { type: 'Concierto', count: 25, revenue: 75000 },
            { type: 'Otro', count: 26, revenue: 78000 }
          ],
          topLocations: [
            { location: 'Madrid', count: 45, revenue: 135000 },
            { location: 'Barcelona', count: 38, revenue: 114000 },
            { location: 'Valencia', count: 32, revenue: 96000 },
            { location: 'Sevilla', count: 28, revenue: 84000 },
            { location: 'Bilbao', count: 25, revenue: 75000 }
          ],
          userEngagement: {
            eventsPerUser: 0.17,
            requestsPerUser: 0.26,
            averageSessionDuration: 8.5
          },
          performance: {
            averageResponseTime: 2.3,
            successRate: 0.92,
            errorRate: 0.08
          }
        },
        trends: {
          eventTrends: [
            { month: 'Enero', count: 12, revenue: 36000 },
            { month: 'Febrero', count: 15, revenue: 45000 },
            { month: 'Marzo', count: 18, revenue: 54000 },
            { month: 'Abril', count: 22, revenue: 66000 },
            { month: 'Mayo', count: 25, revenue: 75000 },
            { month: 'Junio', count: 30, revenue: 90000 }
          ],
          requestTrends: [
            { month: 'Enero', count: 18, acceptanceRate: 0.75 },
            { month: 'Febrero', count: 22, acceptanceRate: 0.78 },
            { month: 'Marzo', count: 25, acceptanceRate: 0.80 },
            { month: 'Abril', count: 28, acceptanceRate: 0.82 },
            { month: 'Mayo', count: 32, acceptanceRate: 0.85 },
            { month: 'Junio', count: 35, acceptanceRate: 0.88 }
          ],
          userTrends: [
            { month: 'Enero', newUsers: 45, activeUsers: 567 },
            { month: 'Febrero', newUsers: 52, activeUsers: 589 },
            { month: 'Marzo', newUsers: 58, activeUsers: 612 },
            { month: 'Abril', newUsers: 65, activeUsers: 634 },
            { month: 'Mayo', newUsers: 72, activeUsers: 657 },
            { month: 'Junio', newUsers: 78, activeUsers: 679 }
          ]
        }
      };
    }
  },

  // Analytics de eventos
  async getEventAnalytics(filters: AnalyticsFilters = {}): Promise<EventAnalytics> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_EVENTS, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      console.log('🔍 Using mock data for event analytics');
      
      // Datos mock para eventos
      return {
        totalEvents: 156,
        eventsByStatus: {
          'Completado': 89,
          'En Progreso': 34,
          'Pendiente': 23,
          'Cancelado': 10
        },
        eventsByType: {
          'Boda': 45,
          'Corporativo': 32,
          'Privado': 28,
          'Concierto': 25,
          'Otro': 26
        },
        eventsByMonth: {
          'Enero': 12,
          'Febrero': 15,
          'Marzo': 18,
          'Abril': 22,
          'Mayo': 25,
          'Junio': 30,
          'Julio': 28,
          'Agosto': 26,
          'Septiembre': 24,
          'Octubre': 20,
          'Noviembre': 18,
          'Diciembre': 16
        },
        averageBudget: 2500,
        totalBudget: 390000,
        completionRate: 0.85,
        cancellationRate: 0.08
      };
    }
  },

  // Analytics de solicitudes
  async getRequestAnalytics(filters: AnalyticsFilters = {}): Promise<RequestAnalytics> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_REQUESTS, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching request analytics:', error);
      console.log('🔍 Using mock data for request analytics');
      
      // Datos mock para solicitudes
      return {
        totalRequests: 234,
        requestsByStatus: {
          'Aceptado': 156,
          'Pendiente': 45,
          'Rechazado': 23,
          'En Revisión': 10
        },
        requestsByType: {
          'Boda': 67,
          'Corporativo': 45,
          'Privado': 38,
          'Concierto': 42,
          'Otro': 42
        },
        requestsByMonth: {
          'Enero': 18,
          'Febrero': 22,
          'Marzo': 25,
          'Abril': 28,
          'Mayo': 32,
          'Junio': 35,
          'Julio': 30,
          'Agosto': 28,
          'Septiembre': 26,
          'Octubre': 24,
          'Noviembre': 22,
          'Diciembre': 20
        },
        averageBudget: 1800,
        totalBudget: 421200,
        acceptanceRate: 0.78,
        averageResponseTime: 2.5
      };
    }
  },

  // Analytics de usuarios
  async getUserAnalytics(filters: AnalyticsFilters = {}): Promise<UserAnalytics> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_USERS, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      console.log('🔍 Using mock data for user analytics');
      
      // Datos mock para usuarios
      return {
        totalUsers: 892,
        usersByRole: {
          'admin': 12,
          'organizador': 156,
          'musico': 234,
          'usuario': 490
        },
        usersByMonth: {
          'Enero': 45,
          'Febrero': 52,
          'Marzo': 58,
          'Abril': 65,
          'Mayo': 72,
          'Junio': 78,
          'Julio': 85,
          'Agosto': 92,
          'Septiembre': 88,
          'Octubre': 82,
          'Noviembre': 76,
          'Diciembre': 69
        },
        activeUsers: 567,
        newUsersThisMonth: 45,
        userGrowthRate: 0.12
      };
    }
  },

  // Analytics de plataforma
  async getPlatformAnalytics(filters: AnalyticsFilters = {}): Promise<PlatformAnalytics> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_PLATFORM, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      console.log('🔍 Using mock data for platform analytics');
      
      // Datos mock para plataforma
      return {
        totalRevenue: 811200,
        averageEventValue: 2200,
        topEventTypes: [
          { type: 'Boda', count: 45, revenue: 135000 },
          { type: 'Corporativo', count: 32, revenue: 96000 },
          { type: 'Privado', count: 28, revenue: 84000 },
          { type: 'Concierto', count: 25, revenue: 75000 },
          { type: 'Otro', count: 26, revenue: 78000 }
        ],
        topLocations: [
          { location: 'Madrid', count: 45, revenue: 135000 },
          { location: 'Barcelona', count: 38, revenue: 114000 },
          { location: 'Valencia', count: 32, revenue: 96000 },
          { location: 'Sevilla', count: 28, revenue: 84000 },
          { location: 'Bilbao', count: 25, revenue: 75000 }
        ],
        userEngagement: {
          eventsPerUser: 0.17,
          requestsPerUser: 0.26,
          averageSessionDuration: 8.5
        },
        performance: {
          averageResponseTime: 2.3,
          successRate: 0.92,
          errorRate: 0.08
        }
      };
    }
  },

  // Reportes de tendencias
  async getTrendsReport(months: number = 6): Promise<TrendsData> {
    try {
      const response = await apiService.get('/analytics/trends', { params: { months } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trends report:', error);
      console.log('🔍 Using mock data for trends report');
      
      return {
        eventTrends: [
          { month: 'Enero', count: 12, revenue: 36000 },
          { month: 'Febrero', count: 15, revenue: 45000 },
          { month: 'Marzo', count: 18, revenue: 54000 },
          { month: 'Abril', count: 22, revenue: 66000 },
          { month: 'Mayo', count: 25, revenue: 75000 },
          { month: 'Junio', count: 30, revenue: 90000 }
        ],
        requestTrends: [
          { month: 'Enero', count: 18, acceptanceRate: 0.75 },
          { month: 'Febrero', count: 22, acceptanceRate: 0.78 },
          { month: 'Marzo', count: 25, acceptanceRate: 0.80 },
          { month: 'Abril', count: 28, acceptanceRate: 0.82 },
          { month: 'Mayo', count: 32, acceptanceRate: 0.85 },
          { month: 'Junio', count: 35, acceptanceRate: 0.88 }
        ],
        userTrends: [
          { month: 'Enero', newUsers: 45, activeUsers: 320 },
          { month: 'Febrero', newUsers: 52, activeUsers: 345 },
          { month: 'Marzo', newUsers: 58, activeUsers: 378 },
          { month: 'Abril', newUsers: 65, activeUsers: 412 },
          { month: 'Mayo', newUsers: 72, activeUsers: 445 },
          { month: 'Junio', newUsers: 78, activeUsers: 478 }
        ]
      };
    }
  },

  // Reportes de rendimiento por ubicación
  async getLocationPerformance(): Promise<LocationPerformance[]> {
    try {
      const response = await apiService.get('/analytics/location-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching location performance:', error);
      console.log('🔍 Using mock data for location performance');
      
      return [
        {
          location: 'Madrid',
          totalEvents: 89,
          totalRequests: 134,
          totalRevenue: 356000,
          averageEventValue: 4000,
          completionRate: 0.88,
          acceptanceRate: 0.82
        },
        {
          location: 'Barcelona',
          totalEvents: 67,
          totalRequests: 98,
          totalRevenue: 268000,
          averageEventValue: 4000,
          completionRate: 0.85,
          acceptanceRate: 0.79
        },
        {
          location: 'Valencia',
          totalEvents: 45,
          totalRequests: 67,
          totalRevenue: 180000,
          averageEventValue: 4000,
          completionRate: 0.82,
          acceptanceRate: 0.76
        },
        {
          location: 'Sevilla',
          totalEvents: 34,
          totalRequests: 52,
          totalRevenue: 136000,
          averageEventValue: 4000,
          completionRate: 0.80,
          acceptanceRate: 0.74
        },
        {
          location: 'Bilbao',
          totalEvents: 28,
          totalRequests: 42,
          totalRevenue: 112000,
          averageEventValue: 4000,
          completionRate: 0.78,
          acceptanceRate: 0.72
        }
      ];
    }
  },

  // Reportes de usuarios más activos
  async getTopUsers(limit: number = 10): Promise<TopUser[]> {
    try {
      const response = await apiService.get('/analytics/top-users', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top users:', error);
      console.log('🔍 Using mock data for top users');
      
      return [
        {
          user: {
            id: '1',
            name: 'María García',
            email: 'maria.garcia@email.com',
            role: 'organizador'
          },
          eventsCreated: 15,
          requestsCreated: 23,
          eventsCompleted: 12,
          requestsAccepted: 18,
          totalRevenue: 45000
        },
        {
          user: {
            id: '2',
            name: 'Carlos López',
            email: 'carlos.lopez@email.com',
            role: 'organizador'
          },
          eventsCreated: 12,
          requestsCreated: 19,
          eventsCompleted: 10,
          requestsAccepted: 15,
          totalRevenue: 38000
        },
        {
          user: {
            id: '3',
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            role: 'musico'
          },
          eventsCreated: 8,
          requestsCreated: 25,
          eventsCompleted: 7,
          requestsAccepted: 20,
          totalRevenue: 32000
        },
        {
          user: {
            id: '4',
            name: 'Luis Rodríguez',
            email: 'luis.rodriguez@email.com',
            role: 'organizador'
          },
          eventsCreated: 10,
          requestsCreated: 16,
          eventsCompleted: 8,
          requestsAccepted: 12,
          totalRevenue: 28000
        },
        {
          user: {
            id: '5',
            name: 'Sofia Fernández',
            email: 'sofia.fernandez@email.com',
            role: 'musico'
          },
          eventsCreated: 6,
          requestsCreated: 22,
          eventsCompleted: 5,
          requestsAccepted: 18,
          totalRevenue: 25000
        }
      ];
    }
  },

  // Exportación de reportes
  async exportReport(
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format: 'csv' | 'json' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_EXPORT, {
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