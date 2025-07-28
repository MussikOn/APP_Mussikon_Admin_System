import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Close,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Settings,
  Star,
  DeviceHub,
  Notifications,
  Language,
  Palette,
  Email
} from '@mui/icons-material';
import type { MobileUser } from '../types/mobileUser';

interface MobileUserDetailsProps {
  user: MobileUser | null;
  open: boolean;
  onClose: () => void;
  onEdit: (user: MobileUser) => void;
  onDelete: (id: string) => void;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
  loading?: boolean;
}

const MobileUserDetails: React.FC<MobileUserDetailsProps> = ({
  user,
  open,
  onClose,
  onEdit,
  onDelete,
  onBlock,
  onUnblock
}) => {
  if (!user) return null;

  const getStatusColor = (status: MobileUser['status']) => {
    switch (status) {
      case 'active':
        return '#00ff88';
      case 'blocked':
        return '#ff4444';
      case 'pending':
        return '#ffaa00';
      case 'inactive':
        return '#888888';
      default:
        return '#888888';
    }
  };

  const getRoleColor = (role: MobileUser['roll']) => {
    switch (role) {
      case 'musico':
        return '#ffd700';
      case 'eventCreator':
        return '#8a2be2';
      case 'usuario':
        return '#00fff7';
      case 'adminJunior':
        return '#ffaa00';
      case 'adminMidLevel':
        return '#00ff88';
      case 'adminSenior':
        return '#ff4444';
      case 'superAdmin':
        return '#ff0066';
      default:
        return '#888888';
    }
  };

  const getStatusIcon = (status: MobileUser['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: '#00ff88' }} />;
      case 'blocked':
        return <Block sx={{ color: '#ff4444' }} />;
      case 'pending':
        return <Star sx={{ color: '#ffaa00' }} />;
      case 'inactive':
        return <Settings sx={{ color: '#888888' }} />;
      default:
        return <Settings sx={{ color: '#888888' }} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastActivity = () => {
    // Since lastActivity doesn't exist in the type, we'll use updatedAt
    return formatDate(user.updatedAt);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 255, 247, 0.3)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(0, 255, 136, 0.1))',
        borderBottom: '1px solid rgba(0, 255, 247, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.profileImage}
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              color: '#000'
            }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
              {user.name} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              {user.userEmail}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#00fff7' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Información principal */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Información Personal
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.name} {user.lastName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.userEmail}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.phone || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Ubicación
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.location || 'No especificada'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                  Biografía
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {user.bio || 'Sin biografía'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Estado y Rol
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(user.status)}
                  <Chip
                    label={user.status === 'active' ? 'Activo' : 
                           user.status === 'blocked' ? 'Bloqueado' :
                           user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                    sx={{
                      background: getStatusColor(user.status),
                      color: '#000',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: getRoleColor(user.roll)
                  }} />
                  <Chip
                    label={user.roll === 'musico' ? 'Músico' :
                           user.roll === 'eventCreator' ? 'Creador de Eventos' :
                           user.roll === 'usuario' ? 'Usuario' :
                           user.roll === 'adminJunior' ? 'Admin Junior' :
                           user.roll === 'adminMidLevel' ? 'Admin Mid-Level' :
                           user.roll === 'adminSenior' ? 'Admin Senior' :
                           user.roll === 'superAdmin' ? 'Super Admin' : user.roll}
                    sx={{
                      background: getRoleColor(user.roll),
                      color: '#000',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Información de músico */}
          {user.roll === 'musico' && (
            <Box>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Información de Músico
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Instrumentos
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {user.instruments?.map((instrument) => (
                      <Chip
                        key={instrument}
                        label={instrument}
                        size="small"
                        sx={{
                          background: 'rgba(255, 215, 0, 0.3)',
                          color: '#ffd700',
                          border: '1px solid rgba(255, 215, 0, 0.5)'
                        }}
                      />
                    )) || <Typography variant="body2" sx={{ color: '#888888' }}>No especificados</Typography>}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                    Experiencia
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {user.experience || 'No especificada'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Información del dispositivo */}
          <Box>
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Información del Dispositivo
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                  Última Actividad
                </Typography>
                                 <Typography variant="body1" sx={{ color: '#ffffff' }}>
                   {formatLastActivity()}
                 </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>
                  Fecha de Registro
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Preferencias */}
          <Box>
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Preferencias
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications sx={{ color: '#00fff7', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Notificaciones: {user.preferences?.notifications ? 'Activadas' : 'Desactivadas'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#00ff88', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Email: {user.preferences?.emailNotifications ? 'Activado' : 'Desactivado'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeviceHub sx={{ color: '#ffd700', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Push: {user.preferences?.pushNotifications ? 'Activadas' : 'Desactivadas'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Language sx={{ color: '#00fff7', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Idioma: {user.preferences?.language === 'es' ? 'Español' : 'English'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette sx={{ color: '#00ff88', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Tema: {user.preferences?.theme === 'light' ? 'Claro' : 'Oscuro'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Estadísticas */}
          <Box>
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Estadísticas
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Paper sx={{
                p: 2,
                background: 'rgba(0, 255, 247, 0.1)',
                border: '1px solid rgba(0, 255, 247, 0.3)',
                borderRadius: '8px'
              }}>
                                 <Typography variant="h4" sx={{ color: '#00fff7', fontWeight: 700 }}>
                   {user.stats?.totalRequests || 0}
                 </Typography>
                 <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                   Total Solicitudes
                 </Typography>
               </Paper>

               <Paper sx={{
                 p: 2,
                 background: 'rgba(0, 255, 136, 0.1)',
                 border: '1px solid rgba(0, 255, 136, 0.3)',
                 borderRadius: '8px'
               }}>
                 <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                   {user.stats?.completedRequests || 0}
                 </Typography>
                 <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                   Solicitudes Completadas
                 </Typography>
               </Paper>

               <Paper sx={{
                 p: 2,
                 background: 'rgba(255, 215, 0, 0.1)',
                 border: '1px solid rgba(255, 215, 0, 0.3)',
                 borderRadius: '8px'
               }}>
                 <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700 }}>
                   {user.stats?.rating || 0}
                 </Typography>
                 <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                   Calificación
                 </Typography>
               </Paper>

              <Paper sx={{
                p: 2,
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '8px'
              }}>
                                 <Typography variant="h4" sx={{ color: '#ff4444', fontWeight: 700 }}>
                   {user.stats?.reviews || 0}
                 </Typography>
                 <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                   Reseñas
                 </Typography>
               </Paper>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        background: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(0, 255, 247, 0.2)'
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#b0b8c1',
            '&:hover': {
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Cerrar
        </Button>
        <Button
          onClick={() => onEdit(user)}
          variant="outlined"
          startIcon={<Edit />}
          sx={{
            color: '#00fff7',
            borderColor: '#00fff7',
            '&:hover': {
              borderColor: '#00ff88',
              color: '#00ff88'
            }
          }}
        >
          Editar
        </Button>
        {user.status === 'active' ? (
                      <Button
              onClick={() => user._id && onBlock(user._id)}
              variant="outlined"
              startIcon={<Block />}
              sx={{
                color: '#ffaa00',
                borderColor: '#ffaa00',
                '&:hover': {
                  borderColor: '#ff4444',
                  color: '#ff4444'
                }
              }}
            >
              Bloquear
            </Button>
        ) : (
                      <Button
              onClick={() => user._id && onUnblock(user._id)}
              variant="outlined"
              startIcon={<CheckCircle />}
              sx={{
                color: '#00ff88',
                borderColor: '#00ff88',
                '&:hover': {
                  borderColor: '#00fff7',
                  color: '#00fff7'
                }
              }}
            >
              Desbloquear
            </Button>
        )}
        <Button
          onClick={() => user._id && onDelete(user._id)}
          variant="outlined"
          startIcon={<Delete />}
          sx={{
            color: '#ff4444',
            borderColor: '#ff4444',
            '&:hover': {
              borderColor: '#ff0066',
              color: '#ff0066'
            }
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileUserDetails; 