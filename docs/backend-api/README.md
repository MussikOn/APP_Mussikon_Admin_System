# 🚀 Guía Completa de Consumo de API Backend - APP_Mussikon_Express

## 📋 Índice

### 🔐 [Autenticación y Usuarios](./endpoints/AUTHENTICATION.md)
- Registro de usuarios
- Login y gestión de sesiones
- Recuperación de contraseñas
- Gestión de perfiles de usuario
- Validación de códigos de verificación

### 🎵 [Músicos y Perfiles](./endpoints/MUSICIANS.md)
- Gestión de perfiles de músicos
- Solicitudes de músicos
- Búsqueda y filtrado de músicos
- Calificaciones y reseñas

### 🎪 [Eventos](./endpoints/EVENTS.md)
- Creación y gestión de eventos
- Asignación de músicos a eventos
- Estados y flujo de eventos
- Búsqueda y filtrado de eventos

### 🖼️ [Sistema de Imágenes](./endpoints/IMAGES.md)
- Subida y gestión de imágenes
- Categorización de imágenes
- URLs firmadas y seguridad
- Metadatos y etiquetas

### 💬 [Chat y Mensajería](./endpoints/CHAT.md)
- Conversaciones entre usuarios
- Mensajes en tiempo real
- Notificaciones push
- Gestión de conversaciones

### 🔍 [Búsqueda Avanzada](./endpoints/SEARCH.md)
- Búsqueda global en la plataforma
- Filtros avanzados
- Búsqueda por ubicación
- Resultados paginados

### 📊 [Analytics y Métricas](./endpoints/ANALYTICS.md)
- Métricas de uso de la plataforma
- Estadísticas de eventos
- Reportes de usuarios
- Dashboard de administración

### 💳 [Sistema de Pagos](./endpoints/PAYMENTS.md)
- Procesamiento de pagos
- Gestión de transacciones
- Integración con pasarelas de pago
- Historial de pagos

### 📱 [Notificaciones Push](./endpoints/NOTIFICATIONS.md)
- Envío de notificaciones push
- Configuración de dispositivos
- Plantillas de notificaciones
- Gestión de suscripciones

### 📍 [Geolocalización](./endpoints/GEOLOCATION.md)
- Servicios de ubicación
- Búsqueda por proximidad
- Cálculo de distancias
- Integración con mapas

### 👑 [Administración](./endpoints/ADMIN.md)
- Panel de administración
- Gestión de usuarios
- Moderación de contenido
- Configuraciones del sistema

### 🔧 [Super Admin](./endpoints/SUPER_ADMIN.md)
- Funciones de super administrador
- Gestión de administradores
- Configuraciones globales
- Logs del sistema

## 📚 [Modelos de Datos](./models/DATA_MODELS.md)
- Estructuras de datos completas
- Tipos TypeScript
- Validaciones y esquemas
- Relaciones entre entidades

## 💡 [Ejemplos de Uso](./examples/)
- [Ejemplos de Autenticación](./examples/AUTH_EXAMPLES.md)
- [Ejemplos de Eventos](./examples/EVENTS_EXAMPLES.md)
- [Ejemplos de Chat](./examples/CHAT_EXAMPLES.md)
- [Ejemplos de Pagos](./examples/PAYMENTS_EXAMPLES.md)

## 🛠️ [Configuración y Setup](./SETUP.md)
- Configuración del entorno
- Variables de entorno
- Autenticación y tokens
- Manejo de errores

## 🔒 [Seguridad](./SECURITY.md)
- Autenticación JWT
- Middleware de seguridad
- Validación de datos
- Rate limiting

## 📖 [Guía de Integración](./INTEGRATION_GUIDE.md)
- Pasos para integrar la API
- Mejores prácticas
- Manejo de errores comunes
- Optimización de requests

---

## 🎯 Información General

### Base URL
```
https://tu-dominio-backend.com/api/v1
```

### Autenticación
La API utiliza **JWT (JSON Web Tokens)** para la autenticación. Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <tu-token-jwt>
```

### Formato de Respuesta
Todas las respuestas siguen este formato estándar:

```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "message": "Mensaje descriptivo",
  "timestamp": "2024-01-08T12:00:00.000Z"
}
```

### Códigos de Estado HTTP
- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en los datos de entrada
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `409` - Conflicto (ej: usuario ya existe)
- `500` - Error interno del servidor

### Rate Limiting
- **Límite general**: 100 requests por minuto por IP
- **Endpoints de autenticación**: 10 requests por minuto por IP
- **Endpoints de búsqueda**: 50 requests por minuto por usuario

### Paginación
Los endpoints que devuelven listas utilizan paginación:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🚀 Comenzando

1. **Configura tu entorno**: Revisa [SETUP.md](./SETUP.md)
2. **Autenticación**: Comienza con [AUTHENTICATION.md](./endpoints/AUTHENTICATION.md)
3. **Ejemplos**: Consulta la carpeta [examples](./examples/) para casos de uso prácticos
4. **Modelos**: Entiende las estructuras de datos en [DATA_MODELS.md](./models/DATA_MODELS.md)

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Revisa la documentación específica de cada endpoint
- Consulta los ejemplos de uso
- Verifica la sección de troubleshooting en cada guía

---

*Última actualización: Enero 2025* 