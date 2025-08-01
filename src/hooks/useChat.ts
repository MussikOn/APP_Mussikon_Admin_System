import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, type Conversation, type Message, type ChatFilters } from '../services/chatService';
import { useAuth } from './useAuth';

interface UseChatReturn {
  // Estado de conversaciones
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  conversationsLoading: boolean;
  conversationsError: string | null;
  
  // Estado de mensajes
  messages: Message[];
  messagesLoading: boolean;
  messagesError: string | null;
  hasMoreMessages: boolean;
  

  
  // Funciones de conversaciones
  fetchConversations: (filters?: ChatFilters) => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  createConversation: (participants: string[], isGroup?: boolean, groupName?: string) => Promise<Conversation | null>;
  deleteConversation: (conversationId: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  
  // Funciones de mensajes
  fetchMessages: (conversationId: string, limit?: number, offset?: number) => Promise<void>;
  sendMessage: (content: string, messageType?: 'text' | 'image' | 'file' | 'audio') => Promise<Message | null>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<Message | null>;
  
  // Funciones de archivos
  uploadFile: (file: File) => Promise<{ fileUrl: string; fileName: string; fileSize: number } | null>;
  
  // Funciones de grupos
  createGroup: (participants: string[], groupName: string, groupAvatar?: string) => Promise<Conversation | null>;
  addParticipantsToGroup: (participants: string[]) => Promise<void>;
  removeParticipantsFromGroup: (participants: string[]) => Promise<void>;
  
  // Funciones de búsqueda
  searchMessages: (query: string) => Promise<Message[]>;
  searchConversations: (query: string) => Promise<void>;
  
  // Utilidades
  clearErrors: () => void;
  resetChat: () => void;
}

export const useChat = (): UseChatReturn => {
  const { user } = useAuth();
  
  // Estado de conversaciones
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  
  // Estado de mensajes
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  // Estado de chat

  
  // Refs para control
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  // ===== FUNCIONES DE CONVERSACIONES =====
  
  const fetchConversations = useCallback(async (filters?: ChatFilters) => {
    if (!user) return;
    
    setConversationsLoading(true);
    setConversationsError(null);
    
    try {
      const response = await chatService.getConversations(filters);
      console.log('🔍 Chat response:', response);
      console.log('🔍 Conversations:', response.conversations);
      setConversations(response.conversations || []);
    } catch (error) {
      setConversationsError(error instanceof Error ? error.message : 'Error al cargar conversaciones');
      console.error('Error fetching conversations:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, [user]);
  
  const selectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    setHasMoreMessages(true);
    
    // Marcar como leída
    if (conversation.unreadCount > 0) {
      markConversationAsRead(conversation.id);
    }
    
    // Cargar mensajes
    fetchMessages(conversation.id);
  }, []);
  
  const createConversation = useCallback(async (
    participants: string[], 
    isGroup = false, 
    groupName?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;
    
    try {
      const conversation = await chatService.createConversation({
        participants: [...participants, user.userEmail],
        isGroup,
        groupName
      });
      
      // Agregar a la lista de conversaciones
      setConversations(prev => [conversation, ...prev]);
      
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user]);
  
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await chatService.deleteConversation(conversationId);
      
      // Remover de la lista
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      // Si era la conversación seleccionada, limpiar
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, [selectedConversation]);
  
  const markConversationAsRead = useCallback(async (conversationId: string) => {
    try {
      await chatService.markConversationAsRead(conversationId);
      
      // Actualizar en la lista
      setConversations(prev => prev.map(c => 
        c.id === conversationId 
          ? { ...c, unreadCount: 0, lastMessage: c.lastMessage ? { ...c.lastMessage, isRead: true } : undefined }
          : c
      ));
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, []);
  
  // ===== FUNCIONES DE MENSAJES =====
  
  const fetchMessages = useCallback(async (conversationId: string, limit = 50, offset = 0) => {
    if (!conversationId) return;
    
    setMessagesLoading(true);
    setMessagesError(null);
    
    try {
      const response = await chatService.getMessages(conversationId, limit, offset);
      
      if (offset === 0) {
        // Primera carga
        setMessages(response.messages);
      } else {
        // Cargar más mensajes (paginación)
        setMessages(prev => [...response.messages, ...prev]);
      }
      
      setHasMoreMessages(response.hasMore);
    } catch (error) {
      setMessagesError(error instanceof Error ? error.message : 'Error al cargar mensajes');
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  }, []);
  
  const sendMessage = useCallback(async (
    content: string, 
    messageType: 'text' | 'image' | 'file' | 'audio' = 'text'
  ): Promise<Message | null> => {
    if (!selectedConversation || !user || !content.trim()) return null;
    
    try {
      const message = await chatService.sendMessage({
        conversationId: selectedConversation.id,
        content: content.trim(),
        messageType
      });
      
      // Agregar mensaje a la lista
      setMessages(prev => [...prev, message]);
      
      // Actualizar última conversación
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
          : c
      ));
      
      // Scroll al final
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [selectedConversation, user]);
  
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!selectedConversation) return;
    
    try {
      await chatService.deleteMessage(selectedConversation.id, messageId);
      
      // Remover mensaje de la lista
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, [selectedConversation]);
  
  const editMessage = useCallback(async (messageId: string, content: string): Promise<Message | null> => {
    if (!selectedConversation || !content.trim()) return null;
    
    try {
      const message = await chatService.editMessage(selectedConversation.id, messageId, content);
      
      // Actualizar mensaje en la lista
      setMessages(prev => prev.map(m => m.id === messageId ? message : m));
      
      return message;
    } catch (error) {
      console.error('Error editing message:', error);
      return null;
    }
  }, [selectedConversation]);
  
  // ===== FUNCIONES DE ARCHIVOS =====
  
  const uploadFile = useCallback(async (file: File) => {
    if (!selectedConversation) return null;
    
    try {
      const result = await chatService.uploadFile(file, selectedConversation.id);
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }, [selectedConversation]);
  
  // ===== FUNCIONES DE GRUPOS =====
  
  const createGroup = useCallback(async (
    participants: string[], 
    groupName: string, 
    groupAvatar?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;
    
    try {
      const group = await chatService.createGroup({
        participants: [...participants, user.userEmail],
        groupName,
        groupAvatar
      });
      
      // Agregar a la lista de conversaciones
      setConversations(prev => [group, ...prev]);
      
      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }, [user]);
  
  const addParticipantsToGroup = useCallback(async (participants: string[]) => {
    if (!selectedConversation?.isGroup) return;
    
    try {
      await chatService.addParticipantsToGroup(selectedConversation.id, participants);
      
      // Actualizar conversación
      const updatedConversation = await chatService.getConversation(selectedConversation.id);
      setSelectedConversation(updatedConversation);
      
      // Actualizar en la lista
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id ? updatedConversation : c
      ));
    } catch (error) {
      console.error('Error adding participants to group:', error);
    }
  }, [selectedConversation]);
  
  const removeParticipantsFromGroup = useCallback(async (participants: string[]) => {
    if (!selectedConversation?.isGroup) return;
    
    try {
      await chatService.removeParticipantsFromGroup(selectedConversation.id, participants);
      
      // Actualizar conversación
      const updatedConversation = await chatService.getConversation(selectedConversation.id);
      setSelectedConversation(updatedConversation);
      
      // Actualizar en la lista
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id ? updatedConversation : c
      ));
    } catch (error) {
      console.error('Error removing participants from group:', error);
    }
  }, [selectedConversation]);
  
  // ===== FUNCIONES DE BÚSQUEDA =====
  
  const searchMessages = useCallback(async (query: string): Promise<Message[]> => {
    if (!query.trim()) return [];
    
    try {
      const results = await chatService.searchMessages(
        query, 
        selectedConversation?.id
      );
      return results;
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }, [selectedConversation]);
  
  const searchConversations = useCallback(async (query: string) => {
    await fetchConversations({ search: query });
  }, [fetchConversations]);
  
  // ===== UTILIDADES =====
  
  const clearErrors = useCallback(() => {
    setConversationsError(null);
    setMessagesError(null);
  }, []);
  
  const resetChat = useCallback(() => {
    setConversations([]);
    setSelectedConversation(null);
    setMessages([]);
    setConversationsError(null);
    setMessagesError(null);
    setHasMoreMessages(true);
  }, []);
  
  // ===== EFECTOS =====
  
  // Cargar conversaciones al montar
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);
  
  // Limpiar timeout de typing
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    // Estado de conversaciones
    conversations,
    selectedConversation,
    conversationsLoading,
    conversationsError,
    
    // Estado de mensajes
    messages,
    messagesLoading,
    messagesError,
    hasMoreMessages,
    
    // Estado de chat

    
    // Funciones de conversaciones
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    markConversationAsRead,
    
    // Funciones de mensajes
    fetchMessages,
    sendMessage,
    deleteMessage,
    editMessage,
    
    // Funciones de archivos
    uploadFile,
    
    // Funciones de grupos
    createGroup,
    addParticipantsToGroup,
    removeParticipantsFromGroup,
    
    // Funciones de búsqueda
    searchMessages,
    searchConversations,
    
    // Utilidades
    clearErrors,
    resetChat
  };
}; 