// Hook personalizado para Sistema de Pagos Móviles - MussikOn Admin System
// Maneja toda la lógica de estado y operaciones de pagos móviles

import { useState, useEffect, useCallback } from 'react';
import { mobilePaymentsService } from '../services/mobilePaymentsService';
import type { 
  MobileDeposit, 
  MobileWithdrawal, 
  MobilePaymentStats,
  BankAccount,
  CreateDepositRequest,
  CreateWithdrawalRequest,
  VerifyDepositRequest,
  ProcessWithdrawalRequest
} from '../services/mobilePaymentsService';

interface UseMobilePaymentsReturn {
  // Estado
  deposits: MobileDeposit[];
  withdrawals: MobileWithdrawal[];
  bankAccounts: BankAccount[];
  stats: MobilePaymentStats;
  userBalance: { balance: number; currency: string };
  loading: boolean;
  error: string | null;
  
  // Operaciones de depósitos
  createDeposit: (data: CreateDepositRequest) => Promise<MobileDeposit>;
  verifyDeposit: (depositId: string, data: VerifyDepositRequest) => Promise<void>;
  approveDeposit: (depositId: string, notes?: string) => Promise<void>;
  rejectDeposit: (depositId: string, reason: string) => Promise<void>;
  reportDeposit: (depositId: string, reason: string) => Promise<void>;
  checkDuplicateVoucher: (depositId: string) => Promise<{ isDuplicate: boolean; duplicateIds: string[]; similarityScore: number; matchedDeposits: MobileDeposit[] }>;
  
  // Operaciones de retiros
  createWithdrawal: (data: CreateWithdrawalRequest) => Promise<MobileWithdrawal>;
  processWithdrawal: (withdrawalId: string, data: ProcessWithdrawalRequest) => Promise<void>;
  
  // Operaciones de cuentas bancarias
  registerBankAccount: (bankData: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    accountType: 'savings' | 'checking';
    routingNumber?: string;
  }) => Promise<BankAccount>;
  
  // Operaciones de balance
  refreshBalance: () => Promise<void>;
  
  // Operaciones de vouchers
  getVoucherImageUrl: (depositId: string) => Promise<string | null>;
  getVoucherPresignedUrl: (depositId: string) => Promise<string | null>;
  downloadVoucher: (depositId: string) => Promise<Blob>;
  
  // Operaciones de detección de fraude
  flagSuspiciousDeposit: (depositId: string, reason: string) => Promise<void>;
  
  // Utilidades
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useMobilePayments = (): UseMobilePaymentsReturn => {
  // Estado principal
  const [deposits, setDeposits] = useState<MobileDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<MobileWithdrawal[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [stats, setStats] = useState<MobilePaymentStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalCommissions: 0,
    pendingDepositsCount: 0,
    pendingWithdrawalsCount: 0,
    totalUsers: 0,
    totalMusicians: 0,
    totalEvents: 0,
    fraudDetection: {
      duplicatesDetected: 0,
      suspiciousActivity: 0,
      totalRejected: 0
    },
    dailyStats: [],
    lastUpdated: new Date().toISOString()
  });
  const [userBalance, setUserBalance] = useState<{ balance: number; currency: string }>({
    balance: 0,
    currency: 'DOP'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [depositsData, withdrawalsData, bankAccountsData, statsData, balanceData] = await Promise.all([
        mobilePaymentsService.getMyDeposits(),
        mobilePaymentsService.getMyWithdrawals(),
        mobilePaymentsService.getMyBankAccounts(),
        mobilePaymentsService.getPaymentSystemStats(),
        mobilePaymentsService.getMyBalance()
      ]);

      setDeposits(depositsData || []);
      setWithdrawals(withdrawalsData || []);
      setBankAccounts(bankAccountsData || []);
      setStats(statsData);
      setUserBalance(balanceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos';
      setError(errorMessage);
      console.error('[useMobilePayments] Error cargando datos:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Operaciones de depósitos
  const createDeposit = useCallback(async (data: CreateDepositRequest): Promise<MobileDeposit> => {
    try {
      setError(null);
      const newDeposit = await mobilePaymentsService.createDeposit(data);
      
      // Actualizar estado local
      setDeposits(prev => [newDeposit, ...prev]);
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
      
      // Actualizar balance
      const updatedBalance = await mobilePaymentsService.getMyBalance();
      setUserBalance(updatedBalance);
      
      return newDeposit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando depósito';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const verifyDeposit = useCallback(async (depositId: string, data: VerifyDepositRequest): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.verifyDeposit(depositId, data);
      
      // Actualizar estado local
      setDeposits(prev => prev.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, status: data.approved ? 'verified' : 'rejected' }
          : deposit
      ));
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando depósito';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const approveDeposit = useCallback(async (depositId: string, notes?: string): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.approveDeposit(depositId, notes);
      
      // Actualizar estado local
      setDeposits(prev => prev.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, status: 'verified' }
          : deposit
      ));
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error aprobando depósito';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const rejectDeposit = useCallback(async (depositId: string, reason: string): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.rejectDeposit(depositId, reason);
      
      // Actualizar estado local
      setDeposits(prev => prev.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, status: 'rejected', rejectionReason: reason }
          : deposit
      ));
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error rechazando depósito';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const reportDeposit = useCallback(async (depositId: string, reason: string): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.reportDeposit(depositId, reason);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error reportando depósito';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const checkDuplicateVoucher = useCallback(async (depositId: string) => {
    try {
      setError(null);
      return await mobilePaymentsService.checkDuplicateVoucher(depositId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando duplicados';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Operaciones de retiros
  const createWithdrawal = useCallback(async (data: CreateWithdrawalRequest): Promise<MobileWithdrawal> => {
    try {
      setError(null);
      const newWithdrawal = await mobilePaymentsService.createWithdrawal(data);
      
      // Actualizar estado local
      setWithdrawals(prev => [newWithdrawal, ...prev]);
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
      
      // Actualizar balance
      const updatedBalance = await mobilePaymentsService.getMyBalance();
      setUserBalance(updatedBalance);
      
      return newWithdrawal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando retiro';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const processWithdrawal = useCallback(async (withdrawalId: string, data: ProcessWithdrawalRequest): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.processWithdrawal(withdrawalId, data);
      
      // Actualizar estado local
      setWithdrawals(prev => prev.map(withdrawal => 
        withdrawal.id === withdrawalId 
          ? { ...withdrawal, status: data.approved ? 'completed' : 'rejected' }
          : withdrawal
      ));
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error procesando retiro';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Operaciones de cuentas bancarias
  const registerBankAccount = useCallback(async (bankData: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    accountType: 'savings' | 'checking';
    routingNumber?: string;
  }): Promise<BankAccount> => {
    try {
      setError(null);
      const newBankAccount = await mobilePaymentsService.registerBankAccount(bankData);
      
      // Actualizar estado local
      setBankAccounts(prev => [...prev, newBankAccount]);
      
      return newBankAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error registrando cuenta bancaria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Operaciones de balance
  const refreshBalance = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const updatedBalance = await mobilePaymentsService.getMyBalance();
      setUserBalance(updatedBalance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando balance';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Operaciones de vouchers
  const getVoucherImageUrl = useCallback(async (depositId: string): Promise<string | null> => {
    try {
      setError(null);
      return await mobilePaymentsService.getVoucherImageUrl(depositId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo imagen de voucher';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getVoucherPresignedUrl = useCallback(async (depositId: string): Promise<string | null> => {
    try {
      setError(null);
      return await mobilePaymentsService.getVoucherPresignedUrl(depositId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo URL firmada';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const downloadVoucher = useCallback(async (depositId: string): Promise<Blob> => {
    try {
      setError(null);
      return await mobilePaymentsService.downloadVoucher(depositId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error descargando voucher';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Operaciones de detección de fraude
  const flagSuspiciousDeposit = useCallback(async (depositId: string, reason: string): Promise<void> => {
    try {
      setError(null);
      await mobilePaymentsService.flagSuspiciousDeposit(depositId, reason);
      
      // Actualizar estadísticas
      const updatedStats = await mobilePaymentsService.getPaymentSystemStats();
      setStats(updatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error marcando depósito como sospechoso';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Utilidades
  const refreshData = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    // Estado
    deposits,
    withdrawals,
    bankAccounts,
    stats,
    userBalance,
    loading,
    error,
    
    // Operaciones de depósitos
    createDeposit,
    verifyDeposit,
    approveDeposit,
    rejectDeposit,
    reportDeposit,
    checkDuplicateVoucher,
    
    // Operaciones de retiros
    createWithdrawal,
    processWithdrawal,
    
    // Operaciones de cuentas bancarias
    registerBankAccount,
    
    // Operaciones de balance
    refreshBalance,
    
    // Operaciones de vouchers
    getVoucherImageUrl,
    getVoucherPresignedUrl,
    downloadVoucher,
    
    // Operaciones de detección de fraude
    flagSuspiciousDeposit,
    
    // Utilidades
    refreshData,
    clearError,
  };
}; 