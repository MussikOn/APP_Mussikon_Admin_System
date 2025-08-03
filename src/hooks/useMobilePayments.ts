// Hook para gestión de pagos móviles - MussikOn Admin System
// Conectado con el backend de MussikOn Express

import { useState, useEffect, useCallback } from 'react';
import { mobilePaymentsService, type MobilePayment, type MobilePaymentStats, type VerifyPaymentRequest, type RejectPaymentRequest } from '../services/mobilePaymentsService';

interface UseMobilePaymentsReturn {
  // Datos
  payments: MobilePayment[];
  stats: MobilePaymentStats | null;
  
  // Estados de carga
  loading: boolean;
  statsLoading: boolean;
  verifyLoading: boolean;
  rejectLoading: boolean;
  
  // Estados de error
  error: string | null;
  statsError: string | null;
  verifyError: string | null;
  rejectError: string | null;
  
  // Funciones
  loadPayments: (params?: { status?: string; limit?: number; offset?: number }) => Promise<void>;
  loadStats: (params?: { period?: '7d' | '30d' | '90d' }) => Promise<void>;
  verifyPayment: (paymentId: string, data: VerifyPaymentRequest) => Promise<boolean>;
  rejectPayment: (paymentId: string, data: RejectPaymentRequest) => Promise<boolean>;
  
  // Utilidades
  refreshData: () => Promise<void>;
  clearErrors: () => void;
}

export const useMobilePayments = (): UseMobilePaymentsReturn => {
  // Estados de datos
  const [payments, setPayments] = useState<MobilePayment[]>([]);
  const [stats, setStats] = useState<MobilePaymentStats | null>(null);
  
  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  
  // Estados de error
  const [error, setError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Cargar depósitos pendientes
  const loadPayments = useCallback(async (params?: { status?: string; limit?: number; offset?: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await mobilePaymentsService.getMobilePayments(params);
      setPayments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando depósitos pendientes';
      setError(errorMessage);
      console.error('Error en loadPayments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async (params?: { period?: '7d' | '30d' | '90d' }) => {
    setStatsLoading(true);
    setStatsError(null);
    
    try {
      const data = await mobilePaymentsService.getMobilePaymentStats(params);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando estadísticas';
      setStatsError(errorMessage);
      console.error('Error en loadStats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Verificar depósito
  const verifyPayment = useCallback(async (paymentId: string, data: VerifyPaymentRequest): Promise<boolean> => {
    setVerifyLoading(true);
    setVerifyError(null);
    
    try {
      await mobilePaymentsService.verifyMobilePayment(paymentId, data);
      
      // Actualizar el depósito en la lista local
              setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { 
                ...payment, 
                status: data.approved ? 'approved' : 'rejected',
                verifiedAt: new Date().toISOString(),
                verificationNotes: data.notes,
                verifiedBy: 'current_admin', // Esto debería venir del contexto de autenticación
                verificationData: data.verificationData ? {
                  ...data.verificationData,
                  verifiedBy: 'current_admin'
                } : undefined
              }
            : payment
        ));
      
      // Recargar estadísticas
      await loadStats();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando depósito';
      setVerifyError(errorMessage);
      console.error('Error en verifyPayment:', err);
      return false;
    } finally {
      setVerifyLoading(false);
    }
  }, [loadStats]);

  // Rechazar depósito
  const rejectPayment = useCallback(async (paymentId: string, data: RejectPaymentRequest): Promise<boolean> => {
    setRejectLoading(true);
    setRejectError(null);
    
    try {
      await mobilePaymentsService.rejectMobilePayment(paymentId, data);
      
      // Actualizar el depósito en la lista local
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'rejected',
              rejectedAt: new Date().toISOString(),
              rejectionReason: data.notes,
              rejectedBy: 'current_admin', // Esto debería venir del contexto de autenticación
              rejectionNotes: data.notes
            }
          : payment
      ));
      
      // Recargar estadísticas
      await loadStats();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error rechazando depósito';
      setRejectError(errorMessage);
      console.error('Error en rejectPayment:', err);
      return false;
    } finally {
      setRejectLoading(false);
    }
  }, [loadStats]);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadPayments(),
      loadStats()
    ]);
  }, [loadPayments, loadStats]);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setError(null);
    setStatsError(null);
    setVerifyError(null);
    setRejectError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Datos
    payments,
    stats,
    
    // Estados de carga
    loading,
    statsLoading,
    verifyLoading,
    rejectLoading,
    
    // Estados de error
    error,
    statsError,
    verifyError,
    rejectError,
    
    // Funciones
    loadPayments,
    loadStats,
    verifyPayment,
    rejectPayment,
    
    // Utilidades
    refreshData,
    clearErrors,
  };
}; 