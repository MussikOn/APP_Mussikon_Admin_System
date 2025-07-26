export interface Event {
  _id?: string;
  name: string;
  title?: string;
  description?: string;
  date: string;
  fecha?: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled';
  type?: string;
  capacity?: number;
  price?: number;
  organizer?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  title?: string;
  description?: string;
  date: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled';
  type?: string;
  capacity?: number;
  price?: number;
  organizer?: string;
  imageUrl?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  _id: string;
}

export interface EventFilters {
  search: string;
  status: Event['status'] | 'all';
  type: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface EventFormData {
  name: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: Event['status'];
  type: string;
  capacity: number;
  price: number;
  organizer: string;
  imageUrl: string;
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
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'cancelled', label: 'Cancelado' }
] as const; 