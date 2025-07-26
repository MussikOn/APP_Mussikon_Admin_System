// Tipos para las solicitudes de músicos

// Tipo del backend
export interface BackendMusicianRequest {
  id?: string;
  userId: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  instrument: string;
  budget: number;
  comments?: string;
  status: 'pendiente' | 'asignada' | 'no_asignada' | 'cancelada' | 'completada';
  assignedMusicianId?: string;
  createdAt: any; // FirebaseFirestore.Timestamp
  updatedAt: any; // FirebaseFirestore.Timestamp
}

// Tipo para el frontend
export interface MusicianRequest {
  _id?: string;
  userId: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  instrument: string;
  budget: number;
  comments?: string;
  status: 'pending' | 'assigned' | 'unassigned' | 'cancelled' | 'completed';
  assignedMusicianId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para crear solicitudes
export interface CreateRequestData {
  userId: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instrument: string;
  budget: number;
  comments?: string;
}

// Tipo para actualizar solicitudes
export interface UpdateRequestData extends Partial<CreateRequestData> {
  status?: 'pending' | 'assigned' | 'unassigned' | 'cancelled' | 'completed';
  assignedMusicianId?: string;
}

// Tipo para aceptar solicitudes
export interface AcceptRequestData {
  requestId: string;
  musicianId: string;
}

// Tipo para cancelar solicitudes
export interface CancelRequestData {
  requestId: string;
}

// Constantes para tipos de eventos
export const EVENT_TYPES = [
  'concierto',
  'culto',
  'boda',
  'evento corporativo',
  'festival',
  'workshop',
  'sesión de grabación',
  'otro'
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
  'otro'
] as const;

// Constantes para estados
export const REQUEST_STATUSES = [
  { value: 'pending', label: 'PENDIENTE', color: '#ffaa00' },
  { value: 'assigned', label: 'ASIGNADA', color: '#00ff88' },
  { value: 'unassigned', label: 'NO ASIGNADA', color: '#ff4444' },
  { value: 'cancelled', label: 'CANCELADA', color: '#888888' },
  { value: 'completed', label: 'COMPLETADA', color: '#00fff7' }
] as const;

// Tipo para filtros
export interface RequestFilters {
  search?: string;
  status?: MusicianRequest['status'];
  eventType?: string;
  instrument?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Tipo para formulario
export interface RequestFormData {
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instrument: string;
  budget: number;
  comments?: string;
} 