// Configuración centralizada para API y sockets
// Solo editar aquí para cambiar la URL base

export const API_CONFIG = {
  // URL base para todas las APIs
  BASE_URL: 'http://172.20.10.2:3001',
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    
    // Usuarios Móviles (Admin)
    MOBILE_USERS: '/admin/users',
    MOBILE_USER_BY_ID: '/admin/users/:id',
    CREATE_MOBILE_USER: '/admin/users',
    UPDATE_MOBILE_USER: '/admin/users/:id',
    DELETE_MOBILE_USER: '/admin/users/:id',
    BLOCK_MOBILE_USER: '/admin/users/:id/block',
    UNBLOCK_MOBILE_USER: '/admin/users/:id/unblock',
    
    // Eventos (Admin)
    ADMIN_EVENTS: '/admin/events',
    ADMIN_EVENT_BY_ID: '/admin/events/:id',
    CREATE_ADMIN_EVENT: '/admin/events',
    UPDATE_ADMIN_EVENT: '/admin/events/:id',
    DELETE_ADMIN_EVENT: '/admin/events/:id',
    
    // Músicos (Admin)
    ADMIN_MUSICIANS: '/admin/musicians',
    ADMIN_MUSICIAN_BY_ID: '/admin/musicians/:id',
    UPDATE_ADMIN_MUSICIAN: '/admin/musicians/:id',
    DELETE_ADMIN_MUSICIAN: '/admin/musicians/:id',
    
    // Solicitudes de Músicos (Admin)
    ADMIN_MUSICIAN_REQUESTS: '/admin/musician-requests',
    ADMIN_MUSICIAN_REQUEST_BY_ID: '/admin/musician-requests/:id',
    DELETE_ADMIN_MUSICIAN_REQUEST: '/admin/musician-requests/:id',
    
    // Imágenes (Admin)
    ADMIN_IMAGES: '/admin/images',
    ADMIN_IMAGE_BY_ID: '/admin/images/:id',
    DELETE_ADMIN_IMAGE: '/admin/images/:id',
    
    // Estadísticas y Analytics
    ADMIN_STATS: '/admin/stats',
    USER_STATS: '/admin/users/stats',
    EVENT_STATS: '/admin/events/stats',
    
    // Notificaciones
    NOTIFICATIONS: '/notifications',
  },
  
  // Configuración de timeout
  TIMEOUT: 15000, // 15 segundos para admin
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de reintentos
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 segundo
  },
  
  // Configuración de paginación
  PAGINATION: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
};

// Configuración de Socket.IO
export const SOCKET_CONFIG = {
  // URL del servidor Socket.IO (misma que la API)
  SOCKET_URL: 'http://172.20.10.2:3001',
  
  // Configuración de conexión
  CONNECTION_OPTIONS: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    timeout: 10000,
    forceNew: true,
  },
  
  // Eventos de Socket.IO
  EVENTS: {
    // Autenticación
    AUTHENTICATE: 'authenticate',
    REGISTER: 'register',
    
    // Notificaciones Admin
    USER_CREATED: 'user_created',
    USER_UPDATED: 'user_updated',
    USER_DELETED: 'user_deleted',
    USER_BLOCKED: 'user_blocked',
    USER_UNBLOCKED: 'user_unblocked',
    
    // Eventos Admin
    EVENT_CREATED: 'event_created',
    EVENT_UPDATED: 'event_updated',
    EVENT_DELETED: 'event_deleted',
    
    // Solicitudes Admin
    REQUEST_CREATED: 'request_created',
    REQUEST_UPDATED: 'request_updated',
    REQUEST_DELETED: 'request_deleted',
    
    // Chat
    MESSAGE_SENT: 'message_sent',
    MESSAGE_RECEIVED: 'message_received',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    
    // Conexión
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
  },
};

// Función para obtener URL completa de un endpoint
export const getApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Reemplazar parámetros en la URL
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};

// Función para obtener URL de Socket.IO
export const getSocketUrl = (): string => {
  return SOCKET_CONFIG.SOCKET_URL;
};

// Función para obtener configuración de conexión de Socket.IO
export const getSocketConnectionOptions = () => {
  return SOCKET_CONFIG.CONNECTION_OPTIONS;
};

// Función para obtener eventos de Socket.IO
export const getSocketEvents = () => {
  return SOCKET_CONFIG.EVENTS;
};

// Función para obtener configuración de API
export const getApiConfig = () => {
  return API_CONFIG;
};

// Función para obtener configuración de timeout
export const getApiTimeout = (): number => {
  return API_CONFIG.TIMEOUT;
};

// Función para obtener headers por defecto
export const getDefaultHeaders = () => {
  return API_CONFIG.DEFAULT_HEADERS;
};

// Función para obtener configuración de reintentos
export const getRetryConfig = () => {
  return API_CONFIG.RETRY_CONFIG;
};

// Función para obtener configuración de paginación
export const getPaginationConfig = () => {
  return API_CONFIG.PAGINATION;
}; 