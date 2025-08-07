// Hook para manejo de depósitos - MussikOn Admin System
// Proporciona funcionalidades para gestionar depósitos del usuario

import { useState, useEffect, useCallback } from 'react';
import { paymentSystemService } from '../../../services/paymentSystemService';

interface UseDepositsReturn {
  deposits: any[];
  loading: boolean;
  error: string | null;
  refreshDeposits: () => Promise<void>;
  uploadDeposit: (formData: FormData) => Promise<boolean>;
  isLoading: boolean;
}

interface UseDepositUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadDeposit: (formData: FormData) => Promise<boolean>;
  resetError: () => void;
}

/**
 * Hook personalizado para manejar los depósitos del usuario
 * @returns Objeto con depósitos, estado de carga, errores y funciones de gestión
 */
export const useDeposits = (): UseDepositsReturn => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene el historial de depósitos del usuario
   */
  const fetchDeposits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const depositsData = await paymentSystemService.getMyDeposits();
      setDeposits(depositsData);
    } catch (err) {
      console.error('Error obteniendo depósitos:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener los depósitos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sube un nuevo depósito
   */
  const uploadDeposit = useCallback(async (formData: FormData): Promise<boolean> => {
    try {
      setError(null);
      
      await paymentSystemService.uploadDeposit(formData);
      
      // Refrescar la lista de depósitos después de subir uno nuevo
      await fetchDeposits();
      
      return true;
    } catch (err) {
      console.error('Error subiendo depósito:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el depósito');
      return false;
    }
  }, [fetchDeposits]);

  /**
   * Función para refrescar los depósitos manualmente
   */
  const refreshDeposits = useCallback(async () => {
    await fetchDeposits();
  }, [fetchDeposits]);

  // Cargar depósitos al montar el componente
  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return {
    deposits,
    loading,
    error,
    refreshDeposits,
    uploadDeposit,
    isLoading: loading
  };
};

/**
 * Hook específico para subir depósitos
 * @returns Objeto con estado de carga, errores y función de subida
 */
export const useDepositUpload = (): UseDepositUploadReturn => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sube un nuevo depósito
   */
  const uploadDeposit = useCallback(async (formData: FormData): Promise<boolean> => {
    try {
      setUploading(true);
      setError(null);
      
      await paymentSystemService.uploadDeposit(formData);
      
      return true;
    } catch (err) {
      console.error('Error subiendo depósito:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el depósito');
      return false;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Resetea el error
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploading,
    error,
    uploadDeposit,
    resetError
  };
};

/**
 * Hook para obtener depósitos filtrados por estado
 * @param status - Estado de los depósitos a filtrar
 * @returns Array de depósitos filtrados
 */
export const useDepositsByStatus = (status: string): any[] => {
  const { deposits } = useDeposits();
  
  return deposits.filter(deposit => deposit.status === status);
};

/**
 * Hook para obtener depósitos pendientes
 * @returns Array de depósitos pendientes
 */
export const usePendingDeposits = (): any[] => {
  return useDepositsByStatus('pending');
};

/**
 * Hook para obtener depósitos verificados
 * @returns Array de depósitos verificados
 */
export const useVerifiedDeposits = (): any[] => {
  return useDepositsByStatus('verified');
};

/**
 * Hook para obtener depósitos rechazados
 * @returns Array de depósitos rechazados
 */
export const useRejectedDeposits = (): any[] => {
  return useDepositsByStatus('rejected');
};

/**
 * Hook para obtener estadísticas de depósitos
 * @returns Objeto con estadísticas de depósitos
 */
export const useDepositsStats = () => {
  const { deposits } = useDeposits();
  
  const stats = {
    total: deposits.length,
    pending: deposits.filter(d => d.status === 'pending').length,
    verified: deposits.filter(d => d.status === 'verified').length,
    rejected: deposits.filter(d => d.status === 'rejected').length,
    totalAmount: deposits.reduce((sum, d) => sum + (d.amount || 0), 0),
    verifiedAmount: deposits
      .filter(d => d.status === 'verified')
      .reduce((sum, d) => sum + (d.amount || 0), 0),
    averageAmount: deposits.length > 0 
      ? deposits.reduce((sum, d) => sum + (d.amount || 0), 0) / deposits.length 
      : 0
  };

  return stats;
}; 