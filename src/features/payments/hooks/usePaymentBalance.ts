// Hook para manejo del balance de pagos - MussikOn Admin System
// Proporciona funcionalidades para obtener y gestionar el balance del usuario

import { useState, useEffect, useCallback } from 'react';
import { paymentSystemService } from '../../../services/paymentSystemService';
import type { UserBalance } from '../../../services/paymentSystemService';

interface UsePaymentBalanceReturn {
  balance: UserBalance | null;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook personalizado para manejar el balance de pagos del usuario
 * @returns Objeto con balance, estado de carga, errores y función de actualización
 */
export const usePaymentBalance = (): UsePaymentBalanceReturn => {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene el balance actual del usuario
   */
  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const balanceData = await paymentSystemService.getMyBalance();
      setBalance(balanceData);
    } catch (err) {
      console.error('Error obteniendo balance:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener el balance');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para refrescar el balance manualmente
   */
  const refreshBalance = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  // Cargar balance al montar el componente
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refreshBalance,
    isLoading: loading
  };
};

/**
 * Hook para obtener solo el balance sin estado de carga
 * Útil para componentes que solo necesitan el valor actual
 */
export const useBalanceValue = (): UserBalance | null => {
  const { balance } = usePaymentBalance();
  return balance;
};

/**
 * Hook para verificar si el usuario tiene fondos suficientes
 * @param requiredAmount - Cantidad requerida
 * @returns true si tiene fondos suficientes, false en caso contrario
 */
export const useHasSufficientFunds = (requiredAmount: number): boolean => {
  const { balance } = usePaymentBalance();
  
  if (!balance) return false;
  
  // Validar que el balance sea un número válido
  if (balance.currentBalance === undefined || balance.currentBalance === null || isNaN(balance.currentBalance)) {
    return false;
  }
  
  return balance.currentBalance >= requiredAmount;
};

/**
 * Hook para obtener el balance formateado como string
 * @returns Balance formateado con moneda
 */
export const useFormattedBalance = (): string => {
  const { balance } = usePaymentBalance();
  
  if (!balance) return '$0.00';
  
  // Validar que el balance sea un número válido
  if (balance.currentBalance === undefined || balance.currentBalance === null || isNaN(balance.currentBalance)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: balance.currency || 'USD',
    minimumFractionDigits: 2
  }).format(balance.currentBalance);
}; 