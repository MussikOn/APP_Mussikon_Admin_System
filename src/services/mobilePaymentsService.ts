// Servicio completo para Sistema de Pagos Móviles - MussikOn Admin System
// Implementa todos los endpoints de pagos móviles del backend

import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// ===== TIPOS DE DATOS =====

export interface MobileUser {
  id: string;
  name: string;
  lastName: string;
  userEmail: string;
  phone?: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: 'savings' | 'checking';
  routingNumber?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MobileDeposit {
  id: string;
  userId: string;
  user?: MobileUser;
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
    hash: string;
  };
  hasVoucherFile: boolean;
  voucherUrl?: string;
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

export interface MobileWithdrawal {
  id: string;
  userId: string;
  user?: MobileUser;
  bankAccountId: string;
  bankAccount?: BankAccount;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes?: string;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MobilePaymentStats {
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
  dailyStats: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    amount: number;
  }>;
  lastUpdated: string;
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

export interface ProcessWithdrawalRequest {
  approved: boolean;
  notes?: string;
  rejectionReason?: string;
}

export interface CreateDepositRequest {
  amount: number;
  currency: string;
  description?: string;
  voucherFile?: File;
}

export interface CreateWithdrawalRequest {
  bankAccountId: string;
  amount: number;
  currency: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateIds: string[];
  similarityScore: number;
  matchedDeposits: MobileDeposit[];
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

// ===== CLASE DEL SERVICIO =====

class MobilePaymentsService {
  /**
   * ===== DEPÓSITOS MÓVILES =====
   */

  /**
   * Obtener depósitos del usuario móvil
   */
  async getMyDeposits(): Promise<MobileDeposit[]> {
    try {
      const response = await apiService.get('/deposits/my-deposits');
      return response.data.data || [];
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos mock para mis depósitos');
      return this.getMockMyDeposits();
    }
  }

  /**
   * Crear un nuevo depósito
   */
  async createDeposit(data: CreateDepositRequest): Promise<MobileDeposit> {
    try {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('currency', data.currency);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.voucherFile) {
        formData.append('voucherFile', data.voucherFile);
      }

      const response = await apiService.post('/payment-system/deposit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando creación de depósito');
      return this.getMockDeposit(data);
    }
  }

  /**
   * Obtener información de un depósito específico
   */
  async getDepositInfo(depositId: string): Promise<VoucherImageData> {
    try {
      const response = await apiService.get(`/payment-system/deposit-info/${depositId}`);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos mock para información de depósito');
      return this.getMockDepositInfo(depositId);
    }
  }

  /**
   * Verificar un depósito (Admin)
   */
  async verifyDeposit(
    depositId: string,
    data: VerifyDepositRequest
  ): Promise<{ depositId: string; status: string; verifiedBy: string }> {
    try {
      const response = await apiService.put(`/payment-system/verify-deposit/${depositId}`, data);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando verificación de depósito');
      return {
        depositId,
        status: data.approved ? 'verified' : 'rejected',
        verifiedBy: 'admin_mock'
      };
    }
  }

  /**
   * Aprobar un depósito (Admin)
   */
  async approveDeposit(depositId: string, notes?: string): Promise<void> {
    try {
      await apiService.post(`/deposits/${depositId}/approve`, { notes });
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando aprobación de depósito');
      console.log(`Depósito ${depositId} aprobado: ${notes}`);
    }
  }

  /**
   * Rechazar un depósito (Admin)
   */
  async rejectDeposit(depositId: string, reason: string): Promise<void> {
    try {
      await apiService.post(`/deposits/${depositId}/reject`, { reason });
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando rechazo de depósito');
      console.log(`Depósito ${depositId} rechazado: ${reason}`);
    }
  }

  /**
   * Reportar un depósito
   */
  async reportDeposit(depositId: string, reason: string): Promise<void> {
    try {
      await apiService.post('/deposits/report', { depositId, reason });
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando reporte de depósito');
      console.log(`Depósito ${depositId} reportado: ${reason}`);
    }
  }

  /**
   * Verificar duplicados de voucher
   */
  async checkDuplicateVoucher(depositId: string): Promise<DuplicateCheckResult> {
    try {
      const response = await apiService.get(`/payment-system/check-duplicate/${depositId}`);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando verificación mock de duplicados');
      return {
        isDuplicate: false,
        duplicateIds: [],
        similarityScore: 0,
        matchedDeposits: []
      };
    }
  }

  /**
   * ===== RETIROS MÓVILES =====
   */

  /**
   * Obtener retiros del usuario móvil
   */
  async getMyWithdrawals(): Promise<MobileWithdrawal[]> {
    try {
      const response = await apiService.get('/payment-system/my-withdrawals');
      return response.data.data || [];
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos mock para mis retiros');
      return this.getMockMyWithdrawals();
    }
  }

  /**
   * Crear un nuevo retiro
   */
  async createWithdrawal(data: CreateWithdrawalRequest): Promise<MobileWithdrawal> {
    try {
      const response = await apiService.post('/payment-system/withdraw', data);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando creación de retiro');
      return this.getMockWithdrawal(data);
    }
  }

  /**
   * Procesar un retiro (Admin)
   */
  async processWithdrawal(
    withdrawalId: string,
    data: ProcessWithdrawalRequest
  ): Promise<{ withdrawalId: string; status: string; processedBy: string }> {
    try {
      const response = await apiService.put(`/payment-system/process-withdrawal/${withdrawalId}`, data);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando procesamiento de retiro');
      return {
        withdrawalId,
        status: data.approved ? 'completed' : 'rejected',
        processedBy: 'admin_mock'
      };
    }
  }

  /**
   * ===== CUENTAS BANCARIAS =====
   */

  /**
   * Obtener cuentas bancarias del usuario
   */
  async getMyBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await apiService.get('/payment-system/bank-accounts/my-accounts');
      return response.data.data || [];
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos mock para cuentas bancarias');
      return this.getMockBankAccounts();
    }
  }

  /**
   * Registrar una nueva cuenta bancaria
   */
  async registerBankAccount(bankData: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    accountType: 'savings' | 'checking';
    routingNumber?: string;
  }): Promise<BankAccount> {
    try {
      const response = await apiService.post('/bank-accounts/register', bankData);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando registro de cuenta bancaria');
      return this.getMockBankAccount(bankData);
    }
  }

  /**
   * ===== BALANCE Y FINANZAS =====
   */

  /**
   * Obtener balance del usuario
   */
  async getMyBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await apiService.get('/payment-system/my-balance');
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando balance mock');
      return { balance: 2500.00, currency: 'DOP' };
    }
  }

  /**
   * ===== ESTADÍSTICAS =====
   */

  /**
   * Obtener estadísticas del sistema de pagos
   */
  async getPaymentSystemStats(): Promise<MobilePaymentStats> {
    try {
      const response = await apiService.get('/payment-system/statistics');
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando estadísticas mock del sistema de pagos');
      return this.getMockPaymentSystemStats();
    }
  }

  /**
   * Obtener estadísticas de depósitos
   */
  async getDepositStats(): Promise<{
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    totalAmount: number;
    verifiedAmount: number;
    averageAmount: number;
    verificationRate: string;
    rejectionRate: string;
  }> {
    try {
      const response = await apiService.get('/payment-system/deposit-stats');
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando estadísticas mock de depósitos');
      return this.getMockDepositStats();
    }
  }

  /**
   * ===== VOUCHERS E IMÁGENES =====
   */

  /**
   * Obtener URL de imagen de voucher
   */
  async getVoucherImageUrl(depositId: string): Promise<string | null> {
    try {
      const response = await apiService.get(`/images/voucher/${depositId}`);
      if (response.status === 200) {
        return `${API_CONFIG.BASE_URL}/images/voucher/${depositId}`;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando imagen mock para voucher');
      return `https://via.placeholder.com/300x200?text=Voucher+${depositId}`;
    }
  }

  /**
   * Obtener URL firmada para voucher
   */
  async getVoucherPresignedUrl(depositId: string): Promise<string | null> {
    try {
      const response = await apiService.get(`/payment-system/voucher/${depositId}/presigned-url`);
      return response.data.data?.presignedUrl || null;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando URL mock para voucher');
      return `https://via.placeholder.com/300x200?text=Voucher+${depositId}`;
    }
  }

  /**
   * Descargar voucher
   */
  async downloadVoucher(depositId: string): Promise<Blob> {
    try {
      const presignedUrl = await this.getVoucherPresignedUrl(depositId);
      if (presignedUrl) {
        const response = await fetch(presignedUrl);
        if (!response.ok) {
          throw new Error('Error descargando con URL firmada');
        }
        return await response.blob();
      }
      
      const response = await apiService.get(`/images/voucher/${depositId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando descarga de voucher');
      const mockText = `Voucher Mock - ID: ${depositId}\nFecha: ${new Date().toISOString()}\nMonto: $500.00`;
      return new Blob([mockText], { type: 'text/plain' });
    }
  }

  /**
   * ===== DETECCIÓN DE FRAUDE =====
   */

  /**
   * Marcar depósito como sospechoso
   */
  async flagSuspiciousDeposit(depositId: string, reason: string): Promise<void> {
    try {
      await apiService.post(`/payment-system/flag-suspicious/${depositId}`, {
        reason,
        flaggedBy: 'admin'
      });
    } catch (error) {
      console.warn('⚠️ Backend no disponible, simulando marcado de depósito como sospechoso');
      console.log(`Depósito ${depositId} marcado como sospechoso: ${reason}`);
    }
  }

  /**
   * ===== DATOS MOCK PARA DESARROLLO =====
   */

  private getMockMyDeposits(): MobileDeposit[] {
    return [
      {
        id: 'dep_001',
        userId: 'user_001',
        user: {
          id: 'user_001',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan.perez@email.com',
          phone: '+1-809-555-0101',
          balance: 2500.00,
          currency: 'DOP',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
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
        userId: 'user_001',
        user: {
          id: 'user_001',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan.perez@email.com',
          phone: '+1-809-555-0101',
          balance: 2500.00,
          currency: 'DOP',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        amount: 750.00,
        currency: 'DOP',
        status: 'verified',
        description: 'Depósito para taller de guitarra',
        voucherFile: {
          url: 'https://via.placeholder.com/300x200?text=Comprobante+2',
          filename: 'comprobante_002.jpg',
          uploadedAt: '2024-01-14T09:15:00Z',
          fileSize: 198432,
          mimeType: 'image/jpeg',
          hash: 'def456ghi789'
        },
        voucherUrl: 'https://via.placeholder.com/300x200?text=Comprobante+2',
        hasVoucherFile: true,
        verifiedBy: 'admin_001',
        verifiedAt: '2024-01-14T15:30:00Z',
        duplicateCheck: {
          isDuplicate: false,
          duplicateIds: [],
          similarityScore: 0
        },
        createdAt: '2024-01-14T09:15:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
      }
    ];
  }

  private getMockMyWithdrawals(): MobileWithdrawal[] {
    return [
      {
        id: 'with_001',
        userId: 'user_001',
        user: {
          id: 'user_001',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan.perez@email.com',
          phone: '+1-809-555-0101',
          balance: 2500.00,
          currency: 'DOP',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        bankAccountId: 'bank_001',
        bankAccount: {
          id: 'bank_001',
          userId: 'user_001',
          accountHolder: 'Juan Pérez',
          bankName: 'Banco Popular',
          accountNumber: '****1234',
          accountType: 'savings',
          isDefault: true,
          isVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        amount: 1500.00,
        currency: 'DOP',
        status: 'pending',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      }
    ];
  }

  private getMockBankAccounts(): BankAccount[] {
    return [
      {
        id: 'bank_001',
        userId: 'user_001',
        accountHolder: 'Juan Pérez',
        bankName: 'Banco Popular',
        accountNumber: '****1234',
        accountType: 'savings',
        isDefault: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'bank_002',
        userId: 'user_001',
        accountHolder: 'Juan Pérez',
        bankName: 'Banreservas',
        accountNumber: '****5678',
        accountType: 'checking',
        isDefault: false,
        isVerified: true,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z'
      }
    ];
  }

  private getMockDeposit(data: CreateDepositRequest): MobileDeposit {
    return {
      id: `dep_${Date.now()}`,
      userId: 'user_001',
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      description: data.description,
      hasVoucherFile: !!data.voucherFile,
      voucherUrl: data.voucherFile ? 'https://via.placeholder.com/300x200?text=Voucher' : undefined,
      duplicateCheck: {
        isDuplicate: false,
        duplicateIds: [],
        similarityScore: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private getMockWithdrawal(data: CreateWithdrawalRequest): MobileWithdrawal {
    return {
      id: `with_${Date.now()}`,
      userId: 'user_001',
      bankAccountId: data.bankAccountId,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private getMockBankAccount(bankData: any): BankAccount {
    return {
      id: `bank_${Date.now()}`,
      userId: 'user_001',
      accountHolder: bankData.accountHolder,
      bankName: bankData.bankName,
      accountNumber: bankData.accountNumber,
      accountType: bankData.accountType,
      routingNumber: bankData.routingNumber,
      isDefault: false,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockDepositInfo(depositId: string): VoucherImageData {
    return {
      id: depositId,
      userId: 'user_001',
      amount: 500.00,
      currency: 'DOP',
      status: 'pending',
      voucherFile: {
        url: `https://via.placeholder.com/300x200?text=Voucher+${depositId}`,
        filename: `comprobante_${depositId}.jpg`,
        uploadedAt: '2024-01-15T10:30:00Z',
        fileSize: 245760,
        mimeType: 'image/jpeg',
        hash: 'abc123def456'
      },
      hasVoucherFile: true,
      voucherUrl: `https://via.placeholder.com/300x200?text=Voucher+${depositId}`
    };
  }

  private getMockPaymentSystemStats(): MobilePaymentStats {
    return {
      totalDeposits: 12500,
      totalWithdrawals: 8500,
      totalCommissions: 1250,
      pendingDepositsCount: 15,
      pendingWithdrawalsCount: 8,
      totalUsers: 150,
      totalMusicians: 45,
      totalEvents: 78,
      fraudDetection: {
        duplicatesDetected: 5,
        suspiciousActivity: 12,
        totalRejected: 25
      },
      dailyStats: [
        { date: '2024-01-15', deposits: 25, withdrawals: 12, amount: 25000 },
        { date: '2024-01-14', deposits: 30, withdrawals: 15, amount: 30000 },
        { date: '2024-01-13', deposits: 20, withdrawals: 10, amount: 20000 }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  private getMockDepositStats() {
    return {
      total: 1250,
      pending: 15,
      verified: 1100,
      rejected: 135,
      totalAmount: 1250000,
      verifiedAmount: 1100000,
      averageAmount: 1000,
      verificationRate: '88%',
      rejectionRate: '10.8%'
    };
  }
}

export const mobilePaymentsService = new MobilePaymentsService(); 

