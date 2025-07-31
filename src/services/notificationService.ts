import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Interfaces para notificaciones
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'event' | 'payment' | 'request' | 'general';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: Record<string, any>;
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: 'system' | 'event' | 'payment' | 'request' | 'general';
  metadata?: Record<string, any>;
}

export interface BulkNotificationData {
  userIds: string[];
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: 'system' | 'event' | 'payment' | 'request' | 'general';
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  period: string;
}

// Servicio de notificaciones
export const notificationService = {
  /**
   * Obtener notificaciones del usuario
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<{
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      
      if (filters.unreadOnly) {
        params.append('unreadOnly', 'true');
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.NOTIFICATIONS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw error;
    }
  },

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ.replace(':id', notificationId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      throw error;
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ
      );

      return response.data.data;
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
      throw error;
    }
  },

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        API_CONFIG.ENDPOINTS.DELETE_NOTIFICATION.replace(':id', notificationId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando notificación:', error);
      throw error;
    }
  },

  /**
   * Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.UNREAD_COUNT
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo contador de no leídas:', error);
      throw error;
    }
  },

  /**
   * Crear notificación (uso interno)
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.CREATE_NOTIFICATION,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando notificación:', error);
      throw error;
    }
  },

  /**
   * Enviar notificación masiva (solo superadmin)
   */
  async sendBulkNotification(data: BulkNotificationData): Promise<{
    success: boolean;
    sent: number;
    failed: number;
  }> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.BULK_NOTIFICATION,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error enviando notificación masiva:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de notificaciones
   */
  async getNotificationStats(filters: {
    period?: 'day' | 'week' | 'month';
    type?: string;
    category?: string;
  } = {}): Promise<NotificationStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.category) {
        params.append('category', filters.category);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.NOTIFICATION_STATS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de notificaciones:', error);
      throw error;
    }
  },

  /**
   * Obtener notificación por ID
   */
  async getNotificationById(notificationId: string): Promise<Notification> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.NOTIFICATION_BY_ID.replace(':id', notificationId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo notificación por ID:', error);
      throw error;
    }
  }
}; 