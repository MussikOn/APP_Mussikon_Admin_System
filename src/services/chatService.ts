import { apiService } from './api';

// Tipos para el sistema de chat
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array de emails de participantes
  participantNames: string[]; // Array de nombres de participantes
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationData {
  participants: string[]; // Array de emails de participantes
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'audio';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatFilters {
  search?: string;
  unreadOnly?: boolean;
  participant?: string;
  limit?: number;
  offset?: number;
}

export interface ChatResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  hasMore: boolean;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

// Servicio de chat
export const chatService = {
  // ===== CONVERSACIONES =====
  
  /**
   * Obtener lista de conversaciones del usuario
   */
  async getConversations(filters?: ChatFilters): Promise<ConversationListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.unreadOnly) params.append('unreadOnly', 'true');
      if (filters?.participant) params.append('participant', filters.participant);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await apiService.get(`/chat/conversations?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Return empty response if API is not implemented yet
      return {
        conversations: [],
        total: 0,
        hasMore: false
      };
    }
  },

  /**
   * Crear nueva conversación
   */
  async createConversation(data: CreateConversationData): Promise<Conversation> {
    try {
      const response = await apiService.post('/chat/conversations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Return mock conversation if API is not implemented yet
      return {
        id: `conv-${Date.now()}`,
        participants: data.participants,
        participantNames: data.participants.map(p => p.split('@')[0]),
        unreadCount: 0,
        isGroup: data.isGroup || false,
        groupName: data.groupName,
        groupAvatar: data.groupAvatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Obtener conversación por ID
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await apiService.get(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Eliminar conversación
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await apiService.delete(`/chat/conversations/${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  /**
   * Marcar conversación como leída
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await apiService.patch(`/chat/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  },

  // ===== MENSAJES =====

  /**
   * Obtener mensajes de una conversación
   */
  async getMessages(conversationId: string, limit?: number, offset?: number): Promise<MessageListResponse> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const response = await apiService.get(`/chat/conversations/${conversationId}/messages?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Enviar mensaje
   */
  async sendMessage(data: SendMessageData): Promise<Message> {
    try {
      const response = await apiService.post(`/chat/conversations/${data.conversationId}/messages`, {
        content: data.content,
        messageType: data.messageType || 'text',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // Return mock message if API is not implemented yet
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        id: `msg-${Date.now()}`,
        conversationId: data.conversationId,
        senderId: user.userEmail || 'unknown',
        senderName: user.name || 'Usuario',
        senderEmail: user.userEmail || 'unknown@example.com',
        content: data.content,
        messageType: data.messageType || 'text',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Eliminar mensaje
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      await apiService.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Editar mensaje
   */
  async editMessage(conversationId: string, messageId: string, content: string): Promise<Message> {
    try {
      const response = await apiService.put(`/chat/conversations/${conversationId}/messages/${messageId}`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  /**
   * Marcar mensaje como leído
   */
  async markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
    try {
      await apiService.patch(`/chat/conversations/${conversationId}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // ===== ARCHIVOS Y MEDIA =====

  /**
   * Subir archivo para mensaje
   */
  async uploadFile(file: File, conversationId: string): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await apiService.post('/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // ===== GRUPOS =====

  /**
   * Crear grupo de chat
   */
  async createGroup(data: { participants: string[]; groupName: string; groupAvatar?: string }): Promise<Conversation> {
    try {
      const response = await apiService.post('/chat/groups', data);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Agregar participantes al grupo
   */
  async addParticipantsToGroup(groupId: string, participants: string[]): Promise<void> {
    try {
      await apiService.post(`/chat/groups/${groupId}/participants`, { participants });
    } catch (error) {
      console.error('Error adding participants to group:', error);
      throw error;
    }
  },

  /**
   * Remover participantes del grupo
   */
  async removeParticipantsFromGroup(groupId: string, participants: string[]): Promise<void> {
    try {
      await apiService.delete(`/chat/groups/${groupId}/participants`, { data: { participants } });
    } catch (error) {
      console.error('Error removing participants from group:', error);
      throw error;
    }
  },

  /**
   * Actualizar información del grupo
   */
  async updateGroup(groupId: string, data: { groupName?: string; groupAvatar?: string }): Promise<Conversation> {
    try {
      const response = await apiService.put(`/chat/groups/${groupId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  // ===== ESTADÍSTICAS =====

  /**
   * Obtener estadísticas de chat
   */
  async getChatStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    unreadMessages: number;
    activeConversations: number;
  }> {
    try {
      const response = await apiService.get('/chat/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  },

  // ===== BÚSQUEDA =====

  /**
   * Buscar en mensajes
   */
  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    try {
      const params = new URLSearchParams({ query });
      if (conversationId) params.append('conversationId', conversationId);

      const response = await apiService.get(`/chat/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  },

  // ===== UTILIDADES =====

  /**
   * Verificar si el usuario está online
   */
  async checkUserOnline(userEmail: string): Promise<{ online: boolean; lastSeen?: string }> {
    try {
      const response = await apiService.get(`/chat/users/${userEmail}/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking user online status:', error);
      throw error;
    }
  },

  /**
   * Obtener usuarios disponibles para chat
   */
  async getAvailableUsers(search?: string): Promise<Array<{
    email: string;
    name: string;
    lastName: string;
    online: boolean;
    lastSeen?: string;
  }>> {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await apiService.get(`/chat/users/available${params}`);
      console.log('🔍 Backend response for available users:', response.data);
      return response.data.data; // Acceder a response.data.data para obtener el array de usuarios
    } catch (error) {
      console.error('Error fetching available users:', error);
      // Return mock data if API is not implemented yet
      return [
        {
          email: 'usuario1@example.com',
          name: 'Usuario',
          lastName: 'Uno',
          online: true
        },
        {
          email: 'usuario2@example.com',
          name: 'Usuario',
          lastName: 'Dos',
          online: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          email: 'usuario3@example.com',
          name: 'Usuario',
          lastName: 'Tres',
          online: true
        }
      ];
    }
  }
};

 