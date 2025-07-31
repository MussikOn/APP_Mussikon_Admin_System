import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Event as EventIcon,
  People as PeopleIcon,
  LibraryMusic as LibraryMusicIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useApiRequest } from '../../hooks/useApiRequest';
import { searchService, type SearchFilters, type SearchResult } from '../../services/searchService';

const Search: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    limit: 20,
    page: 1
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Hook para búsqueda
  const searchRequest = useApiRequest(searchService.globalSearch);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Función para realizar búsqueda
  const handleSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      console.log('🔍 Búsqueda vacía, no se ejecuta');
      return;
    }

    console.log('🔍 Ejecutando búsqueda con query:', debouncedQuery);
    console.log('🔍 Filtros aplicados:', filters);

    try {
      await searchRequest.execute({
        ...filters,
        query: debouncedQuery
      });
      console.log('🔍 Búsqueda completada exitosamente');
    } catch (error) {
      console.error('🔍 Error en búsqueda:', error);
    }
  }, [debouncedQuery, filters, searchRequest]);

  // Ejecutar búsqueda cuando cambie la query o filtros
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, filters.category, filters.status, filters.instrument, filters.role]);

  // Función para limpiar búsqueda
  const handleClear = () => {
    console.log('🔍 Limpiando búsqueda');
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters({
      category: 'all',
      limit: 20,
      page: 1
    });
  };

  // Función para exportar resultados
  const handleExport = async () => {
    try {
      console.log('🔍 Exportando resultados de búsqueda');
      // Aquí implementarías la exportación
      console.log('🔍 Exportación completada');
    } catch (error) {
      console.error('🔍 Error exportando resultados:', error);
    }
  };

  // Función para cambiar filtros
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    console.log('🔍 Cambiando filtro:', key, 'a:', value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función para refrescar búsqueda
  const handleRefresh = () => {
    console.log('🔍 Refrescando búsqueda');
    handleSearch();
  };

  // Renderizar resultado individual
  const renderSearchResult = (result: SearchResult) => {
    const getIcon = () => {
      switch (result.type) {
        case 'event':
          return <EventIcon color="primary" />;
        case 'user':
          return <PeopleIcon color="secondary" />;
        case 'request':
          return <LibraryMusicIcon color="success" />;
        default:
          return <SearchIcon />;
      }
    };

    const getTypeLabel = () => {
      switch (result.type) {
        case 'event':
          return 'Evento';
        case 'user':
          return 'Usuario';
        case 'request':
          return 'Solicitud';
        default:
          return 'Otro';
      }
    };

    return (
      <ListItem key={result.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
        <ListItemIcon>
          {getIcon()}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {result.title}
              </Typography>
              <Chip 
                label={getTypeLabel()} 
                size="small" 
                color={result.type === 'event' ? 'primary' : result.type === 'user' ? 'secondary' : 'success'}
              />
              <Chip 
                label={`${Math.round(result.relevance * 100)}%`} 
                size="small" 
                variant="outlined"
              />
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {result.description}
              </Typography>
              {result.metadata && Object.keys(result.metadata).length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {Object.entries(result.metadata).map(([key, value]) => (
                    <Chip 
                      key={key}
                      label={`${key}: ${value}`} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            🔍 Búsqueda Avanzada
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Busca eventos, usuarios y solicitudes en toda la plataforma
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Refrescar búsqueda">
            <IconButton onClick={handleRefresh} color="primary" disabled={searchRequest.loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar resultados">
            <IconButton onClick={handleExport} color="primary" disabled={!searchRequest.data?.results?.length}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Barra de búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              fullWidth
              label="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos, usuarios, solicitudes..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearIcon />}
              disabled={!searchQuery && !searchRequest.data?.results?.length}
            >
              Limpiar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Categoría"
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="events">Eventos</MenuItem>
                <MenuItem value="users">Usuarios</MenuItem>
                <MenuItem value="requests">Solicitudes</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Instrumento</InputLabel>
              <Select
                value={filters.instrument || ''}
                onChange={(e) => handleFilterChange('instrument', e.target.value)}
                label="Instrumento"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="guitarra">Guitarra</MenuItem>
                <MenuItem value="piano">Piano</MenuItem>
                <MenuItem value="bajo">Bajo</MenuItem>
                <MenuItem value="bateria">Batería</MenuItem>
                <MenuItem value="saxofon">Saxofón</MenuItem>
                <MenuItem value="trompeta">Trompeta</MenuItem>
                <MenuItem value="violin">Violín</MenuItem>
                <MenuItem value="canto">Canto</MenuItem>
                <MenuItem value="teclado">Teclado</MenuItem>
                <MenuItem value="flauta">Flauta</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={filters.role || ''}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                label="Rol"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Super Admin</MenuItem>
                <MenuItem value="eventCreator">Creador de Eventos</MenuItem>
                <MenuItem value="musician">Músico</MenuItem>
                <MenuItem value="organizador">Organizador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Resultados de búsqueda
            </Typography>
            {searchRequest.data && (
              <Chip 
                label={`${searchRequest.data.total} resultados`} 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>

          {/* Estado de carga */}
          {searchRequest.loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <Box textAlign="center">
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Buscando...
                </Typography>
              </Box>
            </Box>
          )}

          {/* Error */}
          {searchRequest.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error en la búsqueda: {searchRequest.error}
            </Alert>
          )}

          {/* Resultados */}
          {!searchRequest.loading && searchRequest.data?.results && (
            <>
              {searchRequest.data.results.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron resultados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </Typography>
                </Box>
              ) : (
                <List>
                  {searchRequest.data.results.map(renderSearchResult)}
                </List>
              )}

              {/* Paginación */}
              {searchRequest.data.hasMore && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                    disabled={searchRequest.loading}
                  >
                    Cargar más resultados
                  </Button>
                </Box>
              )}
            </>
          )}

          {/* Estado inicial */}
          {!searchRequest.loading && !searchRequest.error && !searchRequest.data && (
            <Box textAlign="center" py={4}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Ingresa un término de búsqueda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Busca eventos, usuarios o solicitudes usando la barra de búsqueda arriba
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Search; 