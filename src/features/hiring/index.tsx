import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Menu,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  LinearProgress,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  Breadcrumbs,
  Link,
  Pagination,
  TablePagination,
  Autocomplete,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  FilledInput,
  Input,
  InputBase,
  NativeSelect,
  Switch as SwitchComponent,
  Slider as SliderComponent,
  Rating as RatingComponent,
  LinearProgress as LinearProgressComponent,
  Skeleton as SkeletonComponent,
  Accordion as AccordionComponent,
  AccordionSummary as AccordionSummaryComponent,
  AccordionDetails as AccordionDetailsComponent,
  ExpansionPanel as ExpansionPanelComponent,
  ExpansionPanelSummary as ExpansionPanelSummaryComponent,
  ExpansionPanelDetails as ExpansionPanelDetailsComponent,
  ExpansionPanelActions as ExpansionPanelActionsComponent,
  Stepper as StepperComponent,
  Step as StepComponent,
  StepLabel as StepLabelComponent,
  StepContent as StepContentComponent,
  MobileStepper as MobileStepperComponent,
  Breadcrumbs as BreadcrumbsComponent,
  Link as LinkComponent,
  Pagination as PaginationComponent,
  TablePagination as TablePaginationComponent,
  Autocomplete as AutocompleteComponent,
  Checkbox as CheckboxComponent,
  Radio as RadioComponent,
  RadioGroup as RadioGroupComponent,
  FormLabel as FormLabelComponent,
  FormGroup as FormGroupComponent,
  FormHelperText as FormHelperTextComponent,
  InputAdornment as InputAdornmentComponent,
  OutlinedInput as OutlinedInputComponent,
  FilledInput as FilledInputComponent,
  Input as InputComponent,
  InputBase as InputBaseComponent,
  NativeSelect as NativeSelectComponent
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
  Success as SuccessIcon,
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
  Share as ShareIcon,
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
  ViewDashboard as ViewDashboardIcon,
  ViewArray as ViewArrayIcon,
  ViewCozy as ViewCozyIcon,
  ViewComfyAlt as ViewComfyAltIcon,
  ViewCompactAlt as ViewCompactAltIcon,
  ViewHeadlineAlt as ViewHeadlineAltIcon,
  ViewStreamAlt as ViewStreamAltIcon,
  ViewWeekAlt as ViewWeekAltIcon,
  ViewDayAlt as ViewDayAltIcon,
  ViewAgendaAlt as ViewAgendaAltIcon,
  ViewCarouselAlt as ViewCarouselAltIcon,
  ViewColumnAlt as ViewColumnAltIcon,
  ViewSidebarAlt as ViewSidebarAltIcon,
  ViewTimelineAlt as ViewTimelineAltIcon,
  ViewKanbanAlt as ViewKanbanAltIcon,
  ViewDashboardAlt as ViewDashboardAltIcon,
  ViewArrayAlt as ViewArrayAltIcon,
  ViewCozyAlt as ViewCozyAltIcon,
  ViewComfyAltAlt as ViewComfyAltAltIcon,
  ViewCompactAltAlt as ViewCompactAltAltIcon,
  ViewHeadlineAltAlt as ViewHeadlineAltAltIcon,
  ViewStreamAltAlt as ViewStreamAltAltIcon,
  ViewWeekAltAlt as ViewWeekAltAltIcon,
  ViewDayAltAlt as ViewDayAltAltIcon,
  ViewAgendaAltAlt as ViewAgendaAltAltIcon,
  ViewCarouselAltAlt as ViewCarouselAltAltIcon,
  ViewColumnAltAlt as ViewColumnAltAltIcon,
  ViewSidebarAltAlt as ViewSidebarAltAltIcon,
  ViewTimelineAltAlt as ViewTimelineAltAltIcon,
  ViewKanbanAltAlt as ViewKanbanAltAltIcon,
  ViewDashboardAltAlt as ViewDashboardAltAltIcon,
  ViewArrayAltAlt as ViewArrayAltAltIcon,
  ViewCozyAltAlt as ViewCozyAltAltIcon
} from '@mui/icons-material';
import { HiringRequestForm } from './components/HiringRequestForm';
import { HiringRequestCard } from './components/HiringRequestCard';
import type { HiringRequest, Contract, HiringStatus, ContractStatus } from './types';
import HiringService from '../../services/hiringService';
import { useAuth } from '../../hooks/useAuth';

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
      id={`hiring-tabpanel-${index}`}
      aria-labelledby={`hiring-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HiringSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const loadHiringRequests = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const requests = await HiringService.getUserHiringRequests(user.id);
      setHiringRequests(requests);
    } catch (err) {
      setError('Error al cargar las solicitudes de contratación');
      console.error('Error loading hiring requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMusicianHiringRequests = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const requests = await HiringService.getMusicianHiringRequests(user.id);
      setHiringRequests(requests);
    } catch (err) {
      setError('Error al cargar las solicitudes recibidas');
      console.error('Error loading musician hiring requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // This would need to be implemented in the service
      // const userContracts = await HiringService.getUserContracts(user.id);
      // setContracts(userContracts);
    } catch (err) {
      setError('Error al cargar los contratos');
      console.error('Error loading contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user?.id) return;
    
    try {
      const hiringStats = await HiringService.getHiringStats(user.id);
      setStats(hiringStats);
    } catch (err) {
      console.error('Error loading hiring stats:', err);
    }
  };

  const handleCreateRequest = async (requestData: Partial<HiringRequest>) => {
    try {
      setLoading(true);
      const newRequest = await HiringService.createHiringRequest(requestData);
      setHiringRequests([newRequest, ...hiringRequests]);
      setShowRequestForm(false);
      setError(null);
    } catch (err) {
      setError('Error al crear la solicitud de contratación');
      console.error('Error creating hiring request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const updatedRequest = await HiringService.acceptHiringRequest(requestId, user.id);
      setHiringRequests(hiringRequests.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      setError(null);
    } catch (err) {
      setError('Error al aceptar la solicitud');
      console.error('Error accepting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string, reason?: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const updatedRequest = await HiringService.rejectHiringRequest(requestId, user.id, reason);
      setHiringRequests(hiringRequests.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      setError(null);
    } catch (err) {
      setError('Error al rechazar la solicitud');
      console.error('Error rejecting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string, reason?: string) => {
    try {
      setLoading(true);
      const updatedRequest = await HiringService.cancelHiring(requestId, reason);
      setHiringRequests(hiringRequests.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      setError(null);
    } catch (err) {
      setError('Error al cancelar la solicitud');
      console.error('Error cancelling request:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStats();
      
      if (activeTab === 0) {
        loadHiringRequests();
      } else if (activeTab === 1) {
        loadMusicianHiringRequests();
      } else if (activeTab === 2) {
        loadContracts();
      }
    }
  }, [activeTab, user?.id]);

  const getStatusColor = (status: HiringStatus | ContractStatus) => {
    switch (status) {
      case 'pending':
      case 'draft':
        return 'warning';
      case 'accepted':
      case 'active':
      case 'pending_signature':
        return 'info';
      case 'completed':
        return 'success';
      case 'rejected':
      case 'cancelled':
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sistema de Contratación
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona solicitudes de contratación, contratos y pagos
        </Typography>
      </Box>

      {/* Stats Overview */}
      {stats && <HiringStats stats={stats} />}

      {/* Create Request Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowRequestForm(true)}
          size="large"
        >
          Nueva Solicitud de Contratación
        </Button>
      </Box>

      {/* Request Form Modal */}
      {showRequestForm && (
        <HiringRequestForm
          open={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="hiring tabs">
          <Tab label="Mis Solicitudes" />
          <Tab label="Solicitudes Recibidas" />
          <Tab label="Contratos" />
          <Tab label="Historial de Pagos" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Mis Solicitudes de Contratación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Solicitudes que has enviado a músicos
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Solicitudes Recibidas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Solicitudes de contratación que has recibido
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Contratos Activos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Contratos en curso y completados
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Historial de Pagos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registro de todos los pagos realizados
          </Typography>
        </TabPanel>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content Based on Active Tab */}
      {!loading && (
        <>
          {/* Tab 0: My Hiring Requests */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {hiringRequests.length > 0 ? (
                hiringRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <HiringRequestCard
                      request={request}
                      isOwner={true}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      onCancel={handleCancelRequest}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No tienes solicitudes de contratación
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Crea tu primera solicitud para contratar músicos
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowRequestForm(true)}
                    >
                      Crear Solicitud
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {/* Tab 1: Received Hiring Requests */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              {hiringRequests.length > 0 ? (
                hiringRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <HiringRequestCard
                      request={request}
                      isOwner={false}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No has recibido solicitudes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Las solicitudes de contratación aparecerán aquí
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {/* Tab 2: Contracts */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              {contracts.length > 0 ? (
                contracts.map((contract) => (
                  <Grid item xs={12} md={6} lg={4} key={contract.id}>
                    <ContractCard contract={contract} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ContractIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No tienes contratos activos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Los contratos aparecerán aquí una vez que se acepten las solicitudes
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {/* Tab 3: Payment History */}
          {activeTab === 3 && (
            <PaymentHistory userId={user?.id} />
          )}
        </>
      )}

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              icon={<BusinessIcon />}
              label="Nueva Solicitud"
              onClick={() => setShowRequestForm(true)}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<ContractIcon />}
              label="Ver Contratos"
              onClick={() => setActiveTab(2)}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<PaymentIcon />}
              label="Historial de Pagos"
              onClick={() => setActiveTab(3)}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HiringSystem;
