// Servicio para gestión de pagos móviles - MussikOn Admin System
// Conectado con el backend de MussikOn Express para verificación de depósitos

import { apiService } from './api';

// CORREGIDO: Tipos adaptados al backend de MussikOn Express (DataTypes.ts)
export interface MobilePayment {
  id: string;
  userEmail: string; // ✅ Campo correcto del backend
  amount: number;
  currency: string;
  depositDate: Date; // ✅ Campo correcto del backend
  bankName: string; // ✅ Campo correcto del backend
  accountNumber: string; // ✅ Campo correcto del backend
  reference: string; // ✅ Campo correcto del backend
  purpose: string; // ✅ Campo correcto del backend
  voucherUrl: string; // ✅ Campo correcto del backend
  status: 'pending' | 'approved' | 'rejected'; // ✅ Estados del backend
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isDuplicate?: boolean;
  duplicateOf?: string;
  
  // Campos adicionales para la UI
  user?: {
    name: string;
    lastName: string;
    userEmail: string;
  };
  eventId?: string;
  eventName?: string;
  notes?: string;
  verificationNotes?: string;
  verificationMethod?: string;
  adminNotes?: string;
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
  // CORREGIDO: Usar rutas exactas del backend
  private readonly baseUrl = '/payment-system'; // ✅ Ruta principal del backend

  // CORREGIDO: Obtener depósitos pendientes
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

      console.log('💰 Obteniendo depósitos móviles...');
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<MobilePayment[]>(`${this.baseUrl}/pending-deposits?${queryParams.toString()}`);
      console.log('✅ Depósitos móviles obtenidos:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener depósitos móviles:', error);
      throw error;
    }
  }

  // CORREGIDO: Verificar depósito
  async verifyMobilePayment(
    paymentId: string,
    data: VerifyPaymentRequest
  ): Promise<{ paymentId: string; status: string; transactionId: string }> {
    try {
      console.log('✅ Verificando depósito:', { paymentId, data });
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.post<any>(`${this.baseUrl}/verify-deposit/${paymentId}`, data);
      console.log('✅ Depósito verificado:', response);
      
      return {
        paymentId,
        status: 'approved',
        transactionId: response.data?.transactionId || paymentId
      };
    } catch (error) {
      console.error('❌ Error al verificar depósito:', error);
      throw error;
    }
  }

  // CORREGIDO: Rechazar depósito
  async rejectMobilePayment(
    paymentId: string,
    data: RejectPaymentRequest
  ): Promise<{ paymentId: string; status: string; reason: string }> {
    try {
      console.log('❌ Rechazando depósito:', { paymentId, data });
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.post<any>(`${this.baseUrl}/verify-deposit/${paymentId}`, data);
      console.log('✅ Depósito rechazado:', response);
      
      return {
        paymentId,
        status: 'rejected',
        reason: data.notes || 'Rechazado por administrador'
      };
    } catch (error) {
      console.error('❌ Error al rechazar depósito:', error);
      throw error;
    }
  }

  // CORREGIDO: Obtener estadísticas
  async getMobilePaymentStats(params?: {
    period?: '7d' | '30d' | '90d';
  }): Promise<MobilePaymentStats> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);

      console.log('📊 Obteniendo estadísticas de depósitos...');
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<MobilePaymentStats>(`${this.baseUrl}/statistics?${queryParams.toString()}`);
      console.log('✅ Estadísticas de depósitos obtenidas:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de depósitos:', error);
      throw error;
    }
  }

  // CORREGIDO: Obtener información de depósito
  async getDepositInfo(depositId: string): Promise<MobilePayment> {
    try {
      console.log('📋 Obteniendo información de depósito:', depositId);
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<MobilePayment>(`${this.baseUrl}/deposit-info/${depositId}`);
      console.log('✅ Información de depósito obtenida:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener información de depósito:', error);
      throw error;
    }
  }

  // CORREGIDO: Verificar duplicado
  async checkDuplicate(depositId: string): Promise<{ isDuplicate: boolean; duplicateOf?: string }> {
    try {
      console.log('🔍 Verificando duplicado:', depositId);
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<any>(`${this.baseUrl}/check-duplicate/${depositId}`);
      console.log('✅ Verificación de duplicado completada:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al verificar duplicado:', error);
      throw error;
    }
  }

  // CORREGIDO: Obtener imagen del voucher
  async getVoucherImage(depositId: string): Promise<string> {
    try {
      console.log('🖼️ Obteniendo imagen del voucher:', depositId);
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<string>(`${this.baseUrl}/voucher-image/${depositId}`);
      console.log('✅ Imagen del voucher obtenida');
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener imagen del voucher:', error);
      throw error;
    }
  }

  // CORREGIDO: Descargar voucher
  async downloadVoucher(depositId: string): Promise<Blob> {
    try {
      console.log('📥 Descargando voucher:', depositId);
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get(`${this.baseUrl}/download-voucher/${depositId}`, {
        responseType: 'blob'
      });
      console.log('✅ Voucher descargado');
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al descargar voucher:', error);
      throw error;
    }
  }

  // CORREGIDO: Marcar como sospechoso
  async flagSuspicious(depositId: string, reason: string): Promise<void> {
    try {
      console.log('🚩 Marcando como sospechoso:', { depositId, reason });
      
      // ✅ Usar ruta correcta del backend
      await apiService.post(`${this.baseUrl}/flag-suspicious/${depositId}`, { reason });
      console.log('✅ Depósito marcado como sospechoso');
    } catch (error) {
      console.error('❌ Error al marcar como sospechoso:', error);
      throw error;
    }
  }

  // CORREGIDO: Obtener retiros pendientes
  async getPendingWithdrawals(): Promise<MobilePayment[]> {
    try {
      console.log('💰 Obteniendo retiros pendientes...');
      
      // ✅ Usar ruta correcta del backend
      const response = await apiService.get<MobilePayment[]>(`${this.baseUrl}/pending-withdrawals`);
      console.log('✅ Retiros pendientes obtenidos:', response);
      
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener retiros pendientes:', error);
      throw error;
    }
  }

  // CORREGIDO: Procesar retiro
  async processWithdrawal(withdrawalId: string, approved: boolean, notes?: string): Promise<void> {
    try {
      console.log('💳 Procesando retiro:', { withdrawalId, approved, notes });
      
      // ✅ Usar ruta correcta del backend
      await apiService.post(`${this.baseUrl}/process-withdrawal/${withdrawalId}`, {
        approved,
        notes
      });
      console.log('✅ Retiro procesado');
    } catch (error) {
      console.error('❌ Error al procesar retiro:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const mobilePaymentsService = new MobilePaymentsService();
export default mobilePaymentsService; 

