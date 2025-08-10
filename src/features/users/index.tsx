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
import { useResponsive } from "../../hooks/useResponsive";
import ResponsiveGrid from "../../components/ResponsiveGrid";
import './Users.css';
import {
  Typography,
  Dialog,
  CircularProgress,
  Pagination,
  Snackbar
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Event as EventIcon,
  MusicNote as MusicIcon,
} from "@mui/icons-material";

const PAGE_SIZE = 10;
const ROLES = [
  { value: "admin", label: "Administrador", icon: <AdminIcon />, className: "admin" },
  { value: "superadmin", label: "Super Administrador", icon: <AdminIcon />, className: "superadmin" },
  { value: "organizador", label: "Organizador", icon: <EventIcon />, className: "organizador" },
  { value: "musico", label: "Músico", icon: <MusicIcon />, className: "musico" }
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
  const { } = useTheme();
  const { isMobile } = useResponsive();
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
    execute: createUserReq,
  } = useApiRequest(createUser);

  const {
    loading: loadingUpdate,
    execute: updateUserReq,
  } = useApiRequest(updateUser);

  const {
    loading: loadingDelete,
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
        setTotalUsers(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE));
      }
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios',
        severity: 'error'
      });
    }
  }, [fetchUsers, page]);

  // Cargar usuarios al montar y cambiar página
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtrar usuarios
  const filtered = users.filter(user => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.userEmail?.toLowerCase().includes(searchLower) ||
      user.roll?.toLowerCase().includes(searchLower)
    );
  });

  // Manejar nuevo usuario
  const handleNew = () => {
    setForm(initialForm);
    setEditMode(false);
    setEditUserId(null);
    setFormError("");
    setModalOpen(true);
  };

  // Manejar edición
  const handleEdit = (user: User) => {
    setForm({
      ...user,
      userPassword: "",
    });
    setEditMode(true);
    setEditUserId(user.userEmail);
    setFormError("");
    setModalOpen(true);
  };

  // Manejar eliminación
  const handleDelete = async (userEmail: string) => {
    try {
      setDeleteTarget(userEmail);
      await deleteUser(userEmail);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success'
      });
      setConfirmDelete(null);
      loadUsers();
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar usuario',
        severity: 'error'
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Manejar guardado
  const handleSave = async () => {
    try {
      setFormError("");

      // Validaciones
      if (!form.name || !form.lastName || !form.userEmail) {
        setFormError("Todos los campos son obligatorios");
        return;
      }

      if (!editMode && !form.userPassword) {
        setFormError("La contraseña es obligatoria para nuevos usuarios");
        return;
      }

      if (editMode) {
        await updateUserReq(editUserId!, form);
        setSnackbar({
          open: true,
          message: 'Usuario actualizado exitosamente',
          severity: 'success'
        });
      } else {
        await createUserReq(form);
        setSnackbar({
          open: true,
          message: 'Usuario creado exitosamente',
          severity: 'success'
        });
      }

      setModalOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error('❌ Error guardando usuario:', error);
      setFormError(error.message || 'Error al guardar usuario');
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  // Función para obtener las iniciales del usuario
  const getUserInitials = (user: User) => {
    return `${user.name?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  // Función para obtener la configuración del rol
  const getRoleConfig = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[3];
  };

  // Función para manejar click de eliminar
  const handleDeleteClick = (user: User) => {
    setConfirmDelete({
      id: user.userEmail,
      name: `${user.name} ${user.lastName}`
    });
  };

  // Renderizar card de usuario
  const renderUserCard = (user: User) => (
    <div key={user.userEmail} className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {getUserInitials(user)}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.name} {user.lastName}</h3>
          <p className="user-email">{user.userEmail}</p>
        </div>
      </div>
      
      <div className="user-card-body">
        <div className="user-details">
          <div className="user-detail-item">
            <span className="user-detail-label">Rol:</span>
            <span className={`user-role-chip ${getRoleConfig(user.roll).className}`}>
              {getRoleConfig(user.roll).icon}
              {getRoleConfig(user.roll).label}
            </span>
          </div>
          
          <div className="user-detail-item">
            <span className="user-detail-label">Estado:</span>
            <span className={`user-status-chip ${user.status ? 'active' : 'inactive'}`}>
              {user.status ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
              {user.status ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        
        <div className="user-actions">
          <button 
            className="user-action-btn edit" 
            onClick={() => handleEdit(user)}
            title="Editar usuario"
          >
            <EditIcon />
          </button>
          <button 
            className="user-action-btn delete" 
            onClick={() => handleDeleteClick(user)}
            title="Eliminar usuario"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <div className="users-title">
          <h1>Gestión de Usuarios</h1>
          <span className="users-count">
            ► {totalUsers} usuarios registrados • Sistema Activo ◄
          </span>
        </div>
        <div className="users-actions">
          <button 
            className="users-refresh-btn"
            onClick={loadUsers}
            disabled={loadingUsers}
          >
            <RefreshIcon />
            {loadingUsers ? 'Escaneando...' : 'Actualizar'}
          </button>
          <button 
            className="users-add-btn"
            onClick={handleNew}
          >
            <AddIcon />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      <div className="users-filters">
        <div className="filters-left">
          <div className="users-search-container">
            <SearchIcon className="users-search-icon" />
            <input
              type="text"
              className="users-search-input"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="filters-right">
          <div className="pagination-info">
            ◆ Página {page} de {totalPages} ◆
          </div>
        </div>
      </div>

      {/* Estados de carga y error */}
      {loadingUsers ? (
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <Typography variant="body1" color="text.secondary">
            ◆ Escaneando base de datos de usuarios ◆
          </Typography>
        </div>
      ) : errorUsers ? (
        <div className="users-error">
          <Typography variant="body1">
            Error al cargar usuarios: {errorUsers}
          </Typography>
        </div>
      ) : filtered.length === 0 ? (
        <div className="users-empty">
          <div className="empty-icon">👥</div>
          <h3>No se encontraron usuarios</h3>
          <p>
            {search 
              ? `No hay usuarios que coincidan con "${search}"`
              : 'Aún no hay usuarios registrados en el sistema'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Grid de usuarios */}
          {isMobile ? (
            <div className="users-grid">
              {filtered.map(renderUserCard)}
            </div>
          ) : (
            <ResponsiveGrid
              type="list"
              gap={3}
            >
              {filtered.map(renderUserCard)}
            </ResponsiveGrid>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="users-pagination">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, value) => setPage(value)}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    background: 'var(--color-glass)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    backdropFilter: 'blur(12px)',
                    '&:hover': {
                      background: 'var(--color-glass-strong)',
                      borderColor: 'var(--color-primary)',
                    },
                    '&.Mui-selected': {
                      background: 'var(--color-primary)',
                      color: 'white',
                      borderColor: 'var(--color-primary)',
                    }
                  }
                }}
              />
              <div className="pagination-info">
                ► Mostrando {filtered.length} de {totalUsers} usuarios ◄
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de formulario */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "user-modal"
        }}
      >
        <div className="user-modal-header">
          <h2 className="user-modal-title">
            {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
        </div>
        
        <div className="user-form">
          {formError && (
            <div className="users-error">
              {formError}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ingresa el nombre"
                required
              />
            </div>
            
            <div className="form-field">
              <label>Apellido *</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Ingresa el apellido"
                required
              />
            </div>
          </div>
          
          <div className="form-field">
            <label>Email *</label>
            <input
              type="email"
              value={form.userEmail}
              onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
              placeholder="usuario@ejemplo.com"
              disabled={editMode}
              required
            />
          </div>
          
          {!editMode && (
            <div className="form-field">
              <label>Contraseña *</label>
              <input
                type="password"
                value={form.userPassword || ''}
                onChange={(e) => setForm({ ...form, userPassword: e.target.value })}
                placeholder="Contraseña segura"
                required
              />
            </div>
          )}
          
          <div className="form-row">
            <div className="form-field">
              <label>Rol</label>
              <select
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <label>Estado</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.checked })}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: 'var(--color-text)' }}>
                  Usuario activo
                </span>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="form-btn secondary" 
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="form-btn primary" 
              onClick={handleSave}
              disabled={loadingCreate || loadingUpdate}
            >
              {loadingCreate || loadingUpdate ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  {editMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                editMode ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        PaperProps={{
          className: "user-modal"
        }}
      >
        <div className="user-modal-header" style={{ background: 'var(--color-gradient-danger)' }}>
          <h2 className="user-modal-title">
            Confirmar Eliminación
          </h2>
        </div>
        
        <div className="user-form">
          <Typography variant="body1" sx={{ color: 'var(--color-text)', mb: 2 }}>
            ¿Estás seguro de que quieres eliminar al usuario{' '}
            <strong style={{ color: 'var(--color-primary)' }}>{confirmDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            Esta acción no se puede deshacer.
          </Typography>
          
          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button 
              type="button" 
              className="form-btn secondary" 
              onClick={() => setConfirmDelete(null)}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="form-btn primary" 
              onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
              disabled={loadingDelete || deleteTarget === confirmDelete?.id}
              style={{ 
                background: 'var(--color-gradient-danger)',
                boxShadow: '0 4px 16px var(--color-accent)44'
              }}
            >
              {loadingDelete || deleteTarget === confirmDelete?.id ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div 
          className={snackbar.severity === 'error' ? 'users-error' : 'users-success'}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '300px'
          }}
        >
          {snackbar.message}
        </div>
      </Snackbar>
    </div>
  );
};

export default Users;
