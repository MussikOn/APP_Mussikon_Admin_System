# 🎵 MussikOn Admin System

Sistema de administración completo para la plataforma MussikOn, desarrollado con React, TypeScript y Material-UI.

## 📊 Estado del Proyecto

### ✅ **Módulos Implementados (67%)**
- 🔐 **Autenticación y Autorización** - Sistema completo
- 👥 **Gestión de Usuarios** - CRUD completo con filtros
- 🎵 **Gestión de Músicos** - Perfiles, instrumentos, géneros
- 📋 **Solicitudes de Músicos** - Estados, filtros, búsqueda
- 📅 **Gestión de Eventos** - Tipos, estados, filtros
- 📱 **Usuarios Móviles** - Gestión de dispositivos
- 🖼️ **Gestión de Imágenes** - Carga, galería, categorías
- 📈 **Analytics y Reportes** - Dashboard completo con gráficos

### 🚨 **Módulos con Datos Mock (8%)**
- 💬 **Sistema de Chat** - Interfaz completa, datos simulados

### ❌ **Módulos No Implementados (25%)**
- 💳 **Sistema de Pagos** - Backend disponible
- 🔍 **Búsqueda Avanzada** - Backend disponible
- 📱 **Notificaciones Push** - Backend disponible
- 📍 **Geolocalización** - Backend disponible

## 🚀 Características Principales

### 🎨 **Sistema de Diseño Avanzado**
- **Componentes Responsive:** ResponsiveLayout, ResponsiveGrid, ResponsiveTable
- **Sistema de Estilos Centralizado:** Colores, sombras, tipografía
- **Optimización UX:** Sin transiciones molestas, diseño limpio
- **Material-UI v5:** Componentes modernos y accesibles

### 📊 **Analytics Completo**
- **8 Pestañas de Analytics:** Dashboard, Eventos, Solicitudes, Usuarios, Plataforma, Tendencias, Ubicaciones, Top Usuarios
- **Gráficos Interactivos:** Chart.js con múltiples tipos de visualización
- **Datos Mock Realistas:** Para demostración y desarrollo
- **Alertas Informativas:** Notificación cuando se usan datos simulados

### 🔐 **Sistema de Autenticación Robusto**
- **Múltiples Roles:** Admin, SuperAdmin, Organizador, Músico
- **Protección de Rutas:** Middleware implementado
- **Recuperación de Contraseñas:** Sistema funcional
- **Gestión de Sesiones:** JWT tokens

### 📱 **Diseño Responsive**
- **Mobile-First:** Optimizado para todos los dispositivos
- **Breakpoints Inteligentes:** Adaptación automática
- **Componentes Flexibles:** Grid y layout adaptativo

## 🛠️ Tecnologías

### **Frontend**
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Material-UI v5** - Componentes UI
- **React Router v6** - Navegación
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos y visualizaciones
- **Vite** - Build tool

### **Backend**
- **Express.js** - Framework del servidor
- **Firebase** - Base de datos y autenticación
- **Stripe/PayPal** - Procesamiento de pagos
- **Google Maps API** - Geolocalización
- **Firebase Cloud Messaging** - Notificaciones push

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MussikOn/APP_Mussikon_Admin_System.git

# Navegar al directorio
cd APP_Mussikon_Admin_System

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en modo desarrollo
npm run dev
```

### Variables de Entorno

```env
# Backend URL
VITE_API_URL=http://localhost:3001

# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# Stripe (para pagos)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ResponsiveLayout.tsx
│   ├── ResponsiveGrid.tsx
│   ├── ResponsiveTable.tsx
│   └── analytics/       # Componentes de gráficos
├── features/           # Módulos de la aplicación
│   ├── auth/           # Autenticación
│   ├── users/          # Gestión de usuarios
│   ├── musicians/      # Gestión de músicos
│   ├── events/         # Gestión de eventos
│   ├── analytics/      # Analytics y reportes
│   └── ...
├── services/           # Servicios de API
│   ├── api.ts          # Cliente HTTP base
│   ├── authService.ts  # Servicio de autenticación
│   ├── analyticsService.ts # Servicio de analytics
│   └── ...
├── hooks/              # Hooks personalizados
├── theme/              # Sistema de diseño
│   ├── buttonStyles.ts # Estilos de botones
│   ├── breakpoints.ts  # Breakpoints responsive
│   └── ...
└── utils/              # Utilidades
```

## 🎯 Funcionalidades por Módulo

### 🔐 **Autenticación**
- Login/Logout con JWT
- Gestión de roles y permisos
- Recuperación de contraseñas
- Protección de rutas

### 👥 **Gestión de Usuarios**
- CRUD completo de usuarios
- Filtros y búsqueda avanzada
- Gestión de roles
- Responsive design

### 🎵 **Gestión de Músicos**
- Perfiles completos de músicos
- Gestión de instrumentos y géneros
- Especializaciones
- Filtros avanzados

### 📋 **Solicitudes de Músicos**
- Estados de solicitud
- Filtros por tipo y estado
- Búsqueda avanzada
- Gestión completa

### 📅 **Gestión de Eventos**
- Tipos de eventos
- Estados y filtros
- Gestión de presupuestos
- Responsive design

### 📈 **Analytics y Reportes**
- Dashboard principal
- 8 pestañas de analytics
- Gráficos interactivos
- Exportación de datos
- Datos mock realistas

### 🖼️ **Gestión de Imágenes**
- Carga de imágenes
- Galería organizada
- Categorías y filtros
- Optimización automática

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build

# Linting y Testing
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting
npm run test         # Ejecutar tests

# Utilidades
npm run type-check   # Verificar tipos TypeScript
npm run clean        # Limpiar build
```

## 📊 Estadísticas del Proyecto

- **Archivos:** 150+ archivos
- **Componentes:** 50+ componentes
- **Servicios:** 20+ servicios
- **Líneas de código:** ~25,000+ líneas
- **Módulos implementados:** 8/12 (67%)
- **Backend disponible:** 100% implementado

## 🔄 Estado de Integración con Backend

### ✅ **Completamente Integrado**
- Autenticación
- Gestión de usuarios
- Gestión de músicos
- Solicitudes de músicos
- Gestión de eventos
- Usuarios móviles
- Gestión de imágenes

### 🚨 **Con Datos Mock (Backend Disponible)**
- Analytics (backend completo, usando datos simulados)
- Chat (backend completo, usando datos simulados)

### ❌ **No Implementado (Backend Disponible)**
- Sistema de pagos
- Búsqueda avanzada
- Notificaciones push
- Geolocalización avanzada

## 🎯 Próximos Pasos

1. **Implementar Sistema de Pagos** - Máxima prioridad
2. **Conectar Analytics con Backend** - Eliminar datos mock
3. **Implementar Chat Real** - WebSockets y datos reales
4. **Agregar Búsqueda Avanzada** - Filtros complejos
5. **Implementar Notificaciones Push** - Tiempo real

## 📚 Documentación

- [Guía de Desarrollo](./docs/DEVELOPMENT.md)
- [Análisis del Backend](./docs/BACKEND_ANALYSIS_AND_FRONTEND_GAPS.md)
- [Guía de Instalación](./docs/INSTALLATION.md)
- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Proyecto:** [MussikOn Admin System](https://github.com/MussikOn/APP_Mussikon_Admin_System)
- **Issues:** [GitHub Issues](https://github.com/MussikOn/APP_Mussikon_Admin_System/issues)

---

**🎵 MussikOn Admin System** - Sistema de administración completo para la plataforma de música
