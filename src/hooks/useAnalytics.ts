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
  
  // Función helper para manejar errores
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    const errorMessage = error.response?.data?.message || error.message || `Error en ${operation}`;
    setError(errorMessage);
    setLoading(false);
  }, []);
  
  // Función helper para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Dashboard completo
  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getDashboard(filters);
      setDashboard(data);
    } catch (error) {
      handleError(error, 'cargar dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Analytics de eventos
  const refreshEventAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getEventAnalytics(filters);
      setEventAnalytics(data);
    } catch (error) {
      handleError(error, 'cargar analytics de eventos');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Analytics de solicitudes
  const refreshRequestAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getRequestAnalytics(filters);
      setRequestAnalytics(data);
    } catch (error) {
      handleError(error, 'cargar analytics de solicitudes');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Analytics de usuarios
  const refreshUserAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getUserAnalytics(filters);
      setUserAnalytics(data);
    } catch (error) {
      handleError(error, 'cargar analytics de usuarios');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Analytics de plataforma
  const refreshPlatformAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getPlatformAnalytics(filters);
      setPlatformAnalytics(data);
    } catch (error) {
      handleError(error, 'cargar analytics de plataforma');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Reportes de tendencias
  const refreshTrends = useCallback(async (months: number = 6) => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getTrendsReport(months);
      setTrends(data);
    } catch (error) {
      handleError(error, 'cargar reporte de tendencias');
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);
  
  // Rendimiento por ubicación
  const refreshLocationPerformance = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getLocationPerformance();
      setLocationPerformance(data);
    } catch (error) {
      handleError(error, 'cargar rendimiento por ubicación');
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);
  
  // Usuarios más activos
  const refreshTopUsers = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      clearError();
      const data = await analyticsService.getTopUsers(limit);
      setTopUsers(data);
    } catch (error) {
      handleError(error, 'cargar usuarios más activos');
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);
  
  // Exportación de reportes
  const exportReport = useCallback(async (
    type: 'events' | 'requests' | 'users' | 'platform' | 'trends' | 'location',
    format: 'csv' | 'json' = 'csv'
  ) => {
    try {
      setLoading(true);
      clearError();
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
    } catch (error) {
      handleError(error, 'exportar reporte');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Exportación de reportes de admin
  const exportAdminReport = useCallback(async (
    type: 'users' | 'events' | 'requests',
    format: 'csv' | 'json' = 'csv'
  ) => {
    try {
      setLoading(true);
      clearError();
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
    } catch (error) {
      handleError(error, 'exportar reporte de admin');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, clearError]);
  
  // Funciones de admin
  const getAdminUserAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      return await analyticsService.getAdminUserAnalytics(period, groupBy);
    } catch (error) {
      handleError(error, 'cargar analytics de usuarios admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  const getAdminEventAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      return await analyticsService.getAdminEventAnalytics(period, groupBy);
    } catch (error) {
      handleError(error, 'cargar analytics de eventos admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  const getAdminRequestAnalytics = useCallback(async (period: string, groupBy: string) => {
    try {
      clearError();
      return await analyticsService.getAdminRequestAnalytics(period, groupBy);
    } catch (error) {
      handleError(error, 'cargar analytics de solicitudes admin');
      throw error;
    }
  }, [handleError, clearError]);
  
  // Actualizar filtros
  const updateFilters = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Cargar datos iniciales
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);
  
  return {
    // Estado
    loading,
    error,
    
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