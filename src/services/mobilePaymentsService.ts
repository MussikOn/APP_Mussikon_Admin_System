// Servicio para gestión de pagos móviles - MussikOn Admin System
// Conectado con el backend de MussikOn Express para verificación de depósitos

import { apiService } from './api';

// Tipos adaptados al backend de MussikOn Express
export interface MobilePayment {
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
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  description: string;
  eventId?: string;
  eventName?: string;
  proofImage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  verificationMethod?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  rejectionNotes?: string;
  
  // Campos específicos del backend para depósitos
  voucherFile?: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  depositDate?: string;
  depositTime?: string;
  referenceNumber?: string;
  comments?: string;
  verificationData?: {
    bankDepositDate: string;
    bankDepositTime: string;
    referenceNumber: string;
    accountLastFourDigits: string;
    verifiedBy: string;
  };
}

export interface MobilePaymentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  approvedAmount: number;
  averageAmount: number;
  approvalRate: string;
  rejectionRate: string;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  topPaymentMethods: Array<{
    method: string;
    count: number;
  }>;
  topEvents: Array<{
    eventId: string;
    count: number;
  }>;
}

export interface VerifyPaymentRequest {
  approved: boolean;
  notes?: string;
  verificationData?: {
    bankDepositDate: string;
    bankDepositTime: string;
    referenceNumber: string;
    accountLastFourDigits: string;
  };
}

export interface RejectPaymentRequest {
  approved: false;
  notes: string;
}

class MobilePaymentsService {
  private readonly baseUrl = '/admin/payments';

  /**
   * Obtener todos los depósitos pendientes (conectado al backend real)
   */
  async getMobilePayments(_params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<MobilePayment[]> {
    try {
      // Usar el endpoint real del backend para depósitos pendientes
      const response = await apiService.get(`${this.baseUrl}/pending-deposits`);
      
      if (response.data.success && response.data.data) {
        // Transformar los datos del backend al formato esperado por el frontend
        return response.data.data.map((deposit: any) => this.transformDepositToMobilePayment(deposit));
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo depósitos pendientes:', error);
      // Retornar datos mock para desarrollo
      return this.getMockMobilePayments();
    }
  }

  /**
   * Verificar un depósito (conectado al backend real)
   */
  async verifyMobilePayment(
    paymentId: string,
    data: VerifyPaymentRequest
  ): Promise<{ paymentId: string; status: string; transactionId: string }> {
    try {
      // Usar el endpoint real del backend para verificar depósitos
      const response = await apiService.post(`${this.baseUrl}/pending-deposits/${paymentId}/verify`, data);
      
      if (response.data.success) {
        return {
          paymentId,
          status: data.approved ? 'approved' : 'rejected',
          transactionId: response.data.data?.depositId || paymentId
        };
      }
      
      throw new Error(response.data.error || 'Error verificando depósito');
    } catch (error) {
      console.error('Error verificando depósito:', error);
      throw error;
    }
  }

  /**
   * Rechazar un depósito (conectado al backend real)
   */
  async rejectMobilePayment(
    paymentId: string,
    data: RejectPaymentRequest
  ): Promise<{ paymentId: string; status: string; reason: string }> {
    try {
      // Usar el mismo endpoint de verificación pero con approved: false
      const response = await apiService.post(`${this.baseUrl}/pending-deposits/${paymentId}/verify`, data);
      
      if (response.data.success) {
        return {
          paymentId,
          status: 'rejected',
          reason: data.notes
        };
      }
      
      throw new Error(response.data.error || 'Error rechazando depósito');
    } catch (error) {
      console.error('Error rechazando depósito:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de depósitos (conectado al backend real)
   */
  async getMobilePaymentStats(_params?: {
    period?: '7d' | '30d' | '90d';
  }): Promise<MobilePaymentStats> {
    try {
      // Usar el endpoint real del backend para estadísticas
      const response = await apiService.get(`${this.baseUrl}/statistics`);
      
      if (response.data.success && response.data.data) {
        return this.transformStatsToMobilePaymentStats(response.data.data);
      }
      
      return this.getMockMobilePaymentStats();
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return this.getMockMobilePaymentStats();
    }
  }

  /**
   * Transformar depósito del backend al formato del frontend
   */
  private transformDepositToMobilePayment(deposit: any): MobilePayment {
    console.log('🔍 Transformando depósito del backend:', deposit);
    console.log('🔍 URL del voucher:', deposit.voucherFile?.url);
    
    // Usar el endpoint seguro del backend para las imágenes
    const secureImageUrl = deposit.voucherFile?.url ? 
      `/admin/payments/voucher-image/${deposit.id}` : 
      undefined;
    
    return {
      id: deposit.id,
      userId: deposit.userId,
      amount: deposit.amount,
      currency: deposit.currency || 'RD$',
      status: deposit.status,
      paymentMethod: 'bank_deposit',
      description: `Depósito bancario - ${deposit.bankName || 'Banco'}`,
      proofImage: secureImageUrl,
      notes: deposit.comments,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
      verifiedBy: deposit.verifiedBy,
      verifiedAt: deposit.verifiedAt,
      verificationNotes: deposit.notes,
      rejectedBy: deposit.status === 'rejected' ? deposit.verifiedBy : undefined,
      rejectedAt: deposit.status === 'rejected' ? deposit.verifiedAt : undefined,
      rejectionReason: deposit.status === 'rejected' ? deposit.notes : undefined,
      
      // Campos específicos del backend
      voucherFile: deposit.voucherFile,
      accountHolderName: deposit.accountHolderName,
      accountNumber: deposit.accountNumber,
      bankName: deposit.bankName,
      depositDate: deposit.depositDate,
      depositTime: deposit.depositTime,
      referenceNumber: deposit.referenceNumber,
      comments: deposit.comments,
      verificationData: deposit.verificationData
    };
  }

  /**
   * Transformar estadísticas del backend al formato del frontend
   */
  private transformStatsToMobilePaymentStats(stats: any): MobilePaymentStats {
    return {
      total: stats.pendingDepositsCount || 0,
      pending: stats.pendingDepositsCount || 0,
      approved: 0, // No disponible en el backend actual
      rejected: 0, // No disponible en el backend actual
      totalAmount: stats.totalDeposits || 0,
      approvedAmount: 0, // No disponible en el backend actual
      averageAmount: stats.totalDeposits && stats.pendingDepositsCount ? 
        stats.totalDeposits / stats.pendingDepositsCount : 0,
      approvalRate: '0%', // No disponible en el backend actual
      rejectionRate: '0%', // No disponible en el backend actual
      dailyStats: [], // No disponible en el backend actual
      topPaymentMethods: [], // No disponible en el backend actual
      topEvents: [] // No disponible en el backend actual
    };
  }

  // Datos mock para desarrollo
  private getMockMobilePayments(): MobilePayment[] {
    return [
      {
        id: 'mp_001',
        userId: 'user_001',
        user: {
          id: 'user_001',
          name: 'Juan',
          lastName: 'Pérez',
          userEmail: 'juan.perez@email.com',
        },
        amount: 150.00,
        currency: 'EUR',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        description: 'Pago por evento de música en vivo',
        eventId: 'event_001',
        eventName: 'Concierto de Jazz',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+1',
        notes: 'Transferencia bancaria realizada',
        createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
      },
      {
        id: 'mp_002',
        userId: 'user_002',
        user: {
          id: 'user_002',
          name: 'María',
          lastName: 'García',
          userEmail: 'maria.garcia@email.com',
        },
        amount: 75.50,
        currency: 'EUR',
        status: 'approved',
        paymentMethod: 'paypal',
        description: 'Reserva para taller de guitarra',
        eventId: 'event_002',
        eventName: 'Taller de Guitarra',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+2',
        notes: 'Pago realizado a través de PayPal',
        createdAt: new Date('2024-01-14T15:45:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T09:20:00Z').toISOString(),
        verifiedBy: 'admin_001',
        verifiedAt: new Date('2024-01-15T09:20:00Z').toISOString(),
        verificationNotes: 'Depósito verificado correctamente',
      },
      {
        id: 'mp_003',
        userId: 'user_003',
        user: {
          id: 'user_003',
          name: 'Carlos',
          lastName: 'López',
          userEmail: 'carlos.lopez@email.com',
        },
        amount: 200.00,
        currency: 'EUR',
        status: 'rejected',
        paymentMethod: 'bank_transfer',
        description: 'Pago por festival de música',
        eventId: 'event_003',
        eventName: 'Festival de Música',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+3',
        notes: 'Comprobante no legible',
        createdAt: new Date('2024-01-13T12:15:00Z').toISOString(),
        updatedAt: new Date('2024-01-14T16:30:00Z').toISOString(),
        rejectedBy: 'admin_001',
        rejectedAt: new Date('2024-01-14T16:30:00Z').toISOString(),
        rejectionReason: 'Comprobante no legible',
        rejectionNotes: 'La imagen del comprobante no es clara',
      },
      {
        id: 'mp_004',
        userId: 'user_004',
        user: {
          id: 'user_004',
          name: 'Ana',
          lastName: 'Martínez',
          userEmail: 'ana.martinez@email.com',
        },
        amount: 120.00,
        currency: 'EUR',
        status: 'pending',
        paymentMethod: 'stripe',
        description: 'Pago por clase de piano',
        eventId: 'event_004',
        eventName: 'Clase de Piano',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+4',
        notes: 'Pago con tarjeta de crédito',
        createdAt: new Date('2024-01-15T08:20:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T08:20:00Z').toISOString(),
      },
      {
        id: 'mp_005',
        userId: 'user_005',
        user: {
          id: 'user_005',
          name: 'Luis',
          lastName: 'Rodríguez',
          userEmail: 'luis.rodriguez@email.com',
        },
        amount: 90.00,
        currency: 'EUR',
        status: 'approved',
        paymentMethod: 'bank_transfer',
        description: 'Pago por concierto de violín',
        eventId: 'event_005',
        eventName: 'Concierto de Violín',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+5',
        notes: 'Transferencia confirmada',
        createdAt: new Date('2024-01-12T14:10:00Z').toISOString(),
        updatedAt: new Date('2024-01-13T11:45:00Z').toISOString(),
        verifiedBy: 'admin_002',
        verifiedAt: new Date('2024-01-13T11:45:00Z').toISOString(),
        verificationNotes: 'Transferencia verificada en cuenta bancaria',
      },
    ];
  }

  private getMockMobilePaymentStats(): MobilePaymentStats {
    return {
      total: 25,
      pending: 8,
      approved: 15,
      rejected: 2,
      totalAmount: 3250.50,
      approvedAmount: 1950.75,
      averageAmount: 130.02,
      approvalRate: '60.0%',
      rejectionRate: '8.0%',
      dailyStats: [
        { date: '2024-01-15', count: 5, amount: 650.00 },
        { date: '2024-01-14', count: 8, amount: 1200.50 },
        { date: '2024-01-13', count: 6, amount: 900.00 },
        { date: '2024-01-12', count: 4, amount: 400.00 },
        { date: '2024-01-11', count: 2, amount: 100.00 },
      ],
      topPaymentMethods: [
        { method: 'bank_transfer', count: 12 },
        { method: 'paypal', count: 8 },
        { method: 'stripe', count: 5 },
      ],
      topEvents: [
        { eventId: 'event_001', count: 8 },
        { eventId: 'event_002', count: 6 },
        { eventId: 'event_003', count: 4 },
        { eventId: 'event_004', count: 3 },
        { eventId: 'event_005', count: 2 },
      ],
    };
  }
}

export const mobilePaymentsService = new MobilePaymentsService(); 