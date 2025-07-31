import { apiService } from './api';

// Interfaces para superadmin
export interface SystemBackup {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'full' | 'incremental';
  description?: string;
}

export interface CreateBackupRequest {
  type: 'full' | 'incremental';
  description?: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime: number;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    responseTime?: number;
  }>;
  lastCheck: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
  updatedAt: string;
}

export interface MaintenanceMode {
  enabled: boolean;
  message?: string;
  allowedIPs?: string[];
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Servicio de superadmin
export const superadminService = {
  /**
   * Crear backup del sistema
   */
  async createBackup(request: CreateBackupRequest): Promise<SystemBackup> {
    try {
      const response = await apiService.post(
        '/admin/system/backup',
        request
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando backup del sistema:', error);
      throw error;
    }
  },

  /**
   * Obtener backups del sistema
   */
  async getBackups(): Promise<SystemBackup[]> {
    try {
      const response = await apiService.get(
        '/admin/system/backup'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo backups del sistema:', error);
      throw error;
    }
  },

  /**
   * Restaurar backup del sistema
   */
  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post(
        `/admin/system/backup/${backupId}/restore`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error restaurando backup del sistema:', error);
      throw error;
    }
  },

  /**
   * Eliminar backup del sistema
   */
  async deleteBackup(backupId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        `/admin/system/backup/${backupId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando backup del sistema:', error);
      throw error;
    }
  },

  /**
   * Obtener logs del sistema
   */
  async getSystemLogs(filters: {
    level?: string;
    source?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    logs: SystemLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.level) {
        params.append('level', filters.level);
      }
      
      if (filters.source) {
        params.append('source', filters.source);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/system/logs?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo logs del sistema:', error);
      throw error;
    }
  },

  /**
   * Obtener estado de salud del sistema
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await apiService.get(
        '/admin/system/health'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estado de salud del sistema:', error);
      throw error;
    }
  },

  /**
   * Obtener configuración del sistema
   */
  async getSystemConfig(): Promise<SystemConfig[]> {
    try {
      const response = await apiService.get(
        '/admin/system/config'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo configuración del sistema:', error);
      throw error;
    }
  },

  /**
   * Actualizar configuración del sistema
   */
  async updateSystemConfig(key: string, value: any): Promise<SystemConfig> {
    try {
      const response = await apiService.put(
        `/admin/system/config/${key}`,
        { value }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error actualizando configuración del sistema:', error);
      throw error;
    }
  },

  /**
   * Obtener modo de mantenimiento
   */
  async getMaintenanceMode(): Promise<MaintenanceMode> {
    try {
      const response = await apiService.get(
        '/admin/system/maintenance'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo modo de mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Activar modo de mantenimiento
   */
  async enableMaintenanceMode(data: {
    message?: string;
    allowedIPs?: string[];
    scheduledEnd?: string;
  } = {}): Promise<MaintenanceMode> {
    try {
      const response = await apiService.post(
        '/admin/system/maintenance/enable',
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error activando modo de mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Desactivar modo de mantenimiento
   */
  async disableMaintenanceMode(): Promise<MaintenanceMode> {
    try {
      const response = await apiService.post(
        '/admin/system/maintenance/disable'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error desactivando modo de mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Obtener logs de auditoría
   */
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    logs: AuditLog[];
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
      
      if (filters.action) {
        params.append('action', filters.action);
      }
      
      if (filters.resource) {
        params.append('resource', filters.resource);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/system/audit?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error);
      throw error;
    }
  },

  /**
   * Limpiar logs antiguos
   */
  async cleanupOldLogs(daysToKeep: number = 30): Promise<{
    success: boolean;
    deletedCount: number;
  }> {
    try {
      const response = await apiService.post(
        '/admin/system/logs/cleanup',
        { daysToKeep }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error limpiando logs antiguos:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del sistema
   */
  async getSystemStats(): Promise<{
    users: {
      total: number;
      active: number;
      newThisMonth: number;
    };
    events: {
      total: number;
      active: number;
      completed: number;
    };
    requests: {
      total: number;
      pending: number;
      completed: number;
    };
    system: {
      uptime: number;
      memoryUsage: number;
      cpuUsage: number;
      diskUsage: number;
    };
  }> {
    try {
      const response = await apiService.get(
        '/admin/system/stats'
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas del sistema:', error);
      throw error;
    }
  }
}; 