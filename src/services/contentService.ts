import { apiService } from './api';
// import { API_CONFIG } from '../config/apiConfig';

// Interfaces para contenido
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  status?: 'draft' | 'published';
  metadata?: Record<string, any>;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: 'all' | 'users' | 'musicians' | 'admins';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: 'all' | 'users' | 'musicians' | 'admins';
  startDate: string;
  endDate?: string;
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'notification' | 'email' | 'push' | 'sms';
  targetUsers: string[];
  filters?: {
    roles?: string[];
    locations?: string[];
    instruments?: string[];
    status?: string[];
  };
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBroadcastData {
  title: string;
  message: string;
  type: 'notification' | 'email' | 'push' | 'sms';
  targetUsers?: string[];
  filters?: {
    roles?: string[];
    locations?: string[];
    instruments?: string[];
    status?: string[];
  };
  scheduledAt?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'email' | 'notification' | 'sms' | 'post';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateData {
  name: string;
  type: 'email' | 'notification' | 'sms' | 'post';
  subject?: string;
  content: string;
  variables?: string[];
}

export interface ContentStats {
  posts: {
    total: number;
    published: number;
    draft: number;
    byCategory: Record<string, number>;
  };
  announcements: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };
  broadcasts: {
    total: number;
    sent: number;
    failed: number;
    byType: Record<string, number>;
  };
  templates: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };
  period: string;
}

// Servicio de contenido
export const contentService = {
  /**
   * Obtener posts
   */
  async getPosts(filters: {
    status?: string;
    category?: string;
    author?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.author) {
        params.append('author', filters.author);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/content/posts?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo posts:', error);
      throw error;
    }
  },

  /**
   * Obtener post por ID
   */
  async getPostById(postId: string): Promise<Post> {
    try {
      const response = await apiService.get(
        `/admin/content/posts/${postId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo post por ID:', error);
      throw error;
    }
  },

  /**
   * Crear post
   */
  async createPost(data: CreatePostData): Promise<Post> {
    try {
      const response = await apiService.post(
        '/admin/content/posts',
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando post:', error);
      throw error;
    }
  },

  /**
   * Actualizar post
   */
  async updatePost(postId: string, data: Partial<CreatePostData>): Promise<Post> {
    try {
      const response = await apiService.put(
        `/admin/content/posts/${postId}`,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error actualizando post:', error);
      throw error;
    }
  },

  /**
   * Eliminar post
   */
  async deletePost(postId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        `/admin/content/posts/${postId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando post:', error);
      throw error;
    }
  },

  /**
   * Publicar post
   */
  async publishPost(postId: string): Promise<Post> {
    try {
      const response = await apiService.put(
        `/admin/content/posts/${postId}/publish`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error publicando post:', error);
      throw error;
    }
  },

  /**
   * Obtener anuncios
   */
  async getAnnouncements(filters: {
    isActive?: boolean;
    type?: string;
    priority?: string;
    targetAudience?: string;
  } = {}): Promise<Announcement[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.priority) {
        params.append('priority', filters.priority);
      }
      
      if (filters.targetAudience) {
        params.append('targetAudience', filters.targetAudience);
      }

      const response = await apiService.get(
        `/admin/content/announcements?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo anuncios:', error);
      throw error;
    }
  },

  /**
   * Crear anuncio
   */
  async createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
    try {
      const response = await apiService.post(
        '/admin/content/announcements',
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando anuncio:', error);
      throw error;
    }
  },

  /**
   * Actualizar anuncio
   */
  async updateAnnouncement(announcementId: string, data: Partial<CreateAnnouncementData>): Promise<Announcement> {
    try {
      const response = await apiService.put(
        `/admin/content/announcements/${announcementId}`,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error actualizando anuncio:', error);
      throw error;
    }
  },

  /**
   * Eliminar anuncio
   */
  async deleteAnnouncement(announcementId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        `/admin/content/announcements/${announcementId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando anuncio:', error);
      throw error;
    }
  },

  /**
   * Obtener broadcasts
   */
  async getBroadcasts(filters: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    broadcasts: Broadcast[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const response = await apiService.get(
        `/admin/content/broadcasts?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo broadcasts:', error);
      throw error;
    }
  },

  /**
   * Crear broadcast
   */
  async createBroadcast(data: CreateBroadcastData): Promise<Broadcast> {
    try {
      const response = await apiService.post(
        '/admin/content/broadcasts',
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando broadcast:', error);
      throw error;
    }
  },

  /**
   * Enviar broadcast inmediatamente
   */
  async sendBroadcast(broadcastId: string): Promise<Broadcast> {
    try {
      const response = await apiService.post(
        `/admin/content/broadcasts/${broadcastId}/send`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error enviando broadcast:', error);
      throw error;
    }
  },

  /**
   * Cancelar broadcast programado
   */
  async cancelBroadcast(broadcastId: string): Promise<Broadcast> {
    try {
      const response = await apiService.put(
        `/admin/content/broadcasts/${broadcastId}/cancel`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error cancelando broadcast:', error);
      throw error;
    }
  },

  /**
   * Obtener templates
   */
  async getTemplates(filters: {
    type?: string;
    isActive?: boolean;
  } = {}): Promise<ContentTemplate[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }

      const response = await apiService.get(
        `/admin/content/templates?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo templates:', error);
      throw error;
    }
  },

  /**
   * Crear template
   */
  async createTemplate(data: CreateTemplateData): Promise<ContentTemplate> {
    try {
      const response = await apiService.post(
        '/admin/content/templates',
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error creando template:', error);
      throw error;
    }
  },

  /**
   * Actualizar template
   */
  async updateTemplate(templateId: string, data: Partial<CreateTemplateData>): Promise<ContentTemplate> {
    try {
      const response = await apiService.put(
        `/admin/content/templates/${templateId}`,
        data
      );

      return response.data.data;
    } catch (error) {
      console.error('Error actualizando template:', error);
      throw error;
    }
  },

  /**
   * Eliminar template
   */
  async deleteTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiService.delete(
        `/admin/content/templates/${templateId}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error eliminando template:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de contenido
   */
  async getContentStats(filters: {
    period?: 'day' | 'week' | 'month';
  } = {}): Promise<ContentStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }

      const response = await apiService.get(
        `/admin/content/stats?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de contenido:', error);
      throw error;
    }
  },

  /**
   * Previsualizar template con variables
   */
  async previewTemplate(templateId: string, variables: Record<string, any>): Promise<{
    subject?: string;
    content: string;
  }> {
    try {
      const response = await apiService.post(
        `/admin/content/templates/${templateId}/preview`,
        { variables }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error previsualizando template:', error);
      throw error;
    }
  }
}; 