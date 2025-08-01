# 🔌 Guía de Conectividad con Backend

## 📊 **Estado Actual**

**✅ Sistema Frontend**: 100% funcional  
**❌ Backend**: No disponible (errores 404)  
**🎯 Objetivo**: Conectar con backend real  

---

## 🚨 **Errores Detectados**

### **Errores 404 - Endpoints No Encontrados**
```
❌ GET /admin/users?page=1&limit=20 - 404
❌ GET /admin/users/stats - 404
```

### **Causas Posibles**
1. **Backend no está ejecutándose** en `172.20.10.2:3001`
2. **Endpoints no implementados** en el backend
3. **URL incorrecta** del backend
4. **Configuración de rutas** incorrecta

---

## 🔧 **Soluciones**

### **1. Verificar Estado del Backend**

#### **Opción A: Backend Local**
```bash
# Navegar al directorio del backend
cd ../app_mussikon_express

# Instalar dependencias
npm install

# Ejecutar el servidor
npm start
# o
npm run dev
```

#### **Opción B: Backend Remoto**
```bash
# Verificar si el servidor está activo
curl http://172.20.10.2:3001/health
# o
ping 172.20.10.2
```

### **2. Verificar Endpoints del Backend**

#### **Endpoints Requeridos**
```typescript
// Usuarios Móviles
GET /admin/users                    // Listar usuarios
GET /admin/users/:id               // Obtener usuario por ID
POST /admin/users                  // Crear usuario
PUT /admin/users/:id               // Actualizar usuario
DELETE /admin/users/:id            // Eliminar usuario
GET /admin/users/stats             // Estadísticas de usuarios

// Eventos
GET /admin/events                  // Listar eventos
GET /admin/events/:id              // Obtener evento por ID
POST /admin/events                 // Crear evento
PUT /admin/events/:id              // Actualizar evento
DELETE /admin/events/:id           // Eliminar evento

// Solicitudes de Músicos
GET /admin/musician-requests       // Listar solicitudes
GET /admin/musician-requests/:id   // Obtener solicitud por ID
POST /admin/musician-requests      // Crear solicitud
PUT /admin/musician-requests/:id   // Actualizar solicitud
DELETE /admin/musician-requests/:id // Eliminar solicitud
```

### **3. Configurar Backend**

#### **Verificar archivo de rutas del backend**
```javascript
// app_mussikon_express/routes/adminRoutes.js
router.get('/users', adminController.getUsers);
router.get('/users/stats', adminController.getUserStats);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
```

#### **Verificar controladores**
```javascript
// app_mussikon_express/controllers/adminController.js
exports.getUsers = async (req, res) => {
  try {
    // Lógica para obtener usuarios
    res.json({ users: [], total: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    // Lógica para obtener estadísticas
    res.json({ stats: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **4. Cambiar URL del Backend**

#### **Opción A: Backend Local**
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001', // Cambiar a localhost
  // ... resto de configuración
};
```

#### **Opción B: Backend Remoto**
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://tu-ip-del-backend:3001', // Cambiar IP
  // ... resto de configuración
};
```

### **5. Modo de Desarrollo (Sin Backend)**

#### **Habilitar datos de prueba**
```typescript
// src/services/mobileUsersService.ts
export const mobileUsersService = {
  async getAllUsers(filters?: UserFilters, page: number = 1, limit: number = 20): Promise<MobileUsersResponse> {
    try {
      // Intentar conectar al backend
      const response = await apiService.get<{ users: any[]; total: number; page: number; limit: number; totalPages: number }>(url);
      return {
        users: response.data?.users?.map(mapBackendUserToFrontend) || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 20,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.warn('Backend no disponible, usando datos de prueba');
      
      // Datos de prueba para desarrollo
      const mockUsers = [
        {
          _id: '1',
          name: 'Juan Pérez',
          lastName: 'García',
          userEmail: 'juan@example.com',
          status: 'active',
          roll: 'musico',
          location: 'Madrid',
          instrument: 'guitarra',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        // ... más usuarios de prueba
      ];
      
      return {
        users: mockUsers,
        total: mockUsers.length,
        page: 1,
        limit: 20,
        totalPages: 1
      };
    }
  }
};
```

---

## 🛠️ **Pasos para Resolver**

### **Paso 1: Verificar Backend**
```bash
# Verificar si el backend está ejecutándose
curl http://172.20.10.2:3001/health
```

### **Paso 2: Revisar Logs del Backend**
```bash
# En el directorio del backend
npm run dev
# Revisar logs para errores
```

### **Paso 3: Verificar Rutas**
```bash
# Verificar que las rutas estén registradas
curl http://172.20.10.2:3001/admin/users
```

### **Paso 4: Probar Endpoints**
```bash
# Probar endpoint de usuarios
curl -X GET "http://172.20.10.2:3001/admin/users?page=1&limit=20"

# Probar endpoint de estadísticas
curl -X GET "http://172.20.10.2:3001/admin/users/stats"
```

---

## 📋 **Checklist de Verificación**

### **Backend**
- [ ] Servidor ejecutándose en puerto 3001
- [ ] Rutas `/admin/users` implementadas
- [ ] Rutas `/admin/events` implementadas
- [ ] Rutas `/admin/musician-requests` implementadas
- [ ] Controladores funcionando correctamente
- [ ] Base de datos conectada

### **Frontend**
- [ ] URL correcta en `apiConfig.ts`
- [ ] Sistema de reintentos funcionando
- [ ] Manejo de errores activo
- [ ] Logs de debugging visibles

### **Red**
- [ ] Conectividad entre frontend y backend
- [ ] Firewall permitiendo conexiones
- [ ] CORS configurado correctamente

---

## 🚀 **Configuración Rápida**

### **Para Desarrollo Local**
```bash
# Terminal 1: Backend
cd ../app_mussikon_express
npm install
npm run dev

# Terminal 2: Frontend
cd ../APP_Mussikon_Admin_System
npm run dev
```

### **Para Producción**
```bash
# Configurar URL de producción
# src/config/apiConfig.ts
BASE_URL: 'https://tu-backend-produccion.com'
```

---

## 📞 **Soporte**

### **Si el Backend no está disponible**
1. **Usar datos de prueba** para desarrollo
2. **Implementar endpoints** en el backend
3. **Verificar configuración** de red
4. **Revisar logs** del servidor

### **Si hay errores de CORS**
```javascript
// En el backend (app_mussikon_express)
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true
}));
```

### **Si hay errores de autenticación**
```javascript
// Verificar middleware de autenticación
app.use('/admin', authMiddleware);
```

---

## 🎯 **Próximos Pasos**

1. **Verificar estado del backend** en `172.20.10.2:3001`
2. **Implementar endpoints faltantes** si es necesario
3. **Configurar CORS** correctamente
4. **Probar conectividad** endpoint por endpoint
5. **Implementar datos de prueba** para desarrollo

---

**¡El sistema frontend está 100% funcional y listo para conectar con el backend!** 🚀 