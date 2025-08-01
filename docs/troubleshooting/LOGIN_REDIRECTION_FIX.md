# 🔧 Fix: Problema de Redirección al Login después de 3 segundos

## 🚨 Problema Identificado

La aplicación redirigía automáticamente al login después de estar en el dashboard por aproximadamente 3 segundos.

## 🔍 Causas Raíz

### 1. **Interceptor de Axios Agresivo**
- El interceptor en `src/services/api.ts` forzaba la redirección al login con `window.location.href = '/login'` cuando recibía errores 401
- Esto ocurría incluso si solo una llamada API fallaba

### 2. **Manejo de Errores en useAuth**
- El hook `useAuth` lanzaba errores cuando detectaba tokens inválidos
- Esto causaba que el componente se re-renderizara y perdiera el estado

### 3. **Múltiples Llamadas API Simultáneas**
- El dashboard hacía 7 llamadas API al cargar
- Si cualquiera fallaba con 401, se activaba el interceptor

### 4. **Configuración Hardcodeada**
- La URL del backend estaba hardcodeada en `apiConfig.ts`
- Si el backend no estaba disponible, todas las llamadas fallaban

## ✅ Soluciones Implementadas

### 1. **Interceptor de Axios Mejorado**
```typescript
// ANTES (problemático)
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login'; // ❌ Redirección forzada
}

// DESPUÉS (mejorado)
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('🔐 Token expirado, datos limpiados');
  // Dejar que el componente maneje la navegación
}
```

### 2. **Hook useAuth Mejorado**
```typescript
// ANTES (problemático)
if (!authService.isAuthenticated() || authService.isTokenExpired()) {
  throw new Error('Token inválido o expirado'); // ❌ Error lanzado
}

// DESPUÉS (mejorado)
if (!authService.isAuthenticated() || authService.isTokenExpired()) {
  console.warn('Token inválido o expirado, limpiando sesión');
  setUser(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

### 3. **Dashboard con Manejo de Errores Individual**
```typescript
// ANTES (problemático)
const fetchAllData = () => {
  fetchUsersCount();
  fetchEventsCount();
  // ... más llamadas sin manejo de errores
};

// DESPUÉS (mejorado)
const fetchAllData = () => {
  fetchUsersCount().catch(err => {
    console.warn('Error fetching users count:', err);
  });
  fetchEventsCount().catch(err => {
    console.warn('Error fetching events count:', err);
  });
  // ... manejo individual de errores
};
```

### 4. **Configuración Flexible del Backend**
```typescript
// ANTES (hardcodeado)
BASE_URL: 'http://172.20.10.2:3001',

// DESPUÉS (flexible)
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  return 'http://172.20.10.2:3001'; // fallback
};
```

### 5. **PrivateRoute Mejorado**
```typescript
// ANTES (básico)
if (loading) return <LoadingScreen />;
if (!user) return <Navigate to="/login" replace />;

// DESPUÉS (con logging)
if (loading) {
  return <LoadingScreen />;
}
if (!user) {
  console.log('🔐 Usuario no autenticado, redirigiendo al login');
  return <Navigate to="/login" replace />;
}
```

## 🛠️ Cómo Configurar

### 1. **Crear archivo .env**
```bash
# En la raíz del proyecto
VITE_API_BASE_URL=http://tu-ip-del-backend:3001
```

### 2. **Verificar que el backend esté corriendo**
```bash
# Verificar que el backend esté disponible
curl http://tu-ip-del-backend:3001/health
```

### 3. **Reiniciar la aplicación**
```bash
npm run dev
```

## 🧪 Testing

### 1. **Test de Conexión**
- Abrir DevTools (F12)
- Ir a la pestaña Network
- Hacer login y verificar que las llamadas API sean exitosas

### 2. **Test de Token Expirado**
- Simular token expirado cambiando la fecha en localStorage
- Verificar que no haya redirección forzada

### 3. **Test de Backend No Disponible**
- Detener el backend
- Verificar que la aplicación no se cuelgue
- Verificar que muestre errores apropiados

## 📝 Logs Útiles

Los siguientes logs te ayudarán a diagnosticar problemas:

```javascript
// En la consola del navegador
🔐 Token expirado, datos limpiados
🌐 Usando URL del backend desde variable de entorno: http://...
🔐 Usuario no autenticado, redirigiendo al login
🚫 Usuario admin no tiene permisos para esta ruta
```

## 🚀 Resultado Esperado

Después de aplicar estas correcciones:

1. ✅ La aplicación no redirigirá automáticamente al login
2. ✅ Los errores de API se manejarán de forma elegante
3. ✅ El dashboard cargará correctamente incluso si algunas llamadas fallan
4. ✅ La configuración del backend será más flexible
5. ✅ Mejor logging para debugging

## 🔄 Próximos Pasos

1. **Probar la aplicación** con el backend corriendo
2. **Verificar logs** en la consola del navegador
3. **Configurar la URL correcta** del backend en `.env`
4. **Reportar cualquier problema** restante 