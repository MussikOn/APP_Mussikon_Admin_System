import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Reply as ReplyIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import type { Conversation, Message } from '../../../services/chatService';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  conversation: Conversation;
  loading: boolean;
  hasMoreMessages: boolean;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onEditMessage: (messageId: string, content: string) => Promise<Message | null>;
  onLoadMoreMessages: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,

  loading,
  hasMoreMessages,
  onDeleteMessage,
  onEditMessage,
  onLoadMoreMessages
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const currentUserEmail = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!).userEmail 
    : '';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, message: Message) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async () => {
    if (selectedMessage) {
      await onDeleteMessage(selectedMessage.id);
    }
    handleMenuClose();
  };

  const handleEditMessage = async () => {
    if (selectedMessage) {
      setEditingMessageId(selectedMessage.id);
    }
    handleMenuClose();
  };

  const handleSaveEdit = async (content: string) => {
    if (editingMessageId) {
      await onEditMessage(editingMessageId, content);
      setEditingMessageId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleDownloadFile = (message: Message) => {
    if (message.fileUrl) {
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.fileName || 'archivo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading && messages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        height="200px"
        color="text.secondary"
      >
        <Typography variant="h6" gutterBottom>
          No hay mensajes
        </Typography>
        <Typography variant="body2">
          Envía el primer mensaje para comenzar la conversación
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      <List sx={{ p: 0 }}>
        {/* Botón para cargar más mensajes */}
        {hasMoreMessages && (
          <Box display="flex" justifyContent="center" p={2}>
            <IconButton
              onClick={onLoadMoreMessages}
              disabled={loading}
              size="small"
            >
              {loading ? <CircularProgress size={20} /> : <Typography variant="caption">Cargar más</Typography>}
            </IconButton>
          </Box>
        )}

        {/* Mensajes agrupados por fecha */}
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            {/* Separador de fecha */}
            <Box display="flex" justifyContent="center" my={2}>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: 'background.paper',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  color: 'text.secondary'
                }}
              >
                {date}
              </Typography>
            </Box>

            {/* Mensajes del día */}
            {dateMessages.map((message, index) => {
              const isOwnMessage = message.senderEmail === currentUserEmail;
              const showAvatar = !isOwnMessage && (
                index === 0 || 
                dateMessages[index - 1]?.senderEmail !== message.senderEmail
              );

              return (
                <ListItem
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    px: 2,
                    py: 0.5
                  }}
                >
                  {/* Avatar */}
                  {showAvatar && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: isOwnMessage ? 0 : 1,
                        ml: isOwnMessage ? 1 : 0,
                        backgroundColor: theme.palette.secondary.main
                      }}
                    >
                      {message.senderName.charAt(0).toUpperCase()}
                    </Avatar>
                  )}

                  {/* Espacio para alineación cuando no hay avatar */}
                  {!showAvatar && !isOwnMessage && (
                    <Box sx={{ width: 40 }} />
                  )}

                  {/* Burbuja de mensaje */}
                  <Box sx={{ flex: 1, maxWidth: '70%' }}>
                    <MessageBubble
                      message={message}
                      isOwnMessage={isOwnMessage}
                      isEditing={editingMessageId === message.id}
                      onEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onMenuOpen={(e) => handleMenuOpen(e, message)}
                      onDownload={() => handleDownloadFile(message)}
                    />
                  </Box>
                </ListItem>
              );
            })}
          </React.Fragment>
        ))}
      </List>

      {/* Menú de opciones de mensaje */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 150 }
        }}
      >
        {selectedMessage?.messageType === 'file' && (
          <MenuItem onClick={() => {
            handleDownloadFile(selectedMessage);
            handleMenuClose();
          }}>
            <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
            Descargar
          </MenuItem>
        )}
        
        <MenuItem onClick={handleEditMessage}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ReplyIcon sx={{ mr: 1 }} fontSize="small" />
          Responder
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessageList; 