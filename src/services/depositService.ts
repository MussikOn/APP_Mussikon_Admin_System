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
    phone?: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected' | 'processing';
  description?: string;
  voucherFile?: {
    url: string;
    filename: string;
    uploadedAt: string;
    fileSize: number;
    mimeType: string;
    hash: string; // Para detección de duplicados
  };
  voucherUrl?: string;
  hasVoucherFile: boolean;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  verificationData?: {
    bankDepositDate: string;
    bankDepositTime: string;
    referenceNumber: string;
    accountLastFourDigits: string;
    verifiedBy: string;
    verificationMethod: string;
    bankName: string;
    depositAmount: number;
  };
  duplicateCheck?: {
    isDuplicate: boolean;
    duplicateIds: string[];
    similarityScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DepositStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  processing: number;
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
  fraudDetection: {
    duplicatesDetected: number;
    suspiciousActivity: number;
    totalRejected: number;
  };
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
    verificationMethod: string;
    bankName: string;
    depositAmount: number;
  };
  rejectionReason?: string;
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

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateIds: string[];
  similarityScore: number;
  matchedDeposits: UserDeposit[];
}

export interface VoucherImageData {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  voucherFile: {
    url: string;
    filename: string;
    uploadedAt: string;
    fileSize: number;
    mimeType: string;
    hash: string;
  } | null;
  hasVoucherFile: boolean;
  voucherUrl: string | null;
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
   * Obtener información de depósito específico
   */
  async getDepositInfo(depositId: string): Promise<VoucherImageData> {
    try {
      const response = await apiService.get(
        `/admin/payments/deposit-info/${depositId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo información del depósito:', error);
      throw error;
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
   * Verificar duplicados de voucher
   */
  async checkDuplicateVoucher(depositId: string): Promise<DuplicateCheckResult> {
    try {
      const response = await apiService.get(
        `/admin/payments/check-duplicate/${depositId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error verificando duplicados:', error);
      // Retornar resultado por defecto
      return {
        isDuplicate: false,
        duplicateIds: [],
        similarityScore: 0,
        matchedDeposits: []
      };
    }
  }

  /**
   * Obtener URL de imagen de voucher con manejo de errores
   */
  async getVoucherImageUrl(depositId: string, useDirectRoute: boolean = true): Promise<string | null> {
    try {
      const baseUrl = useDirectRoute 
        ? `/admin/payments/voucher-image-direct/${depositId}`
        : `/admin/payments/voucher-image/${depositId}`;
      
      // Verificar si la imagen existe usando GET en lugar de HEAD
      const response = await apiService.get(baseUrl);
      if (response.status === 200) {
        return `${API_CONFIG.BASE_URL}${baseUrl}`;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo URL de voucher:', error);
      return null;
    }
  }

  /**
   * Descargar voucher
   */
  async downloadVoucher(depositId: string): Promise<Blob> {
    try {
      const response = await apiService.get(
        `/admin/payments/download-voucher/${depositId}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error descargando voucher:', error);
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
    fraudDetection: {
      duplicatesDetected: number;
      suspiciousActivity: number;
      totalRejected: number;
    };
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

  /**
   * Obtener estadísticas de depósitos
   */
  async getDepositStats(): Promise<DepositStats> {
    try {
      const response = await apiService.get('/admin/payments/deposit-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de depósitos:', error);
      // Retornar datos mock para desarrollo
      return this.getMockDepositStats();
    }
  }

  /**
   * Marcar depósito como sospechoso
   */
  async flagSuspiciousDeposit(depositId: string, reason: string): Promise<void> {
    try {
      await apiService.post(`/admin/payments/flag-suspicious/${depositId}`, {
        reason,
        flaggedBy: 'admin'
      });
    } catch (error) {
      console.error('Error marcando depósito como sospechoso:', error);
      throw error;
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
          phone: '+1-809-555-0101'
        },
        amount: 500.00,
        currency: 'DOP',
        status: 'pending',
        description: 'Depósito para evento de música',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+1',
          filename: 'comprobante_001.jpg',
          uploadedAt: '2024-01-15T10:30:00Z',
          fileSize: 245760,
          mimeType: 'image/jpeg',
          hash: 'abc123def456'
        },
        voucherUrl: 'https://via.placeholder.com/300x200?text=Comprobante+1',
        hasVoucherFile: true,
        duplicateCheck: {
          isDuplicate: false,
          duplicateIds: [],
          similarityScore: 0
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
          phone: '+1-809-555-0102'
        },
        amount: 750.00,
        currency: 'DOP',
        status: 'pending',
        description: 'Depósito para taller de guitarra',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+2',
          filename: 'comprobante_002.jpg',
          uploadedAt: '2024-01-15T09:15:00Z',
          fileSize: 198432,
          mimeType: 'image/jpeg',
          hash: 'def456ghi789'
        },
        voucherUrl: 'https://via.placeholder.com/300x200?text=Comprobante+2',
        hasVoucherFile: true,
        duplicateCheck: {
          isDuplicate: false,
          duplicateIds: [],
          similarityScore: 0
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
          phone: '+1-809-555-0103'
        },
        amount: 1200.00,
        currency: 'DOP',
        status: 'pending',
        description: 'Depósito para festival de música',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+3',
          filename: 'comprobante_003.jpg',
          uploadedAt: '2024-01-15T08:45:00Z',
          fileSize: 312456,
          mimeType: 'image/jpeg',
          hash: 'ghi789jkl012'
        },
        voucherUrl: 'https://via.placeholder.com/300x200?text=Comprobante+3',
        hasVoucherFile: true,
        duplicateCheck: {
          isDuplicate: false,
          duplicateIds: [],
          similarityScore: 0
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
        currency: 'DOP',
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
        currency: 'DOP',
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
      fraudDetection: {
        duplicatesDetected: 5,
        suspiciousActivity: 12,
        totalRejected: 25
      },
      lastUpdated: new Date().toISOString()
    };
  }

  private getMockDepositStats(): DepositStats {
    return {
      total: 1250,
      pending: 15,
      verified: 1100,
      rejected: 135,
      processing: 0,
      totalAmount: 1250000,
      verifiedAmount: 1100000,
      averageAmount: 1000,
      verificationRate: '88%',
      rejectionRate: '10.8%',
      dailyStats: [
        { date: '2024-01-15', count: 25, amount: 25000 },
        { date: '2024-01-14', count: 30, amount: 30000 },
        { date: '2024-01-13', count: 20, amount: 20000 }
      ],
      fraudDetection: {
        duplicatesDetected: 5,
        suspiciousActivity: 12,
        totalRejected: 135
      }
    };
  }
}

export const depositService = new DepositService(); 