import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  AttachFile as AttachFileIcon,
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import type { Message } from '../../../services/chatService';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isEditing: boolean;
  onEdit: (content: string) => Promise<void>;
  onCancelEdit: () => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onDownload: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  isEditing,
  onEdit,
  onCancelEdit,
  onMenuOpen,
  onDownload
}) => {
  const theme = useTheme();
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      setIsSaving(true);
      try {
        await onEdit(editContent);
      } finally {
        setIsSaving(false);
      }
    } else {
      onCancelEdit();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      onCancelEdit();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'image':
        return (
          <Box>
            <img
              src={message.fileUrl}
              alt="Imagen"
              style={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 8,
                cursor: 'pointer'
              }}
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            {message.content && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.content}
              </Typography>
            )}
          </Box>
        );

      case 'file':
        return (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={onDownload}
            >
              <AttachFileIcon color="action" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {message.fileName || 'Archivo'}
                </Typography>
                {message.fileSize && (
                  <Typography variant="caption" color="text.secondary">
                    {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                )}
              </Box>
              <DownloadIcon fontSize="small" color="action" />
            </Paper>
            {message.content && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.content}
              </Typography>
            )}
          </Box>
        );

      case 'audio':
        return (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PlayArrowIcon color="primary" />
              <Typography variant="body2">
                Mensaje de voz
              </Typography>
            </Paper>
            {message.content && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.content}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        );
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ width: '100%' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper'
            }
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <IconButton
            size="small"
            onClick={handleSaveEdit}
            disabled={isSaving}
            color="primary"
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onCancelEdit}
            disabled={isSaving}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        maxWidth: '100%'
      }}
    >
      {/* Burbuja de mensaje */}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: '100%',
          backgroundColor: isOwnMessage 
            ? theme.palette.primary.main 
            : theme.palette.background.paper,
          color: isOwnMessage 
            ? theme.palette.primary.contrastText 
            : theme.palette.text.primary,
          borderRadius: 2,
          borderTopLeftRadius: isOwnMessage ? 2 : 0.5,
          borderTopRightRadius: isOwnMessage ? 0.5 : 2,
          position: 'relative',
          '&:hover .message-actions': {
            opacity: 1
          }
        }}
      >
        {/* Contenido del mensaje */}
        {renderMessageContent()}

        {/* Información del mensaje */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 0.5,
            gap: 1
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isOwnMessage 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'text.secondary',
              fontSize: '0.75rem'
            }}
          >
            {formatTime(message.createdAt)}
            {message.updatedAt !== message.createdAt && ' (editado)'}
          </Typography>

          {/* Indicador de lectura */}
          {isOwnMessage && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem'
                }}
              >
                {message.isRead ? '✓✓' : '✓'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Acciones del mensaje */}
        <Box
          className="message-actions"
          sx={{
            position: 'absolute',
            top: -8,
            right: isOwnMessage ? -8 : 'auto',
            left: isOwnMessage ? 'auto' : -8,
            opacity: 0,
            transition: 'opacity 0.2s',
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton
            size="small"
            onClick={onMenuOpen}
            sx={{ p: 0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Nombre del remitente (solo para mensajes de otros) */}
      {!isOwnMessage && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          {message.senderName}
        </Typography>
      )}
    </Box>
  );
};

export default MessageBubble; 