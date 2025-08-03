import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Mic as MicIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (content: string, messageType?: 'text' | 'image' | 'file' | 'audio') => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onUploadFile,
  disabled = false
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await onUploadFile(file);
    }
    // Limpiar el input
    event.target.value = '';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Verificar que sea una imagen
      if (file.type.startsWith('image/')) {
        await onUploadFile(file);
      }
    }
    // Limpiar el input
    event.target.value = '';
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleAttachImage = () => {
    imageInputRef.current?.click();
  };

  const isMessageEmpty = !message.trim();

  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        p: 1,
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider'
      }}
    >
      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Adjuntar imagen">
          <span>
            <IconButton
              size="small"
              onClick={handleAttachImage}
              disabled={disabled}
              color="primary"
            >
              <ImageIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Adjuntar archivo">
          <span>
            <IconButton
              size="small"
              onClick={handleAttachFile}
              disabled={disabled}
              color="primary"
            >
              <AttachFileIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Mensaje de voz">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              color="primary"
            >
              <MicIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Emoji">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              color="primary"
            >
              <EmojiIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Campo de texto */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Escribe un mensaje..."
        variant="outlined"
        size="small"
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.default',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }
        }}
      />

      {/* Botón de enviar */}
      <Tooltip title="Enviar mensaje">
        <span>
          <IconButton
            onClick={handleSendMessage}
            disabled={isMessageEmpty || isSending || disabled}
            color="primary"
            sx={{
              backgroundColor: isMessageEmpty || isSending || disabled 
                ? 'action.disabledBackground' 
                : theme.palette.primary.main,
              color: isMessageEmpty || isSending || disabled 
                ? 'action.disabled' 
                : theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: isMessageEmpty || isSending || disabled 
                  ? 'action.disabledBackground' 
                  : theme.palette.primary.dark
              }
            }}
          >
            {isSending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>

      {/* Inputs ocultos para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept="*/*"
      />

      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        accept="image/*"
      />
    </Paper>
  );
};

export default MessageInput; 