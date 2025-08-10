import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Slider,
  Rating,
  Autocomplete,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  Breadcrumbs,
  Link,
  Pagination,
  TablePagination,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
  OutlinedInput,
  FilledInput,
  Input,
  InputBase,
  NativeSelect
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Block as BlockIcon,
  Report as ReportIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbDownOutlined as ThumbDownOutlinedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,

  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as GavelIcon,
  Policy as PolicyIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Update as UpdateIcon,
  Cached as CachedIcon,
  Sync as SyncIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  AudioFile as AudioFileIcon,
  Folder as FolderIcon,
  CreateNewFolder as CreateNewFolderIcon,
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
  RestoreFromTrash as RestoreFromTrashIcon,
  GetApp as GetAppIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
  SaveAlt as SaveAltIcon,
  Print as PrintIcon,
  ContentCopy as ContentCopyIcon,
  ContentCut as ContentCutIcon,
  ContentPaste as ContentPasteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FindInPage as FindInPageIcon,
  FindReplace as FindReplaceIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewHeadline as ViewHeadlineIcon,
  ViewStream as ViewStreamIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewColumn as ViewColumnIcon,
  ViewSidebar as ViewSidebarIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewKanban as ViewKanbanIcon,
  Dashboard as DashboardIcon,
  ViewArray as ViewArrayIcon,
  ViewCozy as ViewCozyIcon,
  MusicNote as MusicNoteIcon
} from '@mui/icons-material';
import type { HiringRequest } from '../types';

interface HiringRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<HiringRequest>) => void;
  initialData?: Partial<HiringRequest>;
  isEditing?: boolean;
}

const HiringRequestForm: React.FC<HiringRequestFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<HiringRequest>>({
    eventDetails: {
      title: '',
      description: '',
      type: 'wedding',
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: 2,
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      expectedAttendees: 0
    },
    requirements: {
      instruments: [],
      genres: [],
      experience: 'intermediate',
      availability: []
    },
    budget: {
      amount: 100,
      currency: 'EUR',
      paymentTerms: 'immediate',
      depositRequired: false
    },
    timeline: {
      applicationDeadline: new Date().toISOString(),
      decisionDeadline: new Date().toISOString(),
      eventDate: new Date().toISOString(),
      paymentDueDate: new Date().toISOString()
    },
    communication: {
      preferredMethod: 'email',
      availability: [],
      responseTime: '24h',
      language: 'es'
    },
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    { value: 'wedding', label: 'Boda' },
    { value: 'corporate_event', label: 'Evento Corporativo' },
    { value: 'birthday_party', label: 'Fiesta de Cumpleaños' },
    { value: 'anniversary', label: 'Aniversario' },
    { value: 'concert', label: 'Concierto' },
    { value: 'festival', label: 'Festival' },
    { value: 'private_party', label: 'Fiesta Privada' },
    { value: 'religious_ceremony', label: 'Ceremonia Religiosa' },
    { value: 'graduation', label: 'Graduación' },
    { value: 'other', label: 'Otro' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'professional', label: 'Profesional' },
    { value: 'expert', label: 'Experto' }
  ];

  const budgetRanges = [
    { value: 100, label: '€100 - €500' },
    { value: 500, label: '€500 - €1000' },
    { value: 1000, label: '€1000 - €2000' },
    { value: 2000, label: '€2000 - €5000' },
    { value: 5000, label: 'Más de €5000' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const commonInstruments = [
    'Piano', 'Guitarra', 'Violín', 'Flauta', 'Saxofón', 'Batería',
    'Bajo', 'Trompeta', 'Trombón', 'Clarinete', 'Oboe', 'Fagot',
    'Arpa', 'Viola', 'Violonchelo', 'Contrabajo', 'Acordeón', 'Órgano'
  ];

  const commonGenres = [
    'Clásica', 'Jazz', 'Rock', 'Pop', 'Blues', 'Folk', 'Country',
    'Electrónica', 'Hip Hop', 'R&B', 'Reggae', 'Salsa', 'Tango',
    'Flamenco', 'Celta', 'Africana', 'Latina', 'Asiática', 'Otros'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventDetails?.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.eventDetails?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.eventDetails?.date) {
      newErrors.date = 'La fecha es requerida';
    } else if (formData.eventDetails.date && new Date(formData.eventDetails.date) < new Date()) {
      newErrors.date = 'La fecha no puede ser en el pasado';
    }

    if (!formData.eventDetails?.location?.address?.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (formData.eventDetails?.expectedAttendees && formData.eventDetails.expectedAttendees <= 0) {
      newErrors.attendees = 'El número de asistentes debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field.startsWith('eventDetails.')) {
        const subField = field.replace('eventDetails.', '');
        newData.eventDetails = { ...newData.eventDetails, [subField]: value };
      } else if (field.startsWith('requirements.')) {
        const subField = field.replace('requirements.', '');
        newData.requirements = { ...newData.requirements, [subField]: value };
      } else if (field.startsWith('budget.')) {
        const subField = field.replace('budget.', '');
        newData.budget = { ...newData.budget, [subField]: value };
      } else if (field.startsWith('timeline.')) {
        const subField = field.replace('timeline.', '');
        newData.timeline = { ...newData.timeline, [subField]: value };
      } else if (field.startsWith('communication.')) {
        const subField = field.replace('communication.', '');
        newData.communication = { ...newData.communication, [subField]: value };
      } else {
        newData[field as keyof HiringRequest] = value;
      }
      
      return newData;
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Solicitud de Contratación' : 'Nueva Solicitud de Contratación'}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la solicitud"
                value={formData.eventDetails?.title}
                onChange={(e) => handleInputChange('eventDetails.title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Ej: Necesito un pianista para mi boda"
              />
            </Grid>

            {/* Event Type and Date */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de evento</InputLabel>
                <Select
                  value={formData.eventDetails?.type}
                  onChange={(e) => handleInputChange('eventDetails.type', e.target.value)}
                  label="Tipo de evento"
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Fecha del evento"
                  type="date"
                  value={formData.eventDetails?.date ? formData.eventDetails.date.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('eventDetails.date', e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputProps={{
                    startAdornment: <EventIcon />
                  }}
                />
            </Grid>

            {/* Time and Duration */}
            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Hora del evento"
                  type="time"
                  value={formData.eventDetails?.startTime ? formData.eventDetails.startTime.split('T')[1]?.substring(0, 5) : ''}
                  onChange={(e) => handleInputChange('eventDetails.startTime', e.target.value)}
                  InputProps={{
                    startAdornment: <ScheduleIcon />
                  }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Duración (horas)"
                  type="number"
                  value={formData.eventDetails?.endTime || ''}
                  onChange={(e) => handleInputChange('eventDetails.endTime', parseInt(e.target.value))}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{
                    startAdornment: <ScheduleIcon />
                  }}
                />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación del evento"
                value={formData.eventDetails?.location?.address}
                onChange={(e) => handleInputChange('eventDetails.location.address', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                placeholder="Dirección completa o lugar del evento"
                InputProps={{
                  startAdornment: <LocationIcon />
                }}
              />
            </Grid>

            {/* Budget and Urgency */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rango de presupuesto</InputLabel>
                <Select
                  value={formData.budget?.amount}
                  onChange={(e) => handleInputChange('budget.amount', parseInt(e.target.value))}
                  label="Rango de presupuesto"
                >
                  {budgetRanges.map((budget) => (
                    <MenuItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Nivel de urgencia</InputLabel>
                <Select
                  value={formData.budget?.amount}
                  onChange={(e) => handleInputChange('budget.amount', parseInt(e.target.value))}
                  label="Nivel de urgencia"
                >
                  {urgencyLevels.map((urgency) => (
                    <MenuItem key={urgency.value} value={urgency.value}>
                      {urgency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Instruments */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonInstruments}
                value={formData.requirements?.instruments || []}
                onChange={(_, newValue) => handleInputChange('requirements.instruments', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Instrumentos requeridos"
                    placeholder="Selecciona los instrumentos necesarios"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <MusicNoteIcon />
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      icon={<MusicNoteIcon />}
                    />
                  ))
                }
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
                              <TextField
                  fullWidth
                  label="Descripción detallada"
                  multiline
                  rows={4}
                  value={formData.eventDetails?.description}
                  onChange={(e) => handleInputChange('eventDetails.description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe tu evento, el estilo musical que buscas, requisitos específicos..."
                  InputProps={{
                    startAdornment: <DescriptionIcon />
                  }}
                />
            </Grid>

            {/* Additional Requirements */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requisitos adicionales"
                multiline
                rows={3}
                value={formData.requirements?.experience}
                onChange={(e) => handleInputChange('requirements.experience', e.target.value)}
                placeholder="Requisitos especiales, equipamiento, experiencia específica..."
              />
            </Grid>

            {/* Preview */}
            {formData.eventDetails?.title && (
              <Grid item xs={12}>
                <Alert severity="info" icon={<EventIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Vista previa de tu solicitud:
                  </Typography>
                  <Typography variant="body2">
                    <strong>{formData.eventDetails.title}</strong> - {formData.eventDetails.type} el {new Date(formData.eventDetails.date || '').toLocaleDateString('es-ES')} 
                    en {formData.eventDetails.location?.address} por {formData.eventDetails.endTime} horas.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.eventDetails?.title || !formData.eventDetails?.description}
        >
          {isEditing ? 'Actualizar' : 'Crear Solicitud'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HiringRequestForm;
