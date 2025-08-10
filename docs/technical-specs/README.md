# 🏗️ Especificaciones Técnicas del Sistema

> **Arquitectura, configuración y especificaciones técnicas del proyecto**

## 📋 **Documentos Disponibles**

### [🏛️ Arquitectura del Sistema](ARCHITECTURE.md)
- **Descripción**: Estructura completa del proyecto y patrones de diseño
- **Contenido**: 
  - Estructura de carpetas y organización
  - Patrones de arquitectura implementados
  - Stack tecnológico completo
  - Diagramas de flujo y componentes

### [🔧 Configuración Técnica](CONFIGURATION.md)
- **Descripción**: Configuración de herramientas y entornos
- **Contenido**:
  - Configuración de TypeScript
  - Configuración de Vite
  - Configuración de ESLint y Prettier
  - Variables de entorno

### [📱 Sistema de Pagos Móviles](SISTEMA_PAGOS_MOVILES_IMPLEMENTACION.md)
- **Descripción**: Implementación completa del sistema de pagos móviles
- **Contenido**:
  - Arquitectura del sistema de pagos
  - Flujos de transacciones
  - Integración con APIs
  - Manejo de errores y validaciones

### [💳 Flujo de Pagos Móviles](SISTEMA_PAGOS_MOVILES_FLUJO.md)
- **Descripción**: Diagramas y flujos del sistema de pagos
- **Contenido**:
  - Flujos de usuario
  - Estados de transacciones
  - Validaciones y verificaciones
  - Casos de uso

### [🔧 Guía de Actualización Backend](BACKEND_VOUCHER_IMAGE_UPDATE_GUIDE.md)
- **Descripción**: Guía para actualizaciones del backend
- **Contenido**:
  - Cambios en APIs
  - Actualizaciones de endpoints
  - Migración de datos
  - Compatibilidad frontend

## 🎯 **Cómo Usar Esta Sección**

### **Para Desarrolladores:**
1. Comienza con [🏛️ Arquitectura](ARCHITECTURE.md) para entender la estructura
2. Revisa [🔧 Configuración](CONFIGURATION.md) para setup del entorno
3. Consulta [📱 Sistema de Pagos](SISTEMA_PAGOS_MOVILES_IMPLEMENTACION.md) para implementación

### **Para Arquitectos:**
1. Lee [🏛️ Arquitectura](ARCHITECTURE.md) para patrones implementados
2. Revisa [📱 Sistema de Pagos](SISTEMA_PAGOS_MOVILES_IMPLEMENTACION.md) para decisiones técnicas
3. Consulta [💳 Flujo de Pagos](SISTEMA_PAGOS_MOVILES_FLUJO.md) para flujos de negocio

### **Para DevOps:**
1. Revisa [🔧 Configuración](CONFIGURATION.md) para variables de entorno
2. Consulta [🏛️ Arquitectura](ARCHITECTURE.md) para deployment
3. Lee [🔧 Guía Backend](BACKEND_VOUCHER_IMAGE_UPDATE_GUIDE.md) para actualizaciones

## 🏗️ **Stack Tecnológico Principal**

- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **UI Framework**: Material-UI 5.18 + Tailwind CSS 4.1.11
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router 7.7.0
- **State Management**: Zustand 5.0.6
- **HTTP Client**: Axios 1.11.0
- **Charts**: Chart.js 4.5.0

## 🔧 **Herramientas de Desarrollo**

- **Linting**: ESLint 9.30.1
- **Formatting**: Prettier
- **Testing**: Vitest 1.3.0 + React Testing Library
- **Mocking**: MSW (Mock Service Worker)
- **Type Checking**: TypeScript en modo estricto

## 📁 **Estructura del Proyecto**

```
src/
├── components/          # 50+ componentes reutilizables
├── features/           # 18 módulos de funcionalidad
├── services/           # 25+ servicios de API
├── hooks/              # 10+ hooks personalizados
├── store/              # Gestión de estado global
├── theme/              # Sistema de temas y estilos
└── types/              # Definiciones TypeScript
```

## 🔄 **Última Actualización**

- **Fecha**: 6 de Agosto, 2025
- **Estado**: Documentación reorganizada y estructurada
- **Versión**: 1.0.0

---

> **📖 [Volver al Índice Principal](../README.md)**
