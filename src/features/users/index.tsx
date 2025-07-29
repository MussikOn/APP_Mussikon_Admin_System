import React, { useEffect, useState } from "react";
import type { User } from "../../services/usersService";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUserByEmail,
} from "../../services/usersService";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  InputAdornment
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
  MusicNote as MusicIcon
} from "@mui/icons-material";

const PAGE_SIZE = 10;
const ROLES = [
  { value: "admin", label: "Administrador", icon: <AdminIcon />, color: "#00fff7" },
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
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<User>(initialForm);
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUsers().then((data) => {
      if (data) setUsers(data);
    });
  }, [fetchUsers]);

  // Filtro de búsqueda
  const filtered = users.filter((u) =>
    (u.name + " " + u.lastName + " " + u.userEmail)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Validación simple
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
      if (editMode && editUserEmail) {
        await updateUserReq(editUserEmail, form);
      } else {
        await createUserReq(form);
      }
      setModalOpen(false);
      setForm(initialForm);
      setEditMode(false);
      setEditUserEmail(null);
      setPage(1);
      // Refresca usuarios
      const data = await fetchUsers();
      if (data) setUsers(data);
    } catch (e) {
      setFormError(
        editMode ? "Error al editar usuario" : "Error al crear usuario"
      );
    }
  };

  // Eliminar usuario
  const handleDelete = async (userEmail: string) => {
    const normalizedEmail = userEmail.trim().toLowerCase();
    setDeleteTarget(normalizedEmail);
    try {
      await deleteUser(normalizedEmail);
      // Refresca usuarios
      const data = await fetchUsers();
      if (data) setUsers(data);
      setConfirmDelete(null);
    } catch (e) {
      // El error se maneja por errorDelete
    } finally {
      setDeleteTarget(null);
    }
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[2];
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
                fontSize: { xs: '2rem', md: '2.5rem' }
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
              <IconButton
                onClick={() => fetchUsers()}
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
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setModalOpen(true);
                setForm(initialForm);
                setFormError("");
                setEditMode(false);
                setEditUserEmail(null);
              }}
              sx={{
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(127, 95, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(127, 95, 255, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Filtros y Estadísticas */}
      <Card
        sx={{
          background: isDark 
            ? 'rgba(31, 38, 135, 0.15)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 4,
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
                  setPage(1);
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
                  {filtered.length} usuario{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`Admin: ${users.filter(u => u.roll === 'admin').length}`}
                    size="small"
                    icon={<AdminIcon />}
                    sx={{ 
                      background: 'rgba(0, 255, 247, 0.1)', 
                      color: '#00fff7',
                      fontWeight: 600 
                    }} 
                  />
                  <Chip 
                    label={`Organizadores: ${users.filter(u => u.roll === 'organizador').length}`}
                    size="small"
                    icon={<EventIcon />}
                    sx={{ 
                      background: 'rgba(185, 147, 214, 0.1)', 
                      color: '#b993d6',
                      fontWeight: 600 
                    }} 
                  />
                  <Chip 
                    label={`Músicos: ${users.filter(u => u.roll === 'musico').length}`}
                    size="small"
                    icon={<MusicIcon />}
                    sx={{ 
                      background: 'rgba(255, 46, 236, 0.1)', 
                      color: '#ff2eec',
                      fontWeight: 600 
                    }} 
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
          sx={{
            background: isDark 
              ? 'rgba(31, 38, 135, 0.15)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 4,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay usuarios para mostrar.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user, index) => {
                    const roleInfo = getRoleInfo(user.roll);
                    return (
                      <TableRow 
                        key={index}
                        sx={{
                          '&:hover': {
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <TableCell>
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
                                 ID: {(user as any)._id || 'N/A'}
                               </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {user.userEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Editar usuario">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setModalOpen(true);
                                  setEditMode(true);
                                  setEditUserEmail(user.userEmail);
                                  setForm({
                                    name: user.name,
                                    lastName: user.lastName,
                                    userEmail: user.userEmail,
                                    roll: user.roll,
                                    status: user.status,
                                    userPassword: "",
                                  });
                                  setFormError("");
                                }}
                                sx={{
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
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setConfirmDelete({
                                    email: user.userEmail,
                                    name: user.name + " " + user.lastName,
                                  })
                                }
                                disabled={deleteTarget === user.userEmail && loadingDelete}
                                sx={{
                                  color: '#ff2eec',
                                  '&:hover': {
                                    background: 'rgba(255, 46, 236, 0.1)',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
            onClick={handleSave}
            disabled={loadingCreate || loadingUpdate}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
              },
            }}
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
            disabled={deleteTarget === confirmDelete?.email && loadingDelete}
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
            onClick={() => confirmDelete && handleDelete(confirmDelete.email)}
            disabled={deleteTarget === confirmDelete?.email && loadingDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b993d6 0%, #ff2eec 100%)',
              },
            }}
          >
            {deleteTarget === confirmDelete?.email && loadingDelete ? (
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
    </Box>
  );
};

export default Users;
