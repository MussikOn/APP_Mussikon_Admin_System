import { apiService } from './api';
import { getApiUrl } from '../config/apiConfig';
import { API_CONFIG } from '../config/apiConfig';
import type { 
  BackendMusicianRequest, 
  MusicianRequest, 
  CreateRequestData, 
  UpdateRequestData 
} from '../features/musicianRequests/types/request';

// Tipos para respuestas de la API
export interface MusicianRequestsResponse {
  requests: MusicianRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestFilters {
  search?: string;
  status?: string;
  instrument?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  eventId?: string;
  musicianId?: string;
}

export interface RequestStats {
  totalRequests: number;
  pendingRequests: number;
  assignedRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  unassignedRequests: number;
  averageResponseTime: number;
  topInstruments: Array<{ instrument: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  requestsByMonth: Array<{ month: string; count: number }>;
}

// Función para mapear datos del backend al frontend
const mapBackendRequestToFrontend = (backendRequest: BackendMusicianRequest): MusicianRequest => {
  return {
    _id: backendRequest._id || backendRequest.id,
    userId: backendRequest.userId,
    eventType: backendRequest.eventType,
    date: backendRequest.date,
    time: backendRequest.time,
    location: backendRequest.location,
    instrument: backendRequest.instrument,
    budget: backendRequest.budget,
    comments: backendRequest.comments,
    status: mapBackendStatusToFrontend(backendRequest.status),
    assignedMusicianId: backendRequest.assignedMusicianId,
    createdAt: backendRequest.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: backendRequest.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
  };
};

// Función para mapear status del backend al frontend
const mapBackendStatusToFrontend = (backendStatus: BackendMusicianRequest['status']): MusicianRequest['status'] => {
  switch (backendStatus) {
    case 'pendiente':
      return 'pending';
    case 'asignada':
      return 'assigned';
    case 'no_asignada':
      return 'unassigned';
    case 'cancelada':
      return 'cancelled';
    case 'completada':
      return 'completed';
    default:
      return 'pending';
  }
};

// Función para mapear datos del frontend al backend
const mapFrontendRequestToBackend = (frontendRequest: CreateRequestData | UpdateRequestData): any => {
  const backendRequest: any = {
    userId: frontendRequest.userId,
    eventType: frontendRequest.eventType,
    date: frontendRequest.date,
    time: `${frontendRequest.startTime} - ${frontendRequest.endTime}`,
    location: frontendRequest.location,
    instrument: frontendRequest.instrument,
    budget: frontendRequest.budget,
    comments: frontendRequest.comments
  };

  // Agregar status solo si está presente (para actualizaciones)
  if ('status' in frontendRequest && frontendRequest.status) {
    backendRequest.status = mapFrontendStatusToBackend(frontendRequest.status);
  }

  // Agregar assignedMusicianId solo si está presente
  if ('assignedMusicianId' in frontendRequest && frontendRequest.assignedMusicianId) {
    backendRequest.assignedMusicianId = frontendRequest.assignedMusicianId;
  }

  return backendRequest;
};

// Función para mapear status del frontend al backend
const mapFrontendStatusToBackend = (frontendStatus: MusicianRequest['status']): BackendMusicianRequest['status'] => {
  switch (frontendStatus) {
    case 'pending':
      return 'pendiente';
    case 'assigned':
      return 'asignada';
    case 'unassigned':
      return 'no_asignada';
    case 'cancelled':
      return 'cancelada';
    case 'completed':
      return 'completada';
    default:
      return 'pendiente';
  }
};

// Servicio de solicitudes de músicos
export const musicianRequestsService = {
  // Obtener todas las solicitudes
  async getAllRequests(filters?: RequestFilters, page: number = 1, limit: number = 20): Promise<MusicianRequestsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.instrument) params.append('instrument', filters.instrument);
        if (filters.location) params.append('location', filters.location);
        if (filters.eventId) params.append('eventId', filters.eventId);
        if (filters.musicianId) params.append('musicianId', filters.musicianId);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[]; total: number; page: number; limit: number; totalPages: number }>(url);
      
      return {
        requests: response.data?.requests?.map(mapBackendRequestToFrontend) || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 20,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.error('Error al obtener solicitudes de músicos:', error);
      throw error;
    }
  },

  // Obtener solicitud por ID
  async getRequestById(id: string): Promise<MusicianRequest> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUEST_BY_ID, { id });
      const response = await apiService.get<{ request: any }>(url);
      
      return mapBackendRequestToFrontend(response.data?.request);
    } catch (error) {
      console.error('Error al obtener solicitud por ID:', error);
      throw error;
    }
  },

  // Crear nueva solicitud
  async createRequest(requestData: CreateRequestData): Promise<MusicianRequest> {
    try {
      const backendData = mapFrontendRequestToBackend(requestData);
      const response = await apiService.post<{ request: any }>(API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS, backendData);
      
      return mapBackendRequestToFrontend(response.data?.request);
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw error;
    }
  },

  // Actualizar solicitud
  async updateRequest(id: string, requestData: UpdateRequestData): Promise<MusicianRequest> {
    try {
      const backendData = mapFrontendRequestToBackend(requestData);
      const url = getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS, { id });
      const response = await apiService.put<{ request: any }>(url, backendData);
      
      return mapBackendRequestToFrontend(response.data?.request);
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      throw error;
    }
  },

  // Eliminar solicitud
  async deleteRequest(id: string): Promise<void> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.DELETE_ADMIN_MUSICIAN_REQUEST, { id });
      await apiService.delete(url);
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
      throw error;
    }
  },

  // Obtener estadísticas de solicitudes
  async getRequestStats(): Promise<RequestStats> {
    try {
      const response = await apiService.get<{ stats: RequestStats }>(`${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}/stats`);
      return response.data?.stats || {
        totalRequests: 0,
        pendingRequests: 0,
        assignedRequests: 0,
        completedRequests: 0,
        cancelledRequests: 0,
        unassignedRequests: 0,
        averageResponseTime: 0,
        topInstruments: [],
        topLocations: [],
        requestsByMonth: []
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de solicitudes:', error);
      throw error;
    }
  },

  // Obtener solicitudes por estado
  async getRequestsByStatus(status: string): Promise<MusicianRequest[]> {
    try {
      const params = new URLSearchParams({ status });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[] }>(url);
      
      return response.data?.requests?.map(mapBackendRequestToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener solicitudes por estado:', error);
      throw error;
    }
  },

  // Obtener solicitudes por instrumento
  async getRequestsByInstrument(instrument: string): Promise<MusicianRequest[]> {
    try {
      const params = new URLSearchParams({ instrument });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[] }>(url);
      
      return response.data?.requests?.map(mapBackendRequestToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener solicitudes por instrumento:', error);
      throw error;
    }
  },

  // Obtener solicitudes por ubicación
  async getRequestsByLocation(location: string): Promise<MusicianRequest[]> {
    try {
      const params = new URLSearchParams({ location });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[] }>(url);
      
      return response.data?.requests?.map(mapBackendRequestToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener solicitudes por ubicación:', error);
      throw error;
    }
  },

  // Obtener solicitudes por evento
  async getRequestsByEvent(eventId: string): Promise<MusicianRequest[]> {
    try {
      const params = new URLSearchParams({ eventId });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[] }>(url);
      
      return response.data?.requests?.map(mapBackendRequestToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener solicitudes por evento:', error);
      throw error;
    }
  },

  // Obtener solicitudes por músico
  async getRequestsByMusician(musicianId: string): Promise<MusicianRequest[]> {
    try {
      const params = new URLSearchParams({ musicianId });
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}?${params.toString()}`;
      const response = await apiService.get<{ requests: any[] }>(url);
      
      return response.data?.requests?.map(mapBackendRequestToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener solicitudes por músico:', error);
      throw error;
    }
  },

  // Obtener conteo de solicitudes
  async getRequestsCount(filters?: RequestFilters): Promise<number> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.instrument) params.append('instrument', filters.instrument);
        if (filters.location) params.append('location', filters.location);
        if (filters.eventId) params.append('eventId', filters.eventId);
        if (filters.musicianId) params.append('musicianId', filters.musicianId);
      }
      
      const url = `${API_CONFIG.ENDPOINTS.ADMIN_MUSICIAN_REQUESTS}/count?${params.toString()}`;
      const response = await apiService.get<{ count: number }>(url);
      
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error al obtener conteo de solicitudes:', error);
      throw error;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  getRequestStats,
  getRequestsByStatus,
  getRequestsByInstrument,
  getRequestsByLocation,
  getRequestsByEvent,
  getRequestsByMusician,
  getRequestsCount
} = musicianRequestsService; 