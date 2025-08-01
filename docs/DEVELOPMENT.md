# Guía de Desarrollo - APP Mussikon Admin

## 🚀 Introducción

Esta guía proporciona información completa para desarrolladores que trabajen en el **APP Mussikon Admin System**. Incluye estándares de código, mejores prácticas, y flujos de trabajo.

## 🛠️ Stack Tecnológico

### **Frontend**
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Material-UI**: 5.18.0
- **React Router**: 7.7.0
- **Axios**: 1.11.0
- **Zustand**: 5.0.6

### **Herramientas de Desarrollo**
- **Vite**: 7.0.4 (Build tool)
- **ESLint**: 9.30.1 (Linting)
- **TypeScript**: 5.8.3 (Type checking)

## 📁 Estructura del Proyecto

```
src/
├── 🎨 components/          # Componentes reutilizables
│   ├── Sidebar.tsx        # Navegación principal
│   ├── PrivateLayout.tsx  # Layout protegido
│   ├── LoadingScreen.tsx  # Pantalla de carga
│   ├── ThemeToggle.tsx    # Toggle de tema
│   ├── GlobalSearch.tsx   # Búsqueda global
│   ├── QuickFilters.tsx   # Filtros rápidos
│   ├── DashboardCharts.tsx # Gráficos del dashboard
│   ├── DashboardStats.tsx # Estadísticas
│   ├── DashboardNotifications.tsx # Notificaciones
│   └── Sidebar.css        # Estilos del sidebar
├── ⚙️ config/             # Configuraciones
│   └── apiConfig.ts       # Configuración de API
├── 🔄 contexts/           # Contextos de React
│   └── ThemeContext.tsx   # Contexto de tema
├── 🚀 features/           # Módulos principales
│   ├── auth/             # Autenticación
│   ├── dashboard/        # Dashboard principal
│   ├── users/            # Gestión de usuarios
│   ├── events/           # Gestión de eventos
│   ├── musicianRequests/ # Solicitudes de músicos
│   ├── images/           # Gestión de imágenes
│   ├── musicians/        # Gestión de músicos
│   ├── mobileUsers/      # Usuarios móviles
│   ├── search/           # Búsqueda global
│   ├── analytics/        # Analytics
│   └── admin/            # Herramientas de admin
├── 🎣 hooks/             # Custom hooks
│   ├── useAuth.ts        # Autenticación
│   ├── useApiRequest.ts  # Requests de API
│   ├── useResponsive.ts  # Responsive design
│   └── useTheme.ts       # Gestión de tema
├── 🛣️ routes/            # Configuración de rutas
│   └── index.tsx         # Definición de rutas
├── 🔌 services/          # Servicios de API
│   ├── api.ts            # Cliente HTTP principal
│   ├── authService.ts    # Autenticación
│   ├── usersService.ts   # Gestión de usuarios
│   ├── eventsService.ts  # Gestión de eventos
│   ├── musicianRequestsService.ts # Solicitudes
│   ├── imagesService.ts  # Gestión de imágenes
│   ├── musiciansService.ts # Gestión de músicos
│   ├── mobileUsersService.ts # Usuarios móviles
│   ├── searchService.ts  # Búsqueda global
│   ├── analyticsService.ts # Analytics
│   ├── notificationService.ts # Notificaciones
│   ├── paymentService.ts # Pagos
│   ├── contentService.ts # Contenido
│   ├── deviceService.ts  # Dispositivos
│   ├── geolocationService.ts # Geolocalización
│   ├── superadminService.ts # Herramientas admin
│   └── index.ts          # Exportaciones
├── 📦 store/             # Estado global (Zustand)
├── 🎨 theme/             # Configuración de tema
│   ├── themeConfig.ts    # Configuración principal
│   └── README.md         # Documentación del tema
└── 🛠️ utils/             # Utilidades
    └── searchDiagnostic.ts # Diagnóstico de búsqueda
```

## 🎯 Estándares de Código

### **1. Convenciones de Nomenclatura**

#### **Archivos y Carpetas**
```typescript
// PascalCase para componentes
UserCard.tsx
EventDetails.tsx
DashboardStats.tsx

// camelCase para hooks y servicios
useAuth.ts
authService.ts
mobileUsersService.ts

// kebab-case para archivos de configuración
api-config.ts
theme-config.ts
```

#### **Variables y Funciones**
```typescript
// camelCase para variables y funciones
const userData = {};
const handleUserClick = () => {};
const fetchUserData = async () => {};

// PascalCase para componentes y tipos
interface UserData {}
type EventType = 'concert' | 'rehearsal';
const UserCard: React.FC = () => {};
```

#### **Constantes**
```typescript
// UPPER_SNAKE_CASE para constantes
const API_BASE_URL = 'http://192.168.54.86:3001';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;
```

### **2. Estructura de Componentes**

#### **Componente Funcional con TypeScript**
```typescript
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(user.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {user.email}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button onClick={handleEdit} variant="outlined" size="small">
          Editar
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="outlined" 
          color="error" 
          size="small"
          disabled={loading}
        >
          Eliminar
        </Button>
      </Box>
    </Box>
  );
};
```

### **3. Hooks Personalizados**

#### **Estructura de Hook**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../../services/usersService';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.createUser(userData);
      await fetchUsers(); // Refetch users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserData) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.updateUser(id, userData);
      await fetchUsers(); // Refetch users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.deleteUser(id);
      await fetchUsers(); // Refetch users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
```

### **4. Servicios de API**

#### **Estructura de Servicio**
```typescript
import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const usersService = {
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }): Promise<UsersResponse> {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async blockUser(id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/block`);
    return response.data;
  },

  async unblockUser(id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/unblock`);
    return response.data;
  }
};
```

## 🎨 Estándares de UI/UX

### **1. Material-UI Components**

#### **Uso Consistente de Componentes**
```typescript
// ✅ Correcto - Uso consistente de MUI
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

// ✅ Correcto - Props consistentes
<Button 
  variant="contained" 
  color="primary" 
  size="medium"
  onClick={handleClick}
  disabled={loading}
>
  Guardar
</Button>

// ✅ Correcto - Spacing consistente
<Box sx={{ p: 2, mb: 2 }}>
  <Typography variant="h6" gutterBottom>
    Título
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Descripción
  </Typography>
</Box>
```

### **2. Responsive Design**

#### **Breakpoints y Responsive**
```typescript
// ✅ Correcto - Uso de breakpoints
<Box 
  sx={{ 
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',           // 1 columna en móvil
      sm: '1fr 1fr',       // 2 columnas en tablet
      md: '1fr 1fr 1fr',   // 3 columnas en desktop
      lg: '1fr 1fr 1fr 1fr' // 4 columnas en large
    },
    gap: 2
  }}
>
  {/* Contenido */}
</Box>

// ✅ Correcto - Responsive con useResponsive hook
import { useResponsive } from '../../hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 1 : 2
    }}>
      {/* Contenido adaptativo */}
    </Box>
  );
};
```

### **3. Tema y Colores**

#### **Uso del Sistema de Tema**
```typescript
// ✅ Correcto - Uso de colores del tema
<Box sx={{ 
  backgroundColor: 'background.paper',
  color: 'text.primary',
  border: '1px solid',
  borderColor: 'divider'
}}>
  Contenido
</Box>

// ✅ Correcto - Uso de spacing del tema
<Box sx={{ 
  p: 2,        // padding: theme.spacing(2)
  m: 1,        // margin: theme.spacing(1)
  gap: 1       // gap: theme.spacing(1)
}}>
  Contenido
</Box>
```

## 🔧 Configuración de Desarrollo

### **1. Variables de Entorno**

#### **Archivo .env**
```env
# API Configuration
VITE_API_BASE_URL=http://192.168.54.86:3001
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Mussikon Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=false

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### **2. Scripts de Desarrollo**

#### **package.json Scripts**
```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "check-backend": "node scripts/check-backend.cjs"
  }
}
```

### **3. Configuración de TypeScript**

#### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🧪 Testing

### **1. Estructura de Tests**

```
__tests__/
├── components/
│   ├── UserCard.test.tsx
│   ├── EventCard.test.tsx
│   └── DashboardStats.test.tsx
├── hooks/
│   ├── useAuth.test.ts
│   ├── useUsers.test.ts
│   └── useApiRequest.test.ts
├── services/
│   ├── authService.test.ts
│   ├── usersService.test.ts
│   └── api.test.ts
└── utils/
    └── testUtils.ts
```

### **2. Ejemplo de Test**

#### **Component Test**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme/themeConfig';
import { UserCard } from '../UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  status: 'active',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    renderWithTheme(
      <UserCard 
        user={mockUser} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithTheme(
      <UserCard 
        user={mockUser} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithTheme(
      <UserCard 
        user={mockUser} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
  });
});
```

## 🚀 Flujo de Trabajo

### **1. Desarrollo de Features**

#### **Pasos del Flujo**
1. **Crear branch**: `git checkout -b feature/nombre-feature`
2. **Desarrollar**: Implementar funcionalidad
3. **Testear**: Ejecutar tests y linting
4. **Commit**: `git commit -m "feat: add user management feature"`
5. **Push**: `git push origin feature/nombre-feature`
6. **Pull Request**: Crear PR en GitHub
7. **Code Review**: Revisión de código
8. **Merge**: Merge a main después de aprobación

#### **Convenciones de Commits**
```bash
# Formato: type(scope): description
feat(auth): add JWT authentication system
fix(users): resolve user deletion issue
docs(readme): update installation guide
style(components): improve button styling
refactor(services): simplify API service structure
test(hooks): add tests for useAuth hook
chore(deps): update dependencies
```

### **2. Code Review Checklist**

#### **Revisión de Código**
- [ ] **Funcionalidad**: ¿La feature funciona correctamente?
- [ ] **Código**: ¿El código es limpio y legible?
- [ ] **Performance**: ¿Hay problemas de performance?
- [ ] **Testing**: ¿Hay tests adecuados?
- [ ] **Documentación**: ¿Está documentado correctamente?
- [ ] **Seguridad**: ¿Hay problemas de seguridad?
- [ ] **Accesibilidad**: ¿Es accesible?
- [ ] **Responsive**: ¿Funciona en todos los dispositivos?

## 🐛 Debugging

### **1. Herramientas de Debugging**

#### **React Developer Tools**
- Instalar extensión del navegador
- Inspeccionar componentes y props
- Verificar estado y hooks

#### **Redux DevTools (para Zustand)**
```typescript
// Configuración para debugging
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      // store implementation
    }),
    {
      name: 'mussikon-admin-store'
    }
  )
);
```

### **2. Logging**

#### **Console Logging**
```typescript
// ✅ Correcto - Logging estructurado
console.log('🔍 [Search] Processing search query:', query);
console.log('✅ [Auth] User authenticated successfully:', user);
console.log('❌ [API] Request failed:', error);

// ✅ Correcto - Logging condicional
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📚 Recursos Adicionales

### **1. Documentación Oficial**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)

### **2. Herramientas Recomendadas**
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript Importer
  - Material-UI Snippets
  - React Developer Tools

### **3. Bibliotecas Útiles**
- **Date handling**: `date-fns`
- **Form validation**: `react-hook-form` + `yup`
- **Charts**: `recharts`
- **Icons**: `@mui/icons-material`
- **Notifications**: `notistack`

---

**Esta guía de desarrollo proporciona las bases para mantener un código limpio, escalable y mantenible en el proyecto APP Mussikon Admin.** 