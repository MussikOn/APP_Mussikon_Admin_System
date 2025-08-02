# APP Mussikon Admin System

Sistema de administración completo para la plataforma Mussikon, desarrollado con React, TypeScript y Material-UI.

## 🚀 Características Principales

- **Autenticación y Autorización**: Sistema robusto de login con roles (admin, superadmin, user)
- **Dashboard Interactivo**: Estadísticas en tiempo real y gráficos dinámicos
- **Gestión de Usuarios**: CRUD completo para usuarios del sistema
- **Gestión de Eventos**: Administración de eventos musicales
- **Solicitudes de Músicos**: Sistema de gestión de solicitudes
- **Gestión de Imágenes**: Subida y administración de imágenes con NFT
- **Búsqueda Global**: Búsqueda avanzada en toda la plataforma
- **Analytics**: Análisis detallado de datos y métricas
- **Usuarios Móviles**: Gestión específica para usuarios de la app móvil
- **Herramientas de Admin**: Funcionalidades exclusivas para superadmin
- **Tema Dinámico**: Soporte para modo claro/oscuro
- **Responsive Design**: Interfaz adaptativa para todos los dispositivos

## 🛠️ Tecnologías

- **Frontend**: React 19.1.0, TypeScript 5.8.3
- **UI Framework**: Material-UI (MUI) 5.18.0
- **Routing**: React Router DOM 7.7.0
- **HTTP Client**: Axios 1.11.0
- **State Management**: Zustand 5.0.6
- **Build Tool**: Vite 7.0.4
- **Linting**: ESLint 9.30.1

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://192.168.54.86:3001
VITE_APP_NAME=Mussikon Admin
VITE_APP_VERSION=1.0.0
```

### Backend

El sistema requiere un backend Node.js/Express corriendo en `http://192.168.54.86:3001` con los siguientes endpoints:

- `/api/auth/*` - Autenticación
- `/api/users/*` - Gestión de usuarios
- `/api/events/*` - Gestión de eventos
- `/api/requests/*` - Solicitudes de músicos
- `/api/images/*` - Gestión de imágenes
- `/api/search/*` - Búsqueda global
- `/api/analytics/*` - Analytics

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── config/             # Configuraciones (API, tema)
├── contexts/           # Contextos de React
├── features/           # Módulos principales
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── users/         # Gestión de usuarios
│   ├── events/        # Gestión de eventos
│   ├── musicianRequests/ # Solicitudes de músicos
│   ├── images/        # Gestión de imágenes
│   ├── musicians/     # Gestión de músicos
│   ├── mobileUsers/   # Usuarios móviles
│   ├── search/        # Búsqueda global
│   ├── analytics/     # Analytics
│   └── admin/         # Herramientas de admin
├── hooks/             # Custom hooks
├── routes/            # Configuración de rutas
├── services/          # Servicios de API
├── store/             # Estado global (Zustand)
├── theme/             # Configuración de tema
└── utils/             # Utilidades
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
npm run check-backend # Verificar conexión al backend
```

## 🔐 Autenticación

El sistema soporta tres roles principales:

- **superadmin**: Acceso completo a todas las funcionalidades
- **admin**: Acceso a la mayoría de funcionalidades
- **user**: Acceso limitado a funcionalidades básicas

## 📱 Características Responsive

- Diseño adaptativo para desktop, tablet y móvil
- Sidebar colapsable en dispositivos móviles
- Gráficos responsivos
- Tablas con scroll horizontal en móvil

## 🎨 Temas

- Soporte para modo claro y oscuro
- Tema personalizable
- Transiciones suaves entre temas

## 🔍 Búsqueda Global

- Búsqueda en tiempo real
- Filtros por categoría, estado e instrumento
- Resultados paginados
- Exportación de resultados

## 📊 Analytics

- Gráficos interactivos
- Métricas en tiempo real
- Exportación de reportes
- Filtros por fecha y categoría

## ⚠️ Estado de Implementación

**El frontend actual cubre aproximadamente el 30% de las funcionalidades disponibles en el backend.**

### 🔴 **Funcionalidades Críticas Pendientes:**
- **Analytics Avanzados**: Dashboard completo de métricas y reportes
- **Sistema de Pagos**: Gestión de transacciones, facturas y reembolsos
- **Sistema de Notificaciones**: Gestión de notificaciones y notificaciones push
- **Geolocalización**: Búsqueda por proximidad y optimización de rutas
- **Sistema de Contratación**: Gestión de solicitudes de contratación y comunicación
- **Búsqueda Avanzada**: Filtros avanzados por ubicación, precio, fecha, etc.

**📋 [Ver Análisis Completo de Gaps](docs/BACKEND_ANALYSIS_AND_FRONTEND_GAPS.md)**

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión al backend**
   ```bash
   npm run check-backend
   ```

2. **Error de Material-UI Tooltip**
   - Los botones deshabilitados deben estar envueltos en `<span>` dentro de `Tooltip`

3. **Error de autenticación**
   - Verificar que el backend esté corriendo
   - Verificar las credenciales en el archivo `.env`

## 📚 Documentación

- [Guía de Instalación](docs/INSTALLATION.md)
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Guía de Desarrollo](docs/DEVELOPMENT.md)
- [Guía de Despliegue](docs/DEPLOYMENT_GUIDE.md)
- [API de Autenticación](docs/AUTH_API.md)
- [Sistema de Notificaciones](docs/NOTIFICATION_SYSTEM.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación en `/docs`

## 🔄 Changelog

### v1.0.0 (Actual)
- ✅ Sistema de autenticación completo
- ✅ Dashboard con estadísticas
- ✅ CRUD de usuarios, eventos, solicitudes
- ✅ Gestión de imágenes con NFT
- ✅ Búsqueda global avanzada
- ✅ Analytics con gráficos
- ✅ Tema dinámico claro/oscuro
- ✅ Diseño responsive completo
- ✅ Herramientas de administración
- ✅ Sistema de notificaciones

---

**Desarrollado con ❤️ para la plataforma Mussikon**
