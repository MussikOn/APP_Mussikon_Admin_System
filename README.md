# 🎵 MusikOn Admin System

> **Backend API:** `../APP_MussikOn_Express`  
> **URL Base API:** `http://192.168.100.101:1000`

Sistema web administrativo moderno para gestionar todas las funcionalidades del backend de MusikOn con diseño futurista y glassmorphism.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Funcionalidades Pendientes](#-funcionalidades-pendientes)
- [API Endpoints](#-api-endpoints)
- [Autenticación y Roles](#-autenticación-y-roles)
- [Diseño y UI/UX](#-diseño-y-uiux)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Despliegue](#-despliegue)

## ✨ Características

### 🎨 Diseño Futurista
- **Glassmorphism:** Paneles translúcidos con efectos de desenfoque
- **Gradientes vivos:** Púrpura pastel, azul, cian y rosa neón
- **Efectos glow:** Sombras y bordes con resplandor
- **Animaciones suaves:** Transiciones y microinteracciones
- **Modo oscuro:** Predominante con acentos brillantes
- **Responsive:** Adaptable a móvil, tablet y desktop

### 🔧 Arquitectura Moderna
- **React 19 + TypeScript:** Tipado fuerte y últimas características
- **Vite:** Build tool ultra rápido
- **Material UI:** Componentes modernos y accesibles
- **Zustand:** Estado global simple y eficiente
- **React Router DOM:** Navegación SPA
- **Axios:** Cliente HTTP con interceptores

### 🛡️ Seguridad
- **JWT Authentication:** Tokens seguros
- **Role-based Access Control:** Roles específicos por funcionalidad
- **Protected Routes:** Rutas protegidas por autenticación
- **Input Validation:** Validación de formularios

## 🛠️ Tecnologías

### Core
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 7.0.4** - Build tool y dev server

### UI/UX
- **Material UI 7.2.0** - Componentes y sistema de diseño
- **@emotion/react & styled** - CSS-in-JS
- **@mui/icons-material** - Iconografía

### Estado y Navegación
- **Zustand 5.0.6** - Estado global
- **React Router DOM 7.7.0** - Enrutamiento

### HTTP y Utilidades
- **Axios 1.11.0** - Cliente HTTP
- **ESLint 9.30.1** - Linting

## 📊 Estado del Proyecto

### ✅ **Completamente Implementado**
- [x] **Sistema de Autenticación** - Login/logout con JWT
- [x] **Dashboard Principal** - Métricas en tiempo real
- [x] **Gestión de Usuarios** - CRUD completo con validaciones
- [x] **Navegación Responsive** - Sidebar adaptativo
- [x] **Sistema de Temas** - Modo claro/oscuro
- [x] **Arquitectura Base** - Servicios, hooks, componentes
- [x] **Rutas Protegidas** - Control de acceso por roles

### 🚧 **Parcialmente Implementado**
- [x] **Eventos** - Listado básico (sin CRUD completo)
- [x] **Solicitudes de Músicos** - Estructura base
- [x] **Imágenes** - Estructura base
- [x] **Músicos** - Estructura base
- [x] **Admin Tools** - Estructura base

### ❌ **Pendiente de Implementar**
- [ ] **CRUD Completo de Eventos** - Crear, editar, eliminar eventos
- [ ] **CRUD Completo de Solicitudes** - Gestión completa de solicitudes
- [ ] **CRUD Completo de Imágenes** - Subir, editar, eliminar imágenes
- [ ] **Gestión de Perfiles de Músicos** - CRUD de perfiles
- [ ] **Herramientas de Superadmin** - Funciones avanzadas
- [ ] **Notificaciones en Tiempo Real** - Socket.IO integration
- [ ] **Filtros Avanzados** - Búsqueda y filtrado complejo
- [ ] **Exportación de Datos** - PDF, Excel, etc.
- [ ] **Logs y Auditoría** - Historial de acciones
- [ ] **Backup y Restore** - Gestión de datos

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend API corriendo en `http://192.168.100.101:1000`

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd App_mussikon_admin_system

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# Iniciar en modo desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://192.168.100.101:1000
VITE_APP_NAME=MusikOn Admin
VITE_APP_VERSION=1.0.0
```

### Configuración de API
El sistema está configurado para conectarse al backend en:
- **URL Base:** `http://192.168.100.101:1000`
- **Timeout:** 30 segundos
- **Interceptores:** Manejo automático de tokens JWT

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes UI reutilizables
│   ├── Sidebar.tsx      # Navegación principal
│   ├── PrivateLayout.tsx # Layout protegido
│   └── Sidebar.css      # Estilos del sidebar
├── features/            # Módulos de funcionalidad
│   ├── auth/           # Autenticación y login
│   ├── dashboard/      # Dashboard principal
│   ├── users/          # Gestión de usuarios
│   ├── events/         # Gestión de eventos
│   ├── musicianRequests/ # Solicitudes de músicos
│   ├── images/         # Gestión de imágenes
│   ├── musicians/      # Perfiles de músicos
│   └── admin/          # Herramientas de admin
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Gestión de autenticación
│   ├── useApiRequest.ts # Hook para peticiones API
│   └── useResponsive.ts # Hook responsive
├── services/           # Servicios de API
│   ├── api.ts          # Configuración de Axios
│   ├── httpClient.ts   # Cliente HTTP centralizado
│   ├── authService.ts  # Servicios de autenticación
│   ├── usersService.ts # Servicios de usuarios
│   ├── eventsService.ts # Servicios de eventos
│   ├── imagesService.ts # Servicios de imágenes
│   └── musicianRequestsService.ts # Servicios de solicitudes
├── contexts/           # Contextos de React
│   └── ThemeContext.tsx # Contexto de tema
├── routes/             # Configuración de rutas
│   └── index.tsx       # Definición de rutas
├── store/              # Estado global (Zustand)
├── assets/             # Recursos estáticos
├── App.tsx             # Componente raíz
└── main.tsx           # Punto de entrada
```

## ✅ Funcionalidades Implementadas

### 🔐 **Sistema de Autenticación**
- **Login/Logout:** Formulario de login con validaciones
- **JWT Management:** Manejo automático de tokens
- **Session Persistence:** Persistencia de sesión
- **Protected Routes:** Rutas protegidas por autenticación
- **Role-based Access:** Control de acceso por roles

### 📊 **Dashboard Principal**
- **Métricas en Tiempo Real:** Contadores de usuarios, eventos, solicitudes, imágenes
- **Gráficos Interactivos:** Distribución de roles, actividad reciente
- **Navegación Rápida:** Acceso directo a módulos
- **Auto-refresh:** Actualización automática cada 10 minutos
- **Responsive Design:** Adaptable a todos los dispositivos

### 👥 **Gestión de Usuarios (CRUD Completo)**
- **Listado con Paginación:** Tabla con búsqueda y paginación
- **Crear Usuario:** Formulario con validaciones
- **Editar Usuario:** Modificación de datos existentes
- **Eliminar Usuario:** Eliminación con confirmación
- **Filtros y Búsqueda:** Búsqueda por nombre, email, rol
- **Validaciones:** Email válido, contraseña segura, campos requeridos
- **Feedback Visual:** Loading states, errores, confirmaciones

### 🎨 **Sistema de Diseño**
- **Glassmorphism:** Efectos de cristal translúcido
- **Gradientes Vivos:** Colores neón y pasteles
- **Animaciones Suaves:** Transiciones y microinteracciones
- **Modo Oscuro/Claro:** Toggle de tema
- **Responsive Design:** Adaptable a móvil, tablet, desktop
- **Accesibilidad:** ARIA labels, navegación por teclado

### 🧭 **Navegación**
- **Sidebar Responsive:** Navegación adaptativa
- **Menú Circular (Móvil):** Menú circular para dispositivos móviles
- **Breadcrumbs:** Navegación contextual
- **Active States:** Indicadores de página activa

## 🚧 Funcionalidades Pendientes

### 📅 **Gestión de Eventos**
- [ ] **CRUD Completo:** Crear, editar, eliminar eventos
- [ ] **Filtros Avanzados:** Por fecha, estado, tipo
- [ ] **Vista Detallada:** Información completa del evento
- [ ] **Gestión de Estados:** Pending, assigned, completed
- [ ] **Asignación de Músicos:** Matching automático/manual

### 🎵 **Solicitudes de Músicos**
- [ ] **CRUD Completo:** Gestión completa de solicitudes
- [ ] **Estados de Solicitud:** Pending, accepted, rejected, cancelled
- [ ] **Notificaciones:** Alertas en tiempo real
- [ ] **Filtros por Estado:** Búsqueda por estado de solicitud
- [ ] **Historial de Cambios:** Tracking de modificaciones

### 🖼️ **Gestión de Imágenes**
- [ ] **Upload de Imágenes:** Subida con drag & drop
- [ ] **Galería Visual:** Vista de cuadrícula/lista
- [ ] **Edición de Metadatos:** Título, descripción, tags
- [ ] **Previsualización:** Vista previa de imágenes
- [ ] **Optimización:** Compresión automática
- [ ] **Categorización:** Organización por categorías

### 👨‍🎤 **Perfiles de Músicos**
- [ ] **CRUD de Perfiles:** Gestión completa de perfiles
- [ ] **Portfolio:** Galería de trabajos
- [ ] **Especialidades:** Instrumentos y géneros
- [ ] **Calificaciones:** Sistema de reviews
- [ ] **Disponibilidad:** Calendario de disponibilidad

### 🔧 **Herramientas de Admin**
- [ ] **Superadmin Functions:** Eliminación masiva, reset de datos
- [ ] **Logs del Sistema:** Historial de acciones
- [ ] **Backup/Restore:** Gestión de datos
- [ ] **Configuración Global:** Ajustes del sistema
- [ ] **Métricas Avanzadas:** Analytics detallados

### 🔔 **Notificaciones**
- [ ] **Socket.IO Integration:** Notificaciones en tiempo real
- [ ] **Toast Notifications:** Alertas temporales
- [ ] **Email Notifications:** Notificaciones por email
- [ ] **Push Notifications:** Notificaciones push

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Login de usuario
- `GET /auth/verToken` - Verificar token
- `POST /auth/Register` - Registrar usuario
- `PUT /auth/update/:email` - Actualizar usuario
- `DELETE /auth/delete` - Eliminar usuario

### Usuarios
- `GET /getAllUsers` - Obtener todos los usuarios
- `GET /getUsersCount` - Contar usuarios

### Eventos
- `GET /getAllEvents` - Obtener todos los eventos
- `GET /getEventsCount` - Contar eventos

### Solicitudes de Músicos
- `GET /getAllMusicianRequests` - Obtener todas las solicitudes
- `GET /getMusicianRequestsCount` - Contar solicitudes

### Imágenes
- `GET /getAllImages` - Obtener todas las imágenes
- `GET /getImagesCount` - Contar imágenes

### Superadmin
- `DELETE /superAdmin/deleteAllUsers` - Eliminar todos los usuarios

## 🔐 Autenticación y Roles

### Roles del Sistema
- **`admin`** - Administrador general
- **`organizador`** - Creador de eventos
- **`eventCreator`** - Sinónimo de organizador
- **`musico`** - Músico registrado
- **`superadmin`** - Super administrador

### Permisos por Rol
- **`admin`:** Acceso completo excepto herramientas superadmin
- **`organizador`:** Gestión de eventos propios
- **`musico`:** Vista limitada, gestión de perfil
- **`superadmin`:** Acceso completo + herramientas especiales

### Protección de Rutas
```typescript
// Rutas públicas
<Route path="/login" element={<Auth />} />

// Rutas protegidas
<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
<Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />

// Rutas con roles específicos
<Route path="/admin" element={<PrivateRoute allowedRoles={['superadmin']}><AdminTools /></PrivateRoute>} />
```

## 🎨 Diseño y UI/UX

### Principios de Diseño
- **Glassmorphism:** Efectos de cristal translúcido
- **Gradientes Vivos:** Colores neón y pasteles
- **Efectos Glow:** Resplandor en elementos interactivos
- **Animaciones Suaves:** Transiciones fluidas
- **Modo Oscuro:** Predominante con acentos brillantes

### Paleta de Colores
```css
/* Gradientes principales */
--gradient-purple: linear-gradient(90deg, #b993d6 0%, #8ca6db 100%);
--gradient-green: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
--gradient-orange: linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%);
--gradient-cyan: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);

/* Colores base */
--bg-dark: #181c24;
--bg-panel: #202534;
--text-primary: #ffffff;
--text-secondary: #b0b8c1;
--accent-neon: #00fff7;
```

### Componentes Reutilizables
- **Glass Panel:** Contenedor con efecto glassmorphism
- **Gradient Button:** Botones con gradientes
- **Neon Border:** Bordes con efecto glow
- **Responsive Grid:** Sistema de grid adaptativo

## 🛠️ Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Linting del código
npm run preview      # Preview del build
```

### Estructura de Desarrollo
1. **Servicios:** Lógica de API en `src/services/`
2. **Hooks:** Lógica reutilizable en `src/hooks/`
3. **Componentes:** UI reutilizable en `src/components/`
4. **Features:** Módulos de funcionalidad en `src/features/`

### Convenciones de Código
- **TypeScript:** Tipado fuerte en todo el proyecto
- **ESLint:** Reglas de linting configuradas
- **Componentes Funcionales:** Hooks y funciones
- **CSS Modules:** Estilos modulares
- **Naming:** camelCase para variables, PascalCase para componentes

## 🧪 Testing

### Pruebas Manuales Implementadas
- ✅ **Autenticación:** Login, logout, protección de rutas
- ✅ **Gestión de Usuarios:** CRUD completo con validaciones
- ✅ **Dashboard:** Métricas y navegación
- ✅ **Responsive Design:** Móvil, tablet, desktop
- ✅ **Tema:** Toggle claro/oscuro

### Pruebas Pendientes
- [ ] **Eventos:** CRUD completo
- [ ] **Solicitudes:** CRUD completo
- [ ] **Imágenes:** Upload y gestión
- [ ] **Músicos:** Gestión de perfiles
- [ ] **Admin Tools:** Funciones superadmin

### Guías de Testing
Ver archivo `DOCUMENTACION.md` para guías detalladas de testing manual.

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Servidor de Producción
```bash
npm run preview
```

### Configuración de Servidor
- **Nginx:** Configuración para SPA
- **HTTPS:** Certificados SSL
- **Compresión:** Gzip para assets
- **Cache:** Headers de cache optimizados

### Variables de Entorno de Producción
```env
VITE_API_URL=https://api.musikon.com
NODE_ENV=production
```

## 📈 Roadmap

### Fase 1: CRUDs Completos (Prioridad Alta)
- [ ] Completar CRUD de eventos
- [ ] Completar CRUD de solicitudes
- [ ] Completar CRUD de imágenes
- [ ] Implementar gestión de músicos

### Fase 2: Funcionalidades Avanzadas (Prioridad Media)
- [ ] Notificaciones en tiempo real
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Herramientas de superadmin

### Fase 3: Optimización (Prioridad Baja)
- [ ] Performance optimization
- [ ] PWA features
- [ ] Offline support
- [ ] Advanced analytics

## 🤝 Contribución

### Cómo Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usar TypeScript para todo el código
- Seguir las convenciones de ESLint
- Escribir tests para nuevas funcionalidades
- Documentar APIs y componentes

## 📞 Soporte

### Contacto
- **Desarrollador:** [Tu nombre]
- **Email:** [tu-email@example.com]
- **Issues:** [GitHub Issues]

### Recursos
- **Documentación Backend:** `../APP_MussikOn_Express/README.md`
- **API Documentation:** `http://192.168.100.101:1000/docs`
- **Swagger UI:** `http://192.168.100.101:1000/api-docs`

---

**🎵 MusikOn Admin System** - Panel administrativo moderno y futurista para la gestión completa de la plataforma MusikOn.
