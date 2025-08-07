// Hook para manejo de cuentas bancarias - MussikOn Admin System
// Proporciona funcionalidades para gestionar cuentas bancarias del usuario

import { useState, useEffect, useCallback } from 'react';
import { paymentSystemService } from '../../../services/paymentSystemService';
import type { BankAccount, BankAccountData } from '../../../services/paymentSystemService';

interface UseBankAccountsReturn {
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  refreshBankAccounts: () => Promise<void>;
  registerBankAccount: (data: BankAccountData) => Promise<boolean>;
  isLoading: boolean;
}

interface UseBankAccountRegistrationReturn {
  registering: boolean;
  error: string | null;
  registerBankAccount: (data: BankAccountData) => Promise<boolean>;
  resetError: () => void;
}

/**
 * Hook personalizado para manejar las cuentas bancarias del usuario
 * @returns Objeto con cuentas bancarias, estado de carga, errores y funciones de gestión
 */
export const useBankAccounts = (): UseBankAccountsReturn => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene las cuentas bancarias del usuario
   */
  const fetchBankAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountsData = await paymentSystemService.getMyBankAccounts();
      setBankAccounts(accountsData);
    } catch (err) {
      console.error('Error obteniendo cuentas bancarias:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener las cuentas bancarias');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registra una nueva cuenta bancaria
   */
  const registerBankAccount = useCallback(async (data: BankAccountData): Promise<boolean> => {
    try {
      setError(null);
      
      await paymentSystemService.registerBankAccount(data);
      
      // Refrescar la lista de cuentas después de registrar una nueva
      await fetchBankAccounts();
      
      return true;
    } catch (err) {
      console.error('Error registrando cuenta bancaria:', err);
      setError(err instanceof Error ? err.message : 'Error al registrar la cuenta bancaria');
      return false;
    }
  }, [fetchBankAccounts]);

  /**
   * Función para refrescar las cuentas bancarias manualmente
   */
  const refreshBankAccounts = useCallback(async () => {
    await fetchBankAccounts();
  }, [fetchBankAccounts]);

  // Cargar cuentas bancarias al montar el componente
  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  return {
    bankAccounts,
    loading,
    error,
    refreshBankAccounts,
    registerBankAccount,
    isLoading: loading
  };
};

/**
 * Hook específico para registrar cuentas bancarias
 * @returns Objeto con estado de carga, errores y función de registro
 */
export const useBankAccountRegistration = (): UseBankAccountRegistrationReturn => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registra una nueva cuenta bancaria
   */
  const registerBankAccount = useCallback(async (data: BankAccountData): Promise<boolean> => {
    try {
      setRegistering(true);
      setError(null);
      
      await paymentSystemService.registerBankAccount(data);
      
      return true;
    } catch (err) {
      console.error('Error registrando cuenta bancaria:', err);
      setError(err instanceof Error ? err.message : 'Error al registrar la cuenta bancaria');
      return false;
    } finally {
      setRegistering(false);
    }
  }, []);

  /**
   * Resetea el error
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    registering,
    error,
    registerBankAccount,
    resetError
  };
};

/**
 * Hook para obtener la cuenta bancaria por defecto
 * @returns Cuenta bancaria por defecto o null si no existe
 */
export const useDefaultBankAccount = (): BankAccount | null => {
  const { bankAccounts } = useBankAccounts();
  
  return bankAccounts.find(account => account.isDefault) || null;
};

/**
 * Hook para obtener cuentas bancarias verificadas
 * @returns Array de cuentas bancarias verificadas
 */
export const useVerifiedBankAccounts = (): BankAccount[] => {
  const { bankAccounts } = useBankAccounts();
  
  return bankAccounts.filter(account => account.isVerified);
};

/**
 * Hook para obtener cuentas bancarias no verificadas
 * @returns Array de cuentas bancarias no verificadas
 */
export const useUnverifiedBankAccounts = (): BankAccount[] => {
  const { bankAccounts } = useBankAccounts();
  
  return bankAccounts.filter(account => !account.isVerified);
};

/**
 * Hook para verificar si el usuario tiene cuentas bancarias
 * @returns true si tiene al menos una cuenta bancaria, false en caso contrario
 */
export const useHasBankAccounts = (): boolean => {
  const { bankAccounts } = useBankAccounts();
  
  return bankAccounts.length > 0;
};

/**
 * Hook para verificar si el usuario tiene cuentas bancarias verificadas
 * @returns true si tiene al menos una cuenta bancaria verificada, false en caso contrario
 */
export const useHasVerifiedBankAccounts = (): boolean => {
  const verifiedAccounts = useVerifiedBankAccounts();
  
  return verifiedAccounts.length > 0;
};

/**
 * Hook para obtener estadísticas de cuentas bancarias
 * @returns Objeto con estadísticas de cuentas bancarias
 */
export const useBankAccountsStats = () => {
  const { bankAccounts } = useBankAccounts();
  
  const stats = {
    total: bankAccounts.length,
    verified: bankAccounts.filter(account => account.isVerified).length,
    unverified: bankAccounts.filter(account => !account.isVerified).length,
    hasDefault: bankAccounts.some(account => account.isDefault),
    savingsAccounts: bankAccounts.filter(account => account.accountType === 'savings').length,
    checkingAccounts: bankAccounts.filter(account => account.accountType === 'checking').length
  };

  return stats;
}; 