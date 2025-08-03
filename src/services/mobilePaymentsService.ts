// Servicio para gestión de pagos móviles - MussikOn Admin System
// Maneja la verificación de pagos realizados desde la app móvil

import { apiService } from './api';

// Tipos para pagos móviles
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
  status: 'pending' | 'verified' | 'rejected';
  paymentMethod: string;
  description: string;
  eventId?: string;
  eventName?: string;
  proofImage?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
  verificationMethod?: string;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  rejectionNotes?: string;
}

export interface MobilePaymentStats {
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
  notes?: string;
  verificationMethod?: string;
}

export interface RejectPaymentRequest {
  reason: string;
  notes?: string;
}

class MobilePaymentsService {
  private readonly baseUrl = '/admin/mobile-payments';

  /**
   * Obtener todos los pagos móviles
   */
  async getMobilePayments(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<MobilePayment[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiService.get(`${this.baseUrl}?${queryParams}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo pagos móviles:', error);
      // Retornar datos mock para desarrollo
      return this.getMockMobilePayments();
    }
  }

  /**
   * Verificar un pago móvil
   */
  async verifyMobilePayment(
    paymentId: string,
    data: VerifyPaymentRequest
  ): Promise<{ paymentId: string; status: string; transactionId: string }> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/${paymentId}/verify`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error verificando pago móvil:', error);
      throw error;
    }
  }

  /**
   * Rechazar un pago móvil
   */
  async rejectMobilePayment(
    paymentId: string,
    data: RejectPaymentRequest
  ): Promise<{ paymentId: string; status: string; reason: string }> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/${paymentId}/reject`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error rechazando pago móvil:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de pagos móviles
   */
  async getMobilePaymentStats(params?: {
    period?: '7d' | '30d' | '90d';
  }): Promise<MobilePaymentStats> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);

      const response = await apiService.get(
        `${this.baseUrl}/stats?${queryParams}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos móviles:', error);
      // Retornar datos mock para desarrollo
      return this.getMockMobilePaymentStats();
    }
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
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
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
        status: 'verified',
        paymentMethod: 'paypal',
        description: 'Reserva para taller de guitarra',
        eventId: 'event_002',
        eventName: 'Taller de Guitarra',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+2',
        notes: 'Pago realizado a través de PayPal',
        createdAt: new Date('2024-01-14T15:45:00Z'),
        updatedAt: new Date('2024-01-15T09:20:00Z'),
        verifiedBy: 'admin_001',
        verifiedAt: new Date('2024-01-15T09:20:00Z'),
        verificationNotes: 'Pago verificado correctamente',
        verificationMethod: 'manual',
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
        createdAt: new Date('2024-01-13T12:15:00Z'),
        updatedAt: new Date('2024-01-14T16:30:00Z'),
        rejectedBy: 'admin_001',
        rejectedAt: new Date('2024-01-14T16:30:00Z'),
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
        createdAt: new Date('2024-01-15T08:20:00Z'),
        updatedAt: new Date('2024-01-15T08:20:00Z'),
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
        status: 'verified',
        paymentMethod: 'bank_transfer',
        description: 'Pago por concierto de violín',
        eventId: 'event_005',
        eventName: 'Concierto de Violín',
        proofImage: 'https://via.placeholder.com/300x200?text=Comprobante+5',
        notes: 'Transferencia confirmada',
        createdAt: new Date('2024-01-12T14:10:00Z'),
        updatedAt: new Date('2024-01-13T11:45:00Z'),
        verifiedBy: 'admin_002',
        verifiedAt: new Date('2024-01-13T11:45:00Z'),
        verificationNotes: 'Transferencia verificada en cuenta bancaria',
        verificationMethod: 'bank_verification',
      },
    ];
  }

  private getMockMobilePaymentStats(): MobilePaymentStats {
    return {
      total: 25,
      pending: 8,
      verified: 15,
      rejected: 2,
      totalAmount: 3250.50,
      verifiedAmount: 1950.75,
      averageAmount: 130.02,
      verificationRate: '60.0',
      rejectionRate: '8.0',
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