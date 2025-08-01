import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Block as BlockIcon,
  Group as GroupIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import type { Conversation } from '../../../services/chatService';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
  onClearError: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  loading,
  error,
  onSelectConversation,
  onDeleteConversation,
  onClearError
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedConversationForMenu, setSelectedConversationForMenu] = React.useState<Conversation | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, conversation: Conversation) => {
    setMenuAnchor(event.currentTarget);
    setSelectedConversationForMenu(conversation);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedConversationForMenu(null);
  };

  const handleDeleteConversation = () => {
    if (selectedConversationForMenu) {
      onDeleteConversation(selectedConversationForMenu.id);
    }
    handleMenuClose();
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
    
    return conversation.participantNames?.[participantIndex] || otherParticipant || 'Usuario';
  };

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.lastMessage) {
      const sender = conversation.lastMessage.senderName;
      const content = conversation.lastMessage.content;
      const maxLength = 50;
      
      if (content.length > maxLength) {
        return `${sender}: ${content.substring(0, maxLength)}...`;
      }
      return `${sender}: ${content}`;
    }
    
    if (conversation.isGroup) {
      return `${conversation.participants?.length || 0} participantes`;
    }
    
    return 'Sin mensajes';
  };

  const getConversationTime = (conversation: Conversation) => {
    if (conversation.lastMessage) {
      const date = new Date(conversation.lastMessage.createdAt);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
      } else {
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      }
    }
    
    return '';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return (
        <Avatar
          src={conversation.groupAvatar}
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            width: 48,
            height: 48
          }}
        >
          <GroupIcon />
        </Avatar>
      );
    }
    
    // Para conversaciones individuales
    return (
      <Avatar
        sx={{ 
          backgroundColor: theme.palette.secondary.main,
          width: 48,
          height: 48
        }}
      >
        <PersonIcon />
      </Avatar>
    );
  };

  if (loading && (!conversations || conversations.length === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
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

  if (!conversations || conversations.length === 0) {
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
          No hay conversaciones
        </Typography>
        <Typography variant="body2">
          Inicia una nueva conversación para comenzar a chatear
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {conversations && conversations.map((conversation, index) => (
          <React.Fragment key={conversation.id}>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: selectedConversation?.id === conversation.id 
                  ? 'action.selected' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemButton
                onClick={() => onSelectConversation(conversation)}
                sx={{ py: 1.5 }}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={conversation.unreadCount}
                    color="error"
                    invisible={conversation.unreadCount === 0}
                  >
                    {getConversationAvatar(conversation)}
                  </Badge>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                          color: conversation.unreadCount > 0 ? 'text.primary' : 'text.primary'
                        }}
                        noWrap
                      >
                        {getConversationTitle(conversation)}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        {getConversationTime(conversation)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color={conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                      sx={{
                        fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {getConversationSubtitle(conversation)}
                    </Typography>
                  }
                />
                
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, conversation)}
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            </ListItem>
            
            {conversations && index < conversations.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Menú de opciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 150 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ArchiveIcon sx={{ mr: 1 }} fontSize="small" />
          Archivar
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon sx={{ mr: 1 }} fontSize="small" />
          Bloquear
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDeleteConversation} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConversationList; 