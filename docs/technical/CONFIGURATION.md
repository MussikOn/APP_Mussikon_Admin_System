# ⚙️ **Configuración del Sistema - MussikOn Admin System**

> **Guía completa de configuración del proyecto**  
> **Versión:** 1.0.0 | **Última Actualización:** Enero 2025

---

## 📋 **Índice**

1. [Configuración de Entorno](#configuración-de-entorno)
2. [Configuración de API](#configuración-de-api)
3. [Configuración de Build](#configuración-de-build)
4. [Configuración de Desarrollo](#configuración-de-desarrollo)
5. [Variables de Entorno](#variables-de-entorno)
6. [Scripts Disponibles](#scripts-disponibles)

---

## 🌍 **Configuración de Entorno**

### **Requisitos del Sistema**
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0
```

### **Configuración Inicial**
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd APP_Mussikon_Admin_System

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

---

## 🔧 **Configuración de API**

### **Archivo de Configuración Principal**
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://172.20.10.2:3001',
  TIMEOUT: 10000,
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout'
    },
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      UPDATE: '/users/:id',
      DELETE: '/users/:id'
    },
    EVENTS: {
      LIST: '/events',
      CREATE: '/events',
      UPDATE: '/events/:id',
      DELETE: '/events/:id'
    },
    REQUESTS: {
      LIST: '/musician-requests',
      CREATE: '/musician-requests',
      UPDATE: '/musician-requests/:id',
      DELETE: '/musician-requests/:id'
    }
  }
};
```

### **Cliente HTTP Configurado**
```typescript
// src/services/httpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/apiConfig';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token JWT
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🏗️ **Configuración de Build**

### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@config': path.resolve(__dirname, './src/config')
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
});
```

### **TypeScript Configuration**
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
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@config/*": ["src/config/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🛠️ **Configuración de Desarrollo**

### **ESLint Configuration**
```javascript
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
];
```

### **Prettier Configuration**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## 🔐 **Variables de Entorno**

### **Archivo .env**
```bash
# API Configuration
VITE_API_BASE_URL=http://172.20.10.2:3001
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_NAME=MussikOn Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_REFRESH_TOKEN_SECRET=your-refresh-secret

# Analytics (Opcional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **Variables de Desarrollo**
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **Variables de Producción**
```bash
# .env.production
VITE_API_BASE_URL=https://api.mussikon.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

---

## 📜 **Scripts Disponibles**

### **Scripts de Desarrollo**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### **Scripts de Despliegue**
```bash
# Construcción para producción
npm run build

# Preview de producción
npm run preview

# Análisis del bundle
npm run analyze
```

### **Scripts de Mantenimiento**
```bash
# Limpiar cache
npm run clean

# Actualizar dependencias
npm run update-deps

# Verificar seguridad
npm audit
```

---

## 🎯 **Configuraciones Específicas por Módulo**

### **Configuración de Autenticación**
```typescript
// src/config/authConfig.ts
export const AUTH_CONFIG = {
  TOKEN_KEY: 'mussikon_token',
  REFRESH_TOKEN_KEY: 'mussikon_refresh_token',
  TOKEN_EXPIRY: 3600, // 1 hora
  REFRESH_TOKEN_EXPIRY: 604800, // 7 días
  AUTO_REFRESH: true,
  LOGOUT_ON_EXPIRY: true
};
```

### **Configuración de UI**
```typescript
// src/config/uiConfig.ts
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#00BCD4',
    SECONDARY_COLOR: '#FF4081',
    BACKGROUND_COLOR: '#121212',
    SURFACE_COLOR: '#1E1E1E'
  },
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  BREAKPOINTS: {
    MOBILE: 600,
    TABLET: 960,
    DESKTOP: 1280
  }
};
```

### **Configuración de Analytics**
```typescript
// src/config/analyticsConfig.ts
export const ANALYTICS_CONFIG = {
  ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  TRACK_PAGE_VIEWS: true,
  TRACK_EVENTS: true,
  TRACK_ERRORS: true
};
```

---

## 🔍 **Verificación de Configuración**

### **Script de Verificación**
```bash
# Verificar configuración
npm run verify-config

# Verificar conectividad API
npm run check-api

# Verificar build
npm run verify-build
```

### **Checklist de Configuración**
- [ ] Variables de entorno configuradas
- [ ] API URL configurada correctamente
- [ ] TypeScript configurado
- [ ] ESLint configurado
- [ ] Vite configurado
- [ ] Rutas de alias configuradas
- [ ] Scripts de desarrollo funcionando
- [ ] Build de producción funcionando

---

## 🚨 **Solución de Problemas de Configuración**

### **Problemas Comunes**

#### **Error de CORS**
```bash
# Solución: Configurar CORS en el backend
# O usar proxy en desarrollo
```

#### **Error de TypeScript**
```bash
# Solución: Verificar tsconfig.json
npm run type-check
```

#### **Error de Build**
```bash
# Solución: Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 **Referencias**

- **[Documentación de Vite](https://vitejs.dev/config/)**
- **[Documentación de TypeScript](https://www.typescriptlang.org/docs/)**
- **[Documentación de ESLint](https://eslint.org/docs/latest/)**
- **[Documentación de Material-UI](https://mui.com/material-ui/getting-started/)**

---

**Configuración completada y verificada** ✅ 