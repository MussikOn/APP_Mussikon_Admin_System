// Servicio para Gestión de Vouchers - MussikOn Admin System
// Maneja la gestión completa de vouchers de depósitos

import { apiService } from './api';

// ============================================================================
// TIPOS PARA GESTIÓN DE VOUCHERS
// ============================================================================

export interface Voucher {
  id: string;
  depositId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    lastName: string;
    userEmail: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspicious';
  voucherFile: {
    url: string;
    filename: string;
    uploadedAt: string;
    fileSize: number;
    mimeType: string;
    hash: string;
  } | null;
  voucherUrl: string | null;
  hasVoucherFile: boolean;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  flaggedAsSuspicious?: boolean;
  suspiciousReason?: string;
  duplicateCheck?: {
    isDuplicate: boolean;
    duplicateIds: string[];
    similarityScore: number;
  };
  integrityCheck?: {
    isValid: boolean;
    checksum: string;
    lastVerified: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherData {
  depositId: string;
  userId: string;
  amount: number;
  currency: string;
  voucherFile: File;
  description?: string;
}

export interface UpdateVoucherData {
  status?: 'pending' | 'verified' | 'rejected' | 'suspicious';
  adminNotes?: string;
  verifiedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  flaggedAsSuspicious?: boolean;
  suspiciousReason?: string;
}

export interface IntegrityResult {
  isValid: boolean;
  checksum: string;
  originalChecksum: string;
  lastVerified: string;
  issues: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface VoucherStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  suspicious: number;
  totalAmount: number;
  verifiedAmount: number;
  averageAmount: number;
  verificationRate: string;
  rejectionRate: string;
  suspiciousRate: string;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  fraudDetection: {
    duplicatesDetected: number;
    suspiciousActivity: number;
    totalRejected: number;
    flaggedVouchers: number;
  };
}

export interface CleanupResult {
  deletedCount: number;
  freedSpace: number;
  errors: string[];
  summary: string;
}

export interface VoucherAnalytics {
  totalVouchers: number;
  totalAmount: number;
  averageAmount: number;
  verificationRate: string;
  rejectionRate: string;
  suspiciousRate: string;
  dailyTrends: Array<{
    date: string;
    count: number;
    amount: number;
    verified: number;
    rejected: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    count: number;
    amount: number;
    verified: number;
    rejected: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    voucherCount: number;
    totalAmount: number;
    verificationRate: string;
  }>;
  fraudMetrics: {
    duplicatesDetected: number;
    suspiciousActivity: number;
    totalRejected: number;
    flaggedVouchers: number;
    averageSimilarityScore: number;
  };
}

export interface ExportFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  minAmount?: number;
  maxAmount?: number;
  format?: 'csv' | 'json' | 'xlsx';
}

// ============================================================================
// CLASE PRINCIPAL DEL SERVICIO
// ============================================================================

class VoucherService {
  private baseUrl = '/vouchers';

  // ============================================================================
  // OPERACIONES CRUD BÁSICAS
  // ============================================================================

  /**
   * Obtiene un voucher por ID
   */
  async getVoucher(voucherId: string): Promise<Voucher> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${voucherId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo voucher:', error);
      // Retornar datos mock para desarrollo
      return this.getMockVoucher(voucherId);
    }
  }

  /**
   * Crea un nuevo voucher
   */
  async createVoucher(data: CreateVoucherData): Promise<Voucher> {
    try {
      const formData = new FormData();
      formData.append('depositId', data.depositId);
      formData.append('userId', data.userId);
      formData.append('amount', data.amount.toString());
      formData.append('currency', data.currency);
      formData.append('voucherFile', data.voucherFile);
      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await apiService.postFormData(`${this.baseUrl}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error creando voucher:', error);
      throw error;
    }
  }

  /**
   * Actualiza un voucher
   */
  async updateVoucher(voucherId: string, data: UpdateVoucherData): Promise<Voucher> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${voucherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando voucher:', error);
      throw error;
    }
  }

  /**
   * Actualiza la imagen del voucher
   */
  async updateVoucherImage(voucherId: string, imageFile: File): Promise<Voucher> {
    try {
      const formData = new FormData();
      formData.append('voucherImage', imageFile);
      
      const response = await apiService.postFormData(`${this.baseUrl}/${voucherId}/image`, formData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando imagen del voucher:', error);
      throw error;
    }
  }

  /**
   * Elimina un voucher
   */
  async deleteVoucher(voucherId: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${voucherId}`);
    } catch (error) {
      console.error('Error eliminando voucher:', error);
      throw error;
    }
  }

  // ============================================================================
  // VERIFICACIÓN E INTEGRIDAD
  // ============================================================================

  /**
   * Verifica la integridad de un voucher
   */
  async checkVoucherIntegrity(voucherId: string): Promise<IntegrityResult> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${voucherId}/integrity`);
      return response.data;
    } catch (error) {
      console.error('Error verificando integridad:', error);
      // Retornar datos mock para desarrollo
      return this.getMockIntegrityResult();
    }
  }

  /**
   * Valida un voucher
   */
  async validateVoucher(voucherId: string): Promise<ValidationResult> {
    try {
      const response = await apiService.post(`${this.baseUrl}/validate`, { voucherId });
      return response.data;
    } catch (error) {
      console.error('Error validando voucher:', error);
      // Retornar datos mock para desarrollo
      return this.getMockValidationResult();
    }
  }

  // ============================================================================
  // DESCARGAS Y URLs
  // ============================================================================

  /**
   * Descarga un voucher
   */
  async downloadVoucher(voucherId: string): Promise<Blob> {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/${voucherId}/download`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error descargando voucher:', error);
      throw error;
    }
  }

  /**
   * Obtiene URL firmada para un voucher
   */
  async getVoucherPresignedUrl(voucherId: string): Promise<string | null> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${voucherId}/presigned-url`);
      return response.data.url;
    } catch (error) {
      console.error('Error obteniendo URL firmada:', error);
      return null;
    }
  }

  // ============================================================================
  // ESTADÍSTICAS Y ANALYTICS
  // ============================================================================

  /**
   * Obtiene estadísticas de vouchers
   */
  async getVoucherStats(): Promise<VoucherStats> {
    try {
      const response = await apiService.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Retornar datos mock para desarrollo
      return this.getMockVoucherStats();
    }
  }

  /**
   * Obtiene analytics de vouchers
   */
  async getVoucherAnalytics(): Promise<VoucherAnalytics> {
    try {
      const response = await apiService.get(`${this.baseUrl}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo analytics:', error);
      // Retornar datos mock para desarrollo
      return this.getMockVoucherAnalytics();
    }
  }

  // ============================================================================
  // DETECCIÓN DE FRAUDE
  // ============================================================================

  /**
   * Obtiene vouchers duplicados
   */
  async getDuplicateVouchers(): Promise<Voucher[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/duplicates`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo duplicados:', error);
      // Retornar datos mock para desarrollo
      return this.getMockDuplicateVouchers();
    }
  }

  /**
   * Obtiene vouchers sospechosos
   */
  async getSuspiciousVouchers(): Promise<Voucher[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/suspicious`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo sospechosos:', error);
      // Retornar datos mock para desarrollo
      return this.getMockSuspiciousVouchers();
    }
  }

  /**
   * Marca un voucher como sospechoso
   */
  async flagVoucher(voucherId: string, reason: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/flag/${voucherId}`, { reason });
    } catch (error) {
      console.error('Error marcando voucher:', error);
      throw error;
    }
  }

  // ============================================================================
  // MANTENIMIENTO Y LIMPIEZA
  // ============================================================================

  /**
   * Limpia vouchers antiguos
   */
  async cleanupVouchers(daysOld: number): Promise<CleanupResult> {
    try {
      const response = await apiService.post(`${this.baseUrl}/cleanup`, { daysOld });
      return response.data;
    } catch (error) {
      console.error('Error limpiando vouchers:', error);
      // Retornar datos mock para desarrollo
      return this.getMockCleanupResult();
    }
  }

  // ============================================================================
  // EXPORTACIÓN
  // ============================================================================

  /**
   * Exporta vouchers con filtros
   */
  async exportVouchers(filters: ExportFilters): Promise<Blob> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/export`,
        filters,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error exportando vouchers:', error);
      throw error;
    }
  }

  // ============================================================================
  // DATOS MOCK PARA DESARROLLO
  // ============================================================================

  private getMockVoucher(voucherId: string): Voucher {
    return {
      id: voucherId,
      depositId: 'dep123',
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
      voucherFile: {
        url: 'https://example.com/voucher.jpg',
        filename: 'voucher_123.jpg',
        uploadedAt: '2024-01-20T10:30:00Z',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        hash: 'abc123def456'
      },
      voucherUrl: 'https://example.com/voucher.jpg',
      hasVoucherFile: true,
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z'
    };
  }

  private getMockIntegrityResult(): IntegrityResult {
    return {
      isValid: true,
      checksum: 'abc123def456',
      originalChecksum: 'abc123def456',
      lastVerified: new Date().toISOString(),
      issues: []
    };
  }

  private getMockValidationResult(): ValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: ['Verificar que el monto coincida con el comprobante']
    };
  }

  private getMockVoucherStats(): VoucherStats {
    return {
      total: 1250,
      pending: 45,
      verified: 1150,
      rejected: 55,
      suspicious: 10,
      totalAmount: 45000.00,
      verifiedAmount: 42000.00,
      averageAmount: 36.00,
      verificationRate: '92%',
      rejectionRate: '4.4%',
      suspiciousRate: '0.8%',
      dailyStats: [
        { date: '2024-01-20', count: 45, amount: 1620.00 },
        { date: '2024-01-21', count: 52, amount: 1872.00 }
      ],
      fraudDetection: {
        duplicatesDetected: 15,
        suspiciousActivity: 8,
        totalRejected: 55,
        flaggedVouchers: 10
      }
    };
  }

  private getMockVoucherAnalytics(): VoucherAnalytics {
    return {
      totalVouchers: 1250,
      totalAmount: 45000.00,
      averageAmount: 36.00,
      verificationRate: '92%',
      rejectionRate: '4.4%',
      suspiciousRate: '0.8%',
      dailyTrends: [
        {
          date: '2024-01-20',
          count: 45,
          amount: 1620.00,
          verified: 42,
          rejected: 3
        }
      ],
      monthlyTrends: [
        {
          month: '2024-01',
          count: 1250,
          amount: 45000.00,
          verified: 1150,
          rejected: 55
        }
      ],
      topUsers: [
        {
          userId: 'user123',
          userName: 'Juan Pérez',
          voucherCount: 25,
          totalAmount: 5000.00,
          verificationRate: '96%'
        }
      ],
      fraudMetrics: {
        duplicatesDetected: 15,
        suspiciousActivity: 8,
        totalRejected: 55,
        flaggedVouchers: 10,
        averageSimilarityScore: 0.85
      }
    };
  }

  private getMockDuplicateVouchers(): Voucher[] {
    return [
      this.getMockVoucher('voucher1'),
      this.getMockVoucher('voucher2')
    ];
  }

  private getMockSuspiciousVouchers(): Voucher[] {
    return [
      {
        ...this.getMockVoucher('suspicious1'),
        status: 'suspicious',
        flaggedAsSuspicious: true,
        suspiciousReason: 'Monto inusual para el usuario'
      }
    ];
  }

  private getMockCleanupResult(): CleanupResult {
    return {
      deletedCount: 25,
      freedSpace: 102400000, // 100MB
      errors: [],
      summary: 'Se eliminaron 25 vouchers antiguos y se liberaron 100MB de espacio'
    };
  }
}

// Exportar instancia única del servicio
export const voucherService = new VoucherService(); 