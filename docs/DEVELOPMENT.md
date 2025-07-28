# 🛠️ **GUÍA DE DESARROLLO - MUSSIKON ADMIN SYSTEM**

> **Guías, Mejores Prácticas y Estándares de Desarrollo**

---

## 🎯 **INFORMACIÓN GENERAL**

### **Estado del Proyecto**
- **✅ COMPLETADO**: Sistema de API Centralizado y Gestión de Usuarios Móviles
- **🚧 EN DESARROLLO**: Sistema de Notificaciones
- **📅 Fecha**: Diciembre 2024
- **🏆 Versión**: 2.0.0

### **Tecnologías Utilizadas**
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI v7
- **HTTP Client**: Axios con interceptores
- **Estado**: React Hooks + Context
- **Routing**: React Router v6
- **Build Tool**: Vite

---

## 🚀 **CONFIGURACIÓN DEL ENTORNO**

### **Requisitos Previos**
```bash
# Versiones mínimas requeridas
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0
```

### **Instalación del Proyecto**
```bash
# Clonar el repositorio
git clone https://github.com/MussikOn/APP_Mussikon_Admin_System.git

# Navegar al directorio
cd APP_Mussikon_Admin_System

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la configuración local

# Ejecutar en desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código

# Testing (futuro)
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

---

## 📁 **ESTRUCTURA DE DESARROLLO**

### **Convenciones de Nomenclatura**
```typescript
// Archivos y carpetas
components/           # Componentes reutilizables
features/            # Módulos de funcionalidad
hooks/               # Custom hooks
services/            # Servicios de API
types/               # Definiciones de tipos
utils/               # Utilidades

// Nomenclatura de archivos
ComponentName.tsx    # Componentes React
useHookName.ts       # Custom hooks
serviceName.ts       # Servicios
typeName.ts          # Tipos TypeScript
```

### **Organización de Componentes**
```typescript
// Estructura recomendada para features
src/features/featureName/
├── components/          # Componentes específicos
│   ├── ComponentName.tsx
│   └── ComponentName.test.tsx
├── hooks/              # Hooks específicos
│   └── useFeatureName.ts
├── services/           # Servicios específicos
│   └── featureNameService.ts
├── types/              # Tipos específicos
│   └── featureName.ts
└── index.tsx           # Punto de entrada
```

---

## 🔧 **PATRONES DE DESARROLLO**

### **1. Patrón de Servicios**
```typescript
// src/services/exampleService.ts
export const exampleService = {
  // GET - Obtener datos
  async getData(filters?: Filters): Promise<ApiResponse<Data[]>> {
    return apiService.get('/endpoint', { params: filters });
  },

  // POST - Crear datos
  async createData(data: CreateData): Promise<ApiResponse<Data>> {
    return apiService.post('/endpoint', data);
  },

  // PUT - Actualizar datos
  async updateData(id: string, data: UpdateData): Promise<ApiResponse<Data>> {
    return apiService.put(`/endpoint/${id}`, data);
  },

  // DELETE - Eliminar datos
  async deleteData(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/endpoint/${id}`);
  },
};
```

### **2. Patrón de Hooks**
```typescript
// src/hooks/useExample.ts
export const useExample = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (filters?: Filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await exampleService.getData(filters);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createData = useCallback(async (newData: CreateData) => {
    try {
      const response = await exampleService.createData(newData);
      setData(prev => [...prev, response.data]);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear');
      throw err;
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    createData,
  };
};
```

### **3. Patrón de Componentes**
```typescript
// src/components/ExampleComponent.tsx
interface ExampleComponentProps {
  data: Data;
  onEdit: (data: Data) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  data,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const handleEdit = useCallback(() => {
    onEdit(data);
  }, [data, onEdit]);

  const handleDelete = useCallback(() => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      onDelete(data.id);
    }
  }, [data.id, onDelete]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{data.title}</Typography>
        <Typography variant="body2">{data.description}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} color="error">Eliminar</Button>
      </CardActions>
    </Card>
  );
};
```

---

## 🎨 **ESTÁNDARES DE UI/UX**

### **1. Componentes Material-UI**
```typescript
// Uso correcto de Material-UI v7
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

// Layout con Box (reemplaza Grid)
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 2,
    p: 2,
  }}
>
  {/* Contenido */}
</Box>

// Tema personalizado
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00fff7',
    },
    secondary: {
      main: '#b993d6',
    },
  },
});
```

### **2. Glassmorphism Design**
```typescript
// Componente Glass Panel
const GlassPanel: React.FC<GlassPanelProps> = ({ children, className }) => (
  <Box
    className={className}
    sx={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      p: 2,
    }}
  >
    {children}
  </Box>
);
```

### **3. Responsive Design**
```typescript
// Hook para responsive
export const useResponsive = () => {
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
};
```

---

## 🔐 **SEGURIDAD Y AUTENTICACIÓN**

### **1. Protección de Rutas**
```typescript
// src/components/PrivateRoute.tsx
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### **2. Validación de Formularios**
```typescript
// Validación de datos
const validateForm = (data: FormData): string[] => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('El nombre es requerido');
  }

  if (!data.email?.trim()) {
    errors.push('El email es requerido');
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push('El email no es válido');
  }

  if (data.password && data.password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  return errors;
};
```

---

## 📊 **GESTIÓN DE ESTADO**

### **1. Estado Local**
```typescript
// Para estado simple de componentes
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialForm);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
```

### **2. Estado Compartido**
```typescript
// Context para estado compartido
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### **3. Estado de Servidor**
```typescript
// Hook para datos del servidor
export const useServerData = <T>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, fetchData };
};
```

---

## 🧪 **TESTING**

### **1. Testing de Componentes**
```typescript
// __tests__/components/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  const mockData = {
    id: '1',
    title: 'Test Title',
    description: 'Test Description',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it('should render component with data', () => {
    render(
      <ExampleComponent
        data={mockData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ExampleComponent
        data={mockData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockData);
  });
});
```

### **2. Testing de Hooks**
```typescript
// __tests__/hooks/useExample.test.ts
import { renderHook, act } from '@testing-library/react';
import { useExample } from '../useExample';

describe('useExample', () => {
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useExample());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

---

## 🚀 **OPTIMIZACIÓN Y PERFORMANCE**

### **1. Lazy Loading**
```typescript
// src/routes/index.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('../features/dashboard'));
const Users = lazy(() => import('../features/mobileUsers'));
const Events = lazy(() => import('../features/events'));

// Con Suspense
<Suspense fallback={<CircularProgress />}>
  <Dashboard />
</Suspense>
```

### **2. Memoización**
```typescript
// Memoización de componentes
const UserCard = React.memo<UserCardProps>(({ user, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onEdit(user)}>Editar</Button>
        <Button onClick={() => onDelete(user.id)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
});

// Memoización de callbacks
const handleEdit = useCallback((user: User) => {
  // Lógica de edición
}, []);
```

### **3. Code Splitting**
```typescript
// División de bundles por rutas
const AdminTools = lazy(() => import('../features/admin'));
const MusicianRequests = lazy(() => import('../features/musicianRequests'));
const Notifications = lazy(() => import('../features/notifications'));
```

---

## 🔧 **CONFIGURACIÓN Y ENTORNO**

### **1. Variables de Entorno**
```bash
# .env
VITE_API_BASE_URL=http://172.20.10.2:3001
VITE_APP_NAME=MussikOn Admin
VITE_WEBSOCKET_URL=ws://172.20.10.2:3001
VITE_NOTIFICATION_ENABLED=true
VITE_TOAST_DURATION=5000
VITE_MAX_NOTIFICATIONS=50
```

### **2. Configuración de TypeScript**
```json
// tsconfig.json
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
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **3. Configuración de ESLint**
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Reglas personalizadas
    },
  },
];
```

---

## 📚 **DOCUMENTACIÓN DE CÓDIGO**

### **1. Comentarios JSDoc**
```typescript
/**
 * Hook personalizado para gestionar usuarios móviles
 * @param filters - Filtros opcionales para la búsqueda
 * @returns Objeto con datos, estado de carga y funciones
 */
export const useMobileUsers = (filters?: UserFilters) => {
  // Implementación
};

/**
 * Componente para mostrar información de un usuario móvil
 * @param props - Propiedades del componente
 * @returns Elemento JSX
 */
export const MobileUserCard: React.FC<MobileUserCardProps> = (props) => {
  // Implementación
};
```

### **2. README de Componentes**
```markdown
# MobileUserCard

Componente para mostrar información de un usuario móvil en formato de tarjeta.

## Props

- `user: MobileUser` - Datos del usuario
- `onEdit: (user: MobileUser) => void` - Función para editar
- `onDelete: (id: string) => void` - Función para eliminar
- `onBlock: (id: string) => void` - Función para bloquear

## Uso

```tsx
<MobileUserCard
  user={userData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onBlock={handleBlock}
/>
```
```

---

## 🔗 **ENLACES RELACIONADOS**

### **Documentación Principal**
- **[MAIN_DOCUMENTATION.md](MAIN_DOCUMENTATION.md)** - Documentación principal
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura del sistema
- **[INSTALLATION.md](INSTALLATION.md)** - Guía de instalación

### **Sistemas Específicos**
- **[NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md)** - Sistema de notificaciones
- **[AUTHENTICATION_SYSTEM.md](AUTHENTICATION_SYSTEM.md)** - Sistema de autenticación
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - Endpoints de la API

---

## 📞 **INFORMACIÓN DE CONTACTO**

### **Repositorio**
- **URL**: `https://github.com/MussikOn/APP_Mussikon_Admin_System`
- **Branch**: `notification`
- **Commit**: `ddb38b3`

### **Documentación**
- **README.md** - Documentación principal
- **API_SYSTEM_DOCUMENTATION.md** - Sistema de API
- **MAIN_DOCUMENTATION.md** - Documentación organizativa

---

## 🏆 **CONCLUSIÓN**

**¡Las guías de desarrollo están completas y listas para usar!**

### **Beneficios de las Guías**
1. **Consistencia** en el código
2. **Mantenibilidad** mejorada
3. **Escalabilidad** del proyecto
4. **Calidad** del código
5. **Colaboración** efectiva

### **Próximos Pasos**
- **Implementar sistema de notificaciones** siguiendo estas guías
- **Agregar tests completos** para todas las funcionalidades
- **Optimizar rendimiento** para producción
- **Implementar CI/CD** con estas guías

**¡El desarrollo será más eficiente y consistente!** 🚀

---

**Desarrollado con ❤️ para el equipo de MussikOn**

**Fecha de Actualización**: Diciembre 2024  
**Versión**: 2.0.0  
**Estado**: ✅ Completado + 🚧 En desarrollo 