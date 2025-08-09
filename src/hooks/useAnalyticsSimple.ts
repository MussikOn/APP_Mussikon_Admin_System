import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { SystemStats } from '../services/analyticsService';

interface UseAnalyticsSimpleReturn {
  // Estado de carga
  loading: boolean;
  error: string | null;
  
  // Datos
  systemStats: SystemStats | null;
  
  // Funciones
  refreshData: () => Promise<void>;
}

export const useAnalyticsSimple = (): UseAnalyticsSimpleReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await analyticsService.getSystemStats();
      setSystemStats(stats);
      
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Error al cargar los datos de analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    loading,
    error,
    systemStats,
    refreshData
  };
};
