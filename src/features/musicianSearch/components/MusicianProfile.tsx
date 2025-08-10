import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Rating,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Skeleton,
  Paper
} from '@mui/material';
import {
  LocationOn,
  MusicNote,



  Verified,


  ContactMail,
  BookOnline,
  Favorite,
  Share,
  Edit,
  Delete
} from '@mui/icons-material';


interface MusicianProfileProps {
  musician: Musician;
  onContact?: (musicianId: string) => void;
  onBook?: (musicianId: string) => void;
  onFavorite?: (musicianId: string) => void;
  onShare?: (musician: Musician) => void;
  isOwner?: boolean;
  onEdit?: (musician: Musician) => void;
  onDelete?: (musicianId: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`musician-tabpanel-${index}`}
      aria-labelledby={`musician-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const MusicianProfile: React.FC<MusicianProfileProps> = ({
  musician,
  onContact,
  onBook,
  onFavorite,
  onShare,
  isOwner = false,
  onEdit,
  onDelete
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContactSubmit = () => {
    if (onContact) {
      onContact(musician.id);
    }
    setContactDialogOpen(false);
    setContactForm({ subject: '', message: '', contactMethod: 'email' });
  };

  const handleBookingSubmit = () => {
    if (onBook) {
      onBook(musician.id);
    }
    setBookingDialogOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(musician.id);
    }
    setDeleteDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}/hora`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!musician) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={400} />
        <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={40} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header del perfil */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={musician.profileImage}
                  alt={musician.name}
                  sx={{ width: 120, height: 120 }}
                />
              </Grid>
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                    {musician.name}
                  </Typography>
                  {musician.isVerified && (
                    <Verified color="primary" sx={{ mr: 1 }} />
                  )}
                  <Rating value={musician.rating} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({musician.reviewCount} reseñas)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {musician.location.city}, {musician.location.state}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNote color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {musician.instruments.join(', ')}
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                  {formatPrice(musician.hourlyRate)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<ContactMail />}
                    onClick={() => setContactDialogOpen(true)}
                  >
                    Contactar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BookOnline />}
                    onClick={() => setBookingDialogOpen(true)}
                  >
                    Reservar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Favorite />}
                    onClick={() => onFavorite?.(musician.id)}
                  >
                    Favorito
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    onClick={() => onShare?.(musician)}
                  >
                    Compartir
                  </Button>
                  {isOwner && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => onEdit?.(musician)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs de información */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="musician profile tabs">
              <Tab label="Información General" />
              <Tab label="Portfolio" />
              <Tab label="Reseñas" />
              <Tab label="Disponibilidad" />
              <Tab label="Redes Sociales" />
            </Tabs>
          </Box>

          {/* Tab 1: Información General */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Experiencia y Habilidades
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Experiencia: {musician.experience} años
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nivel: {musician.proficiency}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Géneros Musicales
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {musician.genres.map((genre: any) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Idiomas
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {musician.languages.map((language: any) => (
                    <Chip
                      key={language}
                      label={language}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Biografía
                </Typography>
                <Typography variant="body1" paragraph>
                  {musician.bio || 'No hay biografía disponible.'}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Certificaciones
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {musician.certifications?.length > 0 ? (
                    musician.certifications.map((cert: any) => (
                      <Chip
                        key={cert}
                        label={cert}
                        size="small"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay certificaciones disponibles.
                    </Typography>
                  )}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Equipamiento
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {musician.equipment?.length > 0 ? (
                    musician.equipment.map((item: any) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay información de equipamiento disponible.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Portfolio */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Trabajos Destacados
            </Typography>
            {musician.portfolio?.length > 0 ? (
              <Grid container spacing={2}>
                {musician.portfolio.map((item: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.date)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay trabajos en el portfolio disponible.
              </Typography>
            )}
          </TabPanel>

          {/* Tab 3: Reseñas */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Reseñas de Clientes
            </Typography>
            {musician.reviews?.length > 0 ? (
              <List>
                {musician.reviews.map((review: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar src={review.reviewer.profileImage} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                              {review.reviewer.name}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              {formatDate(review.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {review.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < musician.reviews.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay reseñas disponibles.
              </Typography>
            )}
          </TabPanel>

          {/* Tab 4: Disponibilidad */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Horarios Disponibles
            </Typography>
            {musician.availability?.length > 0 ? (
              <Grid container spacing={2}>
                {musician.availability.map((slot: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {slot.day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {slot.startTime} - {slot.endTime}
                      </Typography>
                      <Chip
                        label={slot.status}
                        color={slot.status === 'available' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay información de disponibilidad disponible.
              </Typography>
            )}
          </TabPanel>

          {/* Tab 5: Redes Sociales */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces de Redes Sociales
            </Typography>
            {musician.socialMedia?.length > 0 ? (
              <Grid container spacing={2}>
                {musician.socialMedia.map((social: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Social sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {social.platform}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          fullWidth
                        >
                          Ver Perfil
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay enlaces de redes sociales disponibles.
              </Typography>
            )}
          </TabPanel>
        </Card>

        {/* Diálogo de Contacto */}
        <Dialog
          open={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Contactar a {musician.name}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Asunto"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Método de Contacto</InputLabel>
                  <Select
                    value={contactForm.contactMethod}
                    onChange={(e) => setContactForm({ ...contactForm, contactMethod: e.target.value })}
                    label="Método de Contacto"
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Teléfono</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mensaje"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleContactSubmit} variant="contained">
              Enviar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Reserva */}
        <Dialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Reservar a {musician.name}</DialogTitle>
          <DialogContent>
            <HiringRequestForm
              onSubmit={handleBookingSubmit}
              onCancel={() => setBookingDialogOpen(false)}
              musicianId={musician.id}
              musicianName={musician.name}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo de Confirmación de Eliminación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar el perfil de {musician.name}? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};
