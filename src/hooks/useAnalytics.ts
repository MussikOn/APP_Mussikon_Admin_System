// Hook personalizado para Analytics - MussikOn Admin System
// Este hook maneja el estado y la lógica de analytics

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import type {
  AnalyticsFilters,
  DashboardAnalytics,
  EventAnalytics,
  RequestAnalytics,
  UserAnalytics,
  PlatformAnalytics,
  TrendsData,
  LocationPerformance,
  TopUser
} from '../services/analyticsService';

interface UseAnalyticsReturn {
  // Estado de carga
  loading: boolean;
  error: string | null;
  
  // Estado de conexión
  hasConnectionErrors: boolean;
  hasAnyData: boolean;
  
  // Estado de datos mock
  usingMockData: {
    dashboard: boolean;
    events: boolean;
    requests: boolean;
    users: boolean;
    platform: boolean;
  };
  
  // Datos de analytics
  dashboard: DashboardAnalytics | null;
  eventAnalytics: EventAnalytics | null;
  requestAnalytics: RequestAnalytics | null;
  userAnalytics: UserAnalytics | null;
  platformAnalytics: PlatformAnalytics | null;
  trends: TrendsData | null;
  locationPerformance: LocationPerformance[] | null;
  topUsers: TopUser[] | null;
  
  // Filtros
  filters: AnalyticsFilters;
  
  // Funciones
  setFilters: (filters: AnalyticsFilters) => void;
  refreshDashboard: () => Promise<void>;
  refreshEventAnalytics: () => Promise<void>;
  refreshRequestAnalytics: () => Promise<void>;
  refreshUserAnalytics: () => Promise<void>;
  refreshPlatformAnalytics: () => Promise<void>;
  refreshTrends: (months?: number) => Promise<void>;
  refreshLocationPerformance: () => Promise<void>;
  refreshTopUsers: (limit?: number) => Promise<void>;
  exportReport: (
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format?: 'csv' | 'json'
  ) => Promise<void>;
  exportAdminReport: (
    type: 'users' | 'events' | 'requests',
    format?: 'csv' | 'json'
  ) => Promise<void>;
  
  // Funciones de admin
  getAdminUserAnalytics: (period: string, groupBy: string) => Promise<any>;
  getAdminEventAnalytics: (period: string, groupBy: string) => Promise<any>;
  getAdminRequestAnalytics: (period: string, groupBy: string) => Promise<any>;
}

export const useAnalytics = (initialFilters: AnalyticsFilters = {}): UseAnalyticsReturn => {
  // Estado de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // CORREGIDO: Estados para manejar conexión y datos
  const [hasConnectionErrors, setHasConnectionErrors] = useState(false);
  const [hasAnyData, setHasAnyData] = useState(false);
  
  // Estado de datos
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [eventAnalytics, setEventAnalytics] = useState<EventAnalytics | null>(null);
  const [requestAnalytics, setRequestAnalytics] = useState<RequestAnalytics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [locationPerformance, setLocationPerformance] = useState<LocationPerformance[] | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[] | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);
  
  // Estado de datos mock (por defecto false ya que no usamos mock data)
  const [usingMockData] = useState({
    dashboard: false,
    events: false,
    requests: false,
    users: false,
    platform: false
  });
  
  // Función helper para manejar errores
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    const errorMessage = error.response?.data?.message || error.message || `Error en ${operation}`;
    setError(errorMessage);
    setHasConnectionErrors(true);
    setLoading(false);
  }, []);
  
  // Función helper para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
    setHasConnectionErrors(false);
  }, []);
  
  // CORREGIDO: Verificar si tenemos algún dato real
  const checkHasAnyData = useCallback(() => {
    const hasData = dashboard || eventAnalytics || requestAnalytics || userAnalytics || 
                   platformAnalytics || trends || locationPerformance || topUsers;
    setHasAnyData(!!hasData);
  }, [dashboard, eventAnalytics, requestAnalytics, userAnalytics, platformAnalytics, trends, locationPerformance, topUsers]);

  // CORREGIDO: Dashboard completo - solo datos reales
  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo dashboard analytics...');
      const data = await analyticsService.getDashboard(filters);
      
      if (data && data.events && data.events.totalEvents > 0) {
        setDashboard(data);
        console.log('✅ Dashboard analytics obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales para el dashboard');
        setDashboard(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar dashboard');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [filters, clearError, handleError]);

  // CORREGIDO: Analytics de eventos - solo datos reales
  const refreshEventAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo analytics de eventos...');
      const data = await analyticsService.getEventAnalytics(filters);
      
      if (data && data.totalEvents > 0) {
        setEventAnalytics(data);
        console.log('✅ Analytics de eventos obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de eventos');
        setEventAnalytics(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar analytics de eventos');
      setEventAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [filters, clearError, handleError]);

  // CORREGIDO: Analytics de solicitudes - solo datos reales
  const refreshRequestAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo analytics de solicitudes...');
      const data = await analyticsService.getRequestAnalytics(filters);
      
      if (data && data.totalRequests > 0) {
        setRequestAnalytics(data);
        console.log('✅ Analytics de solicitudes obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de solicitudes');
        setRequestAnalytics(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar analytics de solicitudes');
      setRequestAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [filters, clearError, handleError]);

  // CORREGIDO: Analytics de usuarios - solo datos reales
  const refreshUserAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo analytics de usuarios...');
      const data = await analyticsService.getUserAnalytics(filters);
      
      if (data && data.totalUsers > 0) {
        setUserAnalytics(data);
        console.log('✅ Analytics de usuarios obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de usuarios');
        setUserAnalytics(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar analytics de usuarios');
      setUserAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [filters, clearError, handleError]);

  // CORREGIDO: Analytics de plataforma - solo datos reales
  const refreshPlatformAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo analytics de plataforma...');
      const data = await analyticsService.getPlatformAnalytics(filters);
      
      if (data && data.totalRevenue > 0) {
        setPlatformAnalytics(data);
        console.log('✅ Analytics de plataforma obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de plataforma');
        setPlatformAnalytics(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar analytics de plataforma');
      setPlatformAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [filters, clearError, handleError]);

  // CORREGIDO: Reportes de tendencias - solo datos reales
  const refreshTrends = useCallback(async (months: number = 6) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo reportes de tendencias...');
      const data = await analyticsService.getTrendsReport(months);
      
      if (data && data.eventTrends && data.eventTrends.length > 0) {
        setTrends(data);
        console.log('✅ Reportes de tendencias obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de tendencias');
        setTrends(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar reportes de tendencias');
      setTrends(null);
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  // CORREGIDO: Reportes de rendimiento por ubicación - solo datos reales
  const refreshLocationPerformance = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo rendimiento por ubicación...');
      const data = await analyticsService.getLocationPerformance();
      
      if (data && data.length > 0) {
        setLocationPerformance(data);
        console.log('✅ Rendimiento por ubicación obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de rendimiento por ubicación');
        setLocationPerformance(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar rendimiento por ubicación');
      setLocationPerformance(null);
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  // CORREGIDO: Reportes de usuarios más activos - solo datos reales
  const refreshTopUsers = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('📊 Obteniendo usuarios más activos...');
      const data = await analyticsService.getTopUsers(limit);
      
      if (data && data.length > 0) {
        setTopUsers(data);
        console.log('✅ Usuarios más activos obtenido:', data);
      } else {
        console.log('⚠️ No hay datos reales de usuarios activos');
        setTopUsers(null);
      }
      
    } catch (error) {
      handleError(error, 'cargar usuarios más activos');
      setTopUsers(null);
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);
  
  // CORREGIDO: Exportación de reportes
  const exportReport = useCallback(async (
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format: 'csv' | 'json' = 'csv'
  ) => {
    try {
      setLoading(true);
      clearError();
      
      console.log(`📊 Exportando reporte ${type}...`);
      const blob = await analyticsService.exportReport(type, format, filters);
      
      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Reporte exportado exitosamente');
    } catch (error) {
      handleError(error, 'exportar reporte');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // CORREGIDO: Exportación de reportes de admin
  const exportAdminReport = useCallback(async (
    type: 'users' | 'events' | 'requests',
    format: 'csv' | 'json' = 'csv'
  ) => {
    try {
      setLoading(true);
      clearError();
      
      console.log(`📊 Exportando reporte admin ${type}...`);
      const blob = await analyticsService.exportAdminReport(type, format, filters);
      
      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin_${type}_report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Reporte admin exportado exitosamente');
    } catch (error) {
      handleError(error, 'exportar reporte de admin');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // CORREGIDO: Funciones de admin
  const getAdminUserAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      console.log('📊 Obteniendo analytics de usuarios admin...');
      const data = await analyticsService.getAdminUserAnalytics(period, groupBy);
      console.log('✅ Analytics de usuarios admin obtenido:', data);
      return data;
    } catch (error) {
      handleError(error, 'cargar analytics de usuarios admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  const getAdminEventAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      console.log('📊 Obteniendo analytics de eventos admin...');
      const data = await analyticsService.getAdminEventAnalytics(period, groupBy);
      console.log('✅ Analytics de eventos admin obtenido:', data);
      return data;
    } catch (error) {
      handleError(error, 'cargar analytics de eventos admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  const getAdminRequestAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      console.log('📊 Obteniendo analytics de solicitudes admin...');
      const data = await analyticsService.getAdminRequestAnalytics(period, groupBy);
      console.log('✅ Analytics de solicitudes admin obtenido:', data);
      return data;
    } catch (error) {
      handleError(error, 'cargar analytics de solicitudes admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  // Actualizar filtros
  const updateFilters = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // CORREGIDO: Verificar datos cuando cambian
  useEffect(() => {
    checkHasAnyData();
  }, [checkHasAnyData]);
  
  // Cargar datos iniciales
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);
  
  return {
    // Estado
    loading,
    error,
    
    // CORREGIDO: Estados de conexión
    hasConnectionErrors,
    hasAnyData,
    
    // Estado de datos mock
    usingMockData,
    
    // Datos
    dashboard,
    eventAnalytics,
    requestAnalytics,
    userAnalytics,
    platformAnalytics,
    trends,
    locationPerformance,
    topUsers,
    
    // Filtros
    filters,
    
    // Funciones
    setFilters: updateFilters,
    refreshDashboard,
    refreshEventAnalytics,
    refreshRequestAnalytics,
    refreshUserAnalytics,
    refreshPlatformAnalytics,
    refreshTrends,
    refreshLocationPerformance,
    refreshTopUsers,
    exportReport,
    exportAdminReport,
    
    // Funciones de admin
    getAdminUserAnalytics,
    getAdminEventAnalytics,
    getAdminRequestAnalytics
  };
};

export default useAnalytics; 