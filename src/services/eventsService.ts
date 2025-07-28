import { apiService } from './api';
import { getApiUrl } from '../config/apiConfig';
import { API_CONFIG } from '../config/apiConfig';

// Tipos para eventos
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'borrador' | 'publicado' | 'cancelado' | 'completado';
  organizerId: string;
  organizerName: string;
  budget?: number;
  attendees?: number;
  maxAttendees?: number;
  images?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  budget?: number;
  maxAttendees?: number;
  tags?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'borrador' | 'publicado' | 'cancelado' | 'completado';
}

export interface EventFilters {
  search?: string;
  status?: string;
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  organizerId?: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStats {
  totalEvents: number;
  publishedEvents: number;
  cancelledEvents: number;
  completedEvents: number;
  draftEvents: number;
  totalAttendees: number;
  averageBudget: number;
  topCategories: Array<{ category: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  eventsByMonth: Array<{ month: string; count: number }>;
}

// Función para mapear datos del backend al frontend
const mapBackendEventToFrontend = (backendEvent: any): Event => {
  return {
    _id: backendEvent._id || backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    date: backendEvent.date,
    time: backendEvent.time,
    location: backendEvent.location,
    category: backendEvent.category,
    status: backendEvent.status,
    organizerId: backendEvent.organizerId,
    organizerName: backendEvent.organizerName,
    budget: backendEvent.budget,
    attendees: backendEvent.attendees,
    maxAttendees: backendEvent.maxAttendees,
    images: backendEvent.images || [],
    tags: backendEvent.tags || [],
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt
  };
};

// Función para mapear datos del frontend al backend
const mapFrontendEventToBackend = (frontendEvent: CreateEventData | UpdateEventData): any => {
  const backendEvent: any = {
    title: frontendEvent.title,
    description: frontendEvent.description,
    date: frontendEvent.date,
    time: frontendEvent.time,
    location: frontendEvent.location,
    category: frontendEvent.category,
    budget: frontendEvent.budget,
    maxAttendees: frontendEvent.maxAttendees,
    tags: frontendEvent.tags
  };

  // Agregar status solo si está presente (para actualizaciones)
  if ('status' in frontendEvent && frontendEvent.status) {
    backendEvent.status = frontendEvent.status;
  }

  return backendEvent;
};

// Servicio de eventos
export const eventsService = {
  // Obtener todos los eventos
  async getAllEvents(filters?: EventFilters, page: number = 1, limit: number = 20): Promise<EventsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.location) params.append('location', filters.location);
        if (filters.organizerId) params.append('organizerId', filters.organizerId);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}?${params.toString()}`;
      const response = await apiService.get<{ events: any[]; total: number; page: number; limit: number; totalPages: number }>(url);
      
      return {
        events: response.data?.events?.map(mapBackendEventToFrontend) || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 20,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  },

  // Obtener evento por ID
  async getEventById(id: string): Promise<Event> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_EVENT_BY_ID, { id });
      const response = await apiService.get<{ event: any }>(url);
      
      return mapBackendEventToFrontend(response.data?.event);
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      throw error;
    }
  },

  // Crear nuevo evento
  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const backendData = mapFrontendEventToBackend(eventData);
      const response = await apiService.post<{ event: any }>(API_CONFIG.ENDPOINTS.CREATE_ADMIN_EVENT, backendData);
      
      return mapBackendEventToFrontend(response.data?.event);
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar evento
  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const backendData = mapFrontendEventToBackend(eventData);
      const url = getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_ADMIN_EVENT, { id });
      const response = await apiService.put<{ event: any }>(url, backendData);
      
      return mapBackendEventToFrontend(response.data?.event);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  },

  // Eliminar evento
  async deleteEvent(id: string): Promise<void> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.DELETE_ADMIN_EVENT, { id });
      await apiService.delete(url);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  },

  // Obtener estadísticas de eventos
  async getEventStats(): Promise<EventStats> {
    try {
      const response = await apiService.get<{ stats: EventStats }>(API_CONFIG.ENDPOINTS.EVENT_STATS);
      return response.data?.stats || {
        totalEvents: 0,
        publishedEvents: 0,
        cancelledEvents: 0,
        completedEvents: 0,
        draftEvents: 0,
        totalAttendees: 0,
        averageBudget: 0,
        topCategories: [],
        topLocations: [],
        eventsByMonth: []
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de eventos:', error);
      throw error;
    }
  },

  // Obtener eventos por estado
  async getEventsByStatus(status: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams({ status });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}?${params.toString()}`;
      const response = await apiService.get<{ events: any[] }>(url);
      
      return response.data?.events?.map(mapBackendEventToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener eventos por estado:', error);
      throw error;
    }
  },

  // Obtener eventos por categoría
  async getEventsByCategory(category: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams({ category });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}?${params.toString()}`;
      const response = await apiService.get<{ events: any[] }>(url);
      
      return response.data?.events?.map(mapBackendEventToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener eventos por categoría:', error);
      throw error;
    }
  },

  // Obtener eventos por ubicación
  async getEventsByLocation(location: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams({ location });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}?${params.toString()}`;
      const response = await apiService.get<{ events: any[] }>(url);
      
      return response.data?.events?.map(mapBackendEventToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener eventos por ubicación:', error);
      throw error;
    }
  },

  // Obtener eventos por organizador
  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams({ organizerId });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}?${params.toString()}`;
      const response = await apiService.get<{ events: any[] }>(url);
      
      return response.data?.events?.map(mapBackendEventToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener eventos por organizador:', error);
      throw error;
    }
  },

  // Obtener conteo de eventos
  async getEventsCount(filters?: EventFilters): Promise<number> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.location) params.append('location', filters.location);
        if (filters.organizerId) params.append('organizerId', filters.organizerId);
      }
      
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_EVENTS}/count?${params.toString()}`;
      const response = await apiService.get<{ count: number }>(url);
      
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error al obtener conteo de eventos:', error);
      throw error;
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