import { apiService } from './api';
import { analyticsService } from './searchService';
import { mobileUsersService } from './mobileUsersService';
import { eventsService } from './eventsService';
import { musicianRequestsService } from './musicianRequestsService';
import { imagesService } from './imagesService';
import { usersService } from './usersService';
import { notificationService } from './notificationService';
import { paymentService } from './paymentService';
import { geolocationService } from './geolocationService';
import { contentService } from './contentService';
import { deviceService } from './deviceService';
import { superadminService } from './superadminService';

// Tipos para el sistema centralizado
export interface CentralizedData {
  dashboard: {
    users: any[];
    events: any[];
    requests: any[];
    images: any[];
    notifications: any[];
    stats: {
      totalUsers: number;
      totalEvents: number;
      totalRequests: number;
      totalImages: number;
      activeUsers: number;
      pendingRequests: number;
    };
  };
  analytics: {
    dashboard: any;
    events: any;
    users: any;
    requests: any;
    platform: any;
    trends: any;
  };
  realTime: {
    onlineUsers: number;
    recentActivity: any[];
    systemHealth: {
      status: 'healthy' | 'warning' | 'error';
      message: string;
      timestamp: string;
    };
  };
}

export interface CentralizedFilters {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  category?: string;
  status?: string;
  role?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface CentralizedResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Servicio centralizado de API
export const centralizedApiService = {
  // ===== DASHBOARD PRINCIPAL =====
  
  /**
   * Obtiene todos los datos del dashboard principal
   */
  async getDashboardData(filters?: CentralizedFilters): Promise<CentralizedResponse<CentralizedData['dashboard']>> {
    try {
      console.log('🏠 Obteniendo datos centralizados del dashboard...');
      
      // Cargar datos en paralelo para mejor rendimiento
      const [
        usersData,
        eventsData,
        requestsData,
        imagesData,
        notificationsData,
        analyticsData
      ] = await Promise.allSettled([
        mobileUsersService.getAllUsers({ limit: 5, page: 1 }),
        eventsService.getAllEvents({ limit: 5, page: 1 }),
        musicianRequestsService.getAllRequests({ limit: 5, page: 1 }),
        imagesService.getAllImages({ limit: 5, page: 1 }),
        notificationService.getNotifications({ limit: 10, page: 1 }),
        analyticsService.getDashboardAnalytics(filters)
      ]);

      // Procesar resultados
      const users = usersData.status === 'fulfilled' ? usersData.value.data || [] : [];
      const events = eventsData.status === 'fulfilled' ? eventsData.value.data || [] : [];
      const requests = requestsData.status === 'fulfilled' ? requestsData.value.data || [] : [];
      const images = imagesData.status === 'fulfilled' ? imagesData.value.data || [] : [];
      const notifications = notificationsData.status === 'fulfilled' ? notificationsData.value.data || [] : [];
      const analytics = analyticsData.status === 'fulfilled' ? analyticsData.value : null;

      // Calcular estadísticas
      const stats = {
        totalUsers: analytics?.summary?.total || users.length,
        totalEvents: events.length,
        totalRequests: requests.length,
        totalImages: images.length,
        activeUsers: users.filter((u: any) => u.status === true).length,
        pendingRequests: requests.filter((r: any) => r.status === 'pending').length
      };

      return {
        success: true,
        data: {
          users,
          events,
          requests,
          images,
          notifications,
          stats
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🏠 Error obteniendo datos del dashboard:', error);
      return {
        success: false,
        data: {
          users: [],
          events: [],
          requests: [],
          images: [],
          notifications: [],
          stats: {
            totalUsers: 0,
            totalEvents: 0,
            totalRequests: 0,
            totalImages: 0,
            activeUsers: 0,
            pendingRequests: 0
          }
        },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== ANALYTICS CENTRALIZADOS =====
  
  /**
   * Obtiene todos los analytics centralizados
   */
  async getAllAnalytics(filters?: CentralizedFilters): Promise<CentralizedResponse<CentralizedData['analytics']>> {
    try {
      console.log('📊 Obteniendo analytics centralizados...');
      
      const [
        dashboardAnalytics,
        eventsAnalytics,
        usersAnalytics,
        requestsAnalytics,
        platformAnalytics,
        trendsAnalytics
      ] = await Promise.allSettled([
        analyticsService.getDashboardAnalytics(filters),
        analyticsService.getEventsAnalytics(filters),
        analyticsService.getUsersAnalytics(filters),
        analyticsService.getRequestsAnalytics(filters),
        analyticsService.getPlatformAnalytics(filters),
        analyticsService.getTrendsAnalytics(filters)
      ]);

      return {
        success: true,
        data: {
          dashboard: dashboardAnalytics.status === 'fulfilled' ? dashboardAnalytics.value : null,
          events: eventsAnalytics.status === 'fulfilled' ? eventsAnalytics.value : null,
          users: usersAnalytics.status === 'fulfilled' ? usersAnalytics.value : null,
          requests: requestsAnalytics.status === 'fulfilled' ? requestsAnalytics.value : null,
          platform: platformAnalytics.status === 'fulfilled' ? platformAnalytics.value : null,
          trends: trendsAnalytics.status === 'fulfilled' ? trendsAnalytics.value : null
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('📊 Error obteniendo analytics centralizados:', error);
      return {
        success: false,
        data: {
          dashboard: null,
          events: null,
          users: null,
          requests: null,
          platform: null,
          trends: null
        },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== DATOS EN TIEMPO REAL =====
  
  /**
   * Obtiene datos en tiempo real del sistema
   */
  async getRealTimeData(): Promise<CentralizedResponse<CentralizedData['realTime']>> {
    try {
      console.log('⚡ Obteniendo datos en tiempo real...');
      
      // Simular datos en tiempo real (en producción esto vendría de WebSockets)
      const onlineUsers = Math.floor(Math.random() * 50) + 10;
      const recentActivity = [
        { id: 1, type: 'user_registered', message: 'Nuevo usuario registrado', timestamp: new Date().toISOString() },
        { id: 2, type: 'event_created', message: 'Nuevo evento creado', timestamp: new Date().toISOString() },
        { id: 3, type: 'request_pending', message: 'Nueva solicitud pendiente', timestamp: new Date().toISOString() }
      ];

      const systemHealth = {
        status: 'healthy' as const,
        message: 'Sistema funcionando correctamente',
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: {
          onlineUsers,
          recentActivity,
          systemHealth
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('⚡ Error obteniendo datos en tiempo real:', error);
      return {
        success: false,
        data: {
          onlineUsers: 0,
          recentActivity: [],
          systemHealth: {
            status: 'error' as const,
            message: 'Error obteniendo datos en tiempo real',
            timestamp: new Date().toISOString()
          }
        },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== BÚSQUEDA GLOBAL =====
  
  /**
   * Búsqueda global en todo el sistema
   */
  async globalSearch(query: string, filters?: CentralizedFilters): Promise<CentralizedResponse<any>> {
    try {
      console.log('🔍 Realizando búsqueda global:', query);
      
      const [
        usersResults,
        eventsResults,
        requestsResults,
        imagesResults
      ] = await Promise.allSettled([
        mobileUsersService.searchUsers({ query, limit: 10 }),
        eventsService.searchEvents({ query, limit: 10 }),
        musicianRequestsService.searchRequests({ query, limit: 10 }),
        imagesService.searchImages({ query, limit: 10 })
      ]);

      const results = {
        users: usersResults.status === 'fulfilled' ? usersResults.value.data || [] : [],
        events: eventsResults.status === 'fulfilled' ? eventsResults.value.data || [] : [],
        requests: requestsResults.status === 'fulfilled' ? requestsResults.value.data || [] : [],
        images: imagesResults.status === 'fulfilled' ? imagesResults.value.data || [] : []
      };

      return {
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🔍 Error en búsqueda global:', error);
      return {
        success: false,
        data: { users: [], events: [], requests: [], images: [] },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== GESTIÓN DE USUARIOS =====
  
  /**
   * Obtiene todos los usuarios con filtros
   */
  async getUsers(filters?: any): Promise<CentralizedResponse<any>> {
    try {
      console.log('👥 Obteniendo usuarios...');
      const response = await mobileUsersService.getAllUsers(filters);
      return {
        success: true,
        data: response.data,
        metadata: response.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('👥 Error obteniendo usuarios:', error);
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== GESTIÓN DE EVENTOS =====
  
  /**
   * Obtiene todos los eventos con filtros
   */
  async getEvents(filters?: any): Promise<CentralizedResponse<any>> {
    try {
      console.log('🎉 Obteniendo eventos...');
      const response = await eventsService.getAllEvents(filters);
      return {
        success: true,
        data: response.data,
        metadata: response.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🎉 Error obteniendo eventos:', error);
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== GESTIÓN DE SOLICITUDES =====
  
  /**
   * Obtiene todas las solicitudes con filtros
   */
  async getRequests(filters?: any): Promise<CentralizedResponse<any>> {
    try {
      console.log('📝 Obteniendo solicitudes...');
      const response = await musicianRequestsService.getAllRequests(filters);
      return {
        success: true,
        data: response.data,
        metadata: response.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('📝 Error obteniendo solicitudes:', error);
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== GESTIÓN DE IMÁGENES =====
  
  /**
   * Obtiene todas las imágenes con filtros
   */
  async getImages(filters?: any): Promise<CentralizedResponse<any>> {
    try {
      console.log('🖼️ Obteniendo imágenes...');
      const response = await imagesService.getAllImages(filters);
      return {
        success: true,
        data: response.data,
        metadata: response.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🖼️ Error obteniendo imágenes:', error);
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== NOTIFICACIONES =====
  
  /**
   * Obtiene todas las notificaciones
   */
  async getNotifications(filters?: any): Promise<CentralizedResponse<any>> {
    try {
      console.log('🔔 Obteniendo notificaciones...');
      const response = await notificationService.getNotifications(filters);
      return {
        success: true,
        data: response.data,
        metadata: response.metadata,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🔔 Error obteniendo notificaciones:', error);
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== DIAGNÓSTICO DEL SISTEMA =====
  
  /**
   * Diagnóstico completo del sistema
   */
  async systemDiagnostic(): Promise<CentralizedResponse<any>> {
    try {
      console.log('🔧 Realizando diagnóstico del sistema...');
      
      const endpoints = [
        '/admin/users',
        '/admin/events',
        '/admin/musician-requests',
        '/imgs',
        '/notifications',
        '/analytics/dashboard',
        '/analytics/events',
        '/analytics/users',
        '/analytics/requests'
      ];

      const results = [];

      for (const endpoint of endpoints) {
        try {
          const response = await apiService.get(endpoint);
          results.push({
            endpoint,
            status: 'success',
            responseTime: Date.now(),
            data: response.data
          });
        } catch (error: any) {
          results.push({
            endpoint,
            status: 'error',
            error: error.message,
            code: error.code
          });
        }
      }

      return {
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          endpoints: results,
          summary: {
            total: results.length,
            successful: results.filter(r => r.status === 'success').length,
            failed: results.filter(r => r.status === 'error').length
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('🔧 Error en diagnóstico del sistema:', error);
      return {
        success: false,
        data: { endpoints: [], summary: { total: 0, successful: 0, failed: 0 } },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // ===== EXPORTACIÓN DE DATOS =====
  
  /**
   * Exporta datos del sistema
   */
  async exportData(type: string, filters?: CentralizedFilters): Promise<Blob> {
    try {
      console.log('📤 Exportando datos:', type);
      
      switch (type) {
        case 'users':
          return await mobileUsersService.exportUsers(filters);
        case 'events':
          return await eventsService.exportEvents(filters);
        case 'requests':
          return await musicianRequestsService.exportRequests(filters);
        case 'images':
          return await imagesService.exportImages(filters);
        case 'analytics':
          return await analyticsService.exportAnalytics(filters, 'csv');
        default:
          throw new Error(`Tipo de exportación no soportado: ${type}`);
      }
    } catch (error: any) {
      console.error('📤 Error exportando datos:', error);
      throw error;
    }
  }
};

export default centralizedApiService; 