import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  MusicNote as MusicNoteIcon,
  Euro as EuroIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { EventForm, EVENT_TYPES, INSTRUMENTS } from '../../types/backend';

interface EventCreationFormProps {
  onSubmit: (data: EventForm) => void;
  isLoading?: boolean;
  error?: string;
  onCancel?: () => void;
}

const steps = ['Información Básica', 'Detalles del Evento', 'Repertorio y Presupuesto'];

const EventCreationForm: React.FC<EventCreationFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onCancel
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EventForm>({
    eventName: '',
    eventType: 'concierto',
    date: '',
    time: '',
    location: '',
    duration: '',
    instrument: 'guitarra',
    bringInstrument: false,
    comment: '',
    budget: '',
    songs: [''],
    recommendations: [''],
    mapsLink: ''
  });
  const [errors, setErrors] = useState<Partial<EventForm>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<EventForm> = {};

    switch (step) {
      case 0: // Información Básica
        if (!formData.eventName.trim()) {
          newErrors.eventName = 'El nombre del evento es requerido';
        }
        if (!formData.date) {
          newErrors.date = 'La fecha es requerida';
        }
        if (!formData.time) {
          newErrors.time = 'La hora es requerida';
        }
        if (!formData.location.trim()) {
          newErrors.location = 'La ubicación es requerida';
        }
        break;

      case 1: // Detalles del Evento
        if (!formData.duration.trim()) {
          newErrors.duration = 'La duración es requerida';
        }
        if (!formData.instrument) {
          newErrors.instrument = 'El instrumento es requerido';
        }
        break;

      case 2: // Repertorio y Presupuesto
        if (!formData.budget.trim()) {
          newErrors.budget = 'El presupuesto es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      // Filtrar canciones y recomendaciones vacías
      const cleanFormData = {
        ...formData,
        songs: formData.songs.filter(song => song.trim() !== ''),
        recommendations: formData.recommendations.filter(rec => rec.trim() !== '')
      };
      onSubmit(cleanFormData);
    }
  };

  const handleInputChange = (field: keyof EventForm) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = typeof e.target.value === 'string' ? e.target.value : String(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSwitchChange = (field: keyof EventForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleArrayChange = (field: 'songs' | 'recommendations', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'songs' | 'recommendations') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'songs' | 'recommendations', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Evento"
                value={formData.eventName}
                onChange={handleInputChange('eventName')}
                error={!!errors.eventName}
                helperText={errors.eventName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.eventType}>
                <InputLabel>Tipo de Evento</InputLabel>
                <Select
                  value={formData.eventType}
                  label="Tipo de Evento"
                  onChange={handleInputChange('eventType')}
                >
                  {Object.entries(EVENT_TYPES).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={handleInputChange('date')}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora"
                type="time"
                value={formData.time}
                onChange={handleInputChange('time')}
                error={!!errors.time}
                helperText={errors.time}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duración"
                value={formData.duration}
                onChange={handleInputChange('duration')}
                error={!!errors.duration}
                helperText={errors.duration}
                placeholder="2 horas"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                value={formData.location}
                onChange={handleInputChange('location')}
                error={!!errors.location}
                helperText={errors.location}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.instrument}>
                <InputLabel>Instrumento Requerido</InputLabel>
                <Select
                  value={formData.instrument}
                  label="Instrumento Requerido"
                  onChange={handleInputChange('instrument')}
                >
                  {Object.entries(INSTRUMENTS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.bringInstrument}
                    onChange={handleSwitchChange('bringInstrument')}
                    color="primary"
                  />
                }
                label="¿El músico debe traer su instrumento?"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comentarios Adicionales"
                value={formData.comment}
                onChange={handleInputChange('comment')}
                multiline
                rows={4}
                placeholder="Describe detalles específicos del evento, requisitos especiales, o cualquier información adicional que consideres importante..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presupuesto"
                value={formData.budget}
                onChange={handleInputChange('budget')}
                error={!!errors.budget}
                helperText={errors.budget}
                placeholder="500 EUR"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EuroIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enlace de Google Maps"
                value={formData.mapsLink}
                onChange={handleInputChange('mapsLink')}
                placeholder="https://maps.google.com/..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Canciones del Repertorio
              </Typography>
              {formData.songs.map((song, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Canción ${index + 1}`}
                    value={song}
                    onChange={(e) => handleArrayChange('songs', index, e.target.value)}
                    placeholder="Nombre de la canción"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MusicNoteIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formData.songs.length > 1 && (
                    <IconButton
                      onClick={() => removeArrayItem('songs', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('songs')}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Agregar Canción
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Recomendaciones Musicales
              </Typography>
              {formData.recommendations.map((rec, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Recomendación ${index + 1}`}
                    value={rec}
                    onChange={(e) => handleArrayChange('recommendations', index, e.target.value)}
                    placeholder="Estilo, género o artista preferido"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MusicNoteIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formData.recommendations.length > 1 && (
                    <IconButton
                      onClick={() => removeArrayItem('recommendations', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('recommendations')}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Agregar Recomendación
              </Button>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Crear Nuevo Evento
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completa la información para crear tu evento musical
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              {getStepContent(activeStep)}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    color="secondary"
                  >
                    Cancelar
                  </Button>
                )}

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={<EventIcon />}
                  >
                    {isLoading ? 'Creando Evento...' : 'Crear Evento'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    size="large"
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EventCreationForm;
