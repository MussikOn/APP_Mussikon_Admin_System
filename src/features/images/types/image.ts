// Tipos para el sistema de imágenes CRUD
export interface Image {
  id: string;
  originalName: string;
  fileName: string;
  url: string;
  size: number;
  mimeType: string;
  category: 'profile' | 'post' | 'event' | 'gallery' | 'other';
  description?: string;
  tags?: string[];
  isPublic: boolean;
  isActive: boolean;
  userId?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUploadResponse {
  success: boolean;
  image: Image;
  message: string;
}

export interface ImageUrlResponse {
  url: string;
}

export interface ImageMetadata {
  [key: string]: string;
}

export interface ImagesResponse {
  success: boolean;
  images: Image[];
  total: number;
  page: number;
  limit: number;
}

export interface ImageFilters {
  search?: string;
  category?: Image['category'];
  isPublic?: boolean;
  isActive?: boolean;
  userId?: string;
  eventId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'originalName' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface ImageUpdateRequest {
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  isActive?: boolean;
  category?: Image['category'];
}

export interface ImageUpdateResponse {
  success: boolean;
  image: Image;
  message: string;
}

export interface ImageStats {
  totalImages: number;
  totalSize: number;
  imagesByCategory: Record<string, number>;
  imagesByUser: Record<string, number>;
  publicImages: number;
  privateImages: number;
  activeImages: number;
  inactiveImages: number;
}

export interface ImageStatsResponse {
  success: boolean;
  stats: ImageStats;
}

// Legacy types for backward compatibility
export interface LegacyImage {
  key: string;
  lastModified?: Date;
  size?: number;
  url?: string;
}

export interface LegacyImagesResponse {
  msg: string;
  files: LegacyImage[];
} 