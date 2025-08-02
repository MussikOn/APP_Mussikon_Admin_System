# Guía de Instalación - MussikOn Admin System

## 📋 Prerrequisitos

### **Requisitos del Sistema**
- **Node.js:** Versión 18.0.0 o superior
- **npm:** Versión 9.0.0 o superior (incluido con Node.js)
- **Git:** Versión 2.30.0 o superior
- **Navegador:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Requisitos de Desarrollo**
- **Editor de código:** VS Code (recomendado)
- **Extensiones recomendadas:**
  - TypeScript Importer
  - ESLint
  - Prettier
  - Material Icon Theme
  - Auto Rename Tag

### **Requisitos del Backend**
- **Backend MussikOn Express:** Debe estar ejecutándose
- **URL del backend:** Configurable en variables de entorno
- **Base de datos:** Firebase Firestore (configurado en backend)

## 🚀 Instalación Paso a Paso

### **1. Clonar el Repositorio**

```bash
# Clonar el repositorio principal
git clone https://github.com/MussikOn/APP_Mussikon_Admin_System.git

# Navegar al directorio del proyecto
cd APP_Mussikon_Admin_System

# Verificar que estás en la rama correcta
git branch
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
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus configuraciones
nano .env  # o usar tu editor preferido
```

#### **Configuración del Archivo .env**

```env
# ========================================
# CONFIGURACIÓN DEL BACKEND
# ========================================

# URL del backend (cambiar según tu configuración)
VITE_API_URL=http://localhost:3001
# VITE_API_URL=http://192.168.100.101:3001
# VITE_API_URL=https://api.mussikon.com

# ========================================
# CONFIGURACIÓN DE FIREBASE
# ========================================

# Firebase API Key
VITE_FIREBASE_API_KEY=your_firebase_api_key_here

# Firebase Auth Domain
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

# Firebase Project ID
VITE_FIREBASE_PROJECT_ID=your_project_id

# Firebase Storage Bucket
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Firebase Messaging Sender ID
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789

# Firebase App ID
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# ========================================
# CONFIGURACIÓN DE PAGOS
# ========================================

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# PayPal Client ID
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# ========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ========================================

# Nombre de la aplicación
VITE_APP_NAME=MussikOn Admin System

# Versión de la aplicación
VITE_APP_VERSION=1.0.0

# Modo de desarrollo
VITE_DEV_MODE=true

# ========================================
# CONFIGURACIÓN DE GOOGLE MAPS
# ========================================

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### **4. Verificar la Instalación**

```bash
# Verificar que TypeScript está configurado correctamente
npm run type-check

# Verificar que el linting funciona
npm run lint

# Verificar la conexión al backend (si está disponible)
npm run check-backend
```

### **5. Iniciar el Servidor de Desarrollo**

```bash
# Iniciar el servidor de desarrollo
npm run dev

# El servidor se iniciará en: http://localhost:5173
```

## 🔧 Configuración Adicional

### **Configuración del Backend**

Asegúrate de que el backend esté ejecutándose:

```bash
# En el directorio del backend
cd ../app_mussikon_express

# Instalar dependencias del backend
npm install

# Iniciar el servidor del backend
npm run dev

# El backend debe estar en: http://localhost:3001
```

### **Configuración de Firebase**

1. **Crear proyecto en Firebase Console:**
   - Ir a [Firebase Console](https://console.firebase.google.com/)
   - Crear nuevo proyecto
   - Habilitar Authentication, Firestore, Storage

2. **Obtener configuración:**
   - En la configuración del proyecto
   - Copiar las credenciales al archivo `.env`

### **Configuración de Stripe (para pagos)**

1. **Crear cuenta en Stripe:**
   - Ir a [Stripe Dashboard](https://dashboard.stripe.com/)
   - Obtener las claves de API

2. **Configurar webhooks:**
   - Configurar webhooks para eventos de pago
   - URL del webhook: `https://tu-backend.com/webhooks/stripe`

## 🐛 Solución de Problemas

### **Error: "Cannot find module"**

```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Backend connection failed"**

```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3001/health

# Verificar la URL en .env
cat .env | grep VITE_API_URL
```

### **Error: "Firebase not configured"**

```bash
# Verificar configuración de Firebase
cat .env | grep FIREBASE

# Asegurarse de que todas las variables estén configuradas
```

### **Error: "Port already in use"**

```bash
# Cambiar puerto en vite.config.ts
export default defineConfig({
  server: {
    port: 3000  // Cambiar a otro puerto
  }
})
```

## 📱 Verificación de la Instalación

### **1. Verificar que la aplicación se carga correctamente**

- Abrir http://localhost:5173
- Deberías ver la pantalla de login
- Verificar que no hay errores en la consola del navegador

### **2. Verificar la autenticación**

- Intentar hacer login con credenciales válidas
- Verificar que redirige al dashboard
- Verificar que el token se guarda correctamente

### **3. Verificar los módulos principales**

- Navegar por los diferentes módulos
- Verificar que las tablas se cargan
- Verificar que los filtros funcionan
- Verificar que el diseño es responsive

### **4. Verificar Analytics**

- Ir al módulo de Analytics
- Verificar que se muestran las alertas de datos mock
- Verificar que los gráficos se renderizan
- Verificar que las pestañas funcionan

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run preview          # Previsualizar build de producción

# Linting y Testing
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de linting automáticamente
npm run type-check       # Verificar tipos TypeScript

# Utilidades
npm run clean            # Limpiar build
npm run check-backend    # Verificar conexión al backend
npm run analyze          # Analizar bundle size
```

## 📊 Estado de la Instalación

### **✅ Verificaciones Exitosas**
- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Backend ejecutándose
- [ ] Aplicación cargando correctamente
- [ ] Autenticación funcionando
- [ ] Módulos principales accesibles
- [ ] Analytics con datos mock funcionando

### **🚨 Problemas Comunes**
- [ ] Backend no disponible
- [ ] Variables de entorno mal configuradas
- [ ] Firebase no configurado
- [ ] Puerto ocupado
- [ ] Errores de CORS

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. **Revisar logs:** Verificar consola del navegador y terminal
2. **Verificar configuración:** Asegurarse de que todas las variables estén correctas
3. **Crear issue:** Reportar problemas en GitHub Issues
4. **Documentación:** Revisar otros documentos en `/docs`

---

**🎵 MussikOn Admin System** - Sistema de administración completo para la plataforma de música 