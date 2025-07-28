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
  status: 'borrador' | 'publicado' | 'cancelado' | 'completado';
  organizerId: string;
  organizerName: string;
  budget?: number;
  attendees?: number;
  maxAttendees?: number;
  images?: string[];
  tags?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  _id: string;
}

export interface EventFilters {
  search?: string;
  status?: Event['status'];
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: Event['status'];
  organizerId: string;
  organizerName: string;
  budget?: number;
  attendees?: number;
  maxAttendees?: number;
  images?: string[];
  tags?: string[];
}

export const EVENT_TYPES = [
  'Concierto',
  'Festival',
  'Conferencia',
  'Taller',
  'Exposición',
  'Networking',
  'Otro'
] as const;

export const EVENT_STATUSES = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'completado', label: 'Completado' }
] as const; 