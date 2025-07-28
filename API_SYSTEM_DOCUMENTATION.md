# 🚀 Sistema de API Centralizado - Documentación

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Configuración](#configuración)
4. [Servicios Disponibles](#servicios-disponibles)
5. [Manejo de Errores](#manejo-de-errores)
6. [Autenticación](#autenticación)
7. [Interceptores](#interceptores)
8. [Reintentos Automáticos](#reintentos-automáticos)
9. [Tipos TypeScript](#tipos-typescript)
10. [Ejemplos de Uso](#ejemplos-de-uso)
11. [Migración](#migración)
12. [Troubleshooting](#troubleshooting)

## 🎯 Descripción General

El Sistema de API Centralizado es una implementación robusta y fácil de mantener que conecta la aplicación admin con el backend de MussikOn. Está diseñado siguiendo las mejores prácticas de la app móvil y proporciona:

- **Configuración centralizada** de endpoints y URLs
- **Manejo automático de autenticación** con JWT
- **Interceptores inteligentes** para requests y responses
- **Sistema de reintentos** automático
- **Manejo de errores** centralizado
- **Tipos TypeScript** completos
- **Servicios modulares** por funcionalidad

## 🏗️ Arquitectura del Sistema

```
src/
├── config/
│   └── apiConfig.ts          # Configuración centralizada
├── services/
│   ├── api.ts               # Cliente HTTP principal
│   ├── authService.ts       # Servicio de autenticación
│   ├── mobileUsersService.ts # Servicio de usuarios móviles
│   ├── eventsService.ts     # Servicio de eventos
│   └── musicianRequestsService.ts # Servicio de solicitudes
└── features/
    └── [feature]/
        ├── hooks/
        │   └── use[Feature].ts # Hooks que usan los servicios
        └── types/
            └── [feature].ts    # Tipos específicos
```

## ⚙️ Configuración

### Configuración Base (`src/config/apiConfig.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://172.20.10.2:3001',
  TIMEOUT: 15000,
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Usuarios Móviles (Admin)
    MOBILE_USERS: '/admin/users',
    MOBILE_USER_BY_ID: '/admin/users/:id',
    // ... más endpoints
  }
};
```

### Cambiar URL del Backend

Para cambiar la URL del backend, solo edita `API_CONFIG.BASE_URL` en `src/config/apiConfig.ts`:

```typescript
BASE_URL: 'http://tu-nueva-url:puerto',
```

## 🔧 Servicios Disponibles

### 1. Servicio de API Principal (`api.ts`)

**Funcionalidades:**
- Cliente HTTP con Axios
- Interceptores automáticos
- Manejo de tokens JWT
- Sistema de reintentos
- Logging de requests/responses

**Uso:**
```typescript
import { apiService } from './services/api';

// GET
const response = await apiService.get('/endpoint');

// POST
const response = await apiService.post('/endpoint', data);

// PUT
const response = await apiService.put('/endpoint', data);

// DELETE
const response = await apiService.delete('/endpoint');
```

### 2. Servicio de Autenticación (`authService.ts`)

**Funcionalidades:**
- Login/Logout
- Registro de usuarios
- Refresh de tokens
- Verificación de permisos
- Gestión de sesiones

**Uso:**
```typescript
import { authService } from './services/authService';

// Login
const authResponse = await authService.login({
  userEmail: 'admin@mussikon.com',
  userPassword: 'password'
});

// Verificar autenticación
if (authService.isAuthenticated()) {
  // Usuario autenticado
}

// Verificar permisos
if (authService.isAdmin()) {
  // Usuario es admin
}
```

### 3. Servicio de Usuarios Móviles (`mobileUsersService.ts`)

**Funcionalidades:**
- CRUD completo de usuarios
- Filtrado avanzado
- Estadísticas
- Bloqueo/Desbloqueo

**Uso:**
```typescript
import { mobileUsersService } from './services/mobileUsersService';

// Obtener todos los usuarios
const response = await mobileUsersService.getAllUsers({
  status: 'active',
  roll: 'musico'
});

// Crear usuario
const newUser = await mobileUsersService.createUser(userData);

// Bloquear usuario
const blockedUser = await mobileUsersService.blockUser(userId, 'Razón');
```

### 4. Servicio de Eventos (`eventsService.ts`)

**Funcionalidades:**
- CRUD completo de eventos
- Filtrado por categoría, estado, ubicación
- Estadísticas de eventos
- Gestión de organizadores

**Uso:**
```typescript
import { eventsService } from './services/eventsService';

// Obtener eventos
const events = await eventsService.getAllEvents({
  status: 'publicado',
  category: 'concierto'
});

// Crear evento
const newEvent = await eventsService.createEvent(eventData);
```

### 5. Servicio de Solicitudes (`musicianRequestsService.ts`)

**Funcionalidades:**
- CRUD completo de solicitudes
- Filtrado por instrumento, estado, ubicación
- Estadísticas de solicitudes
- Gestión de músicos asignados

**Uso:**
```typescript
import { musicianRequestsService } from './services/musicianRequestsService';

// Obtener solicitudes
const requests = await musicianRequestsService.getAllRequests({
  status: 'pendiente',
  instrument: 'guitarra'
});

// Crear solicitud
const newRequest = await musicianRequestsService.createRequest(requestData);
```

## 🛡️ Manejo de Errores

### Tipos de Error

```typescript
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

### Manejo Automático

El sistema maneja automáticamente:

1. **Errores 401 (No autorizado)**: Logout automático
2. **Errores de red**: Reintentos automáticos
3. **Errores de timeout**: Configuración personalizable
4. **Errores de validación**: Mensajes descriptivos

### Ejemplo de Manejo

```typescript
try {
  const users = await mobileUsersService.getAllUsers();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}: ${error.message}`);
  } else {
    console.error('Error inesperado:', error);
  }
}
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login**: Usuario se autentica
2. **Token Storage**: JWT se guarda en localStorage
3. **Auto-refresh**: Token se renueva automáticamente
4. **Logout**: Tokens se limpian del localStorage

### Verificación de Permisos

```typescript
// Verificar si es admin
if (authService.isAdmin()) {
  // Mostrar funcionalidades de admin
}

// Verificar nivel de permisos
const level = authService.getPermissionLevel();
if (level >= 3) {
  // Funcionalidades de admin senior
}
```

## 🔄 Interceptores

### Request Interceptor

```typescript
// Agrega token automáticamente
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

```typescript
// Maneja errores automáticamente
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout automático
      authService.logout();
    }
    return Promise.reject(error);
  }
);
```

## 🔁 Reintentos Automáticos

### Configuración

```typescript
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
};
```

### Comportamiento

1. **Primer intento**: Request normal
2. **Error de red**: Espera 1 segundo
3. **Segundo intento**: Request con delay
4. **Error persistente**: Espera 2 segundos
5. **Tercer intento**: Request final
6. **Fallo**: Lanza error

## 📝 Tipos TypeScript

### Respuestas de API

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
```

### Paginación

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## 💡 Ejemplos de Uso

### Hook de Usuarios Móviles

```typescript
import { useMobileUsers } from '../hooks/useMobileUsers';

export const MobileUsersComponent = () => {
  const {
    users,
    loading,
    error,
    stats,
    createUser,
    updateUser,
    deleteUser,
    blockUser
  } = useMobileUsers();

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      // Usuario creado exitosamente
    } catch (error) {
      // Manejar error
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {users.map(user => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};
```

### Servicio Directo

```typescript
import { mobileUsersService } from '../services/mobileUsersService';

const handleFetchUsers = async () => {
  try {
    const response = await mobileUsersService.getAllUsers({
      status: 'active',
      roll: 'musico'
    });
    
    console.log(`Total usuarios: ${response.total}`);
    setUsers(response.users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
};
```

## 🔄 Migración

### De Sistema Anterior

1. **Reemplazar imports**:
   ```typescript
   // Antes
   import { get, post, put, del } from './httpClient';
   
   // Ahora
   import { apiService } from './services/api';
   ```

2. **Actualizar llamadas**:
   ```typescript
   // Antes
   const response = await get('/endpoint');
   
   // Ahora
   const response = await apiService.get('/endpoint');
   ```

3. **Usar servicios específicos**:
   ```typescript
   // Antes
   const users = await getAllMobileUsers();
   
   // Ahora
   const response = await mobileUsersService.getAllUsers();
   ```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error 401 persistente**:
   - Verificar token en localStorage
   - Limpiar localStorage y relogin

2. **Requests no se envían**:
   - Verificar configuración de BASE_URL
   - Revisar interceptores

3. **Errores de tipos**:
   - Verificar imports de tipos
   - Actualizar interfaces si es necesario

4. **Reintentos excesivos**:
   - Ajustar configuración de retry
   - Verificar conectividad de red

### Debug

```typescript
// Habilitar logs detallados
console.log('API Config:', API_CONFIG);
console.log('Current Token:', authService.getToken());
console.log('User:', authService.getCurrentUser());
```

## 📊 Métricas y Monitoreo

### Logs Automáticos

El sistema registra automáticamente:

- ✅ Requests exitosos
- ❌ Requests fallidos
- 🔄 Reintentos
- 🔐 Eventos de autenticación

### Ejemplo de Logs

```
🚀 GET /admin/users
✅ GET /admin/users - 200
❌ POST /auth/login - 401
🔄 Reintento 1/3 para login
🔐 Token expirado, usuario deslogueado
```

## 🚀 Próximas Mejoras

1. **Cache inteligente** para requests frecuentes
2. **WebSocket integration** para tiempo real
3. **Offline support** con queue de requests
4. **Analytics avanzados** de uso de API
5. **Rate limiting** automático
6. **Compresión de requests** para optimizar ancho de banda

---

## 📞 Soporte

Para problemas o preguntas sobre el sistema de API:

1. Revisar esta documentación
2. Verificar logs de consola
3. Comprobar configuración de endpoints
4. Validar conectividad con backend

**¡El Sistema de API Centralizado está listo para conectar tu aplicación admin con el backend de MussikOn!** 🎵 