# 🛠️ Guías de Desarrollo

> **Guías paso a paso para desarrolladores y contribuidores del proyecto**

## 📋 **Documentos Disponibles**

### [🚀 Guía de Inicio Rápido](START.md)
- **Descripción**: Guía completa para comenzar a desarrollar en el proyecto
- **Contenido**: 
  - Instalación y configuración del entorno
  - Primeros pasos para desarrollo
  - Comandos básicos y scripts
  - Estructura del proyecto

### [🎨 Mejoras del Design System](MEJORAS_DESIGN_SYSTEM_COMPLETO.md)
- **Descripción**: Guía completa de mejoras implementadas en el sistema de diseño
- **Contenido**:
  - Componentes del design system
  - Paleta de colores y tipografía
  - Componentes reutilizables
  - Guías de estilo y uso

## 🎯 **Cómo Usar Esta Sección**

### **Para Desarrolladores Nuevos:**
1. **OBLIGATORIO**: Comienza con [🚀 Guía de Inicio Rápido](START.md)
2. Revisa [🎨 Mejoras del Design System](MEJORAS_DESIGN_SYSTEM_COMPLETO.md) para entender el sistema de componentes

### **Para Desarrolladores Experimentados:**
1. Revisa [🎨 Mejoras del Design System](MEJORAS_DESIGN_SYSTEM_COMPLETO.md) para nuevas funcionalidades
2. Consulta [🚀 Guía de Inicio Rápido](START.md) para recordar comandos y estructura

### **Para Contribuidores:**
1. Lee [🚀 Guía de Inicio Rápido](START.md) para setup del entorno
2. Revisa [🎨 Mejoras del Design System](MEJORAS_DESIGN_SYSTEM_COMPLETO.md) para estándares de código

## 🚀 **Flujo de Desarrollo Recomendado**

### **1. Setup Inicial**
```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### **2. Desarrollo Diario**
```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test

# Verificar linting
npm run lint

# Formatear código
npm run format
```

### **3. Antes de Commit**
```bash
# Ejecutar tests completos
npm run test:coverage

# Verificar linting
npm run lint:fix

# Formatear código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

## 🎨 **Design System**

### **Componentes Principales**
- **Botones**: Variantes primario, secundario, outline, ghost
- **Formularios**: Inputs, selects, checkboxes, radio buttons
- **Navegación**: Navbar, sidebar, breadcrumbs, pagination
- **Feedback**: Modales, notificaciones, tooltips, alerts
- **Layout**: Grid, containers, cards, dividers

### **Paleta de Colores**
- **Primarios**: Azul (#1976d2), Verde (#2e7d32)
- **Secundarios**: Naranja (#ed6c02), Púrpura (#9c27b0)
- **Neutros**: Gris (#757575), Blanco (#ffffff)
- **Estados**: Éxito (#2e7d32), Error (#d32f2f), Advertencia (#ed6c02)

### **Tipografía**
- **Títulos**: Roboto Bold, 24px-48px
- **Subtítulos**: Roboto Medium, 18px-24px
- **Cuerpo**: Roboto Regular, 14px-16px
- **Caption**: Roboto Light, 12px

## 🔧 **Herramientas de Desarrollo**

### **Scripts Disponibles**
```json
{
  "dev": "Inicia servidor de desarrollo",
  "build": "Construye para producción",
  "preview": "Vista previa de producción",
  "test": "Ejecuta tests unitarios",
  "test:coverage": "Tests con cobertura",
  "lint": "Verifica linting",
  "lint:fix": "Corrige problemas de linting",
  "format": "Formatea código",
  "type-check": "Verifica tipos TypeScript"
}
```

### **Configuración de Entorno**
- **Node.js**: Versión 18+ requerida
- **npm**: Versión 9+ recomendada
- **Git**: Para control de versiones
- **VS Code**: Editor recomendado con extensiones

## 📁 **Estructura de Desarrollo**

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes básicos de UI
│   ├── forms/          # Componentes de formularios
│   └── layout/         # Componentes de layout
├── features/           # Módulos de funcionalidad
│   ├── auth/           # Autenticación
│   ├── dashboard/      # Dashboard principal
│   └── users/          # Gestión de usuarios
├── hooks/              # Hooks personalizados
├── services/           # Servicios de API
├── store/              # Estado global
├── theme/              # Configuración de temas
└── types/              # Definiciones TypeScript
```

## 🔄 **Última Actualización**

- **Fecha**: 6 de Agosto, 2025
- **Estado**: Documentación reorganizada y estructurada
- **Versión**: 1.0.0

---

> **📖 [Volver al Índice Principal](../README.md)**
