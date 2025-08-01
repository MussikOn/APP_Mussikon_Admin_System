import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import type { Conversation } from '../../../services/chatService';

interface ChatHeaderProps {
  onNewConversation: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  selectedConversation: Conversation | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewConversation,
  onSearch,
  searchQuery,
  selectedConversation
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
    setShowSearch(false);
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || 'Grupo sin nombre';
    }
    
    // Verificar que la conversación tenga participantes
    if (!conversation.participants || !Array.isArray(conversation.participants)) {
      return 'Conversación sin participantes';
    }
    
    // Para conversaciones individuales, mostrar el nombre del otro participante
    const currentUserEmail = localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user')!).userEmail 
      : '';
    
    const otherParticipant = conversation.participants.find(p => p !== currentUserEmail);
    const participantIndex = conversation.participants.indexOf(otherParticipant || '');
    const participantName = conversation.participantNames?.[participantIndex] || otherParticipant || 'Usuario';
    
    return participantName;
  };

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return `${conversation.participants?.length || 0} participantes`;
    }
    
    // Para conversaciones individuales, mostrar estado online
    return 'En línea'; // Esto se puede mejorar con WebSocket
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {isMobile && selectedConversation && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => window.history.back()}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {showSearch ? (
          // Barra de búsqueda
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.default'
                }
              }}
            />
          </Box>
        ) : selectedConversation && selectedConversation.participants ? (
          // Header de conversación seleccionada
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={selectedConversation.groupAvatar}
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2,
                backgroundColor: selectedConversation.isGroup 
                  ? theme.palette.primary.main 
                  : theme.palette.secondary.main
              }}
            >
              {selectedConversation.isGroup 
                ? selectedConversation.groupName?.charAt(0).toUpperCase()
                : getConversationTitle(selectedConversation)?.charAt(0).toUpperCase()
              }
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {getConversationTitle(selectedConversation)}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {getConversationSubtitle(selectedConversation)}
              </Typography>
            </Box>

            {selectedConversation.unreadCount > 0 && (
              <Badge 
                badgeContent={selectedConversation.unreadCount} 
                color="error"
                sx={{ mr: 1 }}
              />
            )}

            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
          </Box>
        ) : (
          // Header principal
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Chat
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => setShowSearch(true)}
              >
                <SearchIcon />
              </IconButton>
              
              <IconButton
                color="inherit"
                onClick={onNewConversation}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader; 