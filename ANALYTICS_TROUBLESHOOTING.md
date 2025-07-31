# 🔧 Guía de Solución de Problemas - Analytics Dashboard

## Problemas Identificados

### 1. Error: `ERR_BLOCKED_BY_CLIENT` para `/analytics/events`

**Descripción:** Las solicitudes a los endpoints de analytics están siendo bloqueadas por el cliente.

**Causas comunes:**
- Extensiones del navegador (ad-blockers, bloqueadores de privacidad)
- Firewall corporativo
- Software antivirus
- Configuraciones de seguridad del navegador

**Soluciones:**

#### A. Desactivar Extensiones Temporalmente
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Desactiva temporalmente las extensiones:
   - Click derecho en el icono de extensiones
   - Selecciona "Desactivar" para cada extensión
   - Recarga la página
4. Si el problema se resuelve, identifica qué extensión lo causa

#### B. Modo Incógnito
1. Abre una ventana de incógnito (Ctrl+Shift+N)
2. Navega a la aplicación
3. Si funciona en incógnito, es una extensión

#### C. Configurar Excepciones
Si usas un ad-blocker:
1. Abre la configuración del ad-blocker
2. Agrega `localhost:3001` a las excepciones
3. O agrega `*://localhost:3001/*` como regla de excepción

#### D. Verificar Firewall
1. Verifica la configuración del firewall de Windows
2. Asegúrate de que `localhost:3001` esté permitido
3. Si usas firewall corporativo, contacta a IT

### 2. Error: `500 Internal Server Error` para `/analytics/dashboard`

**Descripción:** El servidor backend está devolviendo errores internos.

**Causas comunes:**
- Endpoints de analytics no implementados en el backend
- Error en la lógica del servidor
- Problema de configuración del backend
- Base de datos no disponible

**Soluciones:**

#### A. Verificar Estado del Backend
1. Asegúrate de que el servidor backend esté ejecutándose en `localhost:3001`
2. Verifica que puedas acceder a `http://localhost:3001/health` (si existe)
3. Revisa los logs del servidor backend

#### B. Verificar Implementación de Endpoints
Los siguientes endpoints deben estar implementados en el backend:
- `GET /analytics/dashboard`
- `GET /analytics/events`
- `GET /analytics/users`
- `GET /analytics/requests`
- `GET /analytics/platform`
- `GET /analytics/trends`

#### C. Verificar Configuración de CORS
El backend debe permitir solicitudes desde `localhost:5173` (frontend):
```javascript
// En el backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
```

### 3. Error: `Unchecked runtime.lastError: Could not establish connection`

**Descripción:** Error común relacionado con extensiones del navegador.

**Solución:**
- Este error no afecta la funcionalidad de la aplicación
- Es causado por extensiones como React DevTools
- Puede ser ignorado de forma segura

## Verificación de Estado

### 1. Verificar Conexión al Backend
```javascript
// En la consola del navegador
fetch('http://localhost:3001/health')
  .then(response => console.log('Backend OK:', response.status))
  .catch(error => console.error('Backend Error:', error));
```

### 2. Verificar Endpoints Específicos
```javascript
// Verificar cada endpoint
const endpoints = [
  '/analytics/dashboard',
  '/analytics/events', 
  '/analytics/users',
  '/analytics/requests',
  '/analytics/platform',
  '/analytics/trends'
];

endpoints.forEach(endpoint => {
  fetch(`http://localhost:3001${endpoint}`)
    .then(response => console.log(`${endpoint}: ${response.status}`))
    .catch(error => console.error(`${endpoint}: ${error.message}`));
});
```

## Datos de Respaldo

La aplicación incluye un sistema de datos de respaldo que se activa automáticamente cuando:
- Los endpoints del backend no están disponibles
- Ocurren errores de red
- Los endpoints devuelven errores 500

Los datos de respaldo son representativos y permiten que la aplicación funcione mientras se resuelven los problemas del backend.

## Contacto de Soporte

Si los problemas persisten:
- Email: soporte@mussikon.com
- Asunto: "Analytics Dashboard Issues"
- Incluir: logs de consola, versión del navegador, extensiones activas

## Prevención

### Para Desarrolladores:
1. Implementar todos los endpoints de analytics en el backend
2. Configurar CORS correctamente
3. Manejar errores apropiadamente en el servidor
4. Probar con diferentes navegadores y configuraciones

### Para Usuarios:
1. Mantener el navegador actualizado
2. Revisar extensiones regularmente
3. Usar configuraciones de red confiables
4. Reportar problemas temprano

---

**Última actualización:** $(date)
**Versión:** 1.0 