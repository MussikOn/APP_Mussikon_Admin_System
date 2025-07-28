// Tipos para usuarios móviles de la app MussikOn

// Tipo del backend
export interface BackendMobileUser {
  id?: string;
  _id?: string;
  name: string;
  lastName: string;
  userEmail: string;
  userPassword?: string;
  roll: 'musico' | 'eventCreator' | 'usuario' | 'adminJunior' | 'adminMidLevel' | 'adminSenior' | 'superAdmin';
  status: boolean;
  phone?: string;
  location?: string;
  profileImage?: string;
  bio?: string;
  instruments?: string[];
  experience?: string;
  createdAt: any; // FirebaseFirestore.Timestamp
  updatedAt: any; // FirebaseFirestore.Timestamp
  lastLogin?: any; // FirebaseFirestore.Timestamp
  deviceInfo?: {
    platform: string;
    version: string;
    deviceId: string;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  stats?: {
    totalRequests: number;
    completedRequests: number;
    cancelledRequests: number;
    rating: number;
    reviews: number;
  };
}

// Tipo para el frontend
export interface MobileUser {
  _id?: string;
  name: string;
  lastName: string;
  userEmail: string;
  roll: 'musico' | 'eventCreator' | 'usuario' | 'adminJunior' | 'adminMidLevel' | 'adminSenior' | 'superAdmin';
  status: 'active' | 'blocked' | 'pending' | 'inactive';
  phone?: string;
  location?: string;
  profileImage?: string;
  bio?: string;
  instruments?: string[];
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    deviceId: string;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  stats?: {
    totalRequests: number;
    completedRequests: number;
    cancelledRequests: number;
    rating: number;
    reviews: number;
  };
}

// Tipo para crear usuarios
export interface CreateUserData {
  name: string;
  lastName: string;
  userEmail: string;
  userPassword?: string;
  roll: 'musico' | 'eventCreator' | 'usuario' | 'adminJunior' | 'adminMidLevel' | 'adminSenior' | 'superAdmin';
  status?: boolean;
  phone?: string;
  location?: string;
  profileImage?: string;
  bio?: string;
  instruments?: string[];
  experience?: string;
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}

// Tipo para actualizar usuarios
export interface UpdateUserData extends Partial<Omit<CreateUserData, 'status'>> {
  status?: 'active' | 'blocked' | 'pending' | 'inactive';
}

// Tipo para bloquear/desbloquear usuarios
export interface BlockUserData {
  userId: string;
  reason?: string;
}

// Tipo para filtros
export interface UserFilters {
  search?: string;
  status?: MobileUser['status'];
  roll?: MobileUser['roll'];
  location?: string;
  instrument?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Constantes para roles
export const USER_ROLES = [
  { value: 'musico', label: 'MÚSICO', color: '#ffd700' },
  { value: 'eventCreator', label: 'ORGANIZADOR', color: '#8a2be2' },
  { value: 'usuario', label: 'USUARIO', color: '#00fff7' },
  { value: 'adminJunior', label: 'ADMIN JUNIOR', color: '#ffaa00' },
  { value: 'adminMidLevel', label: 'ADMIN MID', color: '#00ff88' },
  { value: 'adminSenior', label: 'ADMIN SENIOR', color: '#ff4444' },
  { value: 'superAdmin', label: 'SUPER ADMIN', color: '#ff0066' }
] as const;

// Constantes para estados
export const USER_STATUSES = [
  { value: 'active', label: 'ACTIVO', color: '#00ff88' },
  { value: 'blocked', label: 'BLOQUEADO', color: '#ff4444' },
  { value: 'pending', label: 'PENDIENTE', color: '#ffaa00' },
  { value: 'inactive', label: 'INACTIVO', color: '#888888' }
] as const;

// Constantes para instrumentos
export const INSTRUMENTS = [
  'guitarra',
  'piano',
  'bajo',
  'batería',
  'voz',
  'violín',
  'saxofón',
  'trompeta',
  'flauta',
  'acordeón',
  'teclado',
  'otro'
] as const;

// Constantes para idiomas
export const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' }
] as const;

// Constantes para temas
export const THEMES = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' }
] as const;

// Constantes para plataformas
export const PLATFORMS = [
  'ios',
  'android',
  'web'
] as const;

// Tipo para estadísticas de usuario
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  pendingUsers: number;
  organizers: number;
  musicians: number;
  newUsersThisMonth: number;
  activeUsersThisWeek: number;
  topLocations: Array<{ location: string; count: number }>;
  topInstruments: Array<{ instrument: string; count: number }>;
  userActivity: Array<{ date: string; count: number }>;
}

// Tipo para reportes de usuario
export interface UserReport {
  userId: string;
  reason: string;
  description: string;
  reporterId: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

// Tipo para acciones administrativas
export interface AdminAction {
  action: 'block' | 'unblock' | 'delete' | 'update' | 'create';
  userId: string;
  adminId: string;
  reason?: string;
  details?: string;
  timestamp: string;
}

// Tipo para notificaciones administrativas
export interface AdminNotification {
  id: string;
  type: 'user_blocked' | 'user_reported' | 'system_alert' | 'user_activity';
  title: string;
  message: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
} 