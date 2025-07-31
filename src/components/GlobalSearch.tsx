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
  ClickAwayListener
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
import { useTheme } from '../contexts/ThemeContext';

interface SearchResult {
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Simular búsqueda (en producción esto sería una llamada a la API)
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));

    // Datos de ejemplo
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Juan Pérez',
        description: 'Músico - Guitarra',
        type: 'user' as const,
        path: '/users',
        icon: <PeopleIcon />,
        color: '#00e0ff'
      },
      {
        id: '2',
        title: 'Concierto de Rock',
        description: 'Evento - 15 de Diciembre',
        type: 'event' as const,
        path: '/events',
        icon: <EventIcon />,
        color: '#ff2eec'
      },
      {
        id: '3',
        title: 'Solicitud de Baterista',
        description: 'Pendiente de revisión',
        type: 'request' as const,
        path: '/musician-requests',
        icon: <LibraryMusicIcon />,
        color: '#b993d6'
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setLoading(false);
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
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
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
        open={isOpen && (query.length > 0 || results.length > 0)}
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
            ) : query.length > 0 ? (
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