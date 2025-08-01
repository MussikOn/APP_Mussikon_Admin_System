import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Rating,
  Divider,
  Badge
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Verified,
  Block,
  LocationOn,
  Star
} from '@mui/icons-material';
import type { Musician } from '../types/musician';

interface MusicianCardProps {
  musician: Musician;
  onEdit: (musician: Musician) => void;
  onDelete: (id: string) => void;
  onView: (musician: Musician) => void;
  onVerify: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  loading?: boolean;
}

const MusicianCard: React.FC<MusicianCardProps> = ({
  musician,
  onEdit,
  onDelete,
  onView,
  onVerify,
  onToggleStatus,
  loading = false
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'guitarra':
        return '🎸';
      case 'piano':
        return '🎹';
      case 'bajo':
        return '🎸';
      case 'bateria':
        return '🥁';
      case 'saxofon':
        return '🎷';
      case 'trompeta':
        return '🎺';
      case 'violin':
        return '🎻';
      case 'canto':
        return '🎤';
      case 'teclado':
        return '🎹';
      case 'flauta':
        return '🎼';
      default:
        return '🎵';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 255, 247, 0.2)',
          border: '1px solid rgba(0, 255, 247, 0.3)'
        }
      }}
    >
      {/* Header con imagen y estado */}
      <Box sx={{ position: 'relative', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: musician.isVerified ? '#4caf50' : '#ff9800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white'
                }}
              >
                {musician.isVerified ? (
                  <Verified sx={{ fontSize: 10, color: 'white' }} />
                ) : (
                  <Star sx={{ fontSize: 10, color: 'white' }} />
                )}
              </Box>
            }
          >
            <Avatar
              src={musician.profileImage}
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {musician.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#00fff7',
                textShadow: '0 0 10px rgba(0, 255, 247, 0.5)',
                fontSize: '1.1rem'
              }}
            >
              {musician.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: '#b0b8c1' }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.8rem' }}>
                {musician.location.city}, {musician.location.state}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Estado y rating */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip
            label={getStatusText(musician.isActive)}
            color={getStatusColor(musician.isActive) as any}
            size="small"
            icon={musician.isActive ? <Verified /> : <Block />}
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating
              value={musician.averageRating}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#ffd700'
                }
              }}
            />
            <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.8rem' }}>
              ({musician.totalReviews})
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Contenido principal */}
      <CardContent sx={{ flex: 1, p: 2 }}>
        {/* Bio */}
        {musician.bio && (
          <Typography
            variant="body2"
            sx={{
              color: '#b0b8c1',
              mb: 2,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {musician.bio}
          </Typography>
        )}

        {/* Instrumentos principales */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#00fff7', fontWeight: 600, mb: 1, display: 'block' }}>
            Instrumentos Principales
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {musician.instruments
              .filter(instrument => instrument.isPrimary)
              .slice(0, 3)
              .map((instrument, index) => (
                <Chip
                  key={index}
                  label={`${getInstrumentIcon(instrument.name)} ${instrument.name}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(0, 255, 247, 0.3)',
                    color: '#00fff7',
                    fontSize: '0.7rem',
                    '&:hover': {
                      borderColor: '#00fff7',
                      backgroundColor: 'rgba(0, 255, 247, 0.1)'
                    }
                  }}
                />
              ))}
          </Box>
        </Box>

        {/* Géneros */}
        {musician.genres.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#00fff7', fontWeight: 600, mb: 1, display: 'block' }}>
              Géneros
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {musician.genres.slice(0, 3).map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    fontSize: '0.7rem',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 136, 0.3)'
                    }
                  }}
                />
              ))}
              {musician.genres.length > 3 && (
                <Chip
                  label={`+${musician.genres.length - 3}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#b0b8c1',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Información adicional */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#b0b8c1', display: 'block' }}>
              Experiencia
            </Typography>
            <Typography variant="body2" sx={{ color: '#00fff7', fontWeight: 600 }}>
              {musician.experience} años
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: '#b0b8c1', display: 'block' }}>
              Tarifa por hora
            </Typography>
            <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
              {formatCurrency(musician.hourlyRate)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Acciones */}
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={() => onView(musician)}
              disabled={loading}
              sx={{
                color: '#00fff7',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 247, 0.1)'
                }
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => onEdit(musician)}
              disabled={loading}
              sx={{
                color: '#00ff88',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.1)'
                }
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {!musician.isVerified && (
            <Tooltip title="Verificar músico">
              <IconButton
                size="small"
                onClick={() => onVerify(musician._id)}
                disabled={loading}
                sx={{
                  color: '#4caf50',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                  }
                }}
              >
                <Verified />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={musician.isActive ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              onClick={() => onToggleStatus(musician._id, !musician.isActive)}
              disabled={loading}
              sx={{
                color: musician.isActive ? '#ff9800' : '#4caf50',
                '&:hover': {
                  backgroundColor: musician.isActive 
                    ? 'rgba(255, 152, 0, 0.1)' 
                    : 'rgba(76, 175, 80, 0.1)'
                }
              }}
            >
              {musician.isActive ? <Block /> : <Verified />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => onDelete(musician._id)}
              disabled={loading}
              sx={{
                color: '#ff4444',
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.1)'
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

export default MusicianCard; 