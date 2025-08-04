# 🚀 Configuración Rápida del Backend - Sistema de Pagos

## Descripción
Guía rápida para configurar el backend del sistema de pagos de Mussikon.

## 📋 Requisitos Previos

### Software Necesario:
- Node.js (v16 o superior)
- MySQL (v8.0) o PostgreSQL (v13)
- Git

### Dependencias:
```bash
npm install express cors helmet morgan jsonwebtoken bcryptjs multer aws-sdk mysql2 dotenv
```

## 🏗️ Estructura del Proyecto

```
app_mussikon_express/
├── package.json
├── .env
├── server.js
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
├── utils/
│   ├── duplicateChecker.js
│   └── imageProcessor.js
└── config/
    ├── database.js
    └── storage.js
```

## ⚙️ Configuración Inicial

### 1. Variables de Entorno (.env)
```bash
# Servidor
PORT=3001
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mussikon_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# iDrive e2
IDRIVE_ACCESS_KEY=tu_access_key
IDRIVE_SECRET_KEY=tu_secret_key
IDRIVE_BUCKET=mussikon-vouchers
IDRIVE_REGION=us-east-1

# CORS
CORS_ORIGIN=http://localhost:5173

# Límites de archivo
MAX_FILE_SIZE=10485760
ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf
```

### 2. Configuración de Base de Datos (config/database.js)
```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
```

### 3. Configuración de Almacenamiento (config/storage.js)
```javascript
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: `https://s3.${process.env.IDRIVE_REGION}.idrivee2.com`,
  accessKeyId: process.env.IDRIVE_ACCESS_KEY,
  secretAccessKey: process.env.IDRIVE_SECRET_KEY,
  region: process.env.IDRIVE_REGION,
  s3ForcePathStyle: true
});

module.exports = s3;
```

## 🗄️ Scripts de Base de Datos

### Crear Tablas (database.sql)
```sql
-- Tabla de depósitos de usuarios
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
  verifiedAt TIMESTAMP NULL,
  rejectedBy VARCHAR(255),
  rejectedAt TIMESTAMP NULL,
  rejectionReason TEXT,
  verificationData JSON,
  duplicateCheck JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

-- Tabla de solicitudes de retiro
CREATE TABLE withdrawal_requests (
  id VARCHAR(255) PRIMARY KEY,
  musicianId VARCHAR(255) NOT NULL,
  bankAccountId VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'DOP',
  status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
  adminNotes TEXT,
  processedBy VARCHAR(255),
  processedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_musicianId (musicianId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

-- Tabla de logs de verificación
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

## 🚀 Servidor Principal (server.js)
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/admin/payments', require('./routes/payments'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint no encontrado' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
```

## 📦 Package.json
```json
{
  "name": "app-mussikon-express",
  "version": "1.0.0",
  "description": "Backend para sistema de pagos Mussikon",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "setup-db": "node scripts/setup-database.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1490.0",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0"
  }
}
```

## 🔧 Comandos de Instalación

### 1. Clonar y configurar:
```bash
# Clonar el repositorio (si existe)
git clone <url-del-repositorio>
cd app_mussikon_express

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### 2. Configurar base de datos:
```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE mussikon_db;
USE mussikon_db;
# Ejecutar el script database.sql
```

### 3. Ejecutar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🧪 Verificación

### 1. Health Check:
```bash
curl http://localhost:3001/health
```

### 2. Verificar endpoints:
```bash
# Desde el proyecto admin
npm run check-payments
```

## 📝 Notas Importantes

### Seguridad:
- Cambiar JWT_SECRET en producción
- Configurar HTTPS en producción
- Implementar rate limiting
- Validar todos los inputs

### Almacenamiento:
- Configurar iDrive e2 correctamente
- Implementar backup automático
- Validar tipos de archivo
- Comprimir imágenes

### Base de Datos:
- Crear índices para optimizar consultas
- Implementar backup regular
- Monitorear performance

### Logging:
- Configurar logs estructurados
- Implementar monitoreo de errores
- Registrar todas las acciones críticas

## 🆘 Solución de Problemas

### Error 404 en endpoints:
- Verificar que las rutas estén registradas
- Verificar que el servidor esté ejecutándose
- Verificar la URL base

### Error 500 en endpoints:
- Revisar logs del servidor
- Verificar configuración de base de datos
- Verificar variables de entorno

### Error de CORS:
- Verificar configuración de CORS
- Verificar origen del frontend
- Verificar headers de requests

### Error de autenticación:
- Verificar JWT_SECRET
- Verificar token en requests
- Verificar middleware de auth

---

**¡Listo!** Con esta configuración, el backend estará listo para manejar las requests del sistema de pagos. 