import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { SearchFilters } from '../types';

interface MusicianSearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

const MusicianSearchForm: React.FC<MusicianSearchFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SearchFilters = {
      query: query.trim() || undefined,
      location: location.trim() || undefined,
      page: 1,
      limit: 12
    };
    onSearch(filters);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Búsqueda Rápida
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Buscar músicos, instrumentos o géneros"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: guitarrista, jazz, rock..."
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ciudad, estado o país"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ height: 56 }}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MusicianSearchForm;
