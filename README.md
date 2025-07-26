# 🎵 MussikOn Admin System

Sistema de administración moderno y futurista para la gestión de eventos musicales, solicitudes de músicos y recursos multimedia.

## 🚀 Características

### ✨ **Módulos Implementados**
- **🎭 Gestión de Eventos** - CRUD completo con conexión real al backend
- **🎼 Solicitudes de Músicos** - Sistema completo de solicitudes con estados avanzados
- **🎨 Gestión de Imágenes** - Pendiente de implementación
- **👤 Perfiles de Músicos** - Pendiente de implementación
- **⚙️ Herramientas de Superadmin** - Pendiente de implementación

### 🎨 **Diseño Futurista**
- **Glassmorphism** - Efectos de cristal y transparencia
- **Neon Gradients** - Colores vibrantes y modernos
- **Animaciones Suaves** - Transiciones fluidas y responsivas
- **UI/UX Avanzada** - Interfaz intuitiva y atractiva

### 🔧 **Tecnologías**
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Material UI 7** - Componentes de UI
- **Vite** - Build tool rápido
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Socket.IO** - Comunicación en tiempo real

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend MussikOn Express (opcional)

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MussikOn/APP_Mussikon_Admin_System.git
cd APP_Mussikon_Admin_System

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### 🚀 Inicio Rápido (Recomendado)

#### **Opción 1: Script Automático (Windows)**
```bash
# Ejecutar script batch
start-dev.bat

# O script PowerShell
.\start-dev.ps1
```

#### **Opción 2: Manual**
```bash
# Terminal 1 - Backend
cd ../app_mussikon_express
npm start

# Terminal 2 - Frontend
cd ../APP_Mussikon_Admin_System
npm run dev
```

## 🔗 Conexión con Backend

El proyecto está configurado para conectarse con el backend MussikOn Express:

```bash
# Backend URL (configurado en src/services/api.ts)
http://localhost:1000
```

### Endpoints Disponibles
- **Eventos:** `/events/*`
- **Solicitudes:** `/musician-requests/*`
- **Administración:** `/admin/*`
- **Autenticación:** `/auth/*`

## 🎯 Módulos del Sistema

### 1. **Gestión de Eventos** ✅
- ✅ CRUD completo de eventos
- ✅ Filtros avanzados por estado, fecha, tipo
- ✅ Formularios con validación
- ✅ Vista detallada de eventos
- ✅ Conexión real con backend
- ✅ Notificaciones en tiempo real

### 2. **Solicitudes de Músicos** ✅
- ✅ Crear solicitudes de músicos
- ✅ Aceptar/Cancelar solicitudes
- ✅ Estados: Pendiente, Asignada, Completada, Cancelada
- ✅ Filtros por instrumento, tipo de evento
- ✅ Conexión real con backend
- ✅ Interfaz futurista

### 3. **Gestión de Imágenes** 🔄
- ⏳ Upload de imágenes con preview
- ⏳ Galería de imágenes
- ⏳ Categorización
- ⏳ Integración con AWS S3
- ⏳ Optimización de imágenes

### 4. **Perfiles de Músicos** 🔄
- ⏳ Gestión de perfiles completos
- ⏳ Galería de trabajos
- ⏳ Especialidades y géneros
- ⏳ Calificaciones y reviews

### 5. **Herramientas de Superadmin** 🔄
- ⏳ Panel de administración avanzada
- ⏳ Logs del sistema
- ⏳ Estadísticas detalladas
- ⏳ Configuración del sistema

## 🎨 Diseño y UX

### Paleta de Colores
```css
/* Colores principales */
--primary: #00d4ff
--secondary: #ff0080
--accent: #ff6b35
--background: #0a0a0a
--surface: rgba(255, 255, 255, 0.1)
```

### Efectos Visuales
- **Glassmorphism:** `backdrop-filter: blur(10px)`
- **Neon Glow:** `box-shadow: 0 0 20px rgba(0, 212, 255, 0.5)`
- **Gradientes:** `linear-gradient(135deg, #00d4ff, #ff0080)`
- **Animaciones:** `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes compartidos
├── contexts/           # Contextos de React
├── features/           # Módulos principales
│   ├── events/        # Gestión de eventos
│   ├── musicianRequests/ # Solicitudes de músicos
│   └── ...
├── hooks/             # Custom hooks
├── routes/            # Configuración de rutas
├── services/          # Servicios de API
└── store/             # Estado global
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Linting y TypeScript
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript

# Testing
npm run test         # Ejecuta tests
npm run test:watch   # Tests en modo watch
```

## 🌐 Despliegue

### Producción
```bash
# Construir
npm run build

# Servir archivos estáticos
npm run preview
```

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:1000
VITE_APP_NAME=MussikOn Admin
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal:** [Tu Nombre]
- **Diseño UI/UX:** [Diseñador]
- **Backend:** [Backend Developer]

## 📞 Contacto

- **Email:** [tu-email@ejemplo.com]
- **GitHub:** [@tu-usuario]
- **Proyecto:** [https://github.com/MussikOn/APP_Mussikon_Admin_System]

## 🎉 Agradecimientos

- Material UI por los componentes
- Vite por el build tool
- React Team por el framework
- La comunidad de TypeScript

---

**🎵 MussikOn Admin System** - Conectando músicos y eventos de manera inteligente
