# Endpoints del Backend para Sistema de Pagos - Mussikon

## Descripción
Este documento describe todos los endpoints necesarios para el sistema de pagos de Mussikon que deben ser implementados en el backend (`../app_mussikon_express`).

## Base URL
```
http://192.168.54.90:3001
```

## Autenticación
Todos los endpoints requieren autenticación JWT en el header:
```
Authorization: Bearer <token>
```

## Endpoints de Depósitos

### 1. Obtener Depósitos Pendientes
```http
GET /admin/payments/pending-deposits
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "dep_001",
      "userId": "user_001",
      "user": {
        "id": "user_001",
        "name": "Juan",
        "lastName": "Pérez",
        "userEmail": "juan.perez@email.com",
        "phone": "+1-809-555-0101"
      },
      "amount": 500.00,
      "currency": "DOP",
      "status": "pending",
      "description": "Depósito para evento de música",
      "voucherFile": {
        "url": "https://storage.example.com/vouchers/dep_001.jpg",
        "filename": "comprobante_001.jpg",
        "uploadedAt": "2024-01-15T10:30:00Z",
        "fileSize": 245760,
        "mimeType": "image/jpeg",
        "hash": "abc123def456"
      },
      "voucherUrl": "https://storage.example.com/vouchers/dep_001.jpg",
      "hasVoucherFile": true,
      "duplicateCheck": {
        "isDuplicate": false,
        "duplicateIds": [],
        "similarityScore": 0
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Verificar Depósito
```http
PUT /admin/payments/verify-deposit/:id
```

**Body:**
```json
{
  "approved": true,
  "notes": "Depósito verificado en cuenta bancaria",
  "verificationData": {
    "bankDepositDate": "2024-01-15",
    "bankDepositTime": "10:30:00",
    "referenceNumber": "REF123456",
    "accountLastFourDigits": "1234",
    "verifiedBy": "admin_user_id",
    "verificationMethod": "bank_statement",
    "bankName": "Banco Popular",
    "depositAmount": 500.00
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "depositId": "dep_001",
    "status": "verified",
    "verifiedBy": "admin_user_id"
  }
}
```

### 3. Obtener Información de Depósito
```http
GET /admin/payments/deposit-info/:id
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "dep_001",
    "userId": "user_001",
    "amount": 500.00,
    "currency": "DOP",
    "status": "pending",
    "voucherFile": {
      "url": "https://storage.example.com/vouchers/dep_001.jpg",
      "filename": "comprobante_001.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "fileSize": 245760,
      "mimeType": "image/jpeg",
      "hash": "abc123def456"
    },
    "hasVoucherFile": true,
    "voucherUrl": "https://storage.example.com/vouchers/dep_001.jpg"
  }
}
```

### 4. Verificar Duplicados
```http
GET /admin/payments/check-duplicate/:id
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "isDuplicate": false,
    "duplicateIds": [],
    "similarityScore": 0,
    "matchedDeposits": []
  }
}
```

### 5. Obtener Imagen de Voucher
```http
GET /admin/payments/voucher-image/:id
```

**Respuesta:** Archivo de imagen (Content-Type: image/jpeg)

### 6. Obtener Imagen de Voucher (Ruta Directa)
```http
GET /admin/payments/voucher-image-direct/:id
```

**Respuesta:** Archivo de imagen (Content-Type: image/jpeg)

### 7. Descargar Voucher
```http
GET /admin/payments/download-voucher/:id
```

**Respuesta:** Archivo para descarga (Content-Disposition: attachment)

### 8. Estadísticas de Depósitos
```http
GET /admin/payments/deposit-stats
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 1250,
    "pending": 15,
    "verified": 1100,
    "rejected": 135,
    "processing": 0,
    "totalAmount": 1250000,
    "verifiedAmount": 1100000,
    "averageAmount": 1000,
    "verificationRate": "88%",
    "rejectionRate": "10.8%",
    "dailyStats": [
      {
        "date": "2024-01-15",
        "count": 25,
        "amount": 25000
      }
    ],
    "fraudDetection": {
      "duplicatesDetected": 5,
      "suspiciousActivity": 12,
      "totalRejected": 135
    }
  }
}
```

### 9. Marcar como Sospechoso
```http
POST /admin/payments/flag-suspicious/:id
```

**Body:**
```json
{
  "reason": "Voucher duplicado detectado",
  "flaggedBy": "admin_user_id"
}
```

## Endpoints de Retiros

### 1. Obtener Retiros Pendientes
```http
GET /admin/payments/pending-withdrawals
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "with_001",
      "musicianId": "musician_001",
      "musician": {
        "id": "musician_001",
        "name": "Ana",
        "lastName": "Martínez",
        "userEmail": "ana.martinez@email.com"
      },
      "bankAccountId": "bank_001",
      "bankAccount": {
        "accountHolder": "Ana Martínez",
        "bankName": "Banco Popular",
        "accountNumber": "****1234"
      },
      "amount": 1500.00,
      "currency": "DOP",
      "status": "pending",
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 2. Procesar Retiro
```http
PUT /admin/payments/process-withdrawal/:id
```

**Body:**
```json
{
  "approved": true,
  "notes": "Retiro aprobado y procesado"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "withdrawalId": "with_001",
    "status": "completed",
    "processedBy": "admin_user_id"
  }
}
```

## Endpoints de Estadísticas

### 1. Estadísticas del Sistema de Pagos
```http
GET /admin/payments/statistics
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "totalDeposits": 12500,
    "totalWithdrawals": 8500,
    "totalCommissions": 1250,
    "pendingDepositsCount": 3,
    "pendingWithdrawalsCount": 2,
    "totalUsers": 150,
    "totalMusicians": 45,
    "totalEvents": 78,
    "fraudDetection": {
      "duplicatesDetected": 5,
      "suspiciousActivity": 12,
      "totalRejected": 25
    },
    "lastUpdated": "2024-01-15T12:00:00Z"
  }
}
```

## Estructura de Base de Datos

### Tabla: user_deposits
```sql
CREATE TABLE user_deposits (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'DOP',
  status ENUM('pending', 'verified', 'rejected', 'processing') DEFAULT 'pending',
  description TEXT,
  voucherFile JSON,
  voucherUrl VARCHAR(500),
  hasVoucherFile BOOLEAN DEFAULT FALSE,
  adminNotes TEXT,
  verifiedBy VARCHAR(255),
  verifiedAt TIMESTAMP,
  rejectedBy VARCHAR(255),
  rejectedAt TIMESTAMP,
  rejectionReason TEXT,
  verificationData JSON,
  duplicateCheck JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

### Tabla: withdrawal_requests
```sql
CREATE TABLE withdrawal_requests (
  id VARCHAR(255) PRIMARY KEY,
  musicianId VARCHAR(255) NOT NULL,
  bankAccountId VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'DOP',
  status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
  adminNotes TEXT,
  processedBy VARCHAR(255),
  processedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_musicianId (musicianId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

### Tabla: verification_logs
```sql
CREATE TABLE verification_logs (
  id VARCHAR(255) PRIMARY KEY,
  depositId VARCHAR(255) NOT NULL,
  adminId VARCHAR(255) NOT NULL,
  action ENUM('verify', 'reject', 'flag_suspicious') NOT NULL,
  notes TEXT,
  verificationData JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_depositId (depositId),
  INDEX idx_adminId (adminId),
  INDEX idx_createdAt (createdAt)
);
```

## Implementación en Express.js

### Estructura de Archivos Recomendada:
```
app_mussikon_express/
├── routes/
│   └── payments.js
├── controllers/
│   └── paymentController.js
├── models/
│   ├── UserDeposit.js
│   ├── WithdrawalRequest.js
│   └── VerificationLog.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── services/
│   ├── depositService.js
│   ├── withdrawalService.js
│   └── imageService.js
└── utils/
    ├── duplicateChecker.js
    └── imageProcessor.js
```

### Ejemplo de Implementación Básica:

```javascript
// routes/payments.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Depósitos
router.get('/pending-deposits', auth, paymentController.getPendingDeposits);
router.put('/verify-deposit/:id', auth, paymentController.verifyDeposit);
router.get('/deposit-info/:id', auth, paymentController.getDepositInfo);
router.get('/check-duplicate/:id', auth, paymentController.checkDuplicate);
router.get('/voucher-image/:id', auth, paymentController.getVoucherImage);
router.get('/voucher-image-direct/:id', auth, paymentController.getVoucherImageDirect);
router.get('/download-voucher/:id', auth, paymentController.downloadVoucher);
router.get('/deposit-stats', auth, paymentController.getDepositStats);
router.post('/flag-suspicious/:id', auth, paymentController.flagSuspicious);

// Retiros
router.get('/pending-withdrawals', auth, paymentController.getPendingWithdrawals);
router.put('/process-withdrawal/:id', auth, paymentController.processWithdrawal);

// Estadísticas
router.get('/statistics', auth, paymentController.getPaymentStatistics);

module.exports = router;
```

## Configuración de Almacenamiento

### iDrive e2 Configuration:
```javascript
// config/storage.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://s3.us-east-1.idrivee2.com',
  accessKeyId: process.env.IDRIVE_ACCESS_KEY,
  secretAccessKey: process.env.IDRIVE_SECRET_KEY,
  region: 'us-east-1',
  s3ForcePathStyle: true
});

module.exports = s3;
```

## Variables de Entorno Requeridas:
```bash
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mussikon_db

# JWT
JWT_SECRET=your_jwt_secret_key

# iDrive e2
IDRIVE_ACCESS_KEY=your_access_key
IDRIVE_SECRET_KEY=your_secret_key
IDRIVE_BUCKET=mussikon-vouchers

# Servidor
PORT=3001
NODE_ENV=development
```

## Notas de Implementación

1. **Seguridad**: Todos los endpoints deben validar el token JWT
2. **Validación**: Validar todos los datos de entrada
3. **Logging**: Registrar todas las acciones importantes
4. **Error Handling**: Manejar errores apropiadamente
5. **Rate Limiting**: Implementar límites de tasa para prevenir abuso
6. **CORS**: Configurar CORS para permitir requests del frontend
7. **File Upload**: Validar tipos y tamaños de archivo
8. **Duplicate Detection**: Implementar algoritmo de detección de duplicados
9. **Image Processing**: Comprimir y optimizar imágenes
10. **Backup**: Implementar backup automático de datos críticos

---

**Nota**: Esta documentación debe ser implementada en el backend (`../app_mussikon_express`) para que el sistema de pagos funcione correctamente. 