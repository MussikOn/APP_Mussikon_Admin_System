// Servicio para Sistema de Pagos Móviles - MussikOn Admin System
// Maneja funcionalidades de pagos para usuarios móviles (balance, depósitos, retiros, cuentas bancarias)

import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// ============================================================================
// TIPOS PARA SISTEMA DE PAGOS MÓVILES
// ============================================================================

export interface UserBalance {
  userId: string;
  userType: 'musician' | 'event_organizer';
  currentBalance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalEarned: number;
  pendingEarnings: number;
  lastTransactionAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountData {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber: string;
}

export interface DepositData {
  amount: number;
  currency: string;
  description?: string;
  voucherFile: File;
}

export interface PaymentData {
  musicianId: string;
  amount: number;
  currency: string;
  eventId: string;
  description?: string;
}

export interface MusicianEarnings {
  id: string;
  musicianId: string;
  eventId: string;
  event?: {
    id: string;
    title: string;
    date: string;
    location: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}

export interface WithdrawalRequestData {
  bankAccountId: string;
  amount: number;
  currency: string;
  reason?: string;
}

export interface PaymentStats {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  successRate: string;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  monthlyStats: Array<{
    month: string;
    count: number;
    amount: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    totalAmount: number;
    transactionCount: number;
  }>;
}

// ============================================================================
// CLASE PRINCIPAL DEL SERVICIO
// ============================================================================

class PaymentSystemService {
  private baseUrl = API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM;

  // ============================================================================
  // FUNCIONALIDADES PARA USUARIOS MÓVILES
  // ============================================================================

  /**
   * Obtiene el balance actual del usuario
   */
  async getMyBalance(): Promise<UserBalance> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-balance`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      // Retornar datos mock para desarrollo
      return this.getMockUserBalance();
    }
  }

  /**
   * Sube un depósito con comprobante
   */
  async uploadDeposit(formData: FormData): Promise<any> {
    try {
      const response = await apiService.postFormData(
        `${this.baseUrl}/deposit`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error subiendo depósito:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de depósitos del usuario
   */
  async getMyDeposits(): Promise<any[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-deposits`);
      console.log('🔍 API Response getMyDeposits:', response);
      console.log('🔍 Response data type:', typeof response.data);
      console.log('🔍 Response data:', response.data);
      
      // Verificar si response.data es un array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no es un array, verificar si tiene una propiedad que contenga el array
      if (response.data && typeof response.data === 'object') {
        // Buscar propiedades que puedan contener el array de depósitos
        const possibleArrayProps = ['deposits', 'data', 'items', 'results', 'list'];
        for (const prop of possibleArrayProps) {
          if (Array.isArray(response.data[prop])) {
            console.log(`🔍 Found deposits in property: ${prop}`);
            return response.data[prop];
          }
        }
        
        // Si no encontramos un array, devolver un array vacío
        console.warn('⚠️ No se encontró un array de depósitos en la respuesta:', response.data);
        return [];
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo depósitos:', error);
      // Retornar datos mock para desarrollo
      return this.getMockMyDeposits();
    }
  }

  /**
   * Registra una nueva cuenta bancaria
   */
  async registerBankAccount(data: BankAccountData): Promise<BankAccount> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/bank-accounts/register`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error registrando cuenta bancaria:', error);
      throw error;
    }
  }

  /**
   * Obtiene las cuentas bancarias del usuario
   */
  async getMyBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/bank-accounts/my-accounts`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cuentas bancarias:', error);
      // Retornar datos mock para desarrollo
      return this.getMockBankAccounts();
    }
  }

  /**
   * Paga a un músico por un evento
   */
  async payMusicianForEvent(eventId: string, data: PaymentData): Promise<any> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/events/${eventId}/pay-musician`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error pagando músico:', error);
      throw error;
    }
  }

  /**
   * Obtiene las ganancias del músico
   */
  async getMusicianEarnings(): Promise<MusicianEarnings[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/musicians/earnings`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ganancias:', error);
      // Retornar datos mock para desarrollo
      return this.getMockMusicianEarnings();
    }
  }

  /**
   * Solicita un retiro de ganancias
   */
  async requestWithdrawal(data: WithdrawalRequestData): Promise<any> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/musicians/withdraw-earnings`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error solicitando retiro:', error);
      throw error;
    }
  }

  // ============================================================================
  // FUNCIONALIDADES PARA ADMINISTRACIÓN
  // ============================================================================

  /**
   * Obtiene estadísticas generales del sistema de pagos
   */
  async getPaymentStatistics(): Promise<PaymentStats> {
    try {
      const response = await apiService.get(`${this.baseUrl}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPaymentStats();
    }
  }

  /**
   * Obtiene depósitos pendientes (admin)
   */
  async getPendingDeposits(): Promise<any[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/pending-deposits`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo depósitos pendientes:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPendingDeposits();
    }
  }

  /**
   * Obtiene retiros pendientes (admin)
   */
  async getPendingWithdrawals(): Promise<any[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/pending-withdrawals`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo retiros pendientes:', error);
      // Retornar datos mock para desarrollo
      return this.getMockPendingWithdrawals();
    }
  }

  /**
   * Verifica un depósito (admin)
   */
  async verifyDeposit(depositId: string, data: any): Promise<any> {
    try {
      const response = await apiService.put(
        `${this.baseUrl}/verify-deposit/${depositId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error verificando depósito:', error);
      throw error;
    }
  }

  /**
   * Procesa un retiro (admin)
   */
  async processWithdrawal(withdrawalId: string, data: any): Promise<any> {
    try {
      const response = await apiService.put(
        `${this.baseUrl}/process-withdrawal/${withdrawalId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error procesando retiro:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de un depósito
   */
  async getDepositInfo(depositId: string): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/deposit-info/${depositId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo información de depósito:', error);
      // Retornar datos mock para desarrollo
      return this.getMockDepositInfo(depositId);
    }
  }

  /**
   * Verifica si un voucher es duplicado
   */
  async checkDuplicateVoucher(depositId: string): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/check-duplicate/${depositId}`);
      return response.data;
    } catch (error) {
      console.error('Error verificando duplicado:', error);
      // Retornar datos mock para desarrollo
      return this.getMockDuplicateCheck();
    }
  }

  /**
   * Obtiene la URL de la imagen del voucher
   */
  async getVoucherImageUrl(depositId: string): Promise<string | null> {
    try {
      const response = await apiService.get(`${this.baseUrl}/voucher-image/${depositId}`);
      return response.data.url;
    } catch (error) {
      console.error('Error obteniendo imagen del voucher:', error);
      return null;
    }
  }

  /**
   * Obtiene URL firmada para el voucher
   */
  async getVoucherPresignedUrl(depositId: string): Promise<string | null> {
    try {
      const response = await apiService.get(`${this.baseUrl}/voucher/${depositId}/presigned-url`);
      return response.data.url;
    } catch (error) {
      console.error('Error obteniendo URL firmada:', error);
      return null;
    }
  }

  /**
   * Descarga un voucher
   */
  async downloadVoucher(depositId: string): Promise<Blob> {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/download-voucher/${depositId}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error descargando voucher:', error);
      throw error;
    }
  }

  /**
   * Marca un depósito como sospechoso
   */
  async flagSuspiciousDeposit(depositId: string, reason: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/flag-suspicious/${depositId}`, {
        reason
      });
    } catch (error) {
      console.error('Error marcando como sospechoso:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de depósitos
   */
  async getDepositStats(): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/deposit-stats`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de depósitos:', error);
      // Retornar datos mock para desarrollo
      return this.getMockDepositStats();
    }
  }

  // ============================================================================
  // DATOS MOCK PARA DESARROLLO
  // ============================================================================

  private getMockUserBalance(): UserBalance {
    return {
      userId: 'user123',
      userType: 'musician',
      currentBalance: 1250.50,
      currency: 'USD',
      totalDeposited: 3000.00,
      totalWithdrawn: 1500.00,
      totalEarned: 2750.50,
      pendingEarnings: 250.00,
      lastTransactionAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockMyDeposits(): any[] {
    return [
      {
        id: 'dep1',
        amount: 500.00,
        currency: 'USD',
        status: 'verified',
        createdAt: '2024-01-15T10:30:00Z',
        voucherUrl: 'https://example.com/voucher1.jpg'
      },
      {
        id: 'dep2',
        amount: 750.00,
        currency: 'USD',
        status: 'pending',
        createdAt: '2024-01-20T14:45:00Z',
        voucherUrl: 'https://example.com/voucher2.jpg'
      }
    ];
  }

  private getMockBankAccounts(): BankAccount[] {
    return [
      {
        id: 'bank1',
        userId: 'user123',
        accountHolder: 'Juan Pérez',
        accountNumber: '****1234',
        bankName: 'Banco Nacional',
        accountType: 'savings',
        routingNumber: '123456789',
        isVerified: true,
        isDefault: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockMusicianEarnings(): MusicianEarnings[] {
    return [
      {
        id: 'earn1',
        musicianId: 'musician123',
        eventId: 'event1',
        event: {
          id: 'event1',
          title: 'Boda de María y Carlos',
          date: '2024-01-25T18:00:00Z',
          location: 'Hotel Plaza'
        },
        amount: 300.00,
        currency: 'USD',
        status: 'paid',
        paidAt: '2024-01-26T10:00:00Z',
        createdAt: '2024-01-20T12:00:00Z'
      }
    ];
  }

  private getMockPaymentStats(): PaymentStats {
    return {
      totalTransactions: 1250,
      totalAmount: 45000.00,
      averageAmount: 36.00,
      successRate: '95.2%',
      dailyStats: [
        { date: '2024-01-20', count: 45, amount: 1620.00 },
        { date: '2024-01-21', count: 52, amount: 1872.00 }
      ],
      monthlyStats: [
        { month: '2024-01', count: 1250, amount: 45000.00 }
      ],
      topUsers: [
        {
          userId: 'user123',
          userName: 'Juan Pérez',
          totalAmount: 5000.00,
          transactionCount: 25
        }
      ]
    };
  }

  private getMockPendingDeposits(): any[] {
    return [
      {
        id: 'dep1',
        userId: 'user123',
        user: {
          id: 'user123',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan@example.com'
        },
        amount: 500.00,
        currency: 'USD',
        status: 'pending',
        createdAt: '2024-01-20T10:30:00Z',
        voucherUrl: 'https://example.com/voucher1.jpg'
      }
    ];
  }

  private getMockPendingWithdrawals(): any[] {
    return [
      {
        id: 'with1',
        musicianId: 'musician123',
        musician: {
          id: 'musician123',
          name: 'María',
          lastName: 'García',
          userEmail: 'maria@example.com'
        },
        amount: 750.00,
        currency: 'USD',
        status: 'pending',
        createdAt: '2024-01-20T14:45:00Z'
      }
    ];
  }

  private getMockDepositInfo(depositId: string): any {
    return {
      id: depositId,
      userId: 'user123',
      amount: 500.00,
      currency: 'USD',
      status: 'pending',
      voucherUrl: 'https://example.com/voucher.jpg',
      createdAt: '2024-01-20T10:30:00Z'
    };
  }

  private getMockDuplicateCheck(): any {
    return {
      isDuplicate: false,
      duplicateIds: [],
      similarityScore: 0.0,
      matchedDeposits: []
    };
  }

  private getMockDepositStats(): any {
    return {
      total: 1250,
      pending: 45,
      verified: 1150,
      rejected: 55,
      totalAmount: 45000.00,
      verifiedAmount: 42000.00,
      averageAmount: 36.00,
      verificationRate: '92%',
      rejectionRate: '4.4%'
    };
  }
}

// Exportar instancia única del servicio
export const paymentSystemService = new PaymentSystemService(); 