import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
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
  Switch,
  FormControlLabel,
  Pagination,
  Snackbar,
  Alert,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Grid,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Event as EventIcon,
  MusicNote as MusicNoteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
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
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Email as EmailIcon,
  PushPin as PushPinIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { NotificationService } from '../../services/notificationService';
import type { Notification, NotificationType, NotificationSettings } from './types';

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
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form states
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as NotificationType,
    priority: 'normal'
  });

  const loadNotifications = useCallback(async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await NotificationService.getUserNotifications(user.uid);
      setNotifications(response);
      setTotalPages(Math.ceil(response.length / 10)); // Assuming 10 per page
    } catch (err) {
      setError('Error al cargar las notificaciones');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, page]);

  const loadSettings = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const userSettings = await NotificationService.getNotificationSettings(user.uid);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading notification settings:', err);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.uid) return;
    
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'read' }
            : n
        )
      );
      setSnackbar({ open: true, message: 'Notificación marcada como leída', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al marcar como leída', severity: 'error' });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!user?.uid) return;
    
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setSnackbar({ open: true, message: 'Notificación eliminada', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
    }
  };

  const handleCreateNotification = async () => {
    if (!user?.uid) return;
    
    try {
      await NotificationService.createNotification({
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        priority: newNotification.priority as any
      });
      
      setCreateDialog(false);
      setNewNotification({ title: '', message: '', type: 'info' as NotificationType, priority: 'normal' });
      loadNotifications();
      setSnackbar({ open: true, message: 'Notificación creada', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear notificación', severity: 'error' });
    }
  };

  const handleUpdateSettings = async () => {
    if (!user?.uid || !settings) return;
    
    try {
      await NotificationService.updateNotificationSettings(user.uid, settings);
      setSettingsDialog(false);
      setSnackbar({ open: true, message: 'Configuración actualizada', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al actualizar configuración', severity: 'error' });
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return notification.status === 'unread';
    if (activeTab === 2) return notification.status === 'read';
    return true;
  });

  if (loading && notifications.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Cargando...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notificaciones
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsDialog(true)}
            sx={{ mr: 2 }}
          >
            Configuración
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            Crear Notificación
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="notification tabs">
            <Tab label={`Todas (${notifications.length})`} />
            <Tab label={`No leídas (${notifications.filter(n => n.status === 'unread').length})`} />
            <Tab label={`Leídas (${notifications.filter(n => n.status === 'read').length})`} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <List>
            {filteredNotifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No hay notificaciones"
                  secondary="Cuando recibas notificaciones, aparecerán aquí"
                />
              </ListItem>
            ) : (
              filteredNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {notification.title}
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority) as any}
                          />
                          {notification.status === 'unread' && (
                            <Chip
                              label="Nueva"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {notification.status === 'unread' && (
                          <IconButton
                            edge="end"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Marcar como leída"
                          >
                            <MarkEmailReadIcon />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" p={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <List>
            {filteredNotifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No hay notificaciones no leídas"
                  secondary="Todas las notificaciones han sido leídas"
                />
              </ListItem>
            ) : (
              filteredNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {notification.title}
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        <IconButton
                          edge="end"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Marcar como leída"
                        >
                          <MarkEmailReadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <List>
            {filteredNotifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No hay notificaciones leídas"
                  secondary="Las notificaciones leídas aparecerán aquí"
                />
              </ListItem>
            ) : (
              filteredNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {notification.title}
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>
        </TabPanel>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configuración de Notificaciones</DialogTitle>
        <DialogContent>
          {settings && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Preferencias de Notificación
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  />
                }
                label="Notificaciones por Email"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  />
                }
                label="Notificaciones Push"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                  />
                }
                label="Notificaciones SMS"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Tipos de Notificación
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                                      checked={settings.types?.includes('info') || false}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(settings.types || []), 'info' as NotificationType]
                      : (settings.types || []).filter(t => t !== 'info');
                    setSettings({ ...settings, types: newTypes });
                  }}
                  />
                }
                label="Información"
              />
              
              <FormControlLabel
                control={
                  <Switch
                                      checked={settings.types?.includes('success') || false}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(settings.types || []), 'success' as NotificationType]
                      : (settings.types || []).filter(t => t !== 'success');
                    setSettings({ ...settings, types: newTypes });
                  }}
                  />
                }
                label="Éxito"
              />
              
              <FormControlLabel
                control={
                  <Switch
                                      checked={settings.types?.includes('warning') || false}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(settings.types || []), 'warning' as NotificationType]
                      : (settings.types || []).filter(t => t !== 'warning');
                    setSettings({ ...settings, types: newTypes });
                  }}
                  />
                }
                label="Advertencias"
              />
              
              <FormControlLabel
                control={
                  <Switch
                                      checked={settings.types?.includes('error') || false}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(settings.types || []), 'error' as NotificationType]
                      : (settings.types || []).filter(t => t !== 'error');
                    setSettings({ ...settings, types: newTypes });
                  }}
                  />
                }
                label="Errores"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Configuración de Frecuencia
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Frecuencia de Resumen</InputLabel>
                <Select
                  value={settings.summaryFrequency}
                  onChange={(e) => setSettings({ ...settings, summaryFrequency: e.target.value })}
                  label="Frecuencia de Resumen"
                >
                  <MenuItem value="immediate">Inmediato</MenuItem>
                  <MenuItem value="hourly">Cada hora</MenuItem>
                  <MenuItem value="daily">Diario</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateSettings} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Notification Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nueva Notificación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            variant="outlined"
            value={newNotification.title}
            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Mensaje"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newNotification.message}
            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newNotification.type}
              onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as NotificationType })}
              label="Tipo"
            >
                              <MenuItem value="info">Información</MenuItem>
                <MenuItem value="success">Éxito</MenuItem>
                <MenuItem value="warning">Advertencia</MenuItem>
                <MenuItem value="error">Error</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={newNotification.priority}
              onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value })}
              label="Prioridad"
            >
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateNotification} 
            variant="contained"
            disabled={!newNotification.title || !newNotification.message}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications;
