# Guía de Instalación - APP Mussikon Admin

## 🚀 Introducción

Esta guía proporciona instrucciones paso a paso para instalar y configurar el **APP Mussikon Admin System** en tu entorno de desarrollo local.

## 📋 Requisitos Previos

### **Sistema Operativo**
- **Windows**: 10 o superior
- **macOS**: 10.15 (Catalina) o superior
- **Linux**: Ubuntu 18.04+ o distribución similar

### **Software Requerido**
```bash
# Versiones mínimas recomendadas
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0
```

### **Verificar Instalaciones**
```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 8.x.x o superior

# Verificar Git
git --version
# Debe mostrar: 2.30.x o superior
```

## 📦 Instalación del Proyecto

### **1. Clonar el Repositorio**

```bash
# Clonar el repositorio
git clone https://github.com/MussikOn/APP_Mussikon_Admin_System.git

# Navegar al directorio del proyecto
cd APP_Mussikon_Admin_System

# Verificar que estás en el directorio correcto
ls
# Debe mostrar: package.json, src/, docs/, etc.
```

### **2. Instalar Dependencias**

```bash
# Instalar todas las dependencias
npm install

# Verificar que la instalación fue exitosa
npm list --depth=0
```

### **3. Configurar Variables de Entorno**

```bash
# Crear archivo de variables de entorno
cp .env.example .env

# Editar el archivo .env con tu configuración
nano .env
# o
code .env
```

#### **Contenido del archivo .env**
```env
# API Configuration
VITE_API_BASE_URL=http://192.168.54.86:3001
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Mussikon Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=false

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **4. Verificar Configuración**

```bash
# Verificar que TypeScript compila correctamente
npm run type-check

# Verificar linting
npm run lint

# Verificar conexión al backend (opcional)
npm run check-backend
```

## 🚀 Ejecutar el Proyecto

### **Modo Desarrollo**

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor se iniciará en:
# http://localhost:5173
# http://192.168.x.x:5173 (acceso desde red local)
```

### **Scripts Disponibles**

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload
npm run build            # Build de producción
npm run preview          # Preview del build de producción
npm run lint             # Linting del código
npm run lint:fix         # Linting con auto-fix
npm run type-check       # Verificación de tipos TypeScript
npm run check-backend    # Verificar conexión al backend
```

## 🔧 Configuración del Backend

### **Requisitos del Backend**

El sistema requiere un backend Node.js/Express corriendo con los siguientes endpoints:

#### **Endpoints Requeridos**
```
POST   /api/auth/login          # Autenticación
POST   /api/auth/logout         # Cerrar sesión
GET    /api/auth/me             # Obtener usuario actual
POST   /api/auth/refresh        # Refresh token

GET    /api/users               # Listar usuarios
POST   /api/users               # Crear usuario
GET    /api/users/:id           # Obtener usuario
PUT    /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Eliminar usuario
PATCH  /api/users/:id/block     # Bloquear usuario
PATCH  /api/users/:id/unblock   # Desbloquear usuario

GET    /api/events              # Listar eventos
POST   /api/events              # Crear evento
GET    /api/events/:id          # Obtener evento
PUT    /api/events/:id          # Actualizar evento
DELETE /api/events/:id          # Eliminar evento

GET    /api/requests            # Listar solicitudes
POST   /api/requests            # Crear solicitud
GET    /api/requests/:id        # Obtener solicitud
PUT    /api/requests/:id        # Actualizar solicitud
DELETE /api/requests/:id        # Eliminar solicitud

GET    /api/search              # Búsqueda global
GET    /api/analytics           # Datos de analytics
```

### **Configuración de CORS**

El backend debe tener CORS configurado para permitir requests desde el frontend:

```javascript
// En el backend (Express)
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.x.x:5173',
    'http://localhost:4173' // Preview
  ],
  credentials: true
}));
```

## 🛠️ Configuración de Desarrollo

### **1. Configuración de TypeScript**

El proyecto incluye configuración TypeScript optimizada:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **2. Configuración de ESLint**

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Reglas personalizadas
    },
  },
];
```

### **3. Configuración de Vite**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acceso desde red local
    port: 5173,
    open: true  // Abre navegador automáticamente
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🔍 Verificación de la Instalación

### **1. Verificar Funcionalidad Básica**

```bash
# 1. Iniciar el servidor de desarrollo
npm run dev

# 2. Abrir navegador en http://localhost:5173

# 3. Verificar que se muestra la página de login

# 4. Verificar que no hay errores en la consola del navegador
```

### **2. Verificar Build de Producción**

```bash
# 1. Crear build de producción
npm run build

# 2. Verificar que se creó la carpeta dist/
ls dist/

# 3. Preview del build
npm run preview

# 4. Verificar que funciona en http://localhost:4173
```

### **3. Verificar Linting y TypeScript**

```bash
# 1. Verificar linting
npm run lint

# 2. Verificar tipos TypeScript
npm run type-check

# 3. Si hay errores, corregirlos antes de continuar
```

## 🐛 Solución de Problemas

### **Problemas Comunes**

#### **1. Error: "Cannot find module"**
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### **2. Error: "Port already in use"**
```bash
# Solución: Cambiar puerto
# En vite.config.ts
export default defineConfig({
  server: {
    port: 3000  // Cambiar a otro puerto
  }
})
```

#### **3. Error: "Backend connection failed"**
```bash
# Verificar que el backend esté corriendo
npm run check-backend

# Verificar URL en .env
VITE_API_BASE_URL=http://192.168.54.86:3001
```

#### **4. Error: "TypeScript compilation failed"**
```bash
# Verificar tipos
npm run type-check

# Si hay errores, revisar:
# - Imports faltantes
# - Tipos incorrectos
# - Configuración de tsconfig.json
```

#### **5. Error: "ESLint errors"**
```bash
# Verificar linting
npm run lint

# Auto-fix errores
npm run lint:fix

# Si persisten errores, corregirlos manualmente
```

### **Logs de Debug**

```bash
# Habilitar logs detallados
export DEBUG=*
npm run dev

# O en Windows
set DEBUG=*
npm run dev
```

## 📱 Configuración para Diferentes Entornos

### **Desarrollo Local**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **Desarrollo en Red Local**
```env
VITE_API_BASE_URL=http://192.168.1.100:3001
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **Staging**
```env
VITE_API_BASE_URL=https://staging-api.mussikon.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### **Producción**
```env
VITE_API_BASE_URL=https://api.mussikon.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

## 🔒 Configuración de Seguridad

### **Variables de Entorno Sensibles**

```env
# Nunca committear estas variables
VITE_JWT_SECRET=your-secret-key
VITE_ADMIN_EMAIL=admin@mussikon.com
VITE_ADMIN_PASSWORD=secure-password
```

### **Configuración de HTTPS (Desarrollo)**

```bash
# Generar certificados SSL locales
npx mkcert localhost 127.0.0.1 ::1

# Configurar Vite para HTTPS
# En vite.config.ts
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem')
    }
  }
})
```

## 📚 Recursos Adicionales

### **Documentación Relacionada**
- [Guía de Desarrollo](DEVELOPMENT.md)
- [Arquitectura del Sistema](ARCHITECTURE.md)
- [API de Autenticación](AUTH_API.md)
- [Sistema de Notificaciones](NOTIFICATION_SYSTEM.md)

### **Herramientas Útiles**
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript Importer
  - Material-UI Snippets
  - React Developer Tools

### **Comandos Útiles**
```bash
# Limpiar cache
npm cache clean --force

# Verificar dependencias obsoletas
npm outdated

# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit
npm audit fix
```

## ✅ Checklist de Instalación

- [ ] **Requisitos previos instalados** (Node.js, npm, Git)
- [ ] **Repositorio clonado** correctamente
- [ ] **Dependencias instaladas** sin errores
- [ ] **Variables de entorno** configuradas
- [ ] **Backend configurado** y corriendo
- [ ] **Servidor de desarrollo** iniciado
- [ ] **Página de login** visible
- [ ] **Sin errores** en consola del navegador
- [ ] **Build de producción** exitoso
- [ ] **Linting y TypeScript** sin errores

---

**¡Tu entorno de desarrollo está listo para trabajar en el APP Mussikon Admin System!** 🚀 