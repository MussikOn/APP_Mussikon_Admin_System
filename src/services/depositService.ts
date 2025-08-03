// Servicio para gestión de depósitos de usuarios - MussikOn Admin System
// Maneja la verificación de depósitos realizados desde la app móvil

import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Tipos para depósitos de usuarios
export interface UserDeposit {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    lastName: string;
    userEmail: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected';
  description?: string;
  voucherFile?: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalAmount: number;
  verifiedAmount: number;
  averageAmount: number;
  verificationRate: string;
  rejectionRate: string;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface VerifyDepositRequest {
  approved: boolean;
  notes?: string;
  verificationData?: {
    bankDepositDate: string;
    bankDepositTime: string;
    referenceNumber: string;
    accountLastFourDigits: string;
    verifiedBy: string;
  };
}

export interface WithdrawalRequest {
  id: string;
  musicianId: string;
  musician?: {
    id: string;
    name: string;
    lastName: string;
    userEmail: string;
  };
  bankAccountId: string;
  bankAccount?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessWithdrawalRequest {
  approved: boolean;
  notes?: string;
}

class DepositService {
  /**
   * Obtener depósitos pendientes
   */
  async getPendingDeposits(): Promise<UserDeposit[]> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PENDING_DEPOSITS);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo depósitos pendientes:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPendingDeposits();
    }
  }

  /**
   * Verificar un depósito
   */
  async verifyDeposit(
    depositId: string,
    data: VerifyDepositRequest
  ): Promise<{ depositId: string; status: string; verifiedBy: string }> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.VERIFY_DEPOSIT.replace(':id', depositId),
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error verificando depósito:', error);
      throw error;
    }
  }

  /**
   * Obtener retiros pendientes
   */
  async getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PENDING_WITHDRAWALS);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo retiros pendientes:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPendingWithdrawals();
    }
  }

  /**
   * Procesar un retiro
   */
  async processWithdrawal(
    withdrawalId: string,
    data: ProcessWithdrawalRequest
  ): Promise<{ withdrawalId: string; status: string; processedBy: string }> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.PROCESS_WITHDRAWAL.replace(':id', withdrawalId),
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error procesando retiro:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del sistema de pagos
   */
  async getPaymentSystemStats(): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalCommissions: number;
    pendingDepositsCount: number;
    pendingWithdrawalsCount: number;
    totalUsers: number;
    totalMusicians: number;
    totalEvents: number;
    lastUpdated: string;
  }> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_STATS);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas del sistema de pagos:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPaymentSystemStats();
    }
  }

  // Datos mock para desarrollo
  private getMockPendingDeposits(): UserDeposit[] {
    return [
      {
        id: 'dep_001',
        userId: 'user_001',
        user: {
          id: 'user_001',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan.perez@email.com',
        },
        amount: 500.00,
        currency: 'RD$',
        status: 'pending',
        description: 'Depósito para evento de música',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+1',
          filename: 'comprobante_001.jpg',
          uploadedAt: '2024-01-15T10:30:00Z'
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 'dep_002',
        userId: 'user_002',
        user: {
          id: 'user_002',
          name: 'María',
          lastName: 'García',
          userEmail: 'maria.garcia@email.com',
        },
        amount: 750.00,
        currency: 'RD$',
        status: 'pending',
        description: 'Depósito para taller de guitarra',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+2',
          filename: 'comprobante_002.jpg',
          uploadedAt: '2024-01-15T09:15:00Z'
        },
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
      },
      {
        id: 'dep_003',
        userId: 'user_003',
        user: {
          id: 'user_003',
          name: 'Carlos',
          lastName: 'López',
          userEmail: 'carlos.lopez@email.com',
        },
        amount: 1200.00,
        currency: 'RD$',
        status: 'pending',
        description: 'Depósito para festival de música',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+3',
          filename: 'comprobante_003.jpg',
          uploadedAt: '2024-01-15T08:45:00Z'
        },
        createdAt: '2024-01-15T08:45:00Z',
        updatedAt: '2024-01-15T08:45:00Z',
      },
    ];
  }

  private getMockPendingWithdrawals(): WithdrawalRequest[] {
    return [
      {
        id: 'with_001',
        musicianId: 'musician_001',
        musician: {
          id: 'musician_001',
          name: 'Ana',
          lastName: 'Martínez',
          userEmail: 'ana.martinez@email.com',
        },
        bankAccountId: 'bank_001',
        bankAccount: {
          accountHolder: 'Ana Martínez',
          bankName: 'Banco Popular',
          accountNumber: '****1234'
        },
        amount: 1500.00,
        currency: 'RD$',
        status: 'pending',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
      {
        id: 'with_002',
        musicianId: 'musician_002',
        musician: {
          id: 'musician_002',
          name: 'Luis',
          lastName: 'Rodríguez',
          userEmail: 'luis.rodriguez@email.com',
        },
        bankAccountId: 'bank_002',
        bankAccount: {
          accountHolder: 'Luis Rodríguez',
          bankName: 'Banreservas',
          accountNumber: '****5678'
        },
        amount: 800.00,
        currency: 'RD$',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ];
  }

  private getMockPaymentSystemStats() {
    return {
      totalDeposits: 12500,
      totalWithdrawals: 8500,
      totalCommissions: 1250,
      pendingDepositsCount: 3,
      pendingWithdrawalsCount: 2,
      totalUsers: 150,
      totalMusicians: 45,
      totalEvents: 78,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const depositService = new DepositService(); 