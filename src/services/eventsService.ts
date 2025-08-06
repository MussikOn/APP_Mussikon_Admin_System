import { apiService } from './api';


// CORREGIDO: Estructura compatible con el backend (DataTypes.ts)
export interface Event {
  // ✅ Estructura exacta del backend
  id: string; // ID de Firestore
  user: string; // Email del organizador
  eventName: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  instrument: string;
  bringInstrument: boolean;
  comment: string;
  budget: string;
  flyerUrl?: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
  status: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled' | 'musician_cancelled';
  assignedMusicianId?: string;
  interestedMusicians?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  // ✅ Campos requeridos para crear evento
  user: string;
  eventName: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  instrument: string;
  bringInstrument: boolean;
  comment: string;
  budget: string;
  flyerUrl?: string;
  songs?: string[];
  recommendations?: string[];
  mapsLink?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled' | 'musician_cancelled';
  assignedMusicianId?: string;
  interestedMusicians?: string[];
}

export interface EventFilters {
  search?: string;
  status?: string;
  eventType?: string;
  instrument?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  user?: string; // Email del organizador
}

// CORREGIDO: Estructura de respuesta compatible con el backend
// ✅ CORREGIDO: Backend devuelve array simple, no objeto con events
export type EventsResponse = Event[];

export interface EventStats {
  totalEvents: number;
  pendingEvents: number;
  assignedEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalBudget: number;
  averageBudget: number;
  topEventTypes: Array<{ eventType: string; count: number }>;
  topInstruments: Array<{ instrument: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  eventsByMonth: Array<{ month: string; count: number }>;
}

// CORREGIDO: Mapeo directo sin transformaciones
const mapBackendEventToFrontend = (backendEvent: any): Event => {
  return {
    id: backendEvent._id || backendEvent.id, // ✅ Backend usa _id
    user: backendEvent.user,
    eventName: backendEvent.eventName,
    eventType: backendEvent.eventType,
    date: backendEvent.date,
    time: backendEvent.time,
    location: backendEvent.location,
    duration: backendEvent.duration,
    instrument: backendEvent.instrument,
    bringInstrument: backendEvent.bringInstrument,
    comment: backendEvent.comment,
    budget: backendEvent.budget,
    flyerUrl: backendEvent.flyerUrl,
    songs: backendEvent.songs || [],
    recommendations: backendEvent.recommendations || [],
    mapsLink: backendEvent.mapsLink,
    status: backendEvent.status,
    assignedMusicianId: backendEvent.assignedMusicianId,
    interestedMusicians: backendEvent.interestedMusicians || [],
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt
  };
};

// CORREGIDO: Mapeo directo sin transformaciones
const mapFrontendEventToBackend = (frontendEvent: CreateEventData | UpdateEventData): any => {
  return {
    ...frontendEvent,
    // Asegurar que los arrays estén presentes
    songs: frontendEvent.songs || [],
    recommendations: frontendEvent.recommendations || [],

  };
};

// Servicio de eventos
export const eventsService = {
  // Obtener todos los eventos con paginación
  async getAllEvents(filters?: EventFilters, page: number = 1, limit: number = 20): Promise<EventsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.eventType) params.append('eventType', filters.eventType);
        if (filters.instrument) params.append('instrument', filters.instrument);
        if (filters.location) params.append('location', filters.location);
        if (filters.user) params.append('user', filters.user);
        if (filters.dateRange) {
          params.append('dateFrom', filters.dateRange.start);
          params.append('dateTo', filters.dateRange.end);
        }
      }
      
      const response = await apiService.get<Event[]>(`/admin/events?${params.toString()}`);
      console.log('📅 Eventos obtenidos:', response);
      
      // ✅ CORREGIDO: Backend devuelve array simple
      if (response.data) {
        return response.data.map(mapBackendEventToFrontend);
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error al obtener eventos:', error);
      throw error;
    }
  },

  // Obtener evento por ID
  async getEventById(id: string): Promise<Event> {
    try {
      const response = await apiService.get<Event>(`/admin/events/${id}`);
      console.log('📅 Evento obtenido:', response);
      return mapBackendEventToFrontend(response.data || response);
    } catch (error) {
      console.error('❌ Error al obtener evento:', error);
      throw error;
    }
  },

  // Crear evento
  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const backendData = mapFrontendEventToBackend(eventData);
      console.log('📝 Creando evento:', backendData);
      const response = await apiService.post<Event>('/admin/events', backendData);
      console.log('✅ Evento creado:', response);
      return mapBackendEventToFrontend(response.data || response);
    } catch (error) {
      console.error('❌ Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar evento
  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const backendData = mapFrontendEventToBackend(eventData);
      console.log('📝 Actualizando evento:', { id, backendData });
      const response = await apiService.put<Event>(`/admin/events/${id}`, backendData);
      console.log('✅ Evento actualizado:', response);
      return mapBackendEventToFrontend(response.data || response);
    } catch (error) {
      console.error('❌ Error al actualizar evento:', error);
      throw error;
    }
  },

  // Eliminar evento
  async deleteEvent(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando evento:', id);
      await apiService.delete(`/admin/events/${id}`);
      console.log('✅ Evento eliminado');
    } catch (error) {
      console.error('❌ Error al eliminar evento:', error);
      throw error;
    }
  },

  // Obtener estadísticas de eventos
  async getEventStats(): Promise<EventStats> {
    try {
      const response = await apiService.get<EventStats>('/admin/events/stats');
      console.log('📊 Estadísticas de eventos:', response);
      return response.data!;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de eventos:', error);
      throw error;
    }
  },

  // Obtener eventos por estado
  async getEventsByStatus(status: string): Promise<Event[]> {
    try {
      const response = await apiService.get<Event[]>(`/admin/events?status=${status}`);
      console.log(`📅 Eventos con estado ${status}:`, response);
      return (response.data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('❌ Error al obtener eventos por estado:', error);
      throw error;
    }
  },

  // Obtener eventos por tipo
  async getEventsByCategory(eventType: string): Promise<Event[]> {
    try {
      const response = await apiService.get<Event[]>(`/admin/events?eventType=${eventType}`);
      console.log(`📅 Eventos de tipo ${eventType}:`, response);
      return (response.data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('❌ Error al obtener eventos por tipo:', error);
      throw error;
    }
  },

  // Obtener eventos por ubicación
  async getEventsByLocation(location: string): Promise<Event[]> {
    try {
      const response = await apiService.get<Event[]>(`/admin/events?location=${location}`);
      console.log(`📅 Eventos en ${location}:`, response);
      return (response.data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('❌ Error al obtener eventos por ubicación:', error);
      throw error;
    }
  },

  // Obtener eventos por organizador
  async getEventsByOrganizer(userEmail: string): Promise<Event[]> {
    try {
      const response = await apiService.get<Event[]>(`/admin/events?user=${userEmail}`);
      console.log(`📅 Eventos del organizador ${userEmail}:`, response);
      return (response.data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('❌ Error al obtener eventos por organizador:', error);
      throw error;
    }
  },

  // ✅ FUNCIÓN CORREGIDA: Sin dependencia circular
  async getEventsCount(): Promise<number> {
    try {
      const response = await apiService.get<Event[]>('/admin/events');
      console.log('📊 Conteo de eventos obtenido:', response);
      
      if (response.data) {
        return response.data.length;
      }
      return 0;
    } catch (error) {
      console.error('❌ Error al obtener conteo de eventos:', error);
      return 0;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
  getEventsByStatus,
  getEventsByCategory,
  getEventsByLocation,
  getEventsByOrganizer,
  getEventsCount
} = eventsService; 