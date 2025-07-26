import { get, post, put, del } from './httpClient';
import type { Event } from '../features/events/types/event';

// Tipos que coinciden con el backend
export interface BackendEvent {
  id: string;
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
  songs: string[];
  recommendations: string[];
  mapsLink: string;
  status: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled';
  assignedMusicianId?: string;
  interestedMusicians?: string[];
  createdAt: string;
  updatedAt: string;
}

// Tipo para crear eventos en el frontend
export interface CreateEventData {
  name: string;
  title?: string;
  description?: string;
  date: string;
  location?: string;
  status?: 'draft' | 'published' | 'cancelled';
  type?: string;
  capacity?: number;
  price?: number;
  organizer?: string;
  imageUrl?: string;
}

// Tipo para actualizar eventos
export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'draft' | 'published' | 'cancelled';
}

// Función para mapear BackendEvent a Event del frontend
const mapBackendEventToFrontend = (backendEvent: BackendEvent): Event => {
  return {
    _id: backendEvent.id,
    name: backendEvent.eventName,
    title: backendEvent.eventType,
    description: backendEvent.comment,
    date: backendEvent.date,
    location: backendEvent.location,
    status: mapBackendStatusToFrontend(backendEvent.status),
    type: backendEvent.eventType,
    capacity: parseInt(backendEvent.duration) || 0,
    price: parseFloat(backendEvent.budget) || 0,
    organizer: backendEvent.user,
    imageUrl: backendEvent.flyerUrl || '',
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt
  };
};

// Función para mapear status del backend al frontend
const mapBackendStatusToFrontend = (backendStatus: BackendEvent['status']): Event['status'] => {
  switch (backendStatus) {
    case 'pending_musician':
      return 'draft';
    case 'musician_assigned':
      return 'published';
    case 'completed':
      return 'published';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'draft';
  }
};

// Función para mapear status del frontend al backend
const mapFrontendStatusToBackend = (frontendStatus: Event['status']): BackendEvent['status'] => {
  switch (frontendStatus) {
    case 'draft':
      return 'pending_musician';
    case 'published':
      return 'musician_assigned';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending_musician';
  }
};

// Función para mapear CreateEventData del frontend al backend
const mapFrontendEventToBackend = (frontendEvent: CreateEventData): any => {
  return {
    eventName: frontendEvent.name,
    eventType: frontendEvent.type || 'concierto',
    date: frontendEvent.date,
    time: '18:00 - 20:00', // Default time
    location: frontendEvent.location || '',
    duration: frontendEvent.capacity?.toString() || '120',
    instrument: 'guitarra', // Default instrument
    bringInstrument: false,
    comment: frontendEvent.description || '',
    budget: frontendEvent.price?.toString() || '0',
    flyerUrl: frontendEvent.imageUrl,
    songs: [],
    recommendations: [],
    mapsLink: `https://maps.google.com/?q=${encodeURIComponent(frontendEvent.location || '')}`
  };
};

// Obtener todos los eventos del usuario
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await get('/events/my-events');
    const backendEvents = (response as any).data.data || [];
    return backendEvents.map(mapBackendEventToFrontend);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Fallback con datos de prueba si el backend no está disponible
    return [
      {
        _id: '1',
        name: 'Concierto de Verano',
        title: 'Música en el Parque',
        description: 'Un evento musical al aire libre con los mejores artistas locales',
        date: '2024-08-15T20:00:00.000Z',
        location: 'Parque Central',
        status: 'published',
        type: 'concierto',
        capacity: 500,
        price: 25,
        organizer: 'admin@mussikon.com',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        createdAt: '2024-07-01T10:00:00.000Z',
        updatedAt: '2024-07-01T10:00:00.000Z'
      },
      {
        _id: '2',
        name: 'Festival de Jazz',
        title: 'Noche de Jazz',
        description: 'Una noche mágica con los mejores exponentes del jazz',
        date: '2024-09-20T19:00:00.000Z',
        location: 'Teatro Municipal',
        status: 'draft',
        type: 'festival',
        capacity: 300,
        price: 40,
        organizer: 'admin@mussikon.com',
        imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
        createdAt: '2024-07-02T14:30:00.000Z',
        updatedAt: '2024-07-02T14:30:00.000Z'
      },
      {
        _id: '3',
        name: 'Culto Dominical',
        title: 'Adoración y Alabanza',
        description: 'Servicio de adoración con música en vivo',
        date: '2024-08-04T10:00:00.000Z',
        location: 'Iglesia Central',
        status: 'published',
        type: 'culto',
        capacity: 200,
        price: 0,
        organizer: 'admin@mussikon.com',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        createdAt: '2024-07-03T09:00:00.000Z',
        updatedAt: '2024-07-03T09:00:00.000Z'
      },
      {
        _id: '4',
        name: 'Workshop de Guitarra',
        title: 'Aprende Guitarra',
        description: 'Taller intensivo de guitarra para principiantes',
        date: '2024-08-25T15:00:00.000Z',
        location: 'Centro Cultural',
        status: 'draft',
        type: 'workshop',
        capacity: 50,
        price: 75,
        organizer: 'admin@mussikon.com',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        createdAt: '2024-07-04T16:45:00.000Z',
        updatedAt: '2024-07-04T16:45:00.000Z'
      },
      {
        _id: '5',
        name: 'Concierto de Rock',
        title: 'Rock en la Ciudad',
        description: 'La mejor música rock en vivo',
        date: '2024-09-10T21:00:00.000Z',
        location: 'Estadio Municipal',
        status: 'cancelled',
        type: 'concierto',
        capacity: 1000,
        price: 60,
        organizer: 'admin@mussikon.com',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        createdAt: '2024-07-05T11:20:00.000Z',
        updatedAt: '2024-07-05T11:20:00.000Z'
      }
    ];
  }
};

// Obtener evento por ID
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const response = await get(`/events/${id}`);
    return mapBackendEventToFrontend((response as any).data);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
};

// Crear nuevo evento
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  try {
    const backendEventData = mapFrontendEventToBackend(eventData);
    const response = await post('/events/request-musician', backendEventData);
    return mapBackendEventToFrontend((response as any).data.data);
  } catch (error) {
    console.error('Error creating event:', error);
    // Simular creación exitosa para desarrollo
    const newEvent: Event = {
      _id: Date.now().toString(),
      name: eventData.name,
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date,
      location: eventData.location,
      status: 'draft',
      type: eventData.type,
      capacity: eventData.capacity || 0,
      price: eventData.price || 0,
      organizer: 'admin@mussikon.com',
      imageUrl: eventData.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Backend no disponible, simulando creación de evento');
    return newEvent;
  }
};

// Actualizar evento
export const updateEvent = async (id: string, eventData: UpdateEventData): Promise<Event> => {
  try {
    const backendEventData = mapFrontendEventToBackend(eventData as CreateEventData);
    const response = await put(`/events/${id}`, backendEventData);
    return mapBackendEventToFrontend((response as any).data);
  } catch (error) {
    console.error('Error updating event:', error);
    // Simular actualización exitosa para desarrollo
    const updatedEvent: Event = {
      _id: id,
      name: eventData.name || 'Evento Actualizado',
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || new Date().toISOString(),
      location: eventData.location || '',
      status: eventData.status || 'draft',
      type: eventData.type || '',
      capacity: eventData.capacity || 0,
      price: eventData.price || 0,
      organizer: 'admin@mussikon.com',
      imageUrl: eventData.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Backend no disponible, simulando actualización de evento');
    return updatedEvent;
  }
};

// Eliminar evento
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await del(`/events/${id}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    console.log('Backend no disponible, simulando eliminación de evento');
    // Simular eliminación exitosa para desarrollo
  }
};

// Obtener eventos por estado
export const getEventsByStatus = async (status: Event['status']): Promise<Event[]> => {
  try {
    const backendStatus = mapFrontendStatusToBackend(status);
    let endpoint = '';
    
    switch (backendStatus) {
      case 'pending_musician':
        endpoint = '/events/my-pending';
        break;
      case 'musician_assigned':
        endpoint = '/events/my-assigned';
        break;
      case 'completed':
        endpoint = '/events/my-completed';
        break;
      default:
        return getAllEvents();
    }
    
    const response = await get(endpoint);
    const backendEvents = (response as any).data || [];
    return backendEvents.map(mapBackendEventToFrontend);
  } catch (error) {
    console.error('Error fetching events by status:', error);
    return [];
  }
};

// Obtener eventos por rango de fechas
export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<Event[]> => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    return [];
  }
};

// Obtener conteo de eventos
export const getEventsCount = async (): Promise<number> => {
  try {
    const events = await getAllEvents();
    return events.length;
  } catch (error) {
    console.error('Error getting events count:', error);
    return 0;
  }
}; 