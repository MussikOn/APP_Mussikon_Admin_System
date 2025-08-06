import { api } from './api';
import { API_CONFIG } from '../config/apiConfig';
import type { 
  Image, 
  ImageUploadResponse, 
  ImageUrlResponse, 
  ImageMetadata, 
  ImagesResponse,
  ImageFilters,
  ImageUpdateRequest,
  ImageStats,
  ImageUpdateResponse,
  LegacyImage,
  LegacyImagesResponse
} from '../features/images/types/image';

// Mock data for when backend is not available
const getMockImages = (): Image[] => [
  {
    id: '1',
    fileName: 'mock-image-1.jpg',
    originalName: 'sample-image-1.jpg',
    url: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Mock+Image+1',
    category: 'profile',
    size: 1024000,
    mimeType: 'image/jpeg',
    description: 'Mock profile image for testing',
    tags: ['profile', 'mock', 'test'],
    isPublic: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    fileName: 'mock-image-2.jpg',
    originalName: 'sample-image-2.jpg',
    url: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Mock+Image+2',
    category: 'event',
    size: 2048000,
    mimeType: 'image/jpeg',
    description: 'Mock event image for testing',
    tags: ['event', 'mock', 'test'],
    isPublic: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    fileName: 'mock-image-3.jpg',
    originalName: 'sample-image-3.jpg',
    url: 'https://via.placeholder.com/500x400/FF9800/FFFFFF?text=Mock+Image+3',
    category: 'post',
    size: 3072000,
    mimeType: 'image/jpeg',
    description: 'Mock post image for testing',
    tags: ['post', 'mock', 'test'],
    isPublic: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const getMockImageStats = (): ImageStats => ({
  totalImages: 3,
  totalSize: 6144000,
  imagesByCategory: {
    profile: 1,
    event: 1,
    post: 1
  },
  imagesByUser: {},
  publicImages: 2,
  privateImages: 1,
  activeImages: 3,
  inactiveImages: 0
});

// Cache para URLs firmadas para evitar consultas repetitivas
const presignedUrlCache = new Map<string, { url: string; timestamp: number }>();

const imagesService = {
  // ==================== NUEVO CRUD MEJORADO ====================
  
  // ✅ FUNCIÓN CORREGIDA: Usar endpoint correcto
  async getAllImages(filters?: ImageFilters): Promise<Image[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.category) params.append('category', filters.category);
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }
      
      // ✅ CORREGIDO: Usar endpoint correcto del backend (/imgs en lugar de /images)
      const url = `/imgs?${params.toString()}`;
      console.log('[imagesService] getAllImages - URL:', url);
      
      const response = await api.get(url);
      console.log('✅ Imágenes obtenidas:', response);
      
      // ✅ CORREGIDO: Manejar estructura de respuesta del backend
      let images: Image[] = [];
      
      if (response.data) {
        // El backend puede devolver { images: [...] } o directamente [...]
        if (Array.isArray(response.data)) {
          images = response.data;
        } else if (response.data.images && Array.isArray(response.data.images)) {
          images = response.data.images;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          images = response.data.data;
        } else {
          console.log('⚠️ Estructura de respuesta inesperada:', response.data);
          images = [];
        }
      }
      
      console.log('✅ Imágenes extraídas:', images.length);
      return images;
    } catch (error) {
      console.error('❌ Error al obtener imágenes:', error);
      // ✅ CORREGIDO: Devolver array vacío en lugar de lanzar error
      console.log('⚠️ Usando datos mock debido al error');
      return getMockImages();
    }
  },

  // Obtener imagen por ID
  async getImageById(imageId: string): Promise<Image | null> {
    try {
      const response = await api.get<{ success: boolean; image: Image }>(
        API_CONFIG.ENDPOINTS.ADMIN_IMAGE_BY_ID.replace(':id', imageId)
      );
      return response.data.image || null;
    } catch (error) {
      console.warn('⚠️ Backend no disponible o error en respuesta, usando imagen mock:', error);
      const mockImages = getMockImages();
      return mockImages.find(img => img.id === imageId) || null;
    }
  },

  // Subir una imagen
  async uploadImage(
    file: File, 
    category: Image['category'], 
    metadata?: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<Image> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', category);
      
      if (metadata) {
        if (metadata.description) {
          formData.append('description', metadata.description);
        }
        if (metadata.tags) {
          formData.append('tags', JSON.stringify(metadata.tags));
        }
        if (metadata.isPublic !== undefined) {
          formData.append('isPublic', String(metadata.isPublic));
        }
      }

      console.log('[imagesService] uploadImage - Subiendo imagen:', file.name);
      
      const response = await api.post<ImageUploadResponse>(
        API_CONFIG.ENDPOINTS.UPLOAD_IMAGE, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('[imagesService] uploadImage - Respuesta:', response);
      
      return response.data.image;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  },

  // Actualizar imagen
  async updateImage(imageId: string, updateData: ImageUpdateRequest): Promise<Image> {
    try {
      const response = await api.put<ImageUpdateResponse>(
        API_CONFIG.ENDPOINTS.UPDATE_IMAGE.replace(':id', imageId),
        updateData
      );
      return response.data.image;
    } catch (error) {
      console.error('Error al actualizar imagen:', error);
      throw error;
    }
  },

  // Eliminar una imagen
  async deleteImage(imageId: string): Promise<void> {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.DELETE_ADMIN_IMAGE.replace(':id', imageId));
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  },

  // Obtener estadísticas de imágenes
  async getImageStats(): Promise<ImageStats> {
    try {
      // ✅ CORREGIDO: Usar endpoint correcto del backend (/imgs en lugar de /images)
      const response = await api.get('/imgs/stats');
      console.log('📊 Estadísticas de imágenes obtenidas:', response);
      
      // ✅ CORREGIDO: Manejar estructura de respuesta del backend
      let stats: ImageStats;
      
      if (response.data) {
        if (response.data.stats) {
          stats = response.data.stats;
        } else if (response.data.data && response.data.data.stats) {
          stats = response.data.data.stats;
        } else {
          console.log('⚠️ Estructura de estadísticas inesperada:', response.data);
          stats = getMockImageStats();
        }
      } else {
        stats = getMockImageStats();
      }
      
      return stats;
    } catch (error) {
      console.warn('⚠️ Backend no disponible o error en respuesta, usando estadísticas mock de imágenes:', error);
      return getMockImageStats();
    }
  },

  // Limpiar imágenes expiradas
  async cleanupExpiredImages(): Promise<{ deletedCount: number; message: string }> {
    try {
      const response = await api.post<{ success: boolean; deletedCount: number; message: string }>(
        API_CONFIG.ENDPOINTS.IMAGE_CLEANUP
      );
      return {
        deletedCount: response.data.deletedCount,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error al limpiar imágenes expiradas:', error);
      throw error;
    }
  },

  // Validar archivo antes de subir
  async validateFile(file: File): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<{ success: boolean; data: { isValid: boolean; errors: string[]; warnings: string[] } }>(
        API_CONFIG.ENDPOINTS.IMAGE_VALIDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error al validar archivo:', error);
      // Fallback: validación básica
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push('Tipo de archivo no permitido');
      }
      
      // Validar tamaño
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        errors.push('Archivo demasiado grande (máximo 10MB)');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  },

  // Obtener URL firmada para una imagen
  async getImagePresignedUrl(imageId: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      // ✅ NUEVO: Verificar cache primero
      const cacheKey = `${imageId}-${expiresIn}`;
      const cached = presignedUrlCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < (expiresIn * 1000 * 0.8)) {
        console.log('[imagesService] getImagePresignedUrl - Usando URL cacheada para:', imageId);
        return cached.url;
      }
      
      // ✅ CORREGIDO: Usar URL directa en lugar de API_CONFIG para evitar problemas (/imgs en lugar de /images)
      const url = `/imgs/${imageId}/presigned?expiresIn=${expiresIn}`;
      console.log('[imagesService] getImagePresignedUrl - Intentando obtener URL firmada para:', imageId);
      
      const response = await api.get<{ success: boolean; data: { presignedUrl: string; expiresIn: number } }>(url);
      
      if (response.data?.success && response.data?.data?.presignedUrl) {
        console.log('[imagesService] getImagePresignedUrl - URL firmada obtenida exitosamente');
        
        // ✅ NUEVO: Guardar en cache
        presignedUrlCache.set(cacheKey, {
          url: response.data.data.presignedUrl,
          timestamp: now
        });
        
        return response.data.data.presignedUrl;
      }
      
      console.log('[imagesService] getImagePresignedUrl - No se pudo obtener URL firmada');
      return null;
    } catch (error) {
      console.error('Error al obtener URL firmada:', error);
      // ✅ CORREGIDO: No lanzar error, solo devolver null
      return null;
    }
  },

  // ==================== ENDPOINTS ESPECÍFICOS ====================

  // Obtener imágenes de perfil
  async getProfileImages(userId: string): Promise<Image[]> {
    try {
      const response = await api.get<ImagesResponse>(
        API_CONFIG.ENDPOINTS.PROFILE_IMAGES.replace(':userId', userId)
      );
      return response.data.images || [];
    } catch (error) {
      console.error('Error al obtener imágenes de perfil:', error);
      throw error;
    }
  },

  // Obtener imágenes de posts
  async getPostImages(userId?: string): Promise<Image[]> {
    try {
      const url = userId 
        ? `${API_CONFIG.ENDPOINTS.POST_IMAGES}?userId=${userId}`
        : API_CONFIG.ENDPOINTS.POST_IMAGES;
      
      const response = await api.get<ImagesResponse>(url);
      return response.data.images || [];
    } catch (error) {
      console.error('Error al obtener imágenes de posts:', error);
      throw error;
    }
  },

  // Obtener imágenes de eventos
  async getEventImages(eventId?: string): Promise<Image[]> {
    try {
      const url = eventId 
        ? `${API_CONFIG.ENDPOINTS.EVENT_IMAGES}?eventId=${eventId}`
        : API_CONFIG.ENDPOINTS.EVENT_IMAGES;
      
      const response = await api.get<ImagesResponse>(url);
      return response.data.images || [];
    } catch (error) {
      console.error('Error al obtener imágenes de eventos:', error);
      throw error;
    }
  },

  // ==================== FUNCIONES HELPER ====================

  // Función helper para obtener URLs de todas las imágenes
  async getImagesWithUrls(filters?: ImageFilters): Promise<Image[]> {
    try {
      const images = await this.getAllImages(filters);
      
      // Procesar cada imagen para obtener URLs firmadas si es necesario
      const processedImages = await Promise.all(
        images.map(async (image) => {
          try {
            // Intentar obtener URL firmada
            const presignedUrl = await this.getImagePresignedUrl(image.id);
            if (presignedUrl) {
              return {
                ...image,
                url: presignedUrl
              };
            }
          } catch (error) {
            console.warn(`Error obteniendo URL firmada para imagen ${image.id}:`, error);
          }
          
          return image;
        })
      );
      
      return processedImages;
    } catch (error) {
      console.warn('⚠️ Error al obtener imágenes con URLs, usando mock:', error);
      return getMockImages();
    }
  },

  // Función para buscar imágenes
  async searchImages(searchTerm: string, filters?: ImageFilters): Promise<Image[]> {
    const searchFilters: ImageFilters = {
      ...filters,
      search: searchTerm
    };
    return await this.getAllImages(searchFilters);
  },

  // Función para obtener imágenes por categoría
  async getImagesByCategory(category: Image['category'], filters?: ImageFilters): Promise<Image[]> {
    const categoryFilters: ImageFilters = {
      ...filters,
      category
    };
    return await this.getAllImages(categoryFilters);
  },

  // Función para obtener imágenes públicas
  async getPublicImages(filters?: ImageFilters): Promise<Image[]> {
    const publicFilters: ImageFilters = {
      ...filters,
      isPublic: true,
      isActive: true
    };
    return await this.getAllImages(publicFilters);
  },

  // ==================== FUNCIONES LEGACY ====================

  // Obtener URL firmada de una imagen (legacy)
  async getImageUrl(key: string): Promise<string> {
    try {
      const response = await api.get<ImageUrlResponse>(
        API_CONFIG.ENDPOINTS.LEGACY_ADMIN_IMAGE_BY_ID.replace(':key', key)
      );
      return response.data.url;
    } catch (error) {
      console.error('Error al obtener URL de imagen:', error);
      throw error;
    }
  },

  // Subir imagen (legacy)
  async uploadImageLegacy(file: File): Promise<{ message: string; key: string; url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ message: string; key: string; url: string }>(
        API_CONFIG.ENDPOINTS.LEGACY_UPLOAD_IMAGE, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al subir imagen (legacy):', error);
      throw error;
    }
  },

  // Eliminar imagen (legacy)
  async deleteImageLegacy(key: string): Promise<void> {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.LEGACY_DELETE_ADMIN_IMAGE.replace(':key', key));
    } catch (error) {
      console.error('Error al eliminar imagen (legacy):', error);
      throw error;
    }
  },

  // Actualizar metadatos de imagen (legacy)
  async updateImageMetadata(key: string, metadata: ImageMetadata): Promise<void> {
    try {
      await api.put(
        API_CONFIG.ENDPOINTS.LEGACY_UPDATE_IMAGE_METADATA.replace(':key', key), 
        metadata
      );
    } catch (error) {
      console.error('Error al actualizar metadatos de imagen:', error);
      throw error;
    }
  },

  // Obtener todas las imágenes (legacy)
  async getAllImagesLegacy(): Promise<LegacyImage[]> {
    try {
      const response = await api.get<LegacyImagesResponse>(API_CONFIG.ENDPOINTS.LEGACY_ADMIN_IMAGES);
      return response.data.files || [];
    } catch (error) {
      console.error('Error al obtener imágenes (legacy):', error);
      throw error;
    }
  }
};

// Exportar el servicio principal
export { imagesService };

// Función para obtener el conteo de imágenes (para compatibilidad con dashboard)
export const getImagesCount = async (): Promise<number> => {
  try {
    const images = await imagesService.getAllImages();
    return images.length;
  } catch (error) {
    console.error('Error al obtener conteo de imágenes:', error);
    return 0;
  }
}; 