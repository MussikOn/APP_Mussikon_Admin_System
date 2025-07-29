import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  SelectAll as SelectAllIcon
} from '@mui/icons-material';

interface ImageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'date' | 'name' | 'size';
  setSortBy: (sort: 'date' | 'name' | 'size') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onSelectAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  onCategoryFilter?: (category: any) => void;
  onPublicFilter?: () => void;
}

const ImageFilters: React.FC<ImageFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onSelectAll,
  allSelected,
  someSelected,
  onCategoryFilter,
  onPublicFilter
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filtros y Controles
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Búsqueda y controles principales */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 300, flexGrow: 1 }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="date">Fecha</MenuItem>
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="size">Tamaño</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Vista:
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid" aria-label="vista de cuadrícula">
                  <GridIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="vista de lista">
                  <ListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Filtros rápidos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Filtros:
            </Typography>
            
            <Chip 
              label="Todas" 
              onClick={() => setSearchTerm('')}
              color="primary"
              variant="outlined"
            />
            
            <Chip 
              label="Públicas" 
              onClick={onPublicFilter}
              variant="outlined"
            />
            
            <Chip 
              label="Perfil" 
              onClick={() => onCategoryFilter?.('profile')}
              variant="outlined"
            />
            
            <Chip 
              label="Posts" 
              onClick={() => onCategoryFilter?.('post')}
              variant="outlined"
            />
            
            <Chip 
              label="Eventos" 
              onClick={() => onCategoryFilter?.('event')}
              variant="outlined"
            />
            
            <Chip 
              label="Galería" 
              onClick={() => onCategoryFilter?.('gallery')}
              variant="outlined"
            />
          </Box>

          {/* Selección múltiple */}
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SelectAllIcon />}
              onClick={onSelectAll}
              size="small"
            >
              {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </Button>
            
            {someSelected && (
              <Typography variant="body2" color="text.secondary">
                {someSelected ? 'Selección parcial' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImageFilters; 