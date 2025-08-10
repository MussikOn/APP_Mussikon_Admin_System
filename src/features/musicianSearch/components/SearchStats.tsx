import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import type { SearchStats as SearchStatsType } from '../types';

interface SearchStatsProps {
  stats: SearchStatsType | null;
}

const SearchStats: React.FC<SearchStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Estadísticas de Búsqueda
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.totalMusicians}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Músicos Encontrados
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calificación Promedio
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              ${stats.averageHourlyRate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Precio Promedio/Hora
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <LocationIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {Object.keys(stats.byLocation).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ubicaciones
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Top Instruments */}
      {Object.keys(stats.byInstrument).length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Instrumentos Más Populares
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(stats.byInstrument)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([instrument, count]) => (
                <Chip
                  key={instrument}
                  label={`${instrument} (${count})`}
                  variant="outlined"
                  size="small"
                />
              ))}
          </Box>
        </Box>
      )}
      
      {/* Top Genres */}
      {Object.keys(stats.byGenre).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Géneros Más Populares
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(stats.byGenre)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([genre, count]) => (
                <Chip
                  key={genre}
                  label={`${genre} (${count})`}
                  variant="outlined"
                  size="small"
                />
              ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SearchStats;

