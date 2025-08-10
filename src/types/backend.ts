// Tipos basados en el backend de MussikOn Express
// Este archivo refleja exactamente la estructura de datos del backend

// ===== TIPOS DE AUTENTICACIÓN =====
export interface AuthUserRegister {
  id?: number;
  name: string;
  roll: string;
  lastName: string;
  userEmail: string;
  userPassword: string;
  create_at: string;
  update_at: string;
  delete_at: string;
  status: boolean;
}

export interface User {
  name: string;
  lastName: string;
  userEmail: string;
  userPassword: string;
  roll: string;
  create_at?: string;
  update_at?: string;
  delete_at?: string;
  status?: boolean;
}

export interface UpdateUser {
  name?: string;
  lastName?: string;
  userEmail?: string;
  userPassword?: string;
  phone: string;
  roll?: string;
  create_at?: string;
  update_at?: string;
  delete_at?: string;
  status?: boolean;
}

// ===== TIPOS DE EVENTOS =====
export interface Event {
  id: string;
  user: string; // Email del organizador
  eventName: string;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
  duration: string;
  instrument: Instrument;
  bringInstrument: boolean;
  comment: string;
  budget: string;
  flyerUrl?: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
  status: EventStatus;
  assignedMusicianId?: string;
  interestedMusicians?: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventType = 
  | 'concierto'
  | 'boda'
  | 'culto'
  | 'evento_corporativo'
  | 'festival'
  | 'fiesta_privada'
  | 'graduacion'
  | 'cumpleanos'
  | 'otro';

export type EventStatus = 
  | 'pending_musician'
  | 'musician_assigned'
  | 'completed'
  | 'cancelled'
  | 'musician_cancelled';

export type Instrument = 
  | 'guitarra'
  | 'piano'
  | 'bajo'
  | 'bateria'
  | 'saxofon'
  | 'trompeta'
  | 'violin'
  | 'canto'
  | 'teclado'
  | 'flauta'
  | 'otro';

// ===== TIPOS DE MÚSICOS =====
export interface Musician {
  userEmail: string;
  name: string;
  lastName: string;
  instruments: string[];
  hasOwnInstruments: boolean;
  experience: number;
  bio?: string;
  location: string;
  hourlyRate: number;
  isApproved: boolean;
  isAvailable: boolean;
  phone?: string;
  socialMedia?: Record<string, string>;
  rating: number;
  totalEvents: number;
  completedEvents: number;
}

export interface MusicianProfile {
  userEmail: string;
  name: string;
  lastName: string;
  instruments: string[];
  hasOwnInstruments: boolean;
  experience: number;
  bio?: string;
  location: string;
  hourlyRate: number;
  isApproved: boolean;
  isAvailable: boolean;
  phone?: string;
  socialMedia?: Record<string, string>;
  rating: number;
  totalEvents: number;
  completedEvents: number;
}

// ===== TIPOS DE BÚSQUEDA DE MÚSICOS =====
export interface MusicianSearchCriteria {
  instrument: string;
  location?: string;
  budget?: number;
  date?: string;
  time?: string;
  duration?: string;
  eventType?: string;
  maxDistance?: number; // en kilómetros
}

export interface MusicianSearchResult {
  userEmail: string;
  name: string;
  lastName: string;
  instruments: string[];
  hasOwnInstruments: boolean;
  experience: number;
  hourlyRate: number;
  location: string;
  isAvailable: boolean;
  rating: number;
  distance?: number;
  matchScore: number;
  availability: {
    isAvailable: boolean;
    conflicts: string[];
  };
}

export interface MusicianSearchRequest {
  eventId: string;
  instrument: string;
  location?: string;
  budget?: number;
  date?: string;
  time?: string;
  duration?: string;
  eventType?: string;
  maxDistance?: number;
}

export interface MusicianSearchResponse {
  userEmail: string;
  name: string;
  lastName: string;
  instruments: string[];
  hasOwnInstruments: boolean;
  experience: number;
  hourlyRate: number;
  location: string;
  isAvailable: boolean;
  rating: number;
  distance?: number;
  matchScore: number;
  availability: {
    isAvailable: boolean;
    conflicts: string[];
  };
}

// ===== TIPOS DE CONTRATACIÓN =====
export interface HiringRequest {
  id: string;
  eventId: string;
  eventCreatorId: string;
  musicianId: string;
  status: HiringRequestStatus;
  eventDetails?: string;
  terms?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type HiringRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export interface Message {
  id: string;
  senderId: string;
  senderType: 'musician' | 'eventCreator';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface HiringRequestCreate {
  eventId: string;
  eventCreatorId: string;
  musicianId: string;
  eventDetails?: string;
  terms?: string;
}

export interface HiringRequestUpdate {
  status?: HiringRequestStatus;
  eventDetails?: string;
  terms?: string;
}

export interface HiringStats {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
  completedRequests: number;
  averageResponseTime: number;
}

// ===== TIPOS DE CHAT =====
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'file' | 'location' | 'contact';
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    duration?: number;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
    contact?: {
      name: string;
      phone: string;
      email?: string;
    };
  };
  editedAt?: string;
  isEdited: boolean;
  reactions?: Record<string, string[]>;
  replyTo?: {
    messageId: string;
    senderName: string;
    content: string;
  };
  deletedAt?: string;
  isDeleted: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
  isActive: boolean;
  createdAt: string;
  type: 'direct' | 'group' | 'event';
  name?: string;
  avatar?: string;
  settings?: {
    notifications: boolean;
    muted: boolean;
    pinned: boolean;
  };
  typingUsers?: string[];
  eventId?: string;
}

// ===== TIPOS DE IMÁGENES =====
export interface Image {
  id: string;
  key: string;
  url: string;
  originalName: string;
  fileName: string;
  size: number;
  mimetype: string;
  category: 'profile' | 'post' | 'event' | 'gallery' | 'admin';
  userId: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isPublic: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface ImageUploadRequest {
  category: 'profile' | 'post' | 'event' | 'gallery' | 'admin';
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

// ===== TIPOS DE PAGINACIÓN Y FILTROS =====
export interface PaginationDTO {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface EventFiltersDTO extends PaginationDTO {
  status?: EventStatus;
  eventType?: EventType;
  instrument?: Instrument;
  dateFrom?: string;
  dateTo?: string;
}

// ===== TIPOS DE RESPUESTAS DE API =====
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ===== TIPOS DE NOTIFICACIONES =====
export interface EventAlert {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  organizerId: string;
  musicianId: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
  calendarEventId?: string;
}

// ===== TIPOS DE GEOLOCALIZACIÓN =====
export interface Location {
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ===== TIPOS DE VALIDACIÓN =====
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== TIPOS DE ESTADÍSTICAS =====
export interface DashboardStats {
  totalEvents: number;
  totalMusicians: number;
  totalUsers: number;
  pendingEvents: number;
  completedEvents: number;
  revenue: number;
  topInstruments: Array<{
    instrument: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

// ===== TIPOS DE CONFIGURACIÓN =====
export interface AppConfig {
  apiUrl: string;
  socketUrl: string;
  googleMapsApiKey?: string;
  stripePublicKey?: string;
  environment: 'development' | 'production' | 'staging';
}

// ===== TIPOS DE ESTADO DE LA APLICACIÓN =====
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  notifications: EventAlert[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
}

// ===== TIPOS DE FORMULARIOS =====
export interface LoginForm {
  userEmail: string;
  userPassword: string;
}

export interface RegisterForm {
  name: string;
  lastName: string;
  userEmail: string;
  userPassword: string;
  phone: string;
  roll: 'admin' | 'superadmin' | 'eventCreator' | 'musician';
}

export interface EventForm {
  eventName: string;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
  duration: string;
  instrument: Instrument;
  bringInstrument: boolean;
  comment: string;
  budget: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
}

export interface MusicianProfileForm {
  instruments: string[];
  hasOwnInstruments: boolean;
  experience: number;
  bio: string;
  location: string;
  hourlyRate: number;
  phone: string;
  socialMedia: Record<string, string>;
}

// ===== TIPOS DE ENUMERACIONES =====
export const EVENT_TYPES: Record<EventType, string> = {
  concierto: 'Concierto',
  boda: 'Boda',
  culto: 'Culto',
  evento_corporativo: 'Evento Corporativo',
  festival: 'Festival',
  fiesta_privada: 'Fiesta Privada',
  graduacion: 'Graduación',
  cumpleanos: 'Cumpleaños',
  otro: 'Otro'
};

export const INSTRUMENTS: Record<Instrument, string> = {
  guitarra: 'Guitarra',
  piano: 'Piano',
  bajo: 'Bajo',
  bateria: 'Batería',
  saxofon: 'Saxofón',
  trompeta: 'Trompeta',
  violin: 'Violín',
  canto: 'Canto',
  teclado: 'Teclado',
  flauta: 'Flauta',
  otro: 'Otro'
};

export const EVENT_STATUSES: Record<EventStatus, string> = {
  pending_musician: 'Pendiente de Músico',
  musician_assigned: 'Músico Asignado',
  completed: 'Completado',
  cancelled: 'Cancelado',
  musician_cancelled: 'Cancelado por Músico'
};

export const HIRING_STATUSES: Record<HiringRequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
  completed: 'Completado'
};

// ===== TIPOS DE UTILIDADES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
