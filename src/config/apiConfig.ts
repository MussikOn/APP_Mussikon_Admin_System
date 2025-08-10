// Configuración centralizada para API y sockets
// Solo editar aquí para cambiar la URL base

// Función para obtener la URL base del backend
const getBaseUrl = (): string => {
  // Prioridad: 1. Variable de entorno, 2. URL hardcodeada
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    console.log('🌐 Usando URL del backend desde variable de entorno:', envUrl);
    return envUrl;
  }
  
  // URL por defecto (puede ser cambiada aquí)
  // const defaultUrl = 'http://192.168.54.17:3001';
  const defaultUrl = 'http://192.168.54.29:3001';
  // const defaultUrl = 'http://192.168.100.101:3001';
  // const defaultUrl = 'http://localhost:3001';
  console.log('🌐 Usando URL del backend por defecto:', defaultUrl);
  return defaultUrl;
};

export const API_CONFIG = {
  // URL base para todas las APIs
  BASE_URL: getBaseUrl(),
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación - ACTUALIZADO para coincidir con el backend
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/admin-auth/login',
    REGISTER: '/auth/Register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_CODE: '/auth/verify-code',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Usuarios Móviles (Admin) - ACTUALIZADO para coincidir con el backend
    MOBILE_USERS: '/admin/users',
    MOBILE_USER_BY_ID: '/admin/users/:id',
    CREATE_MOBILE_USER: '/admin/users',
    UPDATE_MOBILE_USER: '/admin/users/:id',
    DELETE_MOBILE_USER: '/admin/users/:id',
    BLOCK_MOBILE_USER: '/admin/users/:id/block',
    UNBLOCK_MOBILE_USER: '/admin/users/:id/unblock',
    MOBILE_USERS_STATS: '/admin/users/stats',
    
    // Eventos (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_EVENTS: '/admin/events',
    ADMIN_EVENT_BY_ID: '/admin/events/:id',
    CREATE_ADMIN_EVENT: '/admin/events',
    UPDATE_ADMIN_EVENT: '/admin/events/:id',
    DELETE_ADMIN_EVENT: '/admin/events/:id',
    
    // Músicos (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_MUSICIANS: '/admin/musicians',
    ADMIN_MUSICIAN_BY_ID: '/admin/musicians/:id',
    UPDATE_ADMIN_MUSICIAN: '/admin/musicians/:id',
    DELETE_ADMIN_MUSICIAN: '/admin/musicians/:id',
    
    // Solicitudes de Músicos (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_MUSICIAN_REQUESTS: '/admin/musician-requests',
    ADMIN_MUSICIAN_REQUEST_BY_ID: '/admin/musician-requests/:id',
    CREATE_ADMIN_MUSICIAN_REQUEST: '/admin/musician-requests',
    UPDATE_ADMIN_MUSICIAN_REQUEST: '/admin/musician-requests/:id',
    DELETE_ADMIN_MUSICIAN_REQUEST: '/admin/musician-requests/:id',
    ADMIN_MUSICIAN_REQUESTS_STATS: '/admin/musician-requests/stats',
    
    // Búsqueda Avanzada (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_SEARCH_GLOBAL: '/search/global',
    SEARCH_EVENTS: '/search/events',
    SEARCH_USERS: '/search/users',
    SEARCH_MUSICIAN_REQUESTS: '/search/musician-requests',
    SEARCH_LOCATION: '/search/location',
    
    // Analytics (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_ANALYTICS_DASHBOARD: '/analytics/dashboard',
    ADMIN_ANALYTICS_USERS: '/analytics/users',
    ADMIN_ANALYTICS_EVENTS: '/analytics/events',
    ADMIN_ANALYTICS_REQUESTS: '/analytics/requests',
    ADMIN_ANALYTICS_PLATFORM: '/analytics/platform',
    ADMIN_ANALYTICS_TRENDS: '/analytics/trends',
    ADMIN_ANALYTICS_LOCATION_PERFORMANCE: '/analytics/location-performance',
    ADMIN_ANALYTICS_TOP_USERS: '/analytics/top-users',
    ADMIN_ANALYTICS_EXPORT: '/analytics/export',
    
    // Sistema de Pagos - ACTUALIZADO para coincidir con el backend
    PAYMENT_SYSTEM_STATS: '/payment-system/statistics',
    PAYMENT_SYSTEM_DEPOSIT_STATS: '/payment-system/deposit-stats',
    PAYMENT_SYSTEM_PENDING_DEPOSITS: '/payment-system/pending-deposits',
    PAYMENT_SYSTEM_PENDING_WITHDRAWALS: '/payment-system/pending-withdrawals',
    PAYMENT_SYSTEM_VERIFY_DEPOSIT: '/payment-system/verify-deposit/:id',
    PAYMENT_SYSTEM_PROCESS_WITHDRAWAL: '/payment-system/process-withdrawal/:id',
    PAYMENT_SYSTEM_DEPOSIT_INFO: '/payment-system/deposit-info/:id',
    PAYMENT_SYSTEM_CHECK_DUPLICATE: '/payment-system/check-duplicate/:id',
    PAYMENT_SYSTEM_VOUCHER_IMAGE: '/payment-system/voucher-image/:id',
    PAYMENT_SYSTEM_VOUCHER_IMAGE_DIRECT: '/payment-system/voucher-image-direct/:id',
    PAYMENT_SYSTEM_DOWNLOAD_VOUCHER: '/payment-system/download-voucher/:id',
    PAYMENT_SYSTEM_FLAG_SUSPICIOUS: '/payment-system/flag-suspicious/:id',
    
    // Sistema de Pagos Móviles - NUEVOS ENDPOINTS
    PAYMENT_SYSTEM: '/payment-system',
    PAYMENT_SYSTEM_MY_BALANCE: '/payment-system/my-balance',
    PAYMENT_SYSTEM_DEPOSIT: '/payment-system/deposit',
    PAYMENT_SYSTEM_MY_DEPOSITS: '/payment-system/my-deposits',
    PAYMENT_SYSTEM_BANK_ACCOUNTS_REGISTER: '/payment-system/bank-accounts/register',
    PAYMENT_SYSTEM_BANK_ACCOUNTS_MY_ACCOUNTS: '/payment-system/bank-accounts/my-accounts',
    PAYMENT_SYSTEM_PAY_MUSICIAN: '/payment-system/events/:eventId/pay-musician',
    PAYMENT_SYSTEM_MUSICIAN_EARNINGS: '/payment-system/musicians/earnings',
    PAYMENT_SYSTEM_WITHDRAW_EARNINGS: '/payment-system/musicians/withdraw-earnings',
    MOBILE_DEPOSITS_MY_DEPOSITS: '/deposits/my-deposits',
    MOBILE_DEPOSITS_CREATE: '/payment-system/deposit',
    MOBILE_DEPOSITS_APPROVE: '/deposits/:id/approve',
    MOBILE_DEPOSITS_REJECT: '/deposits/:id/reject',
    MOBILE_DEPOSITS_REPORT: '/deposits/report',
    MOBILE_DEPOSITS_PENDING: '/deposits/pending',
    MOBILE_DEPOSITS_BY_ID: '/deposits/:id',
    
    MOBILE_WITHDRAWALS_MY_WITHDRAWALS: '/payment-system/my-withdrawals',
    MOBILE_WITHDRAWALS_CREATE: '/payment-system/withdraw',
    MOBILE_WITHDRAWALS_PROCESS: '/payment-system/process-withdrawal/:id',
    
    MOBILE_BANK_ACCOUNTS_MY_ACCOUNTS: '/payment-system/bank-accounts/my-accounts',
    MOBILE_BANK_ACCOUNTS_REGISTER: '/bank-accounts/register',
    MOBILE_BANK_ACCOUNTS_PENDING: '/deposits/bank-accounts',
    
    MOBILE_BALANCE_MY_BALANCE: '/payment-system/my-balance',
    
    MOBILE_VOUCHERS_IMAGE: '/images/voucher/:id',
    MOBILE_VOUCHERS_PRESIGNED: '/payment-system/voucher/:id/presigned-url',
    MOBILE_VOUCHERS_INTEGRITY: '/vouchers/:id/integrity',
    MOBILE_VOUCHERS_DELETE: '/vouchers/:id',
    
    MOBILE_PAYMENT_METHODS: '/payments/methods',
    MOBILE_PAYMENT_METHOD_BY_ID: '/payments/methods/:id',
    MOBILE_PAYMENT_METHOD_CREATE: '/payments/methods',
    MOBILE_PAYMENT_METHOD_UPDATE: '/payments/methods/:id',
    MOBILE_PAYMENT_METHOD_SET_DEFAULT: '/payments/methods/:id/default',
    MOBILE_PAYMENT_METHOD_DELETE: '/payments/methods/:id',
    
    MOBILE_PAYMENT_INTENTS: '/payments/intents',
    MOBILE_PAYMENT_INTENT_CREATE: '/payments/intents',
    MOBILE_PAYMENT_PROCESS: '/payments/process',
    
    MOBILE_PAYMENT_INVOICES: '/payments/invoices',
    MOBILE_PAYMENT_INVOICE_CREATE: '/payments/invoices',
    MOBILE_PAYMENT_INVOICE_BY_ID: '/payments/invoices/:id',
    MOBILE_PAYMENT_INVOICE_MARK_PAID: '/payments/invoices/:id/pay',
    
    MOBILE_PAYMENT_REFUNDS: '/payments/refunds',
    MOBILE_PAYMENT_REFUND_PROCESS: '/payments/refunds',
    
    MOBILE_PAYMENT_VALIDATE: '/payments/validate',
    MOBILE_PAYMENT_GATEWAYS: '/payments/gateways',
    
    // Rutas de compatibilidad para /admin/payments/* (redirigen a payment-system)
    PENDING_DEPOSITS: '/admin/payments/pending-deposits',
    VERIFY_DEPOSIT: '/admin/payments/verify-deposit/:id',
    PENDING_WITHDRAWALS: '/admin/payments/pending-withdrawals',
    PROCESS_WITHDRAWAL: '/admin/payments/process-withdrawal/:id',
    PAYMENT_SYSTEM_STATS_COMPAT: '/admin/payments/statistics',
    DEPOSIT_INFO: '/admin/payments/deposit-info/:id',
    CHECK_DUPLICATE: '/admin/payments/check-duplicate/:id',
    VOUCHER_IMAGE: '/admin/payments/voucher-image/:id',
    VOUCHER_IMAGE_DIRECT: '/admin/payments/voucher-image-direct/:id',
    DOWNLOAD_VOUCHER: '/admin/payments/download-voucher/:id',
    DEPOSIT_STATS: '/admin/payments/deposit-stats',
    FLAG_SUSPICIOUS: '/admin/payments/flag-suspicious/:id',
    
    // Rutas legacy de pagos (para compatibilidad)
    PAYMENT_METHODS: '/payments/methods',
    PAYMENT_METHOD_BY_ID: '/payments/methods/:id',
    CREATE_PAYMENT_METHOD: '/payments/methods',
    UPDATE_PAYMENT_METHOD: '/payments/methods/:id',
    SET_DEFAULT_PAYMENT_METHOD: '/payments/methods/:id/default',
    DELETE_PAYMENT_METHOD: '/payments/methods/:id',
    PAYMENT_INTENTS: '/payments/intents',
    CREATE_PAYMENT_INTENT: '/payments/intents',
    PROCESS_PAYMENT: '/payments/process',
    PAYMENT_INVOICES: '/payments/invoices',
    CREATE_PAYMENT_INVOICE: '/payments/invoices',
    PAYMENT_INVOICE_BY_ID: '/payments/invoices/:id',
    MARK_INVOICE_PAID: '/payments/invoices/:id/pay',
    PAYMENT_REFUNDS: '/payments/refunds',
    PROCESS_REFUND: '/payments/refunds',
    PAYMENT_STATS: '/payments/stats',
    VALIDATE_PAYMENT_METHOD: '/payments/validate',
    PAYMENT_GATEWAYS: '/payments/gateways',
    VOUCHER_PRESIGNED_URL: '/payments/voucher/:id/presigned-url',
    
    // Imágenes (Admin) - ACTUALIZADO para coincidir con el backend
    ADMIN_IMAGES: '/imgs/getAllImg',
    ADMIN_IMAGE_BY_ID: '/imgs/getUrl/:key',
    DELETE_ADMIN_IMAGE: '/imgs/delete/:key',
    UPLOAD_IMAGE: '/imgs/upload',
    UPDATE_IMAGE: '/imgs/update-metadata/:key',
    IMAGE_STATS: '/imgs/stats',
    IMAGE_CLEANUP: '/imgs/cleanup',
    IMAGE_VALIDATE: '/imgs/validate',
    IMAGE_PRESIGNED_URL: '/imgs/presigned/:key',
    
    // Imágenes específicas
    PROFILE_IMAGES: '/imgs/profile/:userId',
    POST_IMAGES: '/imgs/posts',
    EVENT_IMAGES: '/imgs/events',
    
    // Endpoint de fallback para vouchers (NUEVO)
    VOUCHER_FALLBACK: '/imgs/voucher/:id',
    
    // Imágenes (Legacy) - Para compatibilidad
    LEGACY_ADMIN_IMAGES: '/imgs/getAllImg',
    LEGACY_ADMIN_IMAGE_BY_ID: '/imgs/getUrl/:key',
    LEGACY_DELETE_ADMIN_IMAGE: '/imgs/delete/:key',
    LEGACY_UPLOAD_IMAGE: '/imgs/upload',
    LEGACY_UPDATE_IMAGE_METADATA: '/imgs/update-metadata/:key',
    
    // Notificaciones
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_BY_ID: '/notifications/:id',
    MARK_NOTIFICATION_READ: '/notifications/:id/read',
    MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',
    DELETE_NOTIFICATION: '/notifications/:id',
    UNREAD_COUNT: '/notifications/unread-count',
    CREATE_NOTIFICATION: '/notifications',
    BULK_NOTIFICATION: '/notifications/bulk',
    NOTIFICATION_STATS: '/notifications/stats',
    
    // Geolocalización
    GEOLOCATION_SEARCH: '/geolocation/search',
    NEARBY_EVENTS: '/geolocation/nearby-events',
    NEARBY_MUSICIANS: '/geolocation/nearby-musicians',
    OPTIMIZE_ROUTE: '/geolocation/optimize-route',
    GEOCODE_ADDRESS: '/geolocation/geocode',
    REVERSE_GEOCODE: '/geolocation/reverse-geocode',
    CALCULATE_DISTANCE: '/geolocation/distance',
    IS_WITHIN_RADIUS: '/geolocation/is-within-radius',
    GEOLOCATION_STATS: '/geolocation/stats',
    
    // Estadísticas y Analytics
    ADMIN_STATS: '/admin/stats',
    USER_STATS: '/admin/users/stats',
    EVENT_STATS: '/admin/events/stats',
  },
  
  // Configuración de timeout
  TIMEOUT: 30000, // 30 segundos para admin
  
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
  // URL del servidor Socket.IO (actualizada para el backend en puerto 10000)
  SOCKET_URL: 'http://localhost:10000',
  
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
    
    // Notificaciones
    NOTIFICATION_CREATED: 'notification_created',
    NOTIFICATION_READ: 'notification_read',
    NOTIFICATION_DELETED: 'notification_deleted',
    
    // Pagos
    PAYMENT_PROCESSED: 'payment_processed',
    PAYMENT_FAILED: 'payment_failed',
    INVOICE_CREATED: 'invoice_created',
    REFUND_PROCESSED: 'refund_processed',
    
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
