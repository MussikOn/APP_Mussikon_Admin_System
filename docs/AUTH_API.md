# 🔐 API de Autenticación y Usuarios - MusikOn Admin System

> **Versión:** 1.0.0  
> **Última Actualización:** Diciembre 2024

## 📋 Resumen de la API

### Endpoints Disponibles
- **Autenticación:** Login, verificación de token, logout
- **Usuarios:** CRUD completo de usuarios
- **Roles:** Gestión de roles y permisos
- **Seguridad:** Validaciones y sanitización

### Base URL
```
http://192.168.100.101:1000
```

---

## 🔐 Autenticación

### 1. Login de Usuario

#### Endpoint
```
POST /auth/login
```

#### Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "userEmail": "admin@musikon.com",
  "userPassword": "password123"
}
```

#### Response (Success - 200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Admin",
    "lastName": "User",
    "userEmail": "admin@musikon.com",
    "roll": "admin",
    "status": true
  }
}
```

#### Response (Error - 401)
```json
{
  "message": "Credenciales inválidas"
}
```

#### Implementación en Frontend
```typescript
// src/services/authService.ts
export async function login(userEmail: string, userPassword: string): Promise<AuthResponse> {
  return await post<AuthResponse>('/auth/login', { userEmail, userPassword });
}

// src/hooks/useAuth.ts
const login = async (email: string, password: string) => {
  const data = await loginService(email, password);
  if (data.token) {
    localStorage.setItem('token', data.token);
    setUser(data.user || {});
  }
};
```

### 2. Verificar Token

#### Endpoint
```
GET /auth/verToken
```

#### Headers
```http
Authorization: Bearer <token>
```

#### Response (Success - 200)
```json
{
  "user": {
    "name": "Admin",
    "lastName": "User",
    "userEmail": "admin@musikon.com",
    "roll": "admin",
    "status": true
  }
}
```

#### Response (Error - 401)
```json
{
  "message": "Token inválido o expirado"
}
```

#### Implementación en Frontend
```typescript
// src/services/authService.ts
export async function verifyToken(token: string): Promise<any> {
  return await get<any>('/auth/verToken', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### 3. Logout

#### Implementación en Frontend
```typescript
// src/hooks/useAuth.ts
const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  // Opcional: llamar a endpoint de logout en backend
};
```

---

## 👥 Gestión de Usuarios

### 1. Obtener Todos los Usuarios

#### Endpoint
```
GET /getAllUsers
```

#### Headers
```http
Authorization: Bearer <token>
```

#### Response (Success - 200)
```json
[
  {
    "name": "Admin",
    "lastName": "User",
    "userEmail": "admin@musikon.com",
    "roll": "admin",
    "status": true
  },
  {
    "name": "John",
    "lastName": "Doe",
    "userEmail": "john@musikon.com",
    "roll": "musico",
    "status": true
  }
]
```

#### Implementación en Frontend
```typescript
// src/services/usersService.ts
export async function getAllUsers(): Promise<User[]> {
  return await get<User[]>('/getAllUsers');
}

// src/hooks/useApiRequest.ts
const { data: users, loading, error, execute: fetchUsers } = useApiRequest(getAllUsers);
```

### 2. Crear Usuario

#### Endpoint
```
POST /auth/Register
```

#### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body
```json
{
  "name": "New",
  "lastName": "User",
  "userEmail": "newuser@musikon.com",
  "roll": "musico",
  "status": true,
  "userPassword": "password123"
}
```

#### Response (Success - 201)
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "name": "New",
    "lastName": "User",
    "userEmail": "newuser@musikon.com",
    "roll": "musico",
    "status": true
  }
}
```

#### Response (Error - 400)
```json
{
  "message": "Usuario ya existe"
}
```

#### Implementación en Frontend
```typescript
// src/services/usersService.ts
export async function createUser(form: User): Promise<any> {
  return await post<any>('/auth/Register', form);
}

// Validación antes de enviar
const validateUserForm = (form: User): string[] => {
  const errors: string[] = [];
  
  if (!form.name?.trim()) errors.push('Nombre es requerido');
  if (!form.lastName?.trim()) errors.push('Apellido es requerido');
  if (!form.userEmail?.trim()) errors.push('Email es requerido');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.userEmail)) {
    errors.push('Email inválido');
  }
  if (!form.userPassword || form.userPassword.length < 6) {
    errors.push('Contraseña mínima 6 caracteres');
  }
  
  return errors;
};
```

### 3. Actualizar Usuario

#### Endpoint
```
PUT /auth/update/:email
```

#### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### URL Parameters
- `email`: Email del usuario a actualizar (URL encoded)

#### Request Body
```json
{
  "name": "Updated",
  "lastName": "Name",
  "roll": "admin",
  "status": false
}
```

#### Response (Success - 200)
```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "name": "Updated",
    "lastName": "Name",
    "userEmail": "user@musikon.com",
    "roll": "admin",
    "status": false
  }
}
```

#### Response (Error - 404)
```json
{
  "message": "Usuario no encontrado"
}
```

#### Implementación en Frontend
```typescript
// src/services/usersService.ts
export async function updateUser(email: string, form: Partial<User>): Promise<any> {
  return await put<any>(`/auth/update/${encodeURIComponent(email)}`, form);
}

// En el componente
const handleUpdate = async (email: string, formData: Partial<User>) => {
  try {
    await updateUser(email, formData);
    // Recargar lista de usuarios
    fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
```

### 4. Eliminar Usuario

#### Endpoint
```
DELETE /auth/delete
```

#### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body
```json
{
  "userEmail": "user@musikon.com"
}
```

#### Response (Success - 200)
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

#### Response (Error - 404)
```json
{
  "message": "Usuario no encontrado"
}
```

#### Implementación en Frontend
```typescript
// src/services/usersService.ts
export async function deleteUserByEmail(email: string): Promise<any> {
  return await del<any>('/auth/delete', { data: { userEmail: email } });
}

// En el componente con confirmación
const handleDelete = async (email: string) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await deleteUserByEmail(email);
      // Recargar lista de usuarios
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};
```

---

## 🔐 Roles y Permisos

### Roles Disponibles
```typescript
export const ROLES = [
  'admin',
  'organizador', // sinónimo de eventCreator
  'eventCreator',
  'musico',
  'superadmin',
];
```

### Permisos por Rol

#### Admin
- ✅ Acceso completo a gestión de usuarios
- ✅ Acceso completo a gestión de eventos
- ✅ Acceso completo a gestión de solicitudes
- ✅ Acceso completo a gestión de imágenes
- ❌ Acceso a herramientas de superadmin

#### Organizador/EventCreator
- ✅ Gestión de eventos propios
- ✅ Crear solicitudes de músicos
- ✅ Ver músicos disponibles
- ❌ Gestión de usuarios
- ❌ Acceso a herramientas administrativas

#### Músico
- ✅ Ver eventos disponibles
- ✅ Aceptar/rechazar solicitudes
- ✅ Gestionar perfil propio
- ❌ Crear eventos
- ❌ Gestión de usuarios

#### Superadmin
- ✅ Acceso completo a todas las funcionalidades
- ✅ Eliminación masiva de datos
- ✅ Configuración del sistema
- ✅ Logs y auditoría

### Implementación de Protección de Rutas
```typescript
// src/routes/index.tsx
function PrivateRoute({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.roll)) {
    return <Navigate to="/" replace />;
  }
  
  return <PrivateLayout>{children}</PrivateLayout>;
}

// Uso en rutas
<Route path="/admin" element={<PrivateRoute allowedRoles={['superadmin']}><AdminTools /></PrivateRoute>} />
```

---

## 🔒 Seguridad y Validaciones

### 1. Validación de Email
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
};
```

### 2. Validación de Contraseña
```typescript
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return errors;
};
```

### 3. Sanitización de Datos
```typescript
const sanitizeUserData = (user: User): User => {
  return {
    ...user,
    name: user.name?.trim(),
    lastName: user.lastName?.trim(),
    userEmail: user.userEmail?.trim().toLowerCase(),
    roll: user.roll?.toLowerCase(),
  };
};
```

### 4. Interceptor de Autenticación
```typescript
// src/services/api.ts
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 Manejo de Estados

### 1. Estados de Autenticación
```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

### 2. Estados de Usuarios
```typescript
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  filters: {
    search: string;
    role: string;
    status: boolean | null;
  };
}
```

### 3. Implementación con Hooks
```typescript
// Hook para gestión de usuarios
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: User) => {
    try {
      const newUser = await createUserService(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (email: string, userData: Partial<User>) => {
    try {
      const updatedUser = await updateUserService(email, userData);
      setUsers(prev => prev.map(user => 
        user.userEmail === email ? updatedUser : user
      ));
      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (email: string) => {
    try {
      await deleteUserService(email);
      setUsers(prev => prev.filter(user => user.userEmail !== email));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
```

---

## 🧪 Testing

### 1. Tests de Autenticación
```typescript
// tests/auth.test.ts
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    const response = await login('admin@musikon.com', 'password123');
    expect(response.token).toBeDefined();
    expect(response.user).toBeDefined();
  });

  test('should reject invalid credentials', async () => {
    await expect(login('invalid@email.com', 'wrongpass')).rejects.toThrow();
  });
});
```

### 2. Tests de Usuarios
```typescript
// tests/users.test.ts
describe('Users Management', () => {
  test('should fetch all users', async () => {
    const users = await getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('should create new user', async () => {
    const newUser = {
      name: 'Test',
      lastName: 'User',
      userEmail: 'test@musikon.com',
      roll: 'musico',
      status: true,
      userPassword: 'password123'
    };
    
    const created = await createUser(newUser);
    expect(created.name).toBe(newUser.name);
  });
});
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- **[SECURITY.md](./SECURITY.md)** - Políticas de seguridad
- **[AUTHORIZATION.md](./AUTHORIZATION.md)** - Control de acceso
- **[JWT.md](./JWT.md)** - Manejo de tokens

### Herramientas de Desarrollo
- **Postman:** Testing de APIs
- **JWT.io:** Debugging de tokens
- **React Developer Tools:** Debugging de componentes

---

**🎵 MusikOn Admin System** - API completa de autenticación y gestión de usuarios. 