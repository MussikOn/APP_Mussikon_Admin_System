import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  Rating,
  IconButton,
  Grid,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  BookOnline as BookOnlineIcon,
  AttachMoney as AttachMoneyIcon,
  MusicNote as MusicNoteIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import type { MusicianProfile, Instrument, ExperienceLevel, ProficiencyLevel } from '../types';

interface MusicianCardProps {
  musician: MusicianProfile;
  onContact?: (musicianId: string) => void;
  onBook?: (musicianId: string) => void;
  onFavorite?: (musicianId: string) => void;
}

const MusicianCard: React.FC<MusicianCardProps> = ({
  musician,
  onContact,
  onBook,
  onFavorite
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contactDialog, setContactDialog] = useState(false);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    eventType: '',
    date: '',
    budget: ''
  });
  const [bookingForm, setBookingForm] = useState({
    eventType: '',
    date: '',
    time: '',
    location: '',
    duration: '',
    budget: '',
    requirements: ''
  });

  const handleContact = () => {
    setContactDialog(true);
  };

  const handleBook = () => {
    setBookingDialog(true);
  };

  const handleContactSubmit = () => {
    if (onContact) {
      onContact(musician.id);
    }
    setContactDialog(false);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      eventType: '',
      date: '',
      budget: ''
    });
  };

  const handleBookingSubmit = () => {
    if (onBook) {
      onBook(musician.id);
    }
    setBookingDialog(false);
    // Reset form
    setBookingForm({
      eventType: '',
      date: '',
      time: '',
      location: '',
      duration: '',
      budget: '',
      requirements: ''
    });
  };

  const getExperienceColor = (level: ExperienceLevel) => {
    switch (level) {
      case 'beginner':
        return 'default';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'secondary';
      case 'professional':
        return 'success';
      default:
        return 'default';
    }
  };

  const getProficiencyColor = (level: ProficiencyLevel) => {
    switch (level) {
      case 'basic':
        return 'default';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'secondary';
      case 'expert':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FacebookIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'youtube':
        return <YouTubeIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      default:
        return <LanguageIcon />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header */}
          <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
            <Avatar
              src={musician.profileImage || '/default-avatar.png'}
              sx={{ width: 80, height: 80 }}
            >
              {musician.name.charAt(0)}
            </Avatar>
            
            <Box flexGrow={1}>
              <Typography variant="h6" gutterBottom>
                {musician.name}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={musician.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({musician.reviewCount} reseñas)
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {musician.location?.city}, {musician.location?.state}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Desde {formatPrice(musician.hourlyRate?.min || 0)}/hora
                </Typography>
              </Box>
            </Box>
            
            <IconButton
              onClick={() => onFavorite?.(musician.id)}
              color="primary"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>

          {/* Instruments */}
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Instrumentos
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {musician.instruments.map((instrument: Instrument) => (
                <Chip
                  key={instrument.name}
                  label={instrument.name}
                  size="small"
                  icon={<MusicNoteIcon />}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          {/* Experience & Skills */}
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Experiencia
                </Typography>
                <Chip
                  label={musician.experience || 'N/A'}
                  color={getExperienceColor(musician.experience || 'beginner')}
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Nivel
                </Typography>
                <Chip
                  label={musician.proficiency || 'N/A'}
                  size="small"
                  color={getProficiencyColor(musician.proficiency || 'basic')}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Genres */}
          {musician.genres && musician.genres.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Géneros
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {musician.genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Availability */}
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Disponibilidad
            </Typography>
            <Chip
                              label={musician.availability}
              size="small"
                              color={musician.availability === 'available' ? 'success' : 'warning'}
            />
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {musician.bio}
          </Typography>

          {/* Expandable Content */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            {/* Portfolio */}
            {musician.portfolio && musician.portfolio.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Portafolio
                </Typography>
                <List dense>
                  {musician.portfolio.slice(0, 3).map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <MusicNoteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Social Media */}
            {musician.socialMedia && Object.keys(musician.socialMedia).length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Redes Sociales
                </Typography>
                <Box display="flex" gap={1}>
                  {Object.entries(musician.socialMedia).map(([platform, url]) => (
                    <IconButton
                      key={platform}
                      size="small"
                      onClick={() => window.open(url, '_blank')}
                    >
                      {getSocialIcon(platform)}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            )}
          </Collapse>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Menos' : 'Más'}
          </Button>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MessageIcon />}
              onClick={handleContact}
            >
              Contactar
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<BookOnlineIcon />}
              onClick={handleBook}
            >
              Reservar
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contactar a {musician.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Evento"
                value={contactForm.eventType}
                onChange={(e) => setContactForm({ ...contactForm, eventType: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={contactForm.date}
                onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presupuesto"
                value={contactForm.budget}
                onChange={(e) => setContactForm({ ...contactForm, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                multiline
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe tu evento y requisitos..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancelar</Button>
          <Button onClick={handleContactSubmit} variant="contained">
            Enviar Mensaje
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Reservar a {musician.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Evento</InputLabel>
                <Select
                  value={bookingForm.eventType}
                  onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                  label="Tipo de Evento"
                >
                  <MenuItem value="wedding">Boda</MenuItem>
                  <MenuItem value="corporate">Evento Corporativo</MenuItem>
                  <MenuItem value="party">Fiesta Privada</MenuItem>
                  <MenuItem value="concert">Concierto</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora"
                type="time"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duración (horas)"
                value={bookingForm.duration}
                onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                value={bookingForm.location}
                onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presupuesto"
                value={bookingForm.budget}
                onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requisitos Específicos"
                multiline
                rows={4}
                value={bookingForm.requirements}
                onChange={(e) => setBookingForm({ ...bookingForm, requirements: e.target.value })}
                placeholder="Describe los requisitos específicos para el evento..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancelar</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Confirmar Reserva
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MusicianCard;
