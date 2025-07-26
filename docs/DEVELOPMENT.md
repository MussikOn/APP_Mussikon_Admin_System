# 👨‍💻 Guía de Desarrollo - MusikOn Admin System

> **Versión:** 1.0.0  
> **Última Actualización:** Diciembre 2024

## 📋 Estándares de Desarrollo

### Principios Fundamentales
- **Clean Code:** Código legible y mantenible
- **Type Safety:** Uso completo de TypeScript
- **Component Composition:** Composición sobre herencia
- **Single Responsibility:** Una función, una responsabilidad
- **DRY:** Don't Repeat Yourself
- **KISS:** Keep It Simple, Stupid

---

## 🏗️ Arquitectura de Componentes

### 1. Estructura de Componentes

#### Componentes Presentacionales
```typescript
// Componentes que solo muestran UI
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  return (
    <Card className="user-card glass-panel">
      <CardContent>
        <Typography variant="h6">{user.name} {user.lastName}</Typography>
        <Typography color="textSecondary">{user.userEmail}</Typography>
        <Chip label={user.roll} color="primary" />
      </CardContent>
      <CardActions>
        <Button 
          onClick={() => onEdit(user)}
          disabled={loading}
          startIcon={<EditIcon />}
        >
          Editar
        </Button>
        <Button 
          onClick={() => onDelete(user.userEmail)}
          disabled={loading}
          color="error"
          startIcon={<DeleteIcon />}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};
```

#### Componentes de Contenedor
```typescript
// Componentes que manejan lógica de negocio
const UsersContainer: React.FC = () => {
  const { data: users, loading, error, execute: fetchUsers } = useApiRequest(getAllUsers);
  const { createUser, updateUser, deleteUser } = useUsers();
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const handleCreate = async (userData: User) => {
    try {
      await createUser(userData);
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const handleUpdate = async (email: string, userData: Partial<User>) => {
    try {
      await updateUser(email, userData);
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const handleDelete = async (email: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(email);
        fetchUsers(); // Recargar lista
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="users-container">
      <UserForm onSubmit={handleCreate} />
      <div className="users-grid">
        {users?.map(user => (
          <UserCard
            key={user.userEmail}
            user={user}
            onEdit={(user) => setSelectedUser(user)}
            onDelete={handleDelete}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};
```

### 2. Patrón de Hooks

#### Custom Hooks Reutilizables
```typescript
// Hook para formularios
export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      // Validar campo cuando ha sido tocado
      validateField(field, value);
    }
  }, [touched]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  }, [values]);

  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldErrors = validateFormField(field, value);
    setErrors(prev => ({ ...prev, [field]: fieldErrors }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setValues,
    setErrors,
  };
}

// Hook para paginación
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
```

---

## 🎨 Estándares de Diseño

### 1. Sistema de Colores
```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    main: '#b993d6',
    light: '#d4b5e8',
    dark: '#8b6b9e',
  },
  secondary: {
    main: '#43cea2',
    light: '#6dd4b8',
    dark: '#2a8f6b',
  },
  background: {
    default: '#0a0a0a',
    paper: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
  error: '#f44336',
  warning: '#ff9800',
  success: '#4caf50',
  info: '#2196f3',
};
```

### 2. Tipografía
```typescript
// src/theme/typography.ts
export const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 300,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
};
```

### 3. Espaciado
```typescript
// src/theme/spacing.ts
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
};
```

---

## 🔧 Estándares de Código

### 1. Nomenclatura

#### Variables y Funciones
```typescript
// ✅ Correcto
const userList = [];
const fetchUserData = () => {};
const isUserActive = true;
const handleUserClick = () => {};

// ❌ Incorrecto
const user_list = [];
const fetchUserData = () => {};
const isUserActive = true;
const handleUserClick = () => {};
```

#### Componentes
```typescript
// ✅ Correcto
const UserCard: React.FC<UserCardProps> = () => {};
const UserListContainer: React.FC = () => {};
const useUserData = () => {};

// ❌ Incorrecto
const userCard: React.FC<UserCardProps> = () => {};
const userListContainer: React.FC = () => {};
const useUserData = () => {};
```

#### Interfaces y Tipos
```typescript
// ✅ Correcto
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

type UserStatus = 'active' | 'inactive' | 'pending';

// ❌ Incorrecto
interface userCardProps {
  user: User;
  onEdit: (user: User) => void;
}

type userStatus = 'active' | 'inactive' | 'pending';
```

### 2. Estructura de Archivos
```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   └── Modal/
│   └── layout/           # Componentes de layout
├── features/
│   ├── users/
│   │   ├── components/   # Componentes específicos
│   │   ├── hooks/        # Hooks específicos
│   │   ├── services/     # Servicios específicos
│   │   ├── types/        # Tipos específicos
│   │   └── index.tsx     # Punto de entrada
├── hooks/
├── services/
├── utils/
└── types/
```

### 3. Imports y Exports
```typescript
// ✅ Correcto - Imports organizados
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { User } from '../types';
import { useUsers } from '../hooks/useUsers';
import { UserCard } from '../components/UserCard';

// ✅ Correcto - Exports nombrados
export { UserCard } from './UserCard';
export { useUsers } from './useUsers';
export type { User } from './types';

// ❌ Incorrecto - Imports desordenados
import { Card, CardContent, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
```

---

## 🧪 Testing

### 1. Estructura de Tests
```typescript
// src/components/UserCard/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser = {
  name: 'John',
  lastName: 'Doe',
  userEmail: 'john@example.com',
  roll: 'musico',
  status: true,
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user information correctly', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('musico')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockUser.userEmail);
  });

  it('should disable buttons when loading', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        loading={true}
      />
    );

    expect(screen.getByText('Editar')).toBeDisabled();
    expect(screen.getByText('Eliminar')).toBeDisabled();
  });
});
```

### 2. Tests de Hooks
```typescript
// src/hooks/useUsers.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUsers } from './useUsers';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/usersService';

jest.mock('../services/usersService');

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users on mount', async () => {
    const mockUsers = [
      { name: 'John', userEmail: 'john@example.com' },
      { name: 'Jane', userEmail: 'jane@example.com' },
    ];

    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.loading).toBe(false);
  });

  it('should handle error when fetching users', async () => {
    const error = new Error('Failed to fetch users');
    (getAllUsers as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.error).toBe('Failed to fetch users');
    expect(result.current.loading).toBe(false);
  });
});
```

---

## 📊 Performance

### 1. Memoización
```typescript
// Memoización de componentes
const UserCard = React.memo<UserCardProps>(({ user, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{user.name}</Typography>
        <Button onClick={() => onEdit(user)}>Editar</Button>
        <Button onClick={() => onDelete(user.userEmail)}>Eliminar</Button>
      </CardContent>
    </Card>
  );
});

// Memoización de callbacks
const handleEdit = useCallback((user: User) => {
  setSelectedUser(user);
  setEditModalOpen(true);
}, []);

const handleDelete = useCallback((email: string) => {
  if (window.confirm('¿Estás seguro?')) {
    deleteUser(email);
  }
}, [deleteUser]);
```

### 2. Lazy Loading
```typescript
// Lazy loading de componentes
const AdminTools = lazy(() => import('../features/admin'));
const MusicianRequests = lazy(() => import('../features/musicianRequests'));

// Con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminTools />
</Suspense>
```

### 3. Optimización de Re-renders
```typescript
// Evitar re-renders innecesarios
const UserList = React.memo<{ users: User[] }>(({ users }) => {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.userEmail} user={user} />
      ))}
    </div>
  );
});

// Usar useMemo para cálculos costosos
const filteredUsers = useMemo(() => {
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [users, searchTerm]);
```

---

## 🔒 Seguridad

### 1. Validación de Input
```typescript
// Validación de formularios
const validateUserForm = (form: UserForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.name?.trim()) {
    errors.name = 'Nombre es requerido';
  }

  if (!form.userEmail?.trim()) {
    errors.userEmail = 'Email es requerido';
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.userEmail)) {
    errors.userEmail = 'Email inválido';
  }

  if (!form.userPassword || form.userPassword.length < 6) {
    errors.userPassword = 'Contraseña mínima 6 caracteres';
  }

  return errors;
};
```

### 2. Sanitización de Datos
```typescript
// Sanitización antes de enviar
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

### 3. Manejo de Errores
```typescript
// Error boundary
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Enviar a servicio de tracking
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

---

## 📝 Documentación

### 1. JSDoc para Funciones
```typescript
/**
 * Crea un nuevo usuario en el sistema
 * @param userData - Datos del usuario a crear
 * @returns Promise con el usuario creado
 * @throws Error si la validación falla o el usuario ya existe
 */
export async function createUser(userData: User): Promise<User> {
  // Validación
  const errors = validateUserForm(userData);
  if (Object.keys(errors).length > 0) {
    throw new Error('Datos inválidos');
  }

  // Sanitización
  const sanitizedData = sanitizeUserData(userData);

  // Envío
  return await post<User>('/auth/Register', sanitizedData);
}
```

### 2. Documentación de Componentes
```typescript
/**
 * Tarjeta que muestra información de un usuario
 * @param user - Datos del usuario a mostrar
 * @param onEdit - Callback cuando se hace clic en editar
 * @param onDelete - Callback cuando se hace clic en eliminar
 * @param loading - Estado de carga para deshabilitar botones
 */
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (email: string) => void;
  loading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  // Implementación...
};
```

---

## 🚀 Comandos de Desarrollo

### Scripts de Package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build

# Linting y Type Checking
npm run lint             # Verificar linting
npm run lint:fix         # Corregir errores de linting
npm run type-check       # Verificar tipos TypeScript

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con coverage

# Storybook
npm run storybook        # Iniciar Storybook
npm run build-storybook  # Build de Storybook
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Estándares de código
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guía de testing

### Herramientas de Desarrollo
- **ESLint:** Linting de código
- **Prettier:** Formateo de código
- **Storybook:** Documentación de componentes
- **Vitest:** Framework de testing

---

**🎵 MusikOn Admin System** - Guía completa de desarrollo y buenas prácticas. 