import React, { useEffect, useState, useCallback } from "react";
import type { User } from "../../services/usersService";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUserByEmail,
} from "../../services/usersService";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useTheme } from "../../hooks/useTheme";
import { buttonStyles, chipStyles, cardStyles } from "../../theme/buttonStyles";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import ResponsiveTable from "../../components/ResponsiveTable";
import { responsiveTypography } from "../../theme/breakpoints";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,

  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment,
  Snackbar
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  AdminPanelSettings as AdminIcon,
  Event as EventIcon,
  MusicNote as MusicIcon,

} from "@mui/icons-material";

const PAGE_SIZE = 10;
const ROLES = [
  { value: "admin", label: "Administrador", icon: <AdminIcon />, color: "#00fff7" },
  { value: "superadmin", label: "Super Administrador", icon: <AdminIcon />, color: "#ff0000" },
  { value: "organizador", label: "Organizador", icon: <EventIcon />, color: "#b993d6" },
  { value: "musico", label: "Músico", icon: <MusicIcon />, color: "#ff2eec" }
];

const initialForm: User = {
  name: "",
  lastName: "",
  userEmail: "",
  roll: "musico",
  status: true,
  userPassword: "",
};

const Users: React.FC = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<User>(initialForm);
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Hooks para peticiones
  const {
    loading: loadingUsers,
    error: errorUsers,
    execute: fetchUsers,
  } = useApiRequest(getAllUsers);

  const {
    loading: loadingCreate,
    error: errorCreate,
    execute: createUserReq,
  } = useApiRequest(createUser);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    execute: updateUserReq,
  } = useApiRequest(updateUser);

  const {
    loading: loadingDelete,
    error: errorDelete,
    execute: deleteUser,
  } = useApiRequest(deleteUserByEmail);

  // Función para cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      console.log('🔄 Cargando usuarios, página:', page);
      const response = await fetchUsers(page, PAGE_SIZE);
      if (response) {
        console.log('✅ Usuarios cargados:', response);
        setUsers(response.users || []);
        setTotalPages(response.totalPages || 1);
        setTotalUsers(response.total || 0);
      }
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios',
        severity: 'error'
      });
    }
  }, [fetchUsers, page]);

  // Cargar usuarios al montar el componente y cuando cambie la página
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtro de búsqueda
  const filtered = users.filter((u) =>
    (u.name + " " + u.lastName + " " + u.userEmail)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Validación del formulario
  const validate = () => {
    if (!form.name.trim() || !form.lastName.trim() || !form.userEmail.trim())
      return "Completa todos los campos obligatorios.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.userEmail))
      return "Email inválido.";
    if (!editMode && (!form.userPassword?.trim() || form.userPassword.length < 6))
      return "Contraseña mínima 6 caracteres.";
    return "";
  };

  // Guardar usuario (crear o editar)
  const handleSave = async () => {
    setFormError("");
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    try {
      if (editMode && editUserId) {
        console.log('📝 Editando usuario:', editUserId, form);
        await updateUserReq(editUserId, form);
        setSnackbar({
          open: true,
          message: 'Usuario actualizado correctamente',
          severity: 'success'
        });
      } else {
        console.log('📝 Creando usuario:', form);
        await createUserReq(form);
        setSnackbar({
          open: true,
          message: 'Usuario creado correctamente',
          severity: 'success'
        });
      }
      
      setModalOpen(false);
      setForm(initialForm);
      setEditMode(false);
      setEditUserId(null);
      setPage(1);
      loadUsers(); // Recargar usuarios
    } catch (e) {
      console.error('❌ Error al guardar usuario:', e);
      setFormError(
        editMode ? "Error al editar usuario" : "Error al crear usuario"
      );
      setSnackbar({
        open: true,
        message: editMode ? 'Error al editar usuario' : 'Error al crear usuario',
        severity: 'error'
      });
    }
  };

  // Eliminar usuario
  const handleDelete = async (userId: string) => {
    setDeleteTarget(userId);
    try {
      console.log('🗑️ Eliminando usuario:', userId);
      await deleteUser(userId);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado correctamente',
        severity: 'success'
      });
      loadUsers(); // Recargar usuarios
      setConfirmDelete(null);
    } catch (e) {
      console.error('❌ Error al eliminar usuario:', e);
      setSnackbar({
        open: true,
        message: 'Error al eliminar usuario',
        severity: 'error'
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Obtener información del rol
  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[3]; // Default a músico
  };

  // Cambiar página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Abrir modal para crear usuario
  const handleCreateUser = () => {
    setModalOpen(true);
    setForm(initialForm);
    setFormError("");
    setEditMode(false);
    setEditUserId(null);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user: User) => {
    setModalOpen(true);
    setEditMode(true);
    setEditUserId(user._id || '');
    setForm({
      name: user.name,
      lastName: user.lastName,
      userEmail: user.userEmail,
      roll: user.roll,
      status: user.status,
      userPassword: "",
    });
    setFormError("");
  };

  // Confirmar eliminación
  const handleConfirmDelete = (user: User) => {
    setConfirmDelete({
      id: user._id || '',
      name: user.name + " " + user.lastName,
    });
  };

  return (
    <ResponsiveLayout spacing="md">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: responsiveTypography.h3
              }}
            >
              Gestión de Usuarios
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontWeight: 400, opacity: 0.8 }}
            >
              Administra todos los usuarios de la plataforma
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Actualizar lista">
              <span>
                <IconButton
                  onClick={loadUsers}
                  disabled={loadingUsers}
                  sx={{
                    background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
              sx={buttonStyles.primary}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Filtros y Estadísticas */}
      <Card
        sx={{
          ...(isDark ? cardStyles.dark : cardStyles.default),
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1', md: '1' } }}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, apellido o email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1', md: '1' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {filtered.length} de {totalUsers} usuario{totalUsers !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`Admin: ${users.filter(u => u.roll === 'admin').length}`}
                    size="small"
                    icon={<AdminIcon />}
                    sx={chipStyles.secondary}
                  />
                  <Chip 
                    label={`Organizadores: ${users.filter(u => u.roll === 'organizador').length}`}
                    size="small"
                    icon={<EventIcon />}
                    sx={chipStyles.primary}
                  />
                  <Chip 
                    label={`Músicos: ${users.filter(u => u.roll === 'musico').length}`}
                    size="small"
                    icon={<MusicIcon />}
                    sx={chipStyles.error}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Errores */}
      {(errorUsers || errorCreate || errorUpdate || errorDelete) && (
        <Box sx={{ mb: 3 }}>
          {errorUsers && <Alert severity="error" sx={{ mb: 1 }}>{errorUsers}</Alert>}
          {errorCreate && <Alert severity="error" sx={{ mb: 1 }}>{errorCreate}</Alert>}
          {errorUpdate && <Alert severity="error" sx={{ mb: 1 }}>{errorUpdate}</Alert>}
          {errorDelete && <Alert severity="error" sx={{ mb: 1 }}>{errorDelete}</Alert>}
        </Box>
      )}

      {/* Loading */}
      {loadingUsers && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabla de Usuarios */}
      {!loadingUsers && !errorUsers && (
        <Card
          sx={isDark ? cardStyles.dark : cardStyles.default}
        >
          <ResponsiveTable
            data={filtered}
            columns={[
              {
                id: 'user',
                label: 'Usuario',
                render: (_, user) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.name?.charAt(0) || user.userEmail?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.name} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user._id || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                )
              },
              {
                id: 'email',
                label: 'Email',
                render: (_, user) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {user.userEmail}
                    </Typography>
                  </Box>
                )
              },
              {
                id: 'role',
                label: 'Rol',
                render: (_, user) => {
                  const roleInfo = getRoleInfo(user.roll);
                  return (
                    <Chip
                      label={roleInfo.label}
                      icon={roleInfo.icon}
                      size="small"
                      sx={{
                        background: `${roleInfo.color}20`,
                        color: roleInfo.color,
                        fontWeight: 600,
                      }}
                    />
                  );
                }
              },
              {
                id: 'status',
                label: 'Estado',
                render: (_, user) => (
                  <Chip
                    label={user.status ? "Activo" : "Inactivo"}
                    icon={user.status ? <CheckCircleIcon /> : <CancelIcon />}
                    size="small"
                    sx={{
                      background: user.status ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                      color: user.status ? '#00e676' : '#ff9800',
                      fontWeight: 600,
                    }}
                  />
                )
              },
              {
                id: 'actions',
                label: 'Acciones',
                render: (_, user) => (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Editar usuario">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        sx={{
                          ...buttonStyles.icon,
                          color: '#7f5fff',
                          '&:hover': {
                            background: 'rgba(127, 95, 255, 0.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleConfirmDelete(user)}
                          disabled={deleteTarget === user._id && loadingDelete}
                          sx={{
                            ...buttonStyles.icon,
                            color: '#ff2eec',
                            '&:hover': {
                              background: 'rgba(255, 46, 236, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )
              }
            ]}
          />
        </Card>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                fontWeight: 600,
              },
            }}
          />
        </Box>
      )}

      {/* Modal de Crear/Editar Usuario */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: isDark 
              ? 'rgba(31, 38, 135, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 4,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          {editMode ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Apellido"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.userEmail}
              onChange={(e) => setForm((f) => ({ ...f, userEmail: e.target.value }))}
              disabled={editMode}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={form.roll}
                  onChange={(e) => setForm((f) => ({ ...f, roll: e.target.value }))}
                  label="Rol"
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {role.icon}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))}
                    color="primary"
                  />
                }
                label="Usuario Activo"
              />
            </Box>
            {!editMode && (
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={form.userPassword}
                onChange={(e) => setForm((f) => ({ ...f, userPassword: e.target.value }))}
              />
            )}
          </Box>
          {formError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setModalOpen(false)}
            disabled={loadingCreate || loadingUpdate}
            sx={buttonStyles.text}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loadingCreate || loadingUpdate}
            variant="contained"
            sx={buttonStyles.primary}
          >
            {loadingCreate || loadingUpdate ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Guardando...
              </Box>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: isDark 
              ? 'rgba(31, 38, 135, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '2px solid #ff2eec',
            borderRadius: 4,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
                width: 64,
                height: 64,
              }}
            >
              <WarningIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff2eec' }}>
            ¿Eliminar Usuario?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Seguro que deseas eliminar a{" "}
            <Typography component="span" sx={{ fontWeight: 700, color: '#7f5fff' }}>
              {confirmDelete?.name}
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
          {errorDelete && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorDelete}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={() => setConfirmDelete(null)}
            disabled={deleteTarget === confirmDelete?.id && loadingDelete}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                background: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
            disabled={deleteTarget === confirmDelete?.id && loadingDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b993d6 0%, #ff2eec 100%)',
              },
            }}
          >
            {deleteTarget === confirmDelete?.id && loadingDelete ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Eliminando...
              </Box>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ResponsiveLayout>
  );
};

export default Users;
