import { useState, useEffect, useCallback } from 'react';
import { imagesService } from '../../../services/imagesService';
import type { Image, ImageFilters, ImageUpdateRequest, ImageStats } from '../types/image';

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Cargar todas las imágenes
  const loadImages = useCallback(async (filters?: ImageFilters) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useImages] loadImages - Iniciando carga de imágenes');
      const imagesWithUrls = await imagesService.getImagesWithUrls(filters);
      console.log('[useImages] loadImages - Imágenes cargadas:', imagesWithUrls.length);
      setImages(imagesWithUrls);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las imágenes');
      console.error('Error al cargar imágenes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statsData = await imagesService.getImageStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Subir una nueva imagen
  const uploadImage = useCallback(async (
    file: File, 
    category: Image['category'], 
    metadata?: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ) => {
    setUploading(true);
    setError(null);
    try {
      console.log('[useImages] uploadImage - Iniciando subida:', file.name);
      const result = await imagesService.uploadImage(file, category, metadata);
      console.log('[useImages] uploadImage - Imagen subida exitosamente:', result);
      
      // Agregar la nueva imagen a la lista
      setImages(prev => [result, ...prev]);
      
      // Recargar estadísticas
      await loadStats();
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      console.error('Error al subir imagen:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [loadStats]);

  // Actualizar una imagen
  const updateImage = useCallback(async (imageId: string, updateData: ImageUpdateRequest) => {
    setError(null);
    try {
      console.log('[useImages] updateImage - Actualizando imagen:', imageId);
      const updatedImage = await imagesService.updateImage(imageId, updateData);
      console.log('[useImages] updateImage - Imagen actualizada:', updatedImage);
      setImages(prev => prev.map(img => img.id === imageId ? updatedImage : img));
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la imagen');
      console.error('Error al actualizar imagen:', err);
      throw err;
    }
  }, []);

  // Eliminar una imagen
  const deleteImage = useCallback(async (imageId: string) => {
    setError(null);
    try {
      console.log('[useImages] deleteImage - Eliminando imagen:', imageId);
      await imagesService.deleteImage(imageId);
      console.log('[useImages] deleteImage - Imagen eliminada exitosamente');
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      // Recargar estadísticas
      await loadStats();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la imagen');
      console.error('Error al eliminar imagen:', err);
      throw err;
    }
  }, [loadStats]);

  // Buscar imágenes
  const searchImages = useCallback(async (searchTerm: string, filters?: ImageFilters) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useImages] searchImages - Buscando:', searchTerm);
      const searchFilters: ImageFilters = {
        ...filters,
        search: searchTerm
      };
      const results = await imagesService.getAllImages(searchFilters);
      console.log('[useImages] searchImages - Resultados encontrados:', results.length);
      setImages(results);
    } catch (err: any) {
      setError(err.message || 'Error al buscar imágenes');
      console.error('Error al buscar imágenes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener imágenes por categoría
  const getImagesByCategory = useCallback(async (category: Image['category'], filters?: ImageFilters) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useImages] getImagesByCategory - Categoría:', category);
      const categoryFilters: ImageFilters = {
        ...filters,
        category
      };
      const results = await imagesService.getAllImages(categoryFilters);
      console.log('[useImages] getImagesByCategory - Resultados:', results.length);
      setImages(results);
    } catch (err: any) {
      setError(err.message || 'Error al filtrar por categoría');
      console.error('Error al filtrar por categoría:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener imágenes públicas
  const getPublicImages = useCallback(async (filters?: ImageFilters) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useImages] getPublicImages - Obteniendo imágenes públicas');
      const publicFilters: ImageFilters = {
        ...filters,
        isPublic: true,
        isActive: true
      };
      const results = await imagesService.getAllImages(publicFilters);
      console.log('[useImages] getPublicImages - Resultados:', results.length);
      setImages(results);
    } catch (err: any) {
      setError(err.message || 'Error al obtener imágenes públicas');
      console.error('Error al obtener imágenes públicas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar imágenes expiradas
  const cleanupExpiredImages = useCallback(async () => {
    setError(null);
    try {
      console.log('[useImages] cleanupExpiredImages - Iniciando limpieza');
      const result = await imagesService.cleanupExpiredImages();
      console.log('[useImages] cleanupExpiredImages - Limpieza completada:', result);
      
      // Recargar imágenes y estadísticas
      await loadImages();
      await loadStats();
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al limpiar imágenes expiradas');
      console.error('Error al limpiar imágenes expiradas:', err);
      throw err;
    }
  }, [loadImages, loadStats]);

  // Obtener URL de una imagen específica
  const getImageUrl = useCallback(async (key: string): Promise<string> => {
    try {
      return await imagesService.getImageUrl(key);
    } catch (err: any) {
      console.error('Error al obtener URL de imagen:', err);
      throw err;
    }
  }, []);

  // Obtener URL firmada de una imagen
  const getImagePresignedUrl = useCallback(async (imageId: string, expiresIn?: number): Promise<string | null> => {
    try {
      console.log('[useImages] getImagePresignedUrl - Obteniendo URL firmada para:', imageId);
      const url = await imagesService.getImagePresignedUrl(imageId, expiresIn);
      console.log('[useImages] getImagePresignedUrl - URL obtenida:', url ? 'Sí' : 'No');
      return url;
    } catch (err: any) {
      console.error('Error al obtener URL firmada:', err);
      return null;
    }
  }, []);

  // Validar archivo
  const validateFile = useCallback(async (file: File) => {
    try {
      console.log('[useImages] validateFile - Validando archivo:', file.name);
      const result = await imagesService.validateFile(file);
      console.log('[useImages] validateFile - Resultado:', result);
      return result;
    } catch (err: any) {
      console.error('Error al validar archivo:', err);
      throw err;
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('[useImages] useEffect - Cargando datos iniciales');
    loadImages();
    loadStats();
  }, []); // Solo se ejecuta una vez al montar el componente

  return {
    images,
    loading,
    error,
    uploading,
    stats,
    statsLoading,
    loadImages,
    uploadImage,
    updateImage,
    deleteImage,
    searchImages,
    getImagesByCategory,
    getPublicImages,
    cleanupExpiredImages,
    getImageUrl,
    getImagePresignedUrl,
    validateFile
  };
}; 