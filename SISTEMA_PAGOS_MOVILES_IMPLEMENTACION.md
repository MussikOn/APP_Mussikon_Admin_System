# 💰 SISTEMA DE PAGOS MÓVILES - IMPLEMENTACIÓN COMPLETA

## 📊 RESUMEN EJECUTIVO

**Funcionalidad**: Sistema completo de pagos móviles para MussikOn  
**Backend endpoints disponibles**: 45 endpoints  
**Frontend implementado**: 10 endpoints (22%)  
**Endpoints faltantes**: 35 endpoints (78%)  
**Prioridad**: CRÍTICA - Fase 1

---

## 🏗️ ARQUITECTURA DEL SISTEMA DE PAGOS

### Stack Tecnológico
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: Firebase Firestore
- **Almacenamiento**: AWS S3 (idriveE2)
- **Autenticación**: JWT
- **Validación**: Joi + Multer
- **Email**: Nodemailer

### Estructura de Datos

#### UserDeposit (Depósito de Usuario)
```typescript
interface UserDeposit {
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
```

#### UserBalance (Balance de Usuario)
```typescript
interface UserBalance {
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
```

#### BankAccount (Cuenta Bancaria)
```typescript
interface BankAccount {
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
```

#### WithdrawalRequest (Solicitud de Retiro)
```typescript
interface WithdrawalRequest {
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
```

---

## 📡 ENDPOINTS DEL BACKEND - SISTEMA DE PAGOS

### ✅ **IMPLEMENTADOS EN FRONTEND (10 endpoints)**

#### Administración
- `GET /payment-system/statistics` - Estadísticas de pagos
- `GET /payment-system/pending-deposits` - Depósitos pendientes
- `GET /payment-system/pending-withdrawals` - Retiros pendientes
- `PUT /payment-system/verify-deposit/:id` - Verificar depósito
- `PUT /payment-system/process-withdrawal/:id` - Procesar retiro
- `GET /payment-system/deposit-info/:id` - Información de depósito
- `GET /payment-system/check-duplicate/:id` - Verificar duplicados
- `GET /payment-system/voucher-image/:id` - Imagen del voucher
- `GET /payment-system/voucher-image-direct/:id` - Imagen directa
- `GET /payment-system/voucher/:id/presigned-url` - URL firmada

### ❌ **FALTANTES (35 endpoints)**

#### Para Usuarios Móviles
- `GET /payment-system/my-balance` - Mi balance
- `POST /payment-system/deposit` - Subir depósito
- `GET /payment-system/my-deposits` - Mis depósitos
- `POST /payment-system/bank-accounts/register` - Registrar cuenta bancaria
- `GET /payment-system/bank-accounts/my-accounts` - Mis cuentas bancarias
- `POST /payment-system/events/:eventId/pay-musician` - Pagar músico
- `GET /payment-system/musicians/earnings` - Ganancias de músico
- `POST /payment-system/musicians/withdraw-earnings` - Solicitar retiro

#### Para Administración
- `GET /payment-system/deposit-stats` - Estadísticas de depósitos
- `POST /payment-system/flag-suspicious/:id` - Marcar como sospechoso
- `GET /payment-system/download-voucher/:id` - Descargar voucher
- `GET /firestore/indexes/status` - Estado de índices

#### Sistema de Vouchers
- `GET /vouchers/:id` - Obtener voucher
- `POST /vouchers/:id` - Crear voucher
- `PUT /vouchers/:id` - Actualizar voucher
- `DELETE /vouchers/:id` - Eliminar voucher
- `GET /vouchers/:id/integrity` - Verificar integridad
- `GET /vouchers/:id/download` - Descargar voucher
- `GET /vouchers/:id/presigned-url` - URL firmada
- `GET /vouchers/stats` - Estadísticas de vouchers
- `GET /vouchers/cleanup` - Limpieza de vouchers
- `POST /vouchers/validate` - Validar voucher
- `GET /vouchers/duplicates` - Vouchers duplicados
- `POST /vouchers/flag/:id` - Marcar voucher
- `GET /vouchers/suspicious` - Vouchers sospechosos
- `GET /vouchers/export` - Exportar vouchers
- `GET /vouchers/analytics` - Analytics de vouchers

#### Rutas de Compatibilidad
- `GET /admin/payments/pending-deposits` - Depósitos pendientes (compatibilidad)
- `PUT /admin/payments/verify-deposit/:id` - Verificar depósito (compatibilidad)
- `GET /admin/payments/pending-withdrawals` - Retiros pendientes (compatibilidad)
- `PUT /admin/payments/process-withdrawal/:id` - Procesar retiro (compatibilidad)
- `GET /admin/payments/statistics` - Estadísticas (compatibilidad)
- `GET /admin/payments/deposit-stats` - Estadísticas de depósitos (compatibilidad)
- `GET /admin/payments/deposit-info/:id` - Información de depósito (compatibilidad)
- `GET /admin/payments/check-duplicate/:id` - Verificar duplicados (compatibilidad)
- `GET /admin/payments/voucher-image/:id` - Imagen del voucher (compatibilidad)
- `GET /admin/payments/voucher-image-direct/:id` - Imagen directa (compatibilidad)
- `GET /admin/payments/download-voucher/:id` - Descargar voucher (compatibilidad)
- `POST /admin/payments/flag-suspicious/:id` - Marcar como sospechoso (compatibilidad)

---

## 🔧 IMPLEMENTACIÓN EN EL FRONTEND

### 1. **Servicios Necesarios**

#### PaymentSystemService (Nuevo)
```typescript
// src/services/paymentSystemService.ts
export class PaymentSystemService {
  // Para usuarios móviles
  async getMyBalance(): Promise<UserBalance>
  async uploadDeposit(formData: FormData): Promise<UserDeposit>
  async getMyDeposits(): Promise<UserDeposit[]>
  async registerBankAccount(data: BankAccountData): Promise<BankAccount>
  async getMyBankAccounts(): Promise<BankAccount[]>
  async payMusicianForEvent(eventId: string, data: PaymentData): Promise<any>
  async getMusicianEarnings(): Promise<MusicianEarnings[]>
  async requestWithdrawal(data: WithdrawalRequestData): Promise<WithdrawalRequest>

  // Para administración
  async getPaymentStatistics(): Promise<PaymentStats>
  async getPendingDeposits(): Promise<UserDeposit[]>
  async getPendingWithdrawals(): Promise<WithdrawalRequest[]>
  async verifyDeposit(depositId: string, data: VerifyDepositData): Promise<any>
  async processWithdrawal(withdrawalId: string, data: ProcessWithdrawalData): Promise<any>
  async getDepositInfo(depositId: string): Promise<UserDeposit>
  async checkDuplicateVoucher(depositId: string): Promise<DuplicateCheckResult>
  async getVoucherImageUrl(depositId: string): Promise<string>
  async getVoucherPresignedUrl(depositId: string): Promise<string>
  async downloadVoucher(depositId: string): Promise<Blob>
  async flagSuspiciousDeposit(depositId: string, reason: string): Promise<void>
  async getDepositStats(): Promise<DepositStats>
}
```

#### VoucherService (Nuevo)
```typescript
// src/services/voucherService.ts
export class VoucherService {
  async getVoucher(voucherId: string): Promise<Voucher>
  async createVoucher(data: CreateVoucherData): Promise<Voucher>
  async updateVoucher(voucherId: string, data: UpdateVoucherData): Promise<Voucher>
  async deleteVoucher(voucherId: string): Promise<void>
  async checkVoucherIntegrity(voucherId: string): Promise<IntegrityResult>
  async downloadVoucher(voucherId: string): Promise<Blob>
  async getVoucherPresignedUrl(voucherId: string): Promise<string>
  async getVoucherStats(): Promise<VoucherStats>
  async cleanupVouchers(daysOld: number): Promise<CleanupResult>
  async validateVoucher(voucherId: string): Promise<ValidationResult>
  async getDuplicateVouchers(): Promise<Voucher[]>
  async flagVoucher(voucherId: string, reason: string): Promise<void>
  async getSuspiciousVouchers(): Promise<Voucher[]>
  async exportVouchers(filters: ExportFilters): Promise<Blob>
  async getVoucherAnalytics(): Promise<VoucherAnalytics>
}
```

### 2. **Componentes Necesarios**

#### Para Usuarios Móviles
```typescript
// src/features/payments/components/
- BalanceCard.tsx           // Mostrar balance actual
- DepositForm.tsx          // Formulario de subida de depósito
- DepositHistory.tsx       // Historial de depósitos
- BankAccountForm.tsx      // Registro de cuenta bancaria
- BankAccountsList.tsx     // Lista de cuentas bancarias
- PaymentForm.tsx          // Formulario de pago a músico
- EarningsCard.tsx         // Mostrar ganancias
- WithdrawalForm.tsx       // Formulario de solicitud de retiro
- VoucherUpload.tsx        // Subida de comprobante
- PaymentStatus.tsx        // Estado del pago
```

#### Para Administración
```typescript
// src/features/payments/components/admin/
- PaymentDashboard.tsx     // Dashboard de pagos
- PendingDepositsList.tsx  // Lista de depósitos pendientes
- DepositVerification.tsx  // Verificación de depósito
- VoucherViewer.tsx        // Visor de comprobantes
- DuplicateChecker.tsx     // Verificador de duplicados
- WithdrawalProcessor.tsx  // Procesador de retiros
- PaymentStats.tsx         // Estadísticas de pagos
- SuspiciousFlag.tsx       // Marcador de sospechosos
- VoucherManager.tsx       // Gestor de vouchers
- PaymentAnalytics.tsx     // Analytics de pagos
```

### 3. **Páginas Necesarias**

#### Para Usuarios Móviles
```typescript
// src/features/payments/pages/
- BalancePage.tsx          // Página de balance
- DepositPage.tsx          // Página de depósito
- DepositsHistoryPage.tsx  // Página de historial
- BankAccountsPage.tsx     // Página de cuentas bancarias
- PaymentPage.tsx          // Página de pago
- EarningsPage.tsx         // Página de ganancias
- WithdrawalPage.tsx       // Página de retiro
```

#### Para Administración
```typescript
// src/features/payments/pages/admin/
- PaymentDashboardPage.tsx // Dashboard de pagos
- PendingDepositsPage.tsx  // Depósitos pendientes
- DepositVerificationPage.tsx // Verificación de depósitos
- WithdrawalProcessingPage.tsx // Procesamiento de retiros
- VoucherManagementPage.tsx // Gestión de vouchers
- PaymentAnalyticsPage.tsx // Analytics de pagos
- PaymentSettingsPage.tsx  // Configuración de pagos
```

### 4. **Hooks Necesarios**

```typescript
// src/features/payments/hooks/
- usePaymentBalance.ts     // Hook para balance
- useDeposits.ts          // Hook para depósitos
- useWithdrawals.ts       // Hook para retiros
- useBankAccounts.ts      // Hook para cuentas bancarias
- useVouchers.ts          // Hook para vouchers
- usePaymentStats.ts      // Hook para estadísticas
- usePaymentVerification.ts // Hook para verificación
```

### 5. **Tipos TypeScript**

```typescript
// src/features/payments/types/
- paymentTypes.ts          // Tipos de pagos
- depositTypes.ts          // Tipos de depósitos
- withdrawalTypes.ts       // Tipos de retiros
- voucherTypes.ts          // Tipos de vouchers
- bankAccountTypes.ts      // Tipos de cuentas bancarias
- paymentStatsTypes.ts     // Tipos de estadísticas
```

---

## 🎯 FLUJO DE IMPLEMENTACIÓN

### **FASE 1: Servicios Base (Semana 1)**

1. **Crear PaymentSystemService**
   - Implementar métodos para usuarios móviles
   - Implementar métodos para administración
   - Agregar manejo de errores
   - Agregar logging

2. **Crear VoucherService**
   - Implementar gestión de vouchers
   - Implementar verificación de integridad
   - Implementar detección de duplicados
   - Agregar analytics

3. **Crear tipos TypeScript**
   - Definir interfaces para todos los tipos
   - Agregar validaciones
   - Documentar tipos

### **FASE 2: Componentes Base (Semana 2)**

1. **Componentes de Usuarios Móviles**
   - BalanceCard
   - DepositForm
   - DepositHistory
   - BankAccountForm

2. **Componentes de Administración**
   - PaymentDashboard
   - PendingDepositsList
   - DepositVerification
   - VoucherViewer

3. **Hooks personalizados**
   - usePaymentBalance
   - useDeposits
   - useWithdrawals
   - useBankAccounts

### **FASE 3: Páginas y Rutas (Semana 3)**

1. **Páginas de Usuarios Móviles**
   - BalancePage
   - DepositPage
   - DepositsHistoryPage
   - BankAccountsPage

2. **Páginas de Administración**
   - PaymentDashboardPage
   - PendingDepositsPage
   - DepositVerificationPage
   - WithdrawalProcessingPage

3. **Configurar rutas**
   - Agregar rutas al router
   - Configurar guards de autenticación
   - Configurar guards de roles

### **FASE 4: Funcionalidades Avanzadas (Semana 4)**

1. **Sistema de Vouchers**
   - VoucherManager
   - DuplicateChecker
   - SuspiciousFlag
   - VoucherAnalytics

2. **Sistema de Analytics**
   - PaymentAnalytics
   - PaymentStats
   - Exportación de datos
   - Reportes

3. **Optimizaciones**
   - Caching
   - Lazy loading
   - Performance optimization
   - Error handling

---

## 🔒 SEGURIDAD Y VALIDACIONES

### **Validaciones de Entrada**
```typescript
// Validaciones para depósitos
const depositValidation = {
  amount: {
    required: true,
    min: 1,
    max: 1000000,
    type: 'number'
  },
  voucherFile: {
    required: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
  },
  description: {
    maxLength: 500
  }
};

// Validaciones para cuentas bancarias
const bankAccountValidation = {
  accountHolder: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  accountNumber: {
    required: true,
    pattern: /^\d{8,17}$/
  },
  bankName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  routingNumber: {
    required: true,
    pattern: /^\d{9}$/
  }
};
```

### **Medidas de Seguridad**
- Validación de archivos en frontend y backend
- Detección de duplicados
- Verificación de integridad de archivos
- Límites de tamaño y tipo
- Sanitización de datos
- Auditoría de transacciones

---

## 📊 MÉTRICAS Y MONITOREO

### **Métricas de Rendimiento**
- Tiempo de subida de archivos
- Tiempo de verificación
- Tasa de éxito de transacciones
- Uso de almacenamiento
- Errores de validación

### **Métricas de Negocio**
- Total de depósitos procesados
- Total de retiros procesados
- Tasa de verificación
- Tasa de rechazo
- Detección de fraudes

### **Alertas**
- Archivos sospechosos
- Intentos de duplicados
- Errores de validación
- Problemas de almacenamiento
- Fallos de verificación

---

## 🚀 CONCLUSIÓN

El sistema de pagos móviles es una **funcionalidad crítica** que requiere implementación inmediata. Con 35 endpoints faltantes (78% del sistema), representa una oportunidad significativa para mejorar la gestión de la plataforma.

**Beneficios de la implementación:**
- Gestión completa de pagos móviles
- Verificación administrativa eficiente
- Detección de fraudes
- Analytics detallados
- Experiencia de usuario mejorada

**Tiempo estimado**: 4 semanas con equipo de 2 desarrolladores
**Prioridad**: CRÍTICA - Implementar en Fase 1 