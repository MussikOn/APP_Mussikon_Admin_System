# 🏗️ Arquitectura del Sistema - MusikOn Admin System

> **Versión:** 1.0.0  
> **Última Actualización:** Diciembre 2024

## 📋 Resumen de Arquitectura

### Stack Tecnológico
```
Frontend Stack:
├── React 19.1.0 (Core)
├── TypeScript 5.8.3 (Tipado)
├── Vite 7.0.4 (Build Tool)
├── Material UI 7.2.0 (UI Components)
├── Zustand 5.0.6 (State Management)
├── React Router DOM 7.7.0 (Routing)
├── Axios 1.11.0 (HTTP Client)
└── ESLint 9.30.1 (Code Quality)
```

### Patrón de Arquitectura
- **Feature-based Architecture:** Organización por funcionalidades
- **Service Layer Pattern:** Separación de lógica de negocio
- **Hook-based Logic:** Lógica reutilizable en custom hooks
- **Component Composition:** Composición de componentes
- **Type Safety:** Tipado fuerte con TypeScript

---

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

---

## 🔄 Flujo de Datos

### 1. Flujo de Autenticación
```
User Input → Login Form → Auth Service → API → JWT Token → Local Storage → Protected Routes
```

### 2. Flujo de Peticiones API
```
Component → Hook → Service → HTTP Client → API → Response → State Update → UI Update
```

### 3. Flujo de Estado Global
```
User Action → Hook → Service → API → Zustand Store → Component Re-render → UI Update
```

---

## 🧩 Componentes y Patrones

### 1. Patrón de Componentes

#### Componentes Presentacionales
```typescript
// Componentes que solo muestran UI
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Editar</button>
      <button onClick={() => onDelete(user.id)}>Eliminar</button>
    </div>
  );
};
```

#### Componentes de Contenedor
```typescript
// Componentes que manejan lógica de negocio
const UsersContainer: React.FC = () => {
  const { data: users, loading, error, execute: fetchUsers } = useApiRequest(getAllUsers);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const handleEdit = (user: User) => {
    // Lógica de edición
  };
  
  const handleDelete = (id: string) => {
    // Lógica de eliminación
  };
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {users?.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

### 2. Patrón de Hooks

#### Custom Hooks
```typescript
// Hook para peticiones API
export function useApiRequest<T, Args extends any[]>(
  apiFn: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Error desconocido');
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute };
}
```

### 3. Patrón de Servicios

#### Service Layer
```typescript
// Servicio de usuarios
export async function getAllUsers(): Promise<User[]> {
  return await get<User[]>('/getAllUsers');
}

export async function createUser(form: User): Promise<any> {
  return await post<any>('/auth/Register', form);
}

export async function updateUser(email: string, form: Partial<User>): Promise<any> {
  return await put<any>(`/auth/update/${encodeURIComponent(email)}`, form);
}

export async function deleteUserByEmail(email: string): Promise<any> {
  return await del<any>('/auth/delete', { data: { userEmail: email } });
}
```

---

## 🔐 Sistema de Autenticación

### 1. Flujo de Autenticación
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await verifyToken(token);
        setUser(data.user || data);
      } catch (err: any) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginService(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user || {});
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, error, login, logout };
}
```

### 2. Protección de Rutas
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
```

---

## 🎨 Sistema de Diseño

### 1. Glassmorphism
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### 2. Gradientes
```css
.gradient-purple {
  background: linear-gradient(90deg, #b993d6 0%, #8ca6db 100%);
}

.gradient-green {
  background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
}
```

### 3. Responsive Design
```typescript
// src/hooks/useResponsive.ts
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      setIsDesktop(width > 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
}
```

---

## 🔄 Gestión de Estado

### 1. Estado Local (useState)
```typescript
// Para estado simple de componentes
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialForm);
const [selectedItem, setSelectedItem] = useState(null);
```

### 2. Estado Global (Zustand)
```typescript
// Para estado compartido entre componentes
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'dark',
  notifications: [],
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [...state.notifications, notification] 
    })),
}));
```

### 3. Estado de Servidor (useApiRequest)
```typescript
// Para estado que viene de APIs
const { data, loading, error, execute } = useApiRequest(getAllUsers);
```

---

## 🌐 Integración con APIs

### 1. Configuración de Axios
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'http://192.168.100.101:1000',
  withCredentials: true,
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo global de errores
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

### 2. Cliente HTTP Centralizado
```typescript
// src/services/httpClient.ts
export async function get<T>(url: string, config?: any): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function post<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: any): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}
```

---

## 🧪 Testing y Calidad

### 1. Estructura de Testing
```
tests/
├── unit/              # Tests unitarios
│   ├── components/    # Tests de componentes
│   ├── hooks/         # Tests de hooks
│   └── services/      # Tests de servicios
├── integration/       # Tests de integración
│   ├── api/          # Tests de APIs
│   └── flows/        # Tests de flujos
└── e2e/              # Tests end-to-end
    ├── auth/         # Tests de autenticación
    └── crud/         # Tests de CRUD
```

### 2. Configuración de Testing
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

---

## 📊 Performance y Optimización

### 1. Lazy Loading
```typescript
// src/routes/index.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('../features/dashboard'));
const Users = lazy(() => import('../features/users'));
const Events = lazy(() => import('../features/events'));

// Con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 2. Memoización
```typescript
// Memoización de componentes
const UserCard = React.memo<UserCardProps>(({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Editar</button>
      <button onClick={() => onDelete(user.id)}>Eliminar</button>
    </div>
  );
});

// Memoización de callbacks
const handleEdit = useCallback((user: User) => {
  // Lógica de edición
}, []);
```

### 3. Code Splitting
```typescript
// División de bundles por rutas
const AdminTools = lazy(() => import('../features/admin'));
const MusicianRequests = lazy(() => import('../features/musicianRequests'));
```

---

## 🔐 Seguridad

### 1. Validación de Input
```typescript
// Validación de formularios
const validateUserForm = (form: UserForm): string[] => {
  const errors: string[] = [];
  
  if (!form.name?.trim()) errors.push('Nombre es requerido');
  if (!form.email?.trim()) errors.push('Email es requerido');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.push('Email inválido');
  }
  if (!form.password || form.password.length < 6) {
    errors.push('Contraseña mínima 6 caracteres');
  }
  
  return errors;
};
```

### 2. Sanitización de Datos
```typescript
// Sanitización de datos antes de enviar
const sanitizeUserData = (user: User): User => {
  return {
    ...user,
    name: user.name?.trim(),
    email: user.email?.trim().toLowerCase(),
    password: user.password ? hashPassword(user.password) : undefined,
  };
};
```

---

## 📈 Métricas y Monitoreo

### 1. Performance Monitoring
```typescript
// Métricas de performance
const measurePerformance = (componentName: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
  };
};
```

### 2. Error Tracking
```typescript
// Tracking de errores
const trackError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);
  // Enviar a servicio de tracking
};
```

---

## 🚀 Despliegue

### 1. Build de Producción
```bash
# Build optimizado
npm run build

# Verificar build
npm run preview

# Servir build
npx serve -s dist
```

### 2. Configuración de Servidor
```nginx
# Nginx configuration
server {
    listen 80;
    server_name admin.musikon.com;
    
    location / {
        root /var/www/admin;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://192.168.100.101:1000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de desarrollo
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Optimización de performance
- **[SECURITY.md](./SECURITY.md)** - Políticas de seguridad

### Herramientas de Desarrollo
- **React Developer Tools:** Debugging de componentes
- **Redux DevTools:** Debugging de estado (si se implementa)
- **Lighthouse:** Análisis de performance

---

**🎵 MusikOn Admin System** - Arquitectura moderna y escalable del panel administrativo. 