// Exportación centralizada de servicios - MussikOn Admin System

// Servicios principales
export { default as apiService } from './api';
export { default as authService } from './authService';
export { default as centralizedApiService } from './centralizedApiService';
export { default as contentService } from './contentService';
export { default as deviceService } from './deviceService';
export { default as eventsService } from './eventsService';
export { default as geolocationService } from './geolocationService';
export { default as httpClient } from './httpClient';
export { default as imagesService } from './imagesService';
export { default as mobileUsersService } from './mobileUsersService';
export { default as musicianRequestsService } from './musicianRequestsService';
export { default as musiciansService } from './musiciansService';
export { default as notificationService } from './notificationService';
export { default as paymentService } from './paymentService';
export { default as searchService } from './searchService';
export { default as superadminService } from './superadminService';
export { default as usersService } from './usersService';
export { default as chatService } from './chatService';
export { default as analyticsService } from './analyticsService';

// Tipos de servicios
export type {
  // Auth types
  LoginCredentials,
  AuthResponse,
  User,
  UserRole,
  
  // Event types
  Event,
  EventFormData,
  EventFilters,
  
  // Musician types
  Musician,
  MusicianFormData,
  MusicianFilters,
  
  // Request types
  MusicianRequest,
  RequestFormData,
  RequestFilters,
  
  // Image types
  Image,
  ImageFormData,
  ImageFilters,
  
  // Mobile user types
  MobileUser,
  MobileUserFormData,
  MobileUserFilters,
  
  // Chat types
  Conversation,
  Message,
  ChatFilters,
  
  // Analytics types
  AnalyticsFilters,
  DashboardAnalytics,
  EventAnalytics,
  RequestAnalytics,
  UserAnalytics,
  PlatformAnalytics,
  TrendsData,
  LocationPerformance,
  TopUser
} from './analyticsService';

// Re-export chat types
export type {
  Conversation as ChatConversation,
  Message as ChatMessage,
  ChatFilters as ChatFiltersType
} from './chatService'; 