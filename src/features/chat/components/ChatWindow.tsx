import React, { useRef, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import type { Conversation, Message } from '../../../services/chatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  onSendMessage: (content: string, messageType?: 'text' | 'image' | 'file' | 'audio') => Promise<Message | null>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onEditMessage: (messageId: string, content: string) => Promise<Message | null>;
  onUploadFile: (file: File) => Promise<{ fileUrl: string; fileName: string; fileSize: number } | null>;
  onLoadMoreMessages: () => void;
  onClearError: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  loading,
  error,
  hasMoreMessages,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  onUploadFile,
  onLoadMoreMessages,
  onClearError
}) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll al final cuando se agregan nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, messageType: 'text' | 'image' | 'file' | 'audio' = 'text') => {
    await onSendMessage(content, messageType);
  };

  const handleUploadFile = async (file: File) => {
    const result = await onUploadFile(file);
    if (result) {
      // Enviar mensaje con archivo
      await onSendMessage(`Archivo: ${result.fileName}`, 'file');
    }
  };

  if (loading && messages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" onClose={onClearError}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Área de mensajes */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <MessageList
          messages={messages}
          conversation={conversation}
          loading={loading}
          hasMoreMessages={hasMoreMessages}
          onDeleteMessage={onDeleteMessage}
          onEditMessage={onEditMessage}
          onLoadMoreMessages={onLoadMoreMessages}
        />
        <div ref={messagesEndRef} />
      </Box>

      {/* Input de mensaje */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          disabled={loading}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow; 