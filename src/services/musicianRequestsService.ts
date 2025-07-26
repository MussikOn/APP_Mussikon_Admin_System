import { get, post, put, del } from './httpClient';
import type { 
  MusicianRequest, 
  CreateRequestData, 
  UpdateRequestData, 
  AcceptRequestData, 
  CancelRequestData,
  BackendMusicianRequest 
} from '../features/musicianRequests/types/request';

// Función para mapear BackendMusicianRequest a MusicianRequest del frontend
const mapBackendRequestToFrontend = (backendRequest: BackendMusicianRequest): MusicianRequest => {
  return {
    _id: backendRequest.id,
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

// Obtener todas las solicitudes usando el endpoint de administración
export const getAllRequests = async (): Promise<MusicianRequest[]> => {
  try {
    // Intentar conectar al backend
    const response = await get('/admin/musician-requests');
    const backendRequests = (response as any).data || [];
    console.log('✅ Backend conectado, usando datos reales');
    return backendRequests.map(mapBackendRequestToFrontend);
  } catch (error) {
    console.log('⚠️ Backend no disponible, usando datos de prueba');
    console.error('Error fetching requests:', error);
    // Fallback con datos de prueba si el backend no está disponible
    return [
      {
        _id: '1',
        userId: 'admin@mussikon.com',
        eventType: 'concierto',
        date: '2024-08-15',
        time: '20:00 - 22:00',
        location: 'Teatro Municipal',
        instrument: 'guitarra',
        budget: 500,
        comments: 'Necesitamos un guitarrista para un concierto de rock',
        status: 'pending',
        createdAt: '2024-07-01T10:00:00.000Z',
        updatedAt: '2024-07-01T10:00:00.000Z'
      },
      {
        _id: '2',
        userId: 'admin@mussikon.com',
        eventType: 'boda',
        date: '2024-09-20',
        time: '18:00 - 20:00',
        location: 'Jardín Botánico',
        instrument: 'piano',
        budget: 800,
        comments: 'Buscamos pianista para ceremonia de boda',
        status: 'assigned',
        assignedMusicianId: 'musico1@email.com',
        createdAt: '2024-07-02T14:30:00.000Z',
        updatedAt: '2024-07-02T14:30:00.000Z'
      },
      {
        _id: '3',
        userId: 'admin@mussikon.com',
        eventType: 'culto',
        date: '2024-08-04',
        time: '10:00 - 12:00',
        location: 'Iglesia Central',
        instrument: 'voz',
        budget: 300,
        comments: 'Cantante para servicio dominical',
        status: 'completed',
        assignedMusicianId: 'musico2@email.com',
        createdAt: '2024-07-03T09:00:00.000Z',
        updatedAt: '2024-07-03T09:00:00.000Z'
      },
      {
        _id: '4',
        userId: 'admin@mussikon.com',
        eventType: 'evento corporativo',
        date: '2024-08-25',
        time: '19:00 - 21:00',
        location: 'Centro de Convenciones',
        instrument: 'bajo',
        budget: 600,
        comments: 'Bajista para evento corporativo',
        status: 'cancelled',
        createdAt: '2024-07-04T16:45:00.000Z',
        updatedAt: '2024-07-04T16:45:00.000Z'
      },
      {
        _id: '5',
        userId: 'admin@mussikon.com',
        eventType: 'festival',
        date: '2024-09-10',
        time: '21:00 - 23:00',
        location: 'Parque Central',
        instrument: 'batería',
        budget: 700,
        comments: 'Baterista para festival de música',
        status: 'unassigned',
        createdAt: '2024-07-05T11:20:00.000Z',
        updatedAt: '2024-07-05T11:20:00.000Z'
      }
    ];
  }
};

// Obtener solicitud por ID
export const getRequestById = async (id: string): Promise<MusicianRequest | null> => {
  try {
    const response = await get(`/musician-requests/${id}/status`);
    return mapBackendRequestToFrontend((response as any).data);
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return null;
  }
};

// Crear nueva solicitud
export const createRequest = async (requestData: CreateRequestData): Promise<MusicianRequest> => {
  try {
    const response = await post('/musician-requests', requestData);
    return mapBackendRequestToFrontend((response as any).data);
  } catch (error) {
    console.error('Error creating request:', error);
    // Simular creación exitosa para desarrollo
    const newRequest: MusicianRequest = {
      _id: Date.now().toString(),
      userId: requestData.userId,
      eventType: requestData.eventType,
      date: requestData.date,
      time: `${requestData.startTime} - ${requestData.endTime}`,
      location: requestData.location,
      instrument: requestData.instrument,
      budget: requestData.budget,
      comments: requestData.comments,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Backend no disponible, simulando creación de solicitud');
    return newRequest;
  }
};

// Actualizar solicitud
export const updateRequest = async (id: string, requestData: UpdateRequestData): Promise<MusicianRequest> => {
  try {
    const response = await put(`/musician-requests/${id}`, requestData);
    return mapBackendRequestToFrontend((response as any).data);
  } catch (error) {
    console.error('Error updating request:', error);
    // Simular actualización exitosa para desarrollo
    const updatedRequest: MusicianRequest = {
      _id: id,
      userId: 'admin@mussikon.com',
      eventType: requestData.eventType || 'concierto',
      date: requestData.date || new Date().toISOString().split('T')[0],
      time: requestData.startTime && requestData.endTime ? `${requestData.startTime} - ${requestData.endTime}` : '20:00 - 22:00',
      location: requestData.location || '',
      instrument: requestData.instrument || 'guitarra',
      budget: requestData.budget || 0,
      comments: requestData.comments || '',
      status: requestData.status || 'pending',
      assignedMusicianId: requestData.assignedMusicianId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Backend no disponible, simulando actualización de solicitud');
    return updatedRequest;
  }
};

// Eliminar solicitud
export const deleteRequest = async (id: string): Promise<void> => {
  try {
    await del(`/admin/musician-requests/${id}`);
  } catch (error) {
    console.error('Error deleting request:', error);
    console.log('Backend no disponible, simulando eliminación de solicitud');
    // Simular eliminación exitosa para desarrollo
  }
};

// Aceptar solicitud
export const acceptRequest = async (acceptData: AcceptRequestData): Promise<boolean> => {
  try {
    const response = await post('/musician-requests/accept', acceptData);
    return (response as any).data.success;
  } catch (error) {
    console.error('Error accepting request:', error);
    console.log('Backend no disponible, simulando aceptación de solicitud');
    return true; // Simular aceptación exitosa para desarrollo
  }
};

// Cancelar solicitud
export const cancelRequest = async (cancelData: CancelRequestData): Promise<boolean> => {
  try {
    const response = await post('/musician-requests/cancel', cancelData);
    return (response as any).data.success;
  } catch (error) {
    console.error('Error cancelling request:', error);
    console.log('Backend no disponible, simulando cancelación de solicitud');
    return true; // Simular cancelación exitosa para desarrollo
  }
};

// Obtener solicitudes por estado
export const getRequestsByStatus = async (status: MusicianRequest['status']): Promise<MusicianRequest[]> => {
  try {
    const allRequests = await getAllRequests();
    return allRequests.filter(request => request.status === status);
  } catch (error) {
    console.error('Error fetching requests by status:', error);
    return [];
  }
};

// Obtener solicitudes por rango de fechas
export const getRequestsByDateRange = async (startDate: string, endDate: string): Promise<MusicianRequest[]> => {
  try {
    const allRequests = await getAllRequests();
    return allRequests.filter(request => {
      const requestDate = new Date(request.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return requestDate >= start && requestDate <= end;
    });
  } catch (error) {
    console.error('Error fetching requests by date range:', error);
    return [];
  }
};

// Obtener conteo de solicitudes
export const getRequestsCount = async (): Promise<number> => {
  try {
    const requests = await getAllRequests();
    return requests.length;
  } catch (error) {
    console.error('Error getting requests count:', error);
    return 0;
  }
};

// Obtener solicitudes por tipo de evento
export const getRequestsByEventType = async (eventType: string): Promise<MusicianRequest[]> => {
  try {
    const allRequests = await getAllRequests();
    return allRequests.filter(request => request.eventType === eventType);
  } catch (error) {
    console.error('Error fetching requests by event type:', error);
    return [];
  }
};

// Obtener solicitudes por instrumento
export const getRequestsByInstrument = async (instrument: string): Promise<MusicianRequest[]> => {
  try {
    const allRequests = await getAllRequests();
    return allRequests.filter(request => request.instrument === instrument);
  } catch (error) {
    console.error('Error fetching requests by instrument:', error);
    return [];
  }
}; 