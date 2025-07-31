import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { searchService, SearchFilters, SearchResult } from '../../services/searchService';
import { useApiRequest } from '../../hooks/useApiRequest';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Person as PersonIcon,
  MusicNote as MusicIcon,
  TrendingUp as TrendingIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const Search: React.FC = () => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'events' | 'users' | 'requests'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    limit: 20,
    page: 1
  });

  // Hook para manejar las peticiones API
  const { execute: executeSearch } = useApiRequest();

  // Función para realizar búsqueda
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const searchFilters: SearchFilters = {
        ...filters,
        query: query.trim(),
        category: category === 'all' ? undefined : category
      };

      let response;
      if (category === 'all') {
        response = await executeSearch(() => searchService.globalSearch(searchFilters));
      } else if (category === 'events') {
        response = await executeSearch(() => searchService.searchEvents(searchFilters));
      } else if (category === 'users') {
        response = await executeSearch(() => searchService.searchUsers(searchFilters));
      } else if (category === 'requests') {
        response = await executeSearch(() => searchService.searchMusicianRequests(searchFilters));
      }

      if (response?.data) {
        setResults(response.data.results || []);
      }
    } catch (err) {
      setError('Error al realizar la búsqueda');
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  }, [query, category, filters, executeSearch]);

  // Búsqueda automática con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, category, filters, handleSearch]);

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError('');
  };

  // Obtener icono según el tipo de resultado
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <EventIcon />;
      case 'user':
        return <PersonIcon />;
      case 'request':
        return <MusicIcon />;
      default:
        return <SearchIcon />;
    }
  };

  // Obtener color según el tipo de resultado
  const getResultColor = (type: string) => {
    switch (type) {
      case 'event':
        return '#00fff7';
      case 'user':
        return '#00ff88';
      case 'request':
        return '#ff2eec';
      default:
        return '#b993d6';
    }
  };

  // Exportar resultados
  const handleExport = async () => {
    try {
      const searchFilters: SearchFilters = {
        ...filters,
        query: query.trim(),
        category: category === 'all' ? undefined : category
      };

      const response = await searchService.globalSearch(searchFilters);
      
      // Crear archivo CSV
      const csvContent = [
        ['Tipo', 'Título', 'Descripción', 'Relevancia'],
        ...results.map(result => [
          result.type,
          result.title,
          result.description,
          result.relevance.toString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `busqueda_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al exportar resultados');
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: isDark ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #00fff7, #00ff88)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}
      >
        🔍 Búsqueda Avanzada
      </Typography>

      {/* Barra de búsqueda principal */}
      <Card sx={{ 
        mb: 3, 
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar eventos, usuarios, solicitudes..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00fff7' }} />
                    </InputAdornment>
                  ),
                  endAdornment: query && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                    '&:hover fieldset': {
                      borderColor: '#00fff7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ff88',
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  label="Categoría"
                  sx={{
                    borderRadius: 3,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="events">Eventos</MenuItem>
                  <MenuItem value="users">Usuarios</MenuItem>
                  <MenuItem value="requests">Solicitudes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<FilterIcon />}
                  sx={{
                    borderRadius: 3,
                    borderColor: '#00fff7',
                    color: '#00fff7',
                    '&:hover': {
                      borderColor: '#00ff88',
                      backgroundColor: 'rgba(0,255,247,0.1)',
                    }
                  }}
                >
                  Filtros
                </Button>
                
                {results.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleExport}
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderRadius: 3,
                      borderColor: '#00ff88',
                      color: '#00ff88',
                      '&:hover': {
                        borderColor: '#00fff7',
                        backgroundColor: 'rgba(0,255,136,0.1)',
                      }
                    }}
                  >
                    Exportar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Filtros avanzados */}
          {showFilters && (
            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#00fff7' }}>
                Filtros Avanzados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Estado"
                    placeholder="Filtrar por estado"
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Instrumento"
                    placeholder="Filtrar por instrumento"
                    value={filters.instrument || ''}
                    onChange={(e) => setFilters({ ...filters, instrument: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Rol"
                    placeholder="Filtrar por rol"
                    value={filters.role || ''}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Estado de carga */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#00fff7' }} />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
              <Typography variant="h6" sx={{ color: '#00fff7', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingIcon />
                Resultados ({results.length})
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {results.map((result, index) => (
                <React.Fragment key={result.id}>
                  <ListItem 
                    sx={{ 
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        transform: 'translateX(5px)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: getResultColor(result.type),
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0,255,247,0.3)'
                        }}
                      >
                        {getResultIcon(result.type)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: isDark ? 'white' : 'black', fontWeight: 600 }}>
                          {result.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', mb: 1 }}>
                            {result.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={result.type} 
                              size="small" 
                              sx={{ 
                                bgcolor: getResultColor(result.type),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                            <Chip 
                              label={`Relevancia: ${result.relevance}%`} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderColor: '#00fff7',
                                color: '#00fff7'
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          edge="end" 
                          sx={{ 
                            color: '#00fff7',
                            '&:hover': {
                              color: '#00ff88',
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < results.length - 1 && (
                    <Divider sx={{ mx: 3, opacity: 0.3 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {!loading && !error && query && results.length === 0 && (
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SearchIcon sx={{ fontSize: 64, color: '#00fff7', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ color: isDark ? 'white' : 'black', mb: 1 }}>
              No se encontraron resultados
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
              Intenta con otros términos de búsqueda o ajusta los filtros
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Search; 