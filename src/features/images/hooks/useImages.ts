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
      const imagesWithUrls = await imagesService.getImagesWithUrls(filters);
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
      const result = await imagesService.uploadImage(file, category, metadata);
      
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
      const updatedImage = await imagesService.updateImage(imageId, updateData);
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
      await imagesService.deleteImage(imageId);
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
      const searchFilters: ImageFilters = {
        ...filters,
        search: searchTerm
      };
      const results = await imagesService.getAllImages(searchFilters);
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
      const categoryFilters: ImageFilters = {
        ...filters,
        category
      };
      const results = await imagesService.getAllImages(categoryFilters);
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
      const publicFilters: ImageFilters = {
        ...filters,
        isPublic: true,
        isActive: true
      };
      const results = await imagesService.getAllImages(publicFilters);
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
      const result = await imagesService.cleanupExpiredImages();
      
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

  // Cargar datos al montar el componente
  useEffect(() => {
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
    getImageUrl
  };
}; 