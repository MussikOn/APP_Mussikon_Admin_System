// Exportar todos los servicios del admin system
export { apiService } from './api';
export { mobileUsersService } from './mobileUsersService';
export { eventsService } from './eventsService';
export { musicianRequestsService } from './musicianRequestsService';
export { imagesService } from './imagesService';
export { musiciansService } from './musiciansService';

// Nuevos servicios implementados
export { searchService } from './searchService';
export { notificationService } from './notificationService';
export { paymentService } from './paymentService';
export { geolocationService } from './geolocationService';
export { superadminService } from './superadminService';
export { deviceService } from './deviceService';
export { contentService } from './contentService';
export { chatService } from './chatService';

// Exportar tipos de los servicios
export type {
  SearchFilters,
  SearchResult,
  SearchResponse,
  AnalyticsFilters,
  AnalyticsData,
  AnalyticsResponse
} from './searchService';

export type {
  Notification,
  CreateNotificationData,
  BulkNotificationData,
  NotificationFilters,
  NotificationStats
} from './notificationService';

export type {
  PaymentMethod,
  CreatePaymentMethodData,
  PaymentIntent,
  CreatePaymentIntentData,
  Invoice,
  InvoiceItem,
  CreateInvoiceData,
  Refund,
  ProcessRefundData,
  PaymentStats,
  PaymentGateway
} from './paymentService';

export type {
  Location,
  SearchByProximityFilters,
  NearbyEvent,
  NearbyMusician,
  RouteOptimizationRequest,
  OptimizedRoute,
  GeocodingResult,
  DistanceCalculationRequest,
  DistanceResult,
  LocationStats
} from './geolocationService';

export type {
  SystemBackup,
  CreateBackupRequest,
  SystemLog,
  SystemHealth,
  SystemConfig,
  MaintenanceMode,
  AuditLog
} from './superadminService';

export type {
  Device,
  DeviceActivity,
  DeviceStats
} from './deviceService';

export type {
  Post,
  CreatePostData,
  Announcement,
  CreateAnnouncementData,
  Broadcast,
  CreateBroadcastData,
  ContentTemplate,
  CreateTemplateData,
  ContentStats
} from './contentService';

export type {
  Message,
  Conversation,
  CreateConversationData,
  SendMessageData,
  ChatFilters,
  ChatResponse,
  ConversationListResponse,
  MessageListResponse
} from './chatService'; 