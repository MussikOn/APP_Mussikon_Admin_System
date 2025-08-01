export interface Musician {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  instruments: Instrument[];
  genres: string[];
  experience: number; // años de experiencia
  hourlyRate: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: Availability[];
  portfolio: PortfolioItem[];
  ratings: Rating[];
  averageRating: number;
  totalReviews: number;
  specializations: string[];
  certifications: Certification[];
  socialMedia: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Instrument {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  isPrimary: boolean;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  type: 'audio' | 'video' | 'image' | 'link';
  url: string;
  thumbnail?: string;
  duration?: number; // in seconds
  createdAt: string;
}

export interface Rating {
  _id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  eventId?: string;
  createdAt: string;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  certificateUrl?: string;
}

// Tipos para formularios
export interface CreateMusicianData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  instruments: Instrument[];
  genres: string[];
  experience: number;
  hourlyRate: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: Availability[];
  specializations: string[];
  socialMedia: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
}

export interface UpdateMusicianData extends Partial<CreateMusicianData> {
  isActive?: boolean;
  isVerified?: boolean;
}

// Tipos para filtros
export interface MusicianFilters {
  instruments?: string[];
  genres?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // km
  };
  experience?: {
    min?: number;
    max?: number;
  };
  hourlyRate?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
    max?: number;
  };
  availability?: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  };
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'experience' | 'rating' | 'hourlyRate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Tipos para estadísticas
export interface MusicianStats {
  totalMusicians: number;
  activeMusicians: number;
  verifiedMusicians: number;
  averageRating: number;
  averageHourlyRate: number;
  topInstruments: Array<{
    instrument: string;
    count: number;
  }>;
  topGenres: Array<{
    genre: string;
    count: number;
  }>;
  musiciansByLocation: Array<{
    location: string;
    count: number;
  }>;
  musiciansByExperience: Array<{
    range: string;
    count: number;
  }>;
}

// Tipos para respuestas de API
export interface MusiciansResponse {
  success: boolean;
  data: {
    musicians: Musician[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface MusicianResponse {
  success: boolean;
  data: Musician;
  message?: string;
}

export interface MusicianStatsResponse {
  success: boolean;
  data: MusicianStats;
  message?: string;
} 