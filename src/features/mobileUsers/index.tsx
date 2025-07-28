import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Fab,
  Snackbar,
  Container
} from '@mui/material';
import { 
  Add, 
  Refresh, 
  People
} from '@mui/icons-material';
import { useMobileUsers } from './hooks/useMobileUsers';
import MobileUserCard from './components/MobileUserCard';
import MobileUserForm from './components/MobileUserForm';
import MobileUserDetails from './components/MobileUserDetails';
import MobileUserFilters from './components/MobileUserFilters';
import type { MobileUser, CreateUserData } from './types/mobileUser';

const MobileUsers = () => {
  const {
    users,
    loading,
    error,
    stats,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
  } = useMobileUsers();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingUser, setEditingUser] = useState<MobileUser | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createUser(userData);
      setSnackbar({
        open: true,
        message: 'Usuario móvil creado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al crear usuario móvil',
        severity: 'error'
      });
    }
  };

  const handleUpdateUser = async (userData: CreateUserData) => {
    if (!editingUser?._id) return;
    
    try {
      // Convert boolean status to string status for update
      const updateData = {
        ...userData,
        status: userData.status ? 'active' : 'inactive'
      } as const;
      await updateUser(editingUser._id, updateData);
      setSnackbar({
        open: true,
        message: 'Usuario móvil actualizado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar usuario móvil',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario móvil?')) {
      return;
    }

    try {
      await deleteUser(id);
      setSnackbar({
        open: true,
        message: 'Usuario móvil eliminado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar usuario móvil',
        severity: 'error'
      });
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await blockUser(userId);
      setSnackbar({
        open: true,
        message: 'Usuario bloqueado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al bloquear usuario',
        severity: 'error'
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId);
      setSnackbar({
        open: true,
        message: 'Usuario desbloqueado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al desbloquear usuario',
        severity: 'error'
      });
    }
  };

  const handleEditUser = (user: MobileUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const [selectedUser, setSelectedUser] = useState<MobileUser | null>(null);

  const handleViewUser = (user: MobileUser) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filtros aplicados:', filters);
  };

  const handleClearFilters = () => {
    // setFilters({}); // Función no disponible en el hook actualizado
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };



  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="mobile-users-container" style={{ 
        background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.05) 0%, rgba(0, 0, 0, 0.9) 100%)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(0, 255, 247, 0.2)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header futurista */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
              animation: 'pulse 2s infinite'
            }}>
              <People sx={{ color: '#000', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#00fff7', 
                  fontWeight: 800,
                  textShadow: '0 0 20px rgba(0, 255, 247, 0.5)',
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  letterSpacing: '2px'
                }}
              >
                USUARIOS MÓVILES
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#b0b8c1',
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  mt: 0.5
                }}
              >
                Gestión y Soporte de Usuarios de la App Móvil
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ 
                borderColor: '#00fff7',
                color: '#00fff7',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  borderColor: '#00ff88',
                  backgroundColor: 'rgba(0, 255, 247, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 255, 247, 0.3)'
                }
              }}
            >
              ACTUALIZAR
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowForm(true)}
              sx={{ 
                background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                color: '#000',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.9rem',
                boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00ff88, #00fff7)',
                  boxShadow: '0 0 25px rgba(0, 255, 247, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              NUEVO USUARIO
            </Button>
          </Box>
        </Box>

        {/* Estadísticas */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
          gap: 2,
          mb: 4
        }}>
          <Box sx={{
            background: 'rgba(0, 255, 247, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(0, 255, 247, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#00fff7', fontWeight: 700 }}>
              {stats?.totalUsers || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Total Usuarios
            </Typography>
          </Box>
          
          <Box sx={{
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
              {stats?.activeUsers || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Activos
            </Typography>
          </Box>
          
          <Box sx={{
            background: 'rgba(255, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#ff4444', fontWeight: 700 }}>
              {stats?.blockedUsers || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Bloqueados
            </Typography>
          </Box>
          
          <Box sx={{
            background: 'rgba(255, 170, 0, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 170, 0, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#ffaa00', fontWeight: 700 }}>
              {stats?.pendingUsers || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Pendientes
            </Typography>
          </Box>
          
          <Box sx={{
            background: 'rgba(138, 43, 226, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#8a2be2', fontWeight: 700 }}>
              {stats?.organizers || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Organizadores
            </Typography>
          </Box>
          
          <Box sx={{
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700 }}>
              {stats?.musicians || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
              Músicos
            </Typography>
          </Box>
        </Box>

        {/* Filtros */}
        <MobileUserFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Mensajes de error */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              '& .MuiAlert-icon': {
                color: '#ff4444'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading futurista */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 8,
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{
              position: 'relative',
              width: 80,
              height: 80
            }}>
              <CircularProgress 
                size={80}
                thickness={4}
                sx={{ 
                  color: '#00fff7',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }} 
              />
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 255, 247, 0.5)'
              }}>
                <People sx={{ color: '#000', fontSize: 20 }} />
              </Box>
            </Box>
            <Typography sx={{ color: '#00fff7', fontWeight: 600, letterSpacing: '1px' }}>
              CARGANDO USUARIOS...
            </Typography>
          </Box>
        )}

        {/* Lista de usuarios */}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 12,
                color: '#b0b8c1'
              }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(0, 255, 136, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(0, 255, 247, 0.3)'
                }}>
                  <People sx={{ fontSize: 48, color: '#00fff7' }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#00fff7', fontWeight: 600 }}>
                  No hay usuarios móviles para mostrar
                </Typography>
                <Typography variant="body1" sx={{ color: '#b0b8c1', maxWidth: 400, mx: 'auto' }}>
                  {users.length === 0 
                    ? 'No se han registrado usuarios móviles aún. ¡Crea el primero para comenzar!'
                    : 'No se encontraron usuarios con los filtros aplicados.'
                  }
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)', 
                  lg: 'repeat(4, 1fr)' 
                }, 
                gap: 3,
                animation: 'fadeIn 0.6s ease-out'
              }}>
                {users.map((user) => (
                  <Box key={user._id} sx={{
                    animation: 'slideIn 0.4s ease-out',
                    animationDelay: `${users.indexOf(user) * 0.1}s`
                  }}>
                    <MobileUserCard
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      onView={handleViewUser}
                      onBlock={handleBlockUser}
                      onUnblock={handleUnblockUser}
                      loading={loading}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Formulario de usuario */}
        <MobileUserForm
          open={showForm}
          onClose={handleCloseForm}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          user={editingUser}
          loading={loading}
        />

        {/* Detalles del usuario */}
        <MobileUserDetails
          user={selectedUser}
          open={showDetails}
          onClose={handleCloseDetails}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
          loading={loading}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* FAB futurista */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setShowForm(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #00fff7, #00ff88)',
            color: '#000',
            width: 64,
            height: 64,
            boxShadow: '0 0 25px rgba(0, 255, 247, 0.5)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00ff88, #00fff7)',
              boxShadow: '0 0 35px rgba(0, 255, 247, 0.7)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Add sx={{ fontSize: 28 }} />
        </Fab>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </Container>
  );
};

export default MobileUsers; 