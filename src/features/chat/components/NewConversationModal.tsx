import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { chatService } from '../../../services/chatService';

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onCreateConversation: (participants: string[], isGroup?: boolean, groupName?: string) => Promise<void>;
  onCreateGroup: (participants: string[], groupName: string, groupAvatar?: string) => Promise<void>;
}

interface User {
  email: string;
  name: string;
  lastName: string;
  online: boolean;
  lastSeen?: string;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  open,
  onClose,
  onCreateConversation,
  onCreateGroup
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios disponibles
  useEffect(() => {
    if (open) {
      loadAvailableUsers();
    }
  }, [open, searchQuery]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      const users = await chatService.getAvailableUsers(searchQuery);
      setAvailableUsers(users);
    } catch (error) {
      setError('Error al cargar usuarios disponibles');
      console.error('Error loading available users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      setError('Selecciona al menos un usuario');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (activeTab === 0) {
        // Conversación individual
        await onCreateConversation(selectedUsers.map(u => u.email));
      } else {
        // Grupo
        if (!groupName.trim()) {
          setError('El nombre del grupo es requerido');
          return;
        }
        await onCreateGroup(selectedUsers.map(u => u.email), groupName.trim());
      }

      handleClose();
    } catch (error) {
      setError('Error al crear la conversación');
      console.error('Error creating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab(0);
    setSearchQuery('');
    setSelectedUsers([]);
    setGroupName('');
    setError(null);
    onClose();
  };

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find(u => u.email === user.email)) {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleUserRemove = (userEmail: string) => {
    setSelectedUsers(prev => prev.filter(u => u.email !== userEmail));
  };

  const filteredUsers = Array.isArray(availableUsers) ? availableUsers.filter(
    user => !selectedUsers.find(selected => selected.email === user.email)
  ) : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" gutterBottom component="div">
          Nueva conversación
        </Typography>
        
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mt: 1 }}
        >
          <Tab
            icon={<PersonIcon />}
            label="Individual"
            iconPosition="start"
          />
          <Tab
            icon={<GroupIcon />}
            label="Grupo"
            iconPosition="start"
          />
        </Tabs>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Nombre del grupo (solo para grupos) */}
        {activeTab === 1 && (
          <TextField
            fullWidth
            label="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ingresa el nombre del grupo"
            sx={{ mb: 2 }}
            disabled={loading}
          />
        )}

        {/* Búsqueda de usuarios */}
        <TextField
          fullWidth
          label="Buscar usuarios"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca por nombre o email..."
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        {/* Usuarios seleccionados */}
        {selectedUsers.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Usuarios seleccionados ({selectedUsers.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedUsers.map(user => (
                <Chip
                  key={user.email}
                  avatar={
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  label={`${user.name} ${user.lastName}`}
                  onDelete={() => handleUserRemove(user.email)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Lista de usuarios disponibles */}
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box textAlign="center" p={2} color="text.secondary">
              <Typography variant="body2">
                {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
              </Typography>
            </Box>
          ) : (
            filteredUsers.map(user => (
              <Box
                key={user.email}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => handleUserSelect(user)}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    backgroundColor: user.online 
                      ? theme.palette.success.main 
                      : theme.palette.grey[400]
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    {user.name} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                
                <Chip
                  label={user.online ? 'En línea' : 'Desconectado'}
                  size="small"
                  color={user.online ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreateConversation}
          variant="contained"
          disabled={loading || selectedUsers.length === 0 || (activeTab === 1 && !groupName.trim())}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            activeTab === 0 ? 'Crear conversación' : 'Crear grupo'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewConversationModal; 