// Índice de exportaciones del Sistema de Pagos - MussikOn Admin System
// Exporta todos los hooks y componentes del sistema de pagos

// ============================================================================
// SERVICIOS
// ============================================================================

export { paymentSystemService } from '../../services/paymentSystemService';
export { voucherService } from '../../services/voucherService';

// ============================================================================
// TIPOS
// ============================================================================

export type {
  UserBalance,
  BankAccount,
  BankAccountData,
  DepositData,
  PaymentData,
  MusicianEarnings,
  WithdrawalRequestData,
  PaymentStats
} from '../../services/paymentSystemService';

export type {
  Voucher,
  CreateVoucherData,
  UpdateVoucherData,
  IntegrityResult,
  ValidationResult,
  VoucherStats,
  CleanupResult,
  VoucherAnalytics,
  ExportFilters
} from '../../services/voucherService';

// ============================================================================
// HOOKS
// ============================================================================

// Balance
export {
  usePaymentBalance,
  useBalanceValue,
  useHasSufficientFunds,
  useFormattedBalance
} from './hooks/usePaymentBalance';

// Depósitos
export {
  useDeposits,
  useDepositUpload,
  useDepositsByStatus,
  usePendingDeposits,
  useVerifiedDeposits,
  useRejectedDeposits,
  useDepositsStats
} from './hooks/useDeposits';

// Cuentas Bancarias
export {
  useBankAccounts,
  useBankAccountRegistration,
  useDefaultBankAccount,
  useVerifiedBankAccounts,
  useUnverifiedBankAccounts,
  useHasBankAccounts,
  useHasVerifiedBankAccounts,
  useBankAccountsStats
} from './hooks/useBankAccounts';

// ============================================================================
// COMPONENTES
// ============================================================================

// Componentes principales
export { default as BalanceCard } from './components/BalanceCard';
export { default as Payments } from './Payments';

// Componentes de formularios
export { default as DepositForm } from './components/DepositForm';
export { default as BankAccountForm } from './components/BankAccountForm';
export { default as WithdrawalForm } from './components/WithdrawalForm';

// Componentes de listas
export { default as DepositHistory } from './components/DepositHistory';
export { default as BankAccountsList } from './components/BankAccountsList';
export { default as TransactionHistory } from './components/TransactionHistory';

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Función para formatear moneda
 * @param amount - Cantidad a formatear
 * @param currency - Moneda (por defecto USD)
 * @returns String formateado con moneda
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Función para formatear números con separadores de miles
 * @param num - Número a formatear
 * @returns String formateado
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

/**
 * Función para obtener el color del balance según el monto
 * @param amount - Monto a evaluar
 * @returns Color en formato CSS
 */
export const getBalanceColor = (amount: number): string => {
  if (amount > 1000) return '#2e7d32'; // success
  if (amount > 500) return '#ed6c02'; // warning
  return '#d32f2f'; // error
};

/**
 * Función para obtener el texto del tipo de usuario
 * @param userType - Tipo de usuario
 * @returns Texto en español
 */
export const getUserTypeText = (userType: string): string => {
  switch (userType) {
    case 'musician':
      return 'Músico';
    case 'event_organizer':
      return 'Organizador';
    default:
      return userType;
  }
};

/**
 * Función para obtener el color del chip según el tipo de usuario
 * @param userType - Tipo de usuario
 * @returns Color del chip
 */
export const getUserTypeColor = (userType: string): 'primary' | 'secondary' | 'default' => {
  switch (userType) {
    case 'musician':
      return 'primary';
    case 'event_organizer':
      return 'secondary';
    default:
      return 'default';
  }
};

/**
 * Función para validar archivos de imagen
 * @param file - Archivo a validar
 * @param maxSize - Tamaño máximo en MB (por defecto 10MB)
 * @returns Objeto con validación y mensaje de error
 */
export const validateImageFile = (file: File, maxSize: number = 10): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  const maxSizeBytes = maxSize * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF) y PDF.'
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB.`
    };
  }

  return { isValid: true };
};

/**
 * Función para crear FormData para depósitos
 * @param amount - Monto del depósito
 * @param currency - Moneda
 * @param voucherFile - Archivo del comprobante
 * @param description - Descripción opcional
 * @returns FormData listo para enviar
 */
export const createDepositFormData = (
  amount: number,
  currency: string,
  voucherFile: File,
  description?: string
): FormData => {
  const formData = new FormData();
  formData.append('amount', amount.toString());
  formData.append('currency', currency);
  formData.append('voucherFile', voucherFile);
  
  if (description) {
    formData.append('description', description);
  }

  return formData;
}; 