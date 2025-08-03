import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Interfaces para pagos
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodData {
  type: 'card' | 'bank_account' | 'paypal';
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvc?: string;
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethodId: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency: string;
  paymentMethodId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateInvoiceData {
  userId: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  dueDate: string;
  tax?: number;
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  paymentIntentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
}

export interface ProcessRefundData {
  paymentIntentId: string;
  amount: number;
  reason: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  successRate: number;
  byPeriod: Record<string, number>;
  byStatus: Record<string, number>;
  period: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  config: Record<string, any>;
}

// Servicio de pagos
export const paymentService = {
  /**
   * Obtener métodos de pago del usuario
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_METHODS
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      throw error;
    }
  },

  /**
   * Obtener método de pago por ID
   */
  async getPaymentMethodById(paymentMethodId: string): Promise<PaymentMethod> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_METHOD_BY_ID.replace(':id', paymentMethodId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo método de pago por ID:', error);
      throw error;
    }
  },

  /**
   * Crear método de pago
   */
  async createPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.CREATE_PAYMENT_METHOD,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando método de pago:', error);
      throw error;
    }
  },

  /**
   * Actualizar método de pago
   */
  async updatePaymentMethod(paymentMethodId: string, data: Partial<CreatePaymentMethodData>): Promise<PaymentMethod> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.UPDATE_PAYMENT_METHOD.replace(':id', paymentMethodId),
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error actualizando método de pago:', error);
      throw error;
    }
  },

  /**
   * Establecer método de pago por defecto
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.SET_DEFAULT_PAYMENT_METHOD.replace(':id', paymentMethodId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error estableciendo método de pago por defecto:', error);
      throw error;
    }
  },

  /**
   * Eliminar método de pago
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        API_CONFIG.ENDPOINTS.DELETE_PAYMENT_METHOD.replace(':id', paymentMethodId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando método de pago:', error);
      throw error;
    }
  },

  /**
   * Obtener intenciones de pago
   */
  async getPaymentIntents(): Promise<PaymentIntent[]> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_INTENTS
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo intenciones de pago:', error);
      throw error;
    }
  },

  /**
   * Crear intención de pago
   */
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.CREATE_PAYMENT_INTENT,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando intención de pago:', error);
      throw error;
    }
  },

  /**
   * Procesar pago
   */
  async processPayment(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.PROCESS_PAYMENT,
        { paymentIntentId }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    }
  },

  /**
   * Obtener facturas
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_INVOICES
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo facturas:', error);
      throw error;
    }
  },

  /**
   * Crear factura
   */
  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.CREATE_PAYMENT_INVOICE,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando factura:', error);
      throw error;
    }
  },

  /**
   * Obtener factura por ID
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_INVOICE_BY_ID.replace(':id', invoiceId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo factura por ID:', error);
      throw error;
    }
  },

  /**
   * Marcar factura como pagada
   */
  async markInvoiceAsPaid(invoiceId: string): Promise<Invoice> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.MARK_INVOICE_PAID.replace(':id', invoiceId),
        { paymentMethodId: 'default' } // Método de pago por defecto para verificación manual
      );

      return response.data.data;
    } catch (error) {
      console.error('Error marcando factura como pagada:', error);
      throw error;
    }
  },

  /**
   * Obtener reembolsos
   */
  async getRefunds(): Promise<Refund[]> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_REFUNDS
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo reembolsos:', error);
      throw error;
    }
  },

  /**
   * Procesar reembolso
   */
  async processRefund(data: ProcessRefundData): Promise<Refund> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.PROCESS_REFUND,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error procesando reembolso:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de pagos
   */
  async getPaymentStats(filters: {
    period?: 'day' | 'week' | 'month' | 'quarter';
    status?: string;
  } = {}): Promise<PaymentStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.status) {
        params.append('status', filters.status);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PAYMENT_STATS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos:', error);
      throw error;
    }
  },

  /**
   * Validar método de pago
   */
  async validatePaymentMethod(paymentMethodId: string): Promise<{
    isValid: boolean;
    errors?: string[];
  }> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.VALIDATE_PAYMENT_METHOD,
        { paymentMethodId }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error validando método de pago:', error);
      throw error;
    }
  },

  /**
   * Obtener gateways de pago disponibles
   */
  async getPaymentGateways(): Promise<PaymentGateway[]> {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.PAYMENT_GATEWAYS
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo gateways de pago:', error);
      throw error;
    }
  }
}; 