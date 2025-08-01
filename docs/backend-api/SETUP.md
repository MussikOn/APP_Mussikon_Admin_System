# 🛠️ Configuración y Setup - APP_Mussikon_Express

## 📋 Índice
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Configuración del Entorno](#configuración-del-entorno)
- [Variables de Entorno](#variables-de-entorno)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Configuración de Firebase](#configuración-de-firebase)
- [Configuración de Servicios Externos](#configuración-de-servicios-externos)
- [Configuración de Seguridad](#configuración-de-seguridad)
- [Despliegue](#despliegue)
- [Troubleshooting](#troubleshooting)

---

## 💻 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **TypeScript**: v4.9.0 o superior
- **Firebase CLI**: v11.0.0 o superior
- **Git**: v2.30.0 o superior

### Requisitos Recomendados
- **Node.js**: v20.0.0 LTS
- **npm**: v10.0.0
- **TypeScript**: v5.0.0
- **Firebase CLI**: v12.0.0
- **Git**: v2.40.0

### Verificación de Requisitos

```bash
# Verificar Node.js
node --version
# Debe mostrar v18.0.0 o superior

# Verificar npm
npm --version
# Debe mostrar v8.0.0 o superior

# Verificar TypeScript
npx tsc --version
# Debe mostrar v4.9.0 o superior

# Verificar Firebase CLI
firebase --version
# Debe mostrar v11.0.0 o superior

# Verificar Git
git --version
# Debe mostrar v2.30.0 o superior
```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/app_mussikon_express.git

# Navegar al directorio
cd app_mussikon_express

# Verificar la estructura del proyecto
ls -la
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de producción
npm install

# Instalar dependencias de desarrollo (opcional)
npm install --save-dev

# Verificar que todas las dependencias se instalaron correctamente
npm list --depth=0
```

### 3. Verificar la Instalación

```bash
# Verificar que el proyecto se puede compilar
npm run build

# Verificar que los tests pasan
npm test

# Verificar que el linter no encuentra errores
npm run lint
```

---

## ⚙️ Configuración del Entorno

### 1. Estructura de Archivos de Configuración

```
app_mussikon_express/
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuración de base de datos
│   │   ├── firebase.ts      # Configuración de Firebase
│   │   ├── email.ts         # Configuración de email
│   │   └── security.ts      # Configuración de seguridad
│   ├── utils/
│   │   ├── firebase.ts      # Utilidades de Firebase
│   │   └── jwt.ts          # Utilidades de JWT
│   └── middleware/
│       ├── authMiddleware.ts # Middleware de autenticación
│       └── validationMiddleware.ts # Middleware de validación
├── .env.example            # Ejemplo de variables de entorno
├── .env                    # Variables de entorno (crear)
├── firebase.json           # Configuración de Firebase
├── .firebaserc            # Configuración de proyecto Firebase
└── tsconfig.json          # Configuración de TypeScript
```

### 2. Crear Archivo de Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo con tus configuraciones
nano .env
```

### 3. Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/config/*": ["src/config/*"],
      "@/utils/*": ["src/utils/*"],
      "@/middleware/*": ["src/middleware/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/models/*": ["src/models/*"],
      "@/routes/*": ["src/routes/*"],
      "@/types/*": ["src/types/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

---

## 🔧 Variables de Entorno

### 1. Variables Principales

```bash
# .env
# Configuración del servidor
PORT=3000
NODE_ENV=development
API_VERSION=v1
BASE_URL=http://localhost:3000

# Configuración de JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro_aqui
JWT_REFRESH_EXPIRES_IN=7d

# Configuración de Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY_ID=tu_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu_private_key_aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto.iam.gserviceaccount.com

# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=tu_email@gmail.com

# Configuración de Base de Datos (si usas otra además de Firebase)
DATABASE_URL=tu_database_url
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tu_database_name
DATABASE_USER=tu_database_user
DATABASE_PASSWORD=tu_database_password

# Configuración de Servicios Externos
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret

# Configuración de Seguridad
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000,https://tu-dominio.com

# Configuración de Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Configuración de Notificaciones Push
FCM_SERVER_KEY=tu_fcm_server_key
FCM_PROJECT_ID=tu_fcm_project_id
```

### 2. Configuración por Entorno

```bash
# .env.development
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# .env.production
NODE_ENV=production
PORT=8080
LOG_LEVEL=error
CORS_ORIGIN=https://tu-dominio.com
```

### 3. Validación de Variables de Entorno

```typescript
// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

// Cargar variables de entorno
dotenv.config();

// Esquema de validación
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
  CORS_ORIGIN: z.string(),
});

// Validar variables de entorno
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Error en variables de entorno:', error);
    process.exit(1);
  }
};

export const env = validateEnv();
```

---

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication, Firestore y Storage
4. Configura las reglas de seguridad

### 2. Obtener Credenciales de Servicio

1. Ve a Configuración del Proyecto > Cuentas de servicio
2. Genera una nueva clave privada
3. Descarga el archivo JSON
4. Copia las credenciales a tu archivo `.env`

### 3. Configuración de Firebase en el Código

```typescript
// src/config/firebase.ts
import admin from 'firebase-admin';
import { env } from './env';

const serviceAccount = {
  type: 'service_account',
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: env.FIREBASE_AUTH_URI,
  token_uri: env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: env.FIREBASE_CLIENT_X509_CERT_URL,
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
```

### 4. Reglas de Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || request.auth.token.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Eventos
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.user == request.auth.uid || 
        request.auth.token.role == 'admin'
      );
      allow delete: if request.auth != null && (
        resource.data.user == request.auth.uid || 
        request.auth.token.role == 'admin'
      );
    }
    
    // Imágenes
    match /images/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Reglas de Storage

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes de perfil
    match /profile/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Imágenes de eventos
    match /events/{eventId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Imágenes públicas
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📧 Configuración de Servicios Externos

### 1. Configuración de Email (Nodemailer)

```typescript
// src/config/email.ts
import nodemailer from 'nodemailer';
import { env } from './env';

// Configurar transporter
const transporter = nodemailer.createTransporter({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === '465',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo');
  }
});

export default transporter;
```

### 2. Configuración de Google Maps

```typescript
// src/config/maps.ts
import { env } from './env';

export const googleMapsConfig = {
  apiKey: env.GOOGLE_MAPS_API_KEY,
  baseUrl: 'https://maps.googleapis.com/maps/api',
};

export const getGeocodeUrl = (address: string) => {
  return `${googleMapsConfig.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsConfig.apiKey}`;
};

export const getDistanceMatrixUrl = (origins: string, destinations: string) => {
  return `${googleMapsConfig.baseUrl}/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${googleMapsConfig.apiKey}`;
};
```

### 3. Configuración de Stripe

```typescript
// src/config/stripe.ts
import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const stripeConfig = {
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
};
```

---

## 🔒 Configuración de Seguridad

### 1. Configuración de CORS

```typescript
// src/config/cors.ts
import cors from 'cors';
import { env } from './env';

const corsOptions = {
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas
};

export const corsMiddleware = cors(corsOptions);
```

### 2. Configuración de Rate Limiting

```typescript
// src/config/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { env } from './env';

// Rate limiter general
export const generalLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(env.RATE_LIMIT_MAX_REQUESTS),
  message: {
    error: 'Demasiadas requests desde esta IP, intenta nuevamente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por IP
  message: {
    error: 'Demasiados intentos de autenticación, intenta nuevamente en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para subida de archivos
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 uploads por IP
  message: {
    error: 'Demasiadas subidas de archivos, intenta nuevamente en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 3. Configuración de Helmet

```typescript
// src/config/helmet.ts
import helmet from 'helmet';

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
```

### 4. Configuración de JWT

```typescript
// src/config/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from './env';

export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
  refreshSecret: env.JWT_REFRESH_SECRET,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
};

export const createToken = (payload: any) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

export const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret);
  } catch (error) {
    throw new Error('Refresh token inválido');
  }
};
```

---

## 🚀 Despliegue

### 1. Despliegue en Firebase Functions

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Iniciar sesión en Firebase
firebase login

# Inicializar proyecto Firebase
firebase init functions

# Configurar TypeScript
cd functions
npm install typescript @types/node

# Compilar el proyecto
npm run build

# Desplegar
firebase deploy --only functions
```

### 2. Configuración de Firebase Functions

```json
// firebase.json
{
  "functions": {
    "source": ".",
    "runtime": "nodejs18",
    "codebase": "default",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log",
      "dist",
      "coverage"
    ],
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 3. Despliegue en Heroku

```bash
# Crear archivo Procfile
echo "web: npm start" > Procfile

# Configurar variables de entorno en Heroku
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_jwt_secret
heroku config:set FIREBASE_PROJECT_ID=tu-proyecto-firebase
# ... configurar todas las variables necesarias

# Desplegar
git push heroku main
```

### 4. Despliegue en Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env
    restart: unless-stopped
```

---

## 🔧 Troubleshooting

### 1. Problemas Comunes

#### Error: "Firebase not initialized"
```bash
# Solución: Verificar credenciales de Firebase
# 1. Verificar que el archivo .env tiene todas las variables de Firebase
# 2. Verificar que las credenciales son correctas
# 3. Verificar que el proyecto Firebase existe

# Comando para verificar configuración
npm run verify:firebase
```

#### Error: "JWT_SECRET not defined"
```bash
# Solución: Configurar JWT_SECRET
# 1. Generar un secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Agregar al archivo .env
JWT_SECRET=tu_secret_generado
```

#### Error: "Email configuration failed"
```bash
# Solución: Configurar email correctamente
# 1. Verificar credenciales de Gmail
# 2. Habilitar autenticación de 2 factores
# 3. Generar contraseña de aplicación
# 4. Usar la contraseña de aplicación en EMAIL_PASS
```

### 2. Comandos de Verificación

```bash
# Verificar configuración completa
npm run verify:config

# Verificar conexión a Firebase
npm run verify:firebase

# Verificar conexión de email
npm run verify:email

# Verificar variables de entorno
npm run verify:env

# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Verificar tipos TypeScript
npm run type-check
```

### 3. Logs y Debugging

```typescript
// src/config/logger.ts
import winston from 'winston';
import { env } from './env';

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'app-mussikon-express' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 4. Scripts de Package.json

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "type-check": "tsc --noEmit",
    "verify:config": "node scripts/verify-config.js",
    "verify:firebase": "node scripts/verify-firebase.js",
    "verify:email": "node scripts/verify-email.js",
    "verify:env": "node scripts/verify-env.js",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "postbuild": "npm run type-check"
  }
}
```

---

## 📝 Notas Importantes

1. **Seguridad**: Nunca commits credenciales en el repositorio
2. **Variables de Entorno**: Siempre usa variables de entorno para configuraciones sensibles
3. **Firebase**: Verifica que las reglas de seguridad estén configuradas correctamente
4. **Logs**: Implementa un sistema de logging robusto para debugging
5. **Tests**: Mantén una buena cobertura de tests para detectar problemas temprano

---

*Última actualización: Enero 2025* 