import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  Paper
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

export interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  value: string;
  count?: number;
}

interface QuickFiltersProps {
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  title?: string;
  showCount?: boolean;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  title = "Filtros Rápidos",
  showCount = true
}) => {
  const [expanded, setExpanded] = useState(false);
  const { isDark } = useTheme();

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const handleSelectAll = () => {
    onFilterChange(filters.map(f => f.value));
  };

  const selectedCount = selectedFilters.length;
  const totalCount = filters.length;

  return (
    <Paper
      elevation={0}
      sx={{
        background: isDark 
          ? 'rgba(31, 38, 135, 0.15)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 3,
        p: 2,
        mb: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: expanded ? 2 : 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {showCount && (
            <Chip
              label={`${selectedCount}/${totalCount}`}
              size="small"
              sx={{
                backgroundColor: selectedCount > 0 ? 'primary.main' : 'text.disabled',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedCount > 0 && (
            <Tooltip title="Limpiar filtros">
              <IconButton
                size="small"
                onClick={handleClearAll}
                aria-label="Limpiar todos los filtros"
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    background: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={expanded ? "Contraer filtros" : "Expandir filtros"}>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Contraer filtros" : "Expandir filtros"}
              sx={{
                color: 'text.secondary',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <Collapse in={expanded}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          pt: 1
        }}>
          {filters.map((filter) => {
            const isSelected = selectedFilters.includes(filter.value);
            return (
              <Chip
                key={filter.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {filter.icon}
                    <span>{filter.label}</span>
                    {filter.count !== undefined && (
                      <span style={{ marginLeft: '4px' }}>
                        ({filter.count})
                      </span>
                    )}
                  </Box>
                }
                onClick={() => handleFilterToggle(filter.value)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  backgroundColor: isSelected 
                    ? `${filter.color}20` 
                    : 'transparent',
                  color: isSelected ? filter.color : 'text.primary',
                  borderColor: isSelected ? filter.color : 'divider',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  '&:hover': {
                    backgroundColor: isSelected 
                      ? `${filter.color}30` 
                      : 'rgba(255,255,255,0.05)',
                    transform: 'translateY(-1px)',
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: filter.color,
                    outlineOffset: '2px',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: filter.color,
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
                aria-label={`${isSelected ? 'Deseleccionar' : 'Seleccionar'} filtro ${filter.label}`}
              />
            );
          })}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <Chip
            label="Seleccionar Todo"
            onClick={handleSelectAll}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: 'rgba(127, 95, 255, 0.1)',
              },
            }}
          />
          <Chip
            label="Limpiar Todo"
            onClick={handleClearAll}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              color: 'error.main',
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              },
            }}
          />
        </Box>
      </Collapse>

      {/* Selected Filters Summary */}
      {selectedCount > 0 && !expanded && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5,
          mt: 1
        }}>
          {filters
            .filter(filter => selectedFilters.includes(filter.value))
            .slice(0, 3)
            .map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                size="small"
                sx={{
                  backgroundColor: `${filter.color}20`,
                  color: filter.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            ))}
          {selectedCount > 3 && (
            <Chip
              label={`+${selectedCount - 3} más`}
              size="small"
              sx={{
                backgroundColor: 'text.disabled',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default QuickFilters; 