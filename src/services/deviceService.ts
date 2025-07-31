import { apiService } from './api';

// Interfaces para dispositivos
export interface Device {
  id: string;
  userId: string;
  deviceId: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'web';
  platform: 'ios' | 'android' | 'web' | 'windows' | 'mac' | 'linux';
  version: string;
  isActive: boolean;
  isBlocked: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface DeviceActivity {
  id: string;
  deviceId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  metadata?: Record<string, any>;
}

export interface DeviceStats {
  total: number;
  active: number;
  blocked: number;
  byPlatform: Record<string, number>;
  byType: Record<string, number>;
  recentActivity: number;
  period: string;
}

// Servicio de dispositivos
export const deviceService = {
  /**
   * Obtener todos los dispositivos
   */
  async getDevices(filters: {
    userId?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    platform?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    devices: Device[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.userId) {
        params.append('userId', filters.userId);
      }
      
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      
      if (filters.isBlocked !== undefined) {
        params.append('isBlocked', filters.isBlocked.toString());
      }
      
      if (filters.platform) {
        params.append('platform', filters.platform);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/devices?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos:', error);
      throw error;
    }
  },

  /**
   * Obtener dispositivo por ID
   */
  async getDeviceById(deviceId: string): Promise<Device> {
    try {
      const response = await apiService.get(
        `/admin/devices/${deviceId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivo por ID:', error);
      throw error;
    }
  },

  /**
   * Obtener dispositivos de un usuario
   */
  async getUserDevices(userId: string): Promise<Device[]> {
    try {
      const response = await apiService.get(
        `/admin/devices/user/${userId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos del usuario:', error);
      throw error;
    }
  },

  /**
   * Bloquear dispositivo
   */
  async blockDevice(deviceId: string, reason?: string): Promise<Device> {
    try {
      const response = await apiService.put(
        `/admin/devices/${deviceId}/block`,
        { reason }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error bloqueando dispositivo:', error);
      throw error;
    }
  },

  /**
   * Desbloquear dispositivo
   */
  async unblockDevice(deviceId: string): Promise<Device> {
    try {
      const response = await apiService.put(
        `/admin/devices/${deviceId}/unblock`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error desbloqueando dispositivo:', error);
      throw error;
    }
  },

  /**
   * Eliminar dispositivo
   */
  async deleteDevice(deviceId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        `/admin/devices/${deviceId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando dispositivo:', error);
      throw error;
    }
  },

  /**
   * Obtener actividad del dispositivo
   */
  async getDeviceActivity(deviceId: string, filters: {
    startDate?: string;
    endDate?: string;
    action?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    activities: DeviceActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      if (filters.action) {
        params.append('action', filters.action);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/devices/${deviceId}/activity?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo actividad del dispositivo:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de dispositivos
   */
  async getDeviceStats(filters: {
    period?: 'day' | 'week' | 'month';
    platform?: string;
    type?: string;
  } = {}): Promise<DeviceStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.platform) {
        params.append('platform', filters.platform);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }

      const response = await apiService.get(
        `/admin/devices/stats?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de dispositivos:', error);
      throw error;
    }
  },

  /**
   * Obtener dispositivos inactivos
   */
  async getInactiveDevices(daysInactive: number = 30): Promise<Device[]> {
    try {
      const params = new URLSearchParams();
      params.append('daysInactive', daysInactive.toString());

      const response = await apiService.get(
        `/admin/devices/inactive?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos inactivos:', error);
      throw error;
    }
  },

  /**
   * Limpiar dispositivos inactivos
   */
  async cleanupInactiveDevices(daysInactive: number = 90): Promise<{
    success: boolean;
    deletedCount: number;
  }> {
    try {
      const response = await apiService.post(
        '/admin/devices/cleanup',
        { daysInactive }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error limpiando dispositivos inactivos:', error);
      throw error;
    }
  },

  /**
   * Obtener dispositivos sospechosos
   */
  async getSuspiciousDevices(): Promise<Device[]> {
    try {
      const response = await apiService.get(
        '/admin/devices/suspicious'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos sospechosos:', error);
      throw error;
    }
  },

  /**
   * Marcar dispositivo como sospechoso
   */
  async markDeviceAsSuspicious(deviceId: string, reason: string): Promise<Device> {
    try {
      const response = await apiService.put(
        `/admin/devices/${deviceId}/suspicious`,
        { reason }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error marcando dispositivo como sospechoso:', error);
      throw error;
    }
  },

  /**
   * Obtener dispositivos por ubicación
   */
  async getDevicesByLocation(location: {
    latitude: number;
    longitude: number;
    radius: number;
  }): Promise<Device[]> {
    try {
      const params = new URLSearchParams();
      params.append('latitude', location.latitude.toString());
      params.append('longitude', location.longitude.toString());
      params.append('radius', location.radius.toString());

      const response = await apiService.get(
        `/admin/devices/location?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos por ubicación:', error);
      throw error;
    }
  }
}; 