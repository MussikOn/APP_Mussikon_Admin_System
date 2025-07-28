import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Box,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Phone,
  LocationOn,
  Block,
  CheckCircle,
  Warning,
  Visibility,
  Edit,
  Delete,
  MusicNote
} from '@mui/icons-material';
import type { MobileUser } from '../types/mobileUser';

interface MobileUserCardProps {
  user: MobileUser;
  onEdit: (user: MobileUser) => void;
  onDelete: (id: string) => void;
  onView: (user: MobileUser) => void;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
  loading?: boolean;
}

const MobileUserCard: React.FC<MobileUserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
  onBlock,
  onUnblock,
  loading = false
}) => {
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

  const getRoleLabel = (role: MobileUser['roll']) => {
    switch (role) {
      case 'musico':
        return 'MÚSICO';
      case 'eventCreator':
        return 'ORGANIZADOR';
      case 'usuario':
        return 'USUARIO';
      case 'adminJunior':
        return 'ADMIN JUNIOR';
      case 'adminMidLevel':
        return 'ADMIN MID';
      case 'adminSenior':
        return 'ADMIN SENIOR';
      case 'superAdmin':
        return 'SUPER ADMIN';
      default:
        return 'USUARIO';
    }
  };

  const getStatusIcon = (status: MobileUser['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: '#00ff88' }} />;
      case 'blocked':
        return <Block sx={{ color: '#ff4444' }} />;
      case 'pending':
        return <Warning sx={{ color: '#ffaa00' }} />;
      case 'inactive':
        return <Warning sx={{ color: '#888888' }} />;
      default:
        return <Warning sx={{ color: '#888888' }} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(0, 255, 247, 0.2)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 255, 247, 0.3)',
        borderColor: 'rgba(0, 255, 247, 0.4)'
      },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Indicador de estado */}
      <Box sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1
      }}>
        {getStatusIcon(user.status)}
      </Box>

      <CardContent sx={{ pb: 1 }}>
        {/* Header con avatar y información básica */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: getStatusColor(user.status),
                border: '2px solid #000'
              }} />
            }
          >
            <Avatar
              src={user.profileImage}
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {user.name.charAt(0)}{user.lastName.charAt(0)}
            </Avatar>
          </Badge>
          
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="h6" sx={{ 
              color: '#ffffff', 
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {user.name} {user.lastName}
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: '#b0b8c1',
              fontSize: '0.85rem'
            }}>
              {user.userEmail}
            </Typography>
          </Box>
        </Box>

        {/* Chips de rol y estado */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={getRoleLabel(user.roll)}
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${getRoleColor(user.roll)}, ${getRoleColor(user.roll)}80)`,
              color: '#000',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24
            }}
          />
          
          <Chip
            label={user.status.toUpperCase()}
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${getStatusColor(user.status)}, ${getStatusColor(user.status)}80)`,
              color: '#000',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24
            }}
          />
        </Box>

        {/* Información de contacto */}
        <Box sx={{ mb: 2 }}>
          {user.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ fontSize: 16, color: '#00fff7', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.85rem' }}>
                {user.phone}
              </Typography>
            </Box>
          )}
          
          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: '#00fff7', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.85rem' }}>
                {user.location}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Bio */}
        {user.bio && (
          <Typography variant="body2" sx={{ 
            color: '#b0b8c1', 
            mb: 2,
            fontSize: '0.85rem',
            lineHeight: 1.4
          }}>
            {user.bio.length > 80 ? `${user.bio.substring(0, 80)}...` : user.bio}
          </Typography>
        )}

        {/* Instrumentos (solo para músicos) */}
        {user.roll === 'musico' && user.instruments && user.instruments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MusicNote sx={{ fontSize: 16, color: '#ffd700', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.85rem' }}>
                Instrumentos:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {user.instruments.slice(0, 3).map((instrument, index) => (
                <Chip
                  key={index}
                  label={instrument}
                  size="small"
                  sx={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#ffd700',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              ))}
              {user.instruments.length > 3 && (
                <Chip
                  label={`+${user.instruments.length - 3}`}
                  size="small"
                  sx={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#ffd700',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Estadísticas */}
        {user.stats && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 1,
            mb: 2,
            p: 1,
            background: 'rgba(0, 255, 247, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 247, 0.2)'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00fff7', fontWeight: 700 }}>
                {user.stats.totalRequests}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b8c1', fontSize: '0.7rem' }}>
                Solicitudes
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {user.stats.completedRequests}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b8c1', fontSize: '0.7rem' }}>
                Completadas
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 700 }}>
                {user.stats.rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b8c1', fontSize: '0.7rem' }}>
                Rating
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffaa00', fontWeight: 700 }}>
                {user.stats.reviews}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b8c1', fontSize: '0.7rem' }}>
                Reseñas
              </Typography>
            </Box>
          </Box>
        )}

        {/* Información del dispositivo */}
        {user.deviceInfo && (
          <Box sx={{ 
            p: 1, 
            background: 'rgba(138, 43, 226, 0.05)', 
            borderRadius: '8px',
            border: '1px solid rgba(138, 43, 226, 0.2)',
            mb: 2
          }}>
            <Typography variant="caption" sx={{ color: '#8a2be2', fontSize: '0.7rem', fontWeight: 600 }}>
              {user.deviceInfo.platform.toUpperCase()} • {user.deviceInfo.version}
            </Typography>
          </Box>
        )}

        {/* Último login */}
        {user.lastLogin && (
          <Typography variant="caption" sx={{ 
            color: '#888888', 
            fontSize: '0.7rem',
            display: 'block',
            textAlign: 'center'
          }}>
            Último login: {formatDate(user.lastLogin)}
          </Typography>
        )}
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ 
        pt: 0, 
        pb: 2, 
        px: 2,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Ver detalles">
            <IconButton
              onClick={() => onView(user)}
              disabled={loading}
              sx={{
                color: '#00fff7',
                '&:hover': {
                  background: 'rgba(0, 255, 247, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar usuario">
            <IconButton
              onClick={() => onEdit(user)}
              disabled={loading}
              sx={{
                color: '#00ff88',
                '&:hover': {
                  background: 'rgba(0, 255, 136, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {user.status === 'active' ? (
            <Tooltip title="Bloquear usuario">
              <IconButton
                onClick={() => onBlock(user._id!)}
                disabled={loading}
                sx={{
                  color: '#ff4444',
                  '&:hover': {
                    background: 'rgba(255, 68, 68, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Block />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Desbloquear usuario">
              <IconButton
                onClick={() => onUnblock(user._id!)}
                disabled={loading}
                sx={{
                  color: '#00ff88',
                  '&:hover': {
                    background: 'rgba(0, 255, 136, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Eliminar usuario">
            <IconButton
              onClick={() => onDelete(user._id!)}
              disabled={loading}
              sx={{
                color: '#ff0066',
                '&:hover': {
                  background: 'rgba(255, 0, 102, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default MobileUserCard; 