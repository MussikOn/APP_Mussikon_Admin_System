# 🔐 Sistema de Recuperación de Contraseña - SuperAdmin

## 📋 **Descripción General**

Sistema completo de recuperación de contraseña **exclusivo para usuarios con rol "superadmin"**. Utiliza **nodemailer** para enviar códigos de verificación por email y permite restablecer la contraseña de forma segura.

## 🎯 **Características Principales**

### **✅ Seguridad**
- **Solo para superadmin** - Restricción de acceso por rol
- **Códigos de 6 dígitos** - Generación aleatoria segura
- **Expiración automática** - 10 minutos de validez
- **Validación de contraseña** - Requisitos de seguridad
- **Limpieza automática** - Códigos expirados se eliminan

### **✅ UX/UI**
- **Proceso por pasos** - Stepper visual con 3 etapas
- **Validación en tiempo real** - Feedback inmediato
- **Notificaciones** - Snackbar para confirmaciones
- **Diseño responsive** - Adaptable a todos los dispositivos
- **Tema oscuro/claro** - Consistente con el sistema

### **✅ Funcionalidades**
- **Solicitud de código** - Envío por email
- **Verificación de código** - Validación de 6 dígitos
- **Restablecimiento** - Nueva contraseña segura
- **Redirección automática** - Al login tras completar

## 🔧 **Backend - Implementación**

### **1. Controladores Agregados**

**Archivo:** `../app_mussikon_express/src/controllers/authController.ts`

#### **✅ forgotPasswordController**
```typescript
// Solicitar recuperación de contraseña (solo superadmin)
export const forgotPasswordController = async (req: Request, res: Response) => {
  // Validaciones:
  // - Email requerido y válido
  // - Usuario debe existir
  // - Usuario debe ser superadmin
  // - Genera código de 6 dígitos
  // - Envía email con nodemailer
  // - Guarda código temporalmente (10 min)
}
```

#### **✅ verifyCodeController**
```typescript
// Verificar código de recuperación
export const verifyCodeController = async (req: Request, res: Response) => {
  // Validaciones:
  // - Email y código requeridos
  // - Usuario debe ser superadmin
  // - Código debe existir y no estar expirado
  // - Código debe coincidir
}
```

#### **✅ resetPasswordController**
```typescript
// Restablecer contraseña
export const resetPasswordController = async (req: Request, res: Response) => {
  // Validaciones:
  // - Email, código y nueva contraseña requeridos
  // - Contraseña debe cumplir requisitos de seguridad
  // - Usuario debe ser superadmin
  // - Código debe ser válido
  // - Hashea nueva contraseña con bcrypt
  // - Actualiza en Firebase
  // - Elimina código usado
}
```

### **2. Rutas Agregadas**

**Archivo:** `../app_mussikon_express/src/routes/authRoutes.ts`

```typescript
// POST /auth/forgot-password
router.post("/forgot-password", asyncHandler(forgotPasswordController));

// POST /auth/verify-code
router.post("/verify-code", asyncHandler(verifyCodeController));

// POST /auth/reset-password
router.post("/reset-password", asyncHandler(resetPasswordController));
```

### **3. Funciones de Soporte**

#### **✅ Generación de Códigos**
```typescript
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
```

#### **✅ Limpieza Automática**
```typescript
function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
}

// Ejecutar cada 5 minutos
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);
```

#### **✅ Email HTML Personalizado**
```typescript
const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <title>Recuperar Contraseña - MusikOn</title>
</head>
<body>
  <!-- Email con diseño profesional -->
  <!-- Logo, código de verificación, instrucciones -->
  <!-- Mensaje de seguridad -->
</body>
</html>`;
```

## 🔧 **Frontend - Implementación**

### **1. Servicio de Autenticación**

**Archivo:** `src/services/authService.ts`

#### **✅ Interfaces Agregadas**
```typescript
export interface ForgotPasswordData {
  userEmail: string;
}

export interface VerifyCodeData {
  userEmail: string;
  code: string;
}

export interface ResetPasswordData {
  userEmail: string;
  code: string;
  newPassword: string;
}
```

#### **✅ Funciones Agregadas**
```typescript
// Solicitar recuperación
export async function forgotPassword(data: ForgotPasswordData): Promise<AuthResponse>

// Verificar código
export async function verifyCode(data: VerifyCodeData): Promise<AuthResponse>

// Restablecer contraseña
export async function resetPassword(data: ResetPasswordData): Promise<AuthResponse>
```

### **2. Configuración de API**

**Archivo:** `src/config/apiConfig.ts`

```typescript
export const API_CONFIG = {
  ENDPOINTS: {
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_CODE: '/auth/verify-code',
    RESET_PASSWORD: '/auth/reset-password',
    // ... otros endpoints
  }
};
```

### **3. Componente de Recuperación**

**Archivo:** `src/features/auth/ForgotPassword.tsx`

#### **✅ Características del Componente**
- **Stepper de 3 pasos** - Proceso visual claro
- **Validación robusta** - Email, código, contraseña
- **Estados de carga** - Feedback visual
- **Manejo de errores** - Mensajes específicos
- **Notificaciones** - Snackbar para confirmaciones

#### **✅ Pasos del Proceso**
1. **Solicitar Código**
   - Input de email
   - Validación de formato
   - Envío de solicitud
   - Confirmación de envío

2. **Verificar Código**
   - Input de 6 dígitos
   - Validación de longitud
   - Verificación con backend
   - Confirmación de validez

3. **Nueva Contraseña**
   - Input de nueva contraseña
   - Input de confirmación
   - Validación de seguridad
   - Actualización en backend

### **4. Integración en Login**

**Archivo:** `src/features/auth/index.tsx`

#### **✅ Cambios Realizados**
- **Link de recuperación** - "¿Olvidaste tu contraseña?"
- **Estado de pantalla** - Toggle entre login y recuperación
- **Navegación** - Botón de regreso
- **Diseño mejorado** - Header y footer actualizados

## 🎨 **Diseño y UX**

### **✅ Stepper Visual**
```typescript
const steps = [
  'Solicitar Código',
  'Verificar Código', 
  'Nueva Contraseña'
];
```

### **✅ Validaciones**
```typescript
// Email
const validateEmail = (email: string) => {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

// Contraseña
const validatePassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
};
```

### **✅ Estados de Carga**
- **Spinner durante operaciones**
- **Botones deshabilitados**
- **Mensajes de progreso**
- **Indicadores visuales**

### **✅ Notificaciones**
```typescript
const [snackbar, setSnackbar] = useState<{
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
}>({ open: false, message: '', severity: 'info' });
```

## 🔒 **Seguridad**

### **✅ Restricciones de Acceso**
- **Solo superadmin** puede usar la recuperación
- **Validación de rol** en cada endpoint
- **Verificación de usuario** en base de datos

### **✅ Validación de Códigos**
- **6 dígitos aleatorios** - 900,000 combinaciones
- **Expiración de 10 minutos** - Tiempo limitado
- **Uso único** - Se elimina tras usar
- **Limpieza automática** - Códigos expirados

### **✅ Requisitos de Contraseña**
- **Mínimo 6 caracteres**
- **Al menos una mayúscula**
- **Al menos una minúscula**
- **Al menos un número**
- **Al menos un carácter especial**

### **✅ Protección de Datos**
- **Hashing con bcrypt** - Contraseñas seguras
- **Validación de email** - Formato correcto
- **Sanitización de inputs** - Prevención de inyección
- **Logs de auditoría** - Seguimiento de acciones

## 📧 **Email con Nodemailer**

### **✅ Configuración**
```typescript
// Usa la función sendEmail existente
await sendEmail(
  userEmail,
  "Recuperar Contraseña - MusikOn",
  `Tu código de verificación es: ${verificationCode}`,
  html
);
```

### **✅ Diseño del Email**
- **Logo de MusikOn**
- **Código prominente** - 6 dígitos grandes
- **Instrucciones claras** - Paso a paso
- **Mensaje de seguridad** - Advertencia importante
- **Diseño responsive** - Funciona en móviles

## 🧪 **Testing y Verificación**

### **✅ Flujo de Prueba**
1. **Crear usuario superadmin** en Firebase
2. **Ir a login** y hacer click en "¿Olvidaste tu contraseña?"
3. **Ingresar email** del superadmin
4. **Verificar email** - Debe recibir código
5. **Ingresar código** de 6 dígitos
6. **Verificar código** - Debe avanzar al paso 3
7. **Ingresar nueva contraseña** - Cumplir requisitos
8. **Confirmar contraseña** - Debe coincidir
9. **Actualizar contraseña** - Debe funcionar
10. **Redirección automática** - Al login

### **✅ Casos de Error**
- **Email inválido** - Validación de formato
- **Usuario no existe** - Mensaje específico
- **Usuario no es superadmin** - Restricción de acceso
- **Código inválido** - Validación de 6 dígitos
- **Código expirado** - Tiempo límite
- **Contraseña débil** - Requisitos de seguridad
- **Contraseñas no coinciden** - Validación de confirmación

## 📝 **Notas Importantes**

### **✅ Configuración Requerida**
- **Nodemailer configurado** en el backend
- **Firebase funcionando** para base de datos
- **Usuario superadmin** creado previamente
- **Variables de entorno** para email configuradas

### **✅ Limitaciones**
- **Solo para superadmin** - No disponible para otros roles
- **Código de 10 minutos** - Expiración automática
- **Un código por email** - No se pueden solicitar múltiples
- **Requiere email válido** - Para recibir código

### **✅ Mejoras Futuras**
- **Captcha** para prevenir spam
- **Rate limiting** por IP
- **Notificaciones push** como alternativa
- **Historial de cambios** de contraseña
- **Autenticación de dos factores**

## 🚀 **Instalación y Uso**

### **✅ Backend**
1. **Reiniciar servidor** para cargar nuevos endpoints
2. **Verificar nodemailer** configurado correctamente
3. **Probar endpoints** con Postman o similar

### **✅ Frontend**
1. **Reiniciar aplicación** para cargar nuevos componentes
2. **Verificar rutas** funcionando correctamente
3. **Probar flujo completo** con usuario superadmin

### **✅ Verificación**
1. **Login con superadmin** existente
2. **Probar recuperación** de contraseña
3. **Verificar email** recibido
4. **Completar proceso** de restablecimiento
5. **Login con nueva contraseña**

## 🔍 **Debugging**

### **✅ Logs del Backend**
```bash
# Verificar envío de email
console.log('📧 Enviando email a:', userEmail);

# Verificar generación de código
console.log('🔐 Código generado:', verificationCode);

# Verificar validaciones
console.log('✅ Usuario verificado:', user.roll);
```

### **✅ Logs del Frontend**
```bash
# Verificar solicitud
console.log('📧 Solicitando recuperación:', userEmail);

# Verificar respuesta
console.log('✅ Código enviado correctamente');

# Verificar errores
console.error('❌ Error al enviar código:', error);
```

### **✅ Verificación de Email**
- **Revisar carpeta spam** si no llega
- **Verificar configuración** de nodemailer
- **Probar con email válido** de superadmin
- **Revisar logs** del servidor

¡El sistema de recuperación de contraseña está completamente implementado y listo para usar! 🎉 