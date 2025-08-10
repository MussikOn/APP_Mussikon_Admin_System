export interface MusicianProfile {
  id: string;
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  instruments: Instrument[];
  genres: string[];
  experience: ExperienceLevel;
  availability: AvailabilityStatus;
  hourlyRate: {
    min: number;
    max: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
  socialMedia: SocialMediaLinks;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Instrument {
  name: string;
  proficiency: ProficiencyLevel;
  yearsOfExperience: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  type: 'audio' | 'video' | 'image' | 'document';
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface SocialMediaLinks {
  youtube?: string;
  spotify?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface SearchFilters {
  query?: string;
  instruments?: string[];
  genres?: string[];
  location?: string;
  radius?: number;
  experience?: ExperienceLevel[];
  availability?: AvailabilityStatus[];
  hourlyRate?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  verified?: boolean;
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  musicians: MusicianProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: SearchFilters;
}

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional' | 'expert';
export type ProficiencyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable' | 'partially_available';
export type SortOption = 'rating' | 'experience' | 'hourlyRate' | 'distance' | 'name' | 'createdAt';

export interface SearchStats {
  totalMusicians: number;
  byInstrument: Record<string, number>;
  byGenre: Record<string, number>;
  byLocation: Record<string, number>;
  byExperience: Record<ExperienceLevel, number>;
  averageRating: number;
  averageHourlyRate: number;
}

