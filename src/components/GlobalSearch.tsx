import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Keyboard as KeyboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  LibraryMusic as LibraryMusicIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { searchService } from '../services/searchService';
import type { SearchFilters } from '../services/searchService';

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'event' | 'request' | 'image';
  path: string;
  icon: React.ReactNode;
  color: string;
}

const searchTypes = {
  user: { icon: <PeopleIcon />, color: '#00e0ff', label: 'Usuario' },
  event: { icon: <EventIcon />, color: '#ff2eec', label: 'Evento' },
  request: { icon: <LibraryMusicIcon />, color: '#b993d6', label: 'Solicitud' },
  image: { icon: <ImageIcon />, color: '#00fff7', label: 'Imagen' }
};

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();
  const navigate = useNavigate();





  // Función para realizar búsqueda real usando el servicio
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Iniciando búsqueda global:', searchQuery);
      
      // Configurar filtros de búsqueda
      const filters: SearchFilters = {
        query: searchQuery,
        category: 'all',
        limit: 10
      };

      // Realizar búsqueda global
      const response = await searchService.globalSearch(filters);
      
      console.log('🔍 Resultados de búsqueda recibidos:', response);
      
      // Convertir los resultados del backend al formato esperado por el componente
      const allResults: SearchResultItem[] = [];
      
      // Extraer los datos de la estructura real
      const events = response.data?.events || [];
      const requests = response.data?.requests || [];
      const users = response.data?.users || [];
      
      // Procesar eventos
      if (events.length > 0) {
        events.forEach((event: any) => {
          allResults.push({
            id: event.id || event.user || 'event-' + Math.random(),
            title: event.eventName || 'Evento sin nombre',
            description: `${event.eventType || 'Evento'} - ${event.date || 'Sin fecha'}`,
            type: 'event',
            path: `/events/${event.id || event.user}`,
            icon: <EventIcon />,
            color: '#ff2eec'
          });
        });
      }
      
      // Procesar solicitudes de músicos
      if (requests.length > 0) {
        requests.forEach((request: any) => {
          allResults.push({
            id: request.id || request.user || 'request-' + Math.random(),
            title: request.eventName || 'Solicitud sin nombre',
            description: `${request.instrument || 'Instrumento'} - ${request.status || 'Pendiente'}`,
            type: 'request',
            path: `/musician-requests/${request.id || request.user}`,
            icon: <LibraryMusicIcon />,
            color: '#b993d6'
          });
        });
      }
      
      // Procesar usuarios
      if (users.length > 0) {
        users.forEach((user: any) => {
          allResults.push({
            id: user.userEmail || user.id || 'user-' + Math.random(),
            title: `${user.name || 'Usuario'} ${user.lastName || ''}`,
            description: `${user.roll || 'Usuario'} - ${user.userEmail || 'Sin email'}`,
            type: 'user',
            path: `/users/${user.userEmail || user.id}`,
            icon: <PeopleIcon />,
            color: '#00e0ff'
          });
        });
      }
      
      console.log('🔍 Resultados convertidos:', allResults);
      setResults(allResults);
      
    } catch (error: any) {
      console.error('🔍 Error en búsqueda global:', error);
      
      // Manejar diferentes tipos de errores
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        setError('La búsqueda fue bloqueada por una extensión del navegador. Intenta desactivar ad-blockers o extensiones de privacidad.');
      } else if (error.status === 404) {
        setError('El servicio de búsqueda no está disponible en este momento.');
      } else if (error.status === 500) {
        setError('Error interno del servidor. Intenta nuevamente en unos momentos.');
      } else if (error.message?.includes('Network Error')) {
        setError('Error de conexión. Verifica tu conexión a internet y que el backend esté funcionando.');
      } else {
        setError(`Error en la búsqueda: ${error.message || 'Error desconocido'}`);
      }
      
      // Usar datos de respaldo en caso de error
      setResults(getFallbackResults(searchQuery));
    } finally {
      setLoading(false);
    }
  };

  // Datos de respaldo en caso de error
  const getFallbackResults = (searchQuery: string): SearchResultItem[] => {
    const mockResults: SearchResultItem[] = [
      {
        id: '1',
        title: 'Juan Pérez',
        description: 'Músico - Guitarra',
        type: 'user',
        path: '/users/1',
        icon: <PeopleIcon />,
        color: '#00e0ff'
      },
      {
        id: '2',
        title: 'Concierto de Rock',
        description: 'Evento - 15 de Diciembre',
        type: 'event',
        path: '/events/2',
        icon: <EventIcon />,
        color: '#ff2eec'
      },
      {
        id: '3',
        title: 'Solicitud de Baterista',
        description: 'Pendiente de revisión',
        type: 'request',
        path: '/musician-requests/3',
        icon: <LibraryMusicIcon />,
        color: '#b993d6'
      }
    ];

    return mockResults.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
    setError(null);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResultItem) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <TextField
        ref={inputRef}
        fullWidth
        placeholder="Buscar usuarios, eventos, solicitudes..."
        value={query}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : query ? (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
                >
                  <ClearIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <KeyboardIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled">
                    Ctrl+K
                  </Typography>
                </Box>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            background: isDark 
              ? 'rgba(31, 38, 135, 0.15)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'}`,
            '&:hover': {
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'}`,
            },
            '&.Mui-focused': {
              border: `2px solid ${isDark ? '#7f5fff' : '#7f5fff'}`,
            },
          },
        }}
        aria-label="Búsqueda global"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
        aria-autocomplete="list"
      />

      <Popper
        open={isOpen && (query.length > 0 || results.length > 0 || !!error)}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              borderRadius: 3,
              background: isDark 
                ? 'rgba(31, 38, 135, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'}`,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            {error ? (
              <Box sx={{ p: 2 }}>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  {error}
                </Alert>
                {results.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Mostrando resultados de respaldo
                  </Typography>
                )}
              </Box>
            ) : null}
            
            {loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Buscando...
                </Typography>
              </Box>
            ) : results.length > 0 ? (
              <List sx={{ p: 0 }}>
                {results.map((result, index) => (
                  <ListItem key={result.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleResultClick(result)}
                      selected={index === selectedIndex}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${result.color}15 0%, ${result.color}05 100%)`,
                        },
                        '&.Mui-selected': {
                          background: `linear-gradient(135deg, ${result.color}20 0%, ${result.color}10 100%)`,
                          borderLeft: `3px solid ${result.color}`,
                        },
                        '&:focus': {
                          outline: '2px solid',
                          outlineColor: result.color,
                          outlineOffset: '2px',
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: result.color,
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: result.color,
                          minWidth: 40,
                        }}
                      >
                        {result.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={result.title}
                        secondary={result.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                        }}
                      />
                      <Chip
                        label={searchTypes[result.type].label}
                        size="small"
                        sx={{
                          backgroundColor: `${result.color}20`,
                          color: result.color,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : query.length > 0 && !loading && !error ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron resultados para "{query}"
                </Typography>
              </Box>
            ) : null}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default GlobalSearch; 