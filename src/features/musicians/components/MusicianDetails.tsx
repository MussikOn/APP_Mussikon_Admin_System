import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Rating,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Badge,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';

import {
  Close,
  Edit,
  Delete,
  Verified,
  Block,
  LocationOn,
  AccessTime,
  Star,
  MusicNote,
  Email,
  Phone,
  Language,
  Instagram,
  YouTube,
  School,
  Work
} from '@mui/icons-material';
import type { Musician } from '../types/musician';

interface MusicianDetailsProps {
  musician: Musician | null;
  open: boolean;
  onClose: () => void;
  onEdit: (musician: Musician) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  loading?: boolean;
}

const MusicianDetails: React.FC<MusicianDetailsProps> = ({
  musician,
  open,
  onClose,
  onEdit,
  onDelete,
  onVerify,
  onToggleStatus,
  loading = false
}) => {
  if (!musician) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'guitarra': return '🎸';
      case 'piano': return '🎹';
      case 'bajo': return '🎸';
      case 'bateria': return '🥁';
      case 'saxofon': return '🎷';
      case 'trompeta': return '🎺';
      case 'violin': return '🎻';
      case 'canto': return '🎤';
      case 'teclado': return '🎹';
      case 'flauta': return '🎼';
      default: return '🎵';
    }
  };



  const getLevelLabel = (level: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto'
    };
    return levels[level as keyof typeof levels] || level;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 247, 0.2)',
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#00fff7', 
        borderBottom: '1px solid rgba(0, 255, 247, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Detalles del Músico
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => onEdit(musician)}
              disabled={loading}
              sx={{ color: '#00ff88' }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar">
            <IconButton onClick={onClose} sx={{ color: '#00fff7' }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Header con información básica */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: musician.isVerified ? '#4caf50' : '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}
                  >
                    {musician.isVerified ? (
                      <Verified sx={{ fontSize: 12, color: 'white' }} />
                    ) : (
                      <Star sx={{ fontSize: 12, color: 'white' }} />
                    )}
                  </Box>
                }
              >
                <Avatar
                  src={musician.profileImage}
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {musician.name.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ 
                  color: '#00fff7', 
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(0, 255, 247, 0.5)',
                  mb: 1
                }}>
                  {musician.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#b0b8c1' }} />
                    <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                      {musician.location.city}, {musician.location.state}, {musician.location.country}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                      ({musician.totalReviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={musician.isActive ? 'Activo' : 'Inactivo'}
                    color={musician.isActive ? 'success' : 'error'}
                    size="small"
                    icon={musician.isActive ? <Verified /> : <Block />}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!musician.isVerified && (
                  <Tooltip title="Verificar músico">
                    <IconButton
                      onClick={() => onVerify(musician._id)}
                      disabled={loading}
                      sx={{ color: '#4caf50' }}
                    >
                      <Verified />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title={musician.isActive ? 'Desactivar' : 'Activar'}>
                  <IconButton
                    onClick={() => onToggleStatus(musician._id, !musician.isActive)}
                    disabled={loading}
                    sx={{ color: musician.isActive ? '#ff9800' : '#4caf50' }}
                  >
                    {musician.isActive ? <Block /> : <Verified />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => onDelete(musician._id)}
                    disabled={loading}
                    sx={{ color: '#ff4444' }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 247, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                  Información de Contacto
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email sx={{ color: '#00fff7' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={musician.email}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                        '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                      }}
                    />
                  </ListItem>
                  
                  {musician.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <Phone sx={{ color: '#00fff7' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Teléfono" 
                        secondary={musician.phone}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                          '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                        }}
                      />
                    </ListItem>
                  )}
                  
                  <ListItem>
                    <ListItemIcon>
                      <Work sx={{ color: '#00fff7' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Experiencia" 
                      secondary={`${musician.experience} años`}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                        '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime sx={{ color: '#00fff7' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tarifa por Hora" 
                      secondary={formatCurrency(musician.hourlyRate)}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                        '& .MuiListItemText-secondary': { color: '#00ff88', fontWeight: 600 }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Redes sociales */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 247, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                  Redes Sociales
                </Typography>
                
                <List dense>
                  {musician.socialMedia.instagram && (
                    <ListItem>
                      <ListItemIcon>
                        <Instagram sx={{ color: '#e4405f' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Instagram" 
                        secondary={musician.socialMedia.instagram}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                          '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                        }}
                      />
                    </ListItem>
                  )}
                  
                  {musician.socialMedia.youtube && (
                    <ListItem>
                      <ListItemIcon>
                        <YouTube sx={{ color: '#ff0000' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="YouTube" 
                        secondary={musician.socialMedia.youtube}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                          '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                        }}
                      />
                    </ListItem>
                  )}
                  
                  {musician.socialMedia.spotify && (
                    <ListItem>
                      <ListItemIcon>
                        <YouTube sx={{ color: '#1db954' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Spotify" 
                        secondary={musician.socialMedia.spotify}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                          '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                        }}
                      />
                    </ListItem>
                  )}
                  
                  {musician.socialMedia.website && (
                    <ListItem>
                      <ListItemIcon>
                        <Language sx={{ color: '#00fff7' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sitio Web" 
                        secondary={musician.socialMedia.website}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                          '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Biografía */}
          {musician.bio && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 247, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                    Biografía
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#b0b8c1', lineHeight: 1.6 }}>
                    {musician.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Instrumentos */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 247, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                  <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Instrumentos
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {musician.instruments.map((instrument, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        backgroundColor: instrument.isPrimary ? 'rgba(0, 255, 247, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: instrument.isPrimary ? '1px solid rgba(0, 255, 247, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>
                          {getInstrumentIcon(instrument.name)}
                        </Typography>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: instrument.isPrimary ? '#00fff7' : '#ffffff',
                            fontWeight: instrument.isPrimary ? 600 : 400
                          }}>
                            {instrument.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#b0b8c1' }}>
                            {getLevelLabel(instrument.level)} • {instrument.yearsOfExperience} años
                          </Typography>
                        </Box>
                      </Box>
                      
                      {instrument.isPrimary && (
                        <Chip
                          label="Principal"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 255, 247, 0.2)',
                            color: '#00fff7',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Géneros */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 247, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                  Géneros Musicales
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {musician.genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      sx={{
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        fontWeight: 600
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Especialidades */}
          {musician.specializations.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 247, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Especialidades
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {musician.specializations.map((specialization, index) => (
                      <Chip
                        key={index}
                        label={specialization}
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(0, 255, 247, 0.3)',
                          color: '#00fff7',
                          '&:hover': {
                            borderColor: '#00fff7',
                            backgroundColor: 'rgba(0, 255, 247, 0.1)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Certificaciones */}
          {musician.certifications.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 247, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Certificaciones
                  </Typography>
                  
                  <List dense>
                    {musician.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Verified sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={cert.name}
                          secondary={`${cert.issuer} • ${new Date(cert.dateObtained).toLocaleDateString()}`}
                          sx={{ 
                            '& .MuiListItemText-primary': { color: '#00fff7', fontWeight: 600 },
                            '& .MuiListItemText-secondary': { color: '#b0b8c1' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Portfolio */}
          {musician.portfolio.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 247, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                    Portfolio
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {musician.portfolio.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px'
                        }}>
                          <CardContent>
                            <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                              {item.description}
                            </Typography>
                            <Chip
                              label={item.type}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 255, 136, 0.2)',
                                color: '#00ff88',
                                fontSize: '0.7rem'
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Reviews */}
          {musician.ratings.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 247, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                    <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Reviews ({musician.totalReviews})
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {musician.ratings.slice(0, 5).map((rating, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600 }}>
                            {rating.userName}
                          </Typography>
                          <Rating
                            value={rating.rating}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#ffd700'
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                          {rating.comment}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid rgba(0, 255, 247, 0.2)',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#b0b8c1',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Cerrar
        </Button>
        
        <Button
          variant="contained"
          onClick={() => onEdit(musician)}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #00fff7, #00ff88)',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              background: 'linear-gradient(135deg, #00ff88, #00fff7)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Editar Músico
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MusicianDetails; 