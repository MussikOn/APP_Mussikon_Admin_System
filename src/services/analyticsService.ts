import * as httpClient from './httpClient';

// Interfaces para tipos de datos de analytics
export interface SystemStats {
  users: {
    total: number;
    byRole: Record<string, number>;
    change: number;
  };
  events: {
    total: number;
    byStatus: Record<string, number>;
    change: number;
  };
  requests: {
    total: number;
    byStatus: Record<string, number>;
    change: number;
  };
  images: {
    total: number;
    totalSize: number;
    change: number;
  };
  chat: {
    conversations: number;
    messages: number;
  };
  system: {
    timestamp: string;
    uptime: number;
    memory: any;
  };
}

export interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

class AnalyticsService {
  private baseUrl = '/analytics';

  /**
   * Obtener estadísticas generales del sistema
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats/public`) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }

  /**
   * Generar datos de distribución de usuarios por rol
   */
  generateUserRoleDistribution(usersByRole: Record<string, number>): ChartData[] {
    const roleColors = {
      admin: '#00fff7',
      superadmin: '#ff2eec',
      eventCreator: '#b993d6',
      organizador: '#b993d6',
      musician: '#7f5fff',
      musico: '#7f5fff'
    };

    const roleLabels = {
      admin: 'Administradores',
      superadmin: 'Super Administradores',
      eventCreator: 'Creadores de Eventos',
      organizador: 'Organizadores',
      musician: 'Músicos',
      musico: 'Músicos'
    };

    return Object.entries(usersByRole).map(([role, count]) => ({
      label: roleLabels[role as keyof typeof roleLabels] || role,
      value: count,
      color: roleColors[role as keyof typeof roleColors] || '#7f5fff'
    }));
  }

  /**
   * Generar datos de estado de eventos
   */
  generateEventStatusData(eventsByStatus: Record<string, number>): ChartData[] {
    const statusColors = {
      active: '#00e676',
      activo: '#00e676',
      completed: '#4caf50',
      completado: '#4caf50',
      cancelled: '#f44336',
      cancelado: '#f44336',
      pending: '#ff9800',
      pendiente: '#ff9800'
    };

    const statusLabels = {
      active: 'Activos',
      activo: 'Activos',
      completed: 'Completados',
      completado: 'Completados',
      cancelled: 'Cancelados',
      cancelado: 'Cancelados',
      pending: 'Pendientes',
      pendiente: 'Pendientes'
    };

    return Object.entries(eventsByStatus).map(([status, count]) => ({
      label: statusLabels[status as keyof typeof statusLabels] || status,
      value: count,
      color: statusColors[status as keyof typeof statusColors] || '#7f5fff'
    }));
  }

  /**
   * Calcular métricas de rendimiento
   */
  calculatePerformanceMetrics(stats: SystemStats, performance: any): {
    systemHealth: number;
    dataGrowth: number;
    userActivity: number;
    eventSuccess: number;
  } {
    // Calcular salud del sistema basada en memoria y uptime
    const memoryUsage = performance.memory?.heapUsed ? performance.memory.heapUsed / performance.memory.heapTotal : 0.5;
    const systemHealth = Math.max(0, 100 - (memoryUsage * 100));

    // Calcular crecimiento de datos
    const totalGrowth = (stats.users.change + stats.events.change + stats.images.change) / 3;
    const dataGrowth = Math.max(0, Math.min(100, totalGrowth));

    // Calcular actividad de usuarios
    const totalActivity = stats.users.total + stats.events.total + stats.requests.total;
    const userActivity = Math.min(100, (totalActivity / 100) * 10); // Escalar a 0-100

    // Calcular éxito de eventos
    const activeEvents = stats.events.byStatus.active || stats.events.byStatus.activo || 0;
    const completedEvents = stats.events.byStatus.completed || stats.events.byStatus.completado || 0;
    const totalEvents = stats.events.total;
    const eventSuccess = totalEvents > 0 ? ((activeEvents + completedEvents) / totalEvents) * 100 : 0;

    return {
      systemHealth: Math.round(systemHealth),
      dataGrowth: Math.round(dataGrowth),
      userActivity: Math.round(userActivity),
      eventSuccess: Math.round(eventSuccess)
    };
  }
}

export const analyticsService = new AnalyticsService();