# 🚀 Guía de Instalación - MusikOn Admin System

> **Versión:** 1.0.0  
> **Última Actualización:** Diciembre 2024

## 📋 Prerrequisitos

### Requisitos del Sistema
- **Node.js:** 18.0.0 o superior
- **npm:** 8.0.0 o superior (o yarn 1.22.0+)
- **Git:** 2.30.0 o superior
- **Navegador:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Verificar Versiones
```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.0.0 o superior

# Verificar npm
npm --version
# Debe mostrar: 8.0.0 o superior

# Verificar Git
git --version
# Debe mostrar: 2.30.0 o superior
```

### Backend API
- **URL Base:** `http://192.168.100.101:1000`
- **Estado:** Debe estar corriendo y accesible
- **Documentación:** `http://192.168.100.101:1000/docs`

---

## 🔧 Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
# Clonar el repositorio
git clone <repository-url>
cd App_mussikon_admin_system

# Verificar que estás en la rama correcta
git branch
```

### 2. Instalar Dependencias
```bash
# Instalar todas las dependencias
npm install

# Verificar que no hay errores
npm audit
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo de variables de entorno
cp .env.example .env

# Editar el archivo .env con tus configuraciones
nano .env
```

#### Contenido del archivo `.env`:
```env
# API Configuration
VITE_API_URL=http://192.168.100.101:1000
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=MusikOn Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### 4. Verificar Configuración
```bash
# Verificar que TypeScript compila correctamente
npx tsc --noEmit

# Verificar que ESLint no encuentra errores
npm run lint

# Verificar que el build funciona
npm run build
```

### 5. Iniciar Servidor de Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# http://localhost:5173
# http://192.168.100.101:5173 (acceso desde red local)
```

---

## 🔍 Verificación de la Instalación

### 1. Verificar que el Servidor Funciona
- Abrir `http://localhost:5173` en el navegador
- Deberías ver la página de login
- Verificar que no hay errores en la consola del navegador

### 2. Verificar Conexión con Backend
- Intentar hacer login con credenciales válidas
- Verificar que las peticiones a la API funcionan
- Revisar la consola del navegador para errores de red

### 3. Verificar Funcionalidades Básicas
- [ ] Login/logout funciona
- [ ] Dashboard se carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Sidebar responsive funciona
- [ ] Tema claro/oscuro funciona

---

## 🛠️ Configuración Avanzada

### Configuración de Desarrollo

#### 1. Configurar Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Acceso desde red local
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.100.101:1000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

#### 2. Configurar TypeScript
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
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 3. Configurar ESLint
```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

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
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
]
```

### Configuración de Producción

#### 1. Variables de Entorno de Producción
```env
# Production .env
VITE_API_URL=https://api.musikon.com
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

#### 2. Build de Producción
```bash
# Crear build optimizado
npm run build

# Verificar el build
npm run preview

# El build estará en la carpeta dist/
```

---

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión a la API
```bash
# Verificar que el backend esté corriendo
curl http://192.168.100.101:1000/health

# Verificar variables de entorno
echo $VITE_API_URL

# Verificar configuración de CORS en el backend
```

#### 2. Error de Dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 3. Error de TypeScript
```bash
# Verificar configuración de TypeScript
npx tsc --noEmit

# Verificar tipos de Material UI
npm install @types/react @types/react-dom
```

#### 4. Error de Build
```bash
# Limpiar build anterior
rm -rf dist/

# Reinstalar dependencias
npm install

# Intentar build nuevamente
npm run build
```

### Logs y Debugging

#### 1. Habilitar Logs Detallados
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar logs para debugging
api.interceptors.request.use(config => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
```

#### 2. Verificar Estado de la Aplicación
```typescript
// En cualquier componente
console.log('Environment:', import.meta.env.VITE_APP_ENVIRONMENT);
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Debug Mode:', import.meta.env.VITE_DEBUG_MODE);
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de desarrollo
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuración avanzada

### Herramientas de Desarrollo
- **Vite Dev Tools:** Extensión de navegador para debugging
- **React Developer Tools:** Extensión para debugging de React
- **Redux DevTools:** Para debugging de estado (si se implementa Redux)

### Comandos Útiles
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código

# Testing
npm test             # Ejecutar tests (cuando se implementen)
npm run test:watch   # Tests en modo watch

# Utilidades
npm run clean        # Limpiar build (si se configura)
npm run type-check   # Verificar tipos TypeScript
```

---

## ✅ Checklist de Instalación

### Instalación Básica
- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Servidor de desarrollo corriendo

### Verificación
- [ ] Página de login se carga
- [ ] Conexión con backend funciona
- [ ] Login/logout funciona
- [ ] Dashboard se carga
- [ ] Navegación funciona
- [ ] Tema claro/oscuro funciona

### Configuración Avanzada
- [ ] TypeScript compila sin errores
- [ ] ESLint no encuentra errores
- [ ] Build de producción funciona
- [ ] Variables de entorno correctas
- [ ] Logs de debugging configurados

---

**🎵 MusikOn Admin System** - Guía completa de instalación y configuración del panel administrativo. 