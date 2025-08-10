import { api } from './api';
import type { HiringRequest, Contract, PaymentInfo } from '../features/hiring/types';

export class HiringService {
  // Crear una solicitud de contratación
  static async createHiringRequest(request: Partial<HiringRequest>): Promise<HiringRequest> {
    try {
      const response = await api.post('/hiring/create-request', request);
      return response.data;
    } catch (error) {
      console.error('Error creating hiring request:', error);
      throw error;
    }
  }

  // Obtener todas las solicitudes de contratación del usuario
  static async getUserHiringRequests(userId: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get(`/hiring/user-requests/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user hiring requests:', error);
      throw error;
    }
  }

  // Obtener solicitudes de contratación recibidas por un músico
  static async getMusicianHiringRequests(musicianId: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get(`/hiring/musician-requests/${musicianId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting musician hiring requests:', error);
      throw error;
    }
  }

  // Aceptar una solicitud de contratación
  static async acceptHiringRequest(requestId: string, musicianId: string): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/accept/${requestId}`, {
        musicianId,
        status: 'accepted'
      });
      return response.data;
    } catch (error) {
      console.error('Error accepting hiring request:', error);
      throw error;
    }
  }

  // Rechazar una solicitud de contratación
  static async rejectHiringRequest(requestId: string, musicianId: string, reason?: string): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/reject/${requestId}`, {
        musicianId,
        status: 'rejected',
        rejectionReason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting hiring request:', error);
      throw error;
    }
  }

  // Crear un contrato
  static async createContract(hiringRequestId: string, contractData: Partial<Contract>): Promise<Contract> {
    try {
      const response = await api.post(`/hiring/create-contract/${hiringRequestId}`, contractData);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  // Obtener contrato por ID
  static async getContract(contractId: string): Promise<Contract> {
    try {
      const response = await api.get(`/hiring/contract/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting contract:', error);
      throw error;
    }
  }

  // Firmar contrato
  static async signContract(contractId: string, userId: string, signature: string): Promise<Contract> {
    try {
      const response = await api.put(`/hiring/sign-contract/${contractId}`, {
        userId,
        signature,
        signedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error signing contract:', error);
      throw error;
    }
  }

  // Procesar pago
  static async processPayment(contractId: string, paymentInfo: PaymentInfo): Promise<any> {
    try {
      const response = await api.post(`/hiring/process-payment/${contractId}`, paymentInfo);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Obtener historial de pagos
  static async getPaymentHistory(contractId: string): Promise<any[]> {
    try {
      const response = await api.get(`/hiring/payment-history/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  // Cancelar contratación
  static async cancelHiring(requestId: string, reason?: string): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/cancel/${requestId}`, {
        status: 'cancelled',
        cancellationReason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling hiring:', error);
      throw error;
    }
  }

  // Obtener estadísticas de contratación
  static async getHiringStats(userId: string): Promise<any> {
    try {
      const response = await api.get(`/hiring/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting hiring stats:', error);
      throw error;
    }
  }
}

export default HiringService;
