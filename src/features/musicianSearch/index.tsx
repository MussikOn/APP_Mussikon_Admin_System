import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Pagination,
  Chip,

} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import MusicianSearchForm from './components/MusicianSearchForm';
import MusicianCard from './components/MusicianCard';
import SearchFilters from './components/SearchFilters';
import SearchStats from './components/SearchStats';
import type { MusicianProfile, SearchFilters as SearchFiltersType, SearchResponse } from './types';
import MusicianSearchService from '../../services/musicianSearchService';
import { useAuth } from '../../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MusicianSearch: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    page: 1,
    limit: 12
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchStats, setSearchStats] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = async (searchFilters: SearchFiltersType) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await MusicianSearchService.searchMusicians({
        ...filters,
        ...searchFilters,
        page: 1 // Reset to first page on new search
      });
      
      setSearchResults(results);
      setFilters({ ...filters, ...searchFilters, page: 1 });
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const newFilters = { ...filters, page };
      const results = await MusicianSearchService.searchMusicians(newFilters);
      setSearchResults(results);
      setFilters(newFilters);
    } catch (err) {
      setError('Error al cambiar de página. Por favor, inténtalo de nuevo.');
      console.error('Page change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFiltersType>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const loadRecommendedMusicians = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const results = await MusicianSearchService.getRecommendedMusicians(user.id);
      setSearchResults(results);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularMusicians = async () => {
    try {
      setLoading(true);
      const results = await MusicianSearchService.getPopularMusicians(12);
      setSearchResults(results);
    } catch (err) {
      console.error('Error loading popular musicians:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      loadPopularMusicians();
    } else if (activeTab === 1) {
      loadRecommendedMusicians();
    }
  }, [activeTab, user?.id]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Buscar Músicos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encuentra músicos profesionales para tu evento o proyecto musical
        </Typography>
      </Box>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <MusicianSearchForm onSearch={handleSearch} />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="search tabs">
          <Tab label="Populares" />
          <Tab label="Recomendados" />
          <Tab label="Búsqueda Avanzada" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Músicos Populares
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Los músicos más solicitados y mejor valorados de nuestra plataforma
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Recomendados para Ti
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Músicos recomendados basados en tus preferencias y búsquedas anteriores
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Búsqueda Avanzada
            </Typography>
            <Chip
              icon={<FilterIcon />}
              label="Filtros"
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'default'}
              variant={showFilters ? 'filled' : 'outlined'}
            />
          </Box>
          
          {showFilters && (
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={() => handleSearch(filters)}
            />
          )}
        </TabPanel>
      </Paper>

      {/* Search Results */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searchResults && !loading && (
        <>
          {/* Search Stats */}
          <SearchStats stats={searchStats} />

          {/* Results Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {searchResults.musicians.map((musician) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={musician.id}>
                <MusicianCard musician={musician} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {searchResults.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={searchResults.totalPages}
                page={searchResults.page}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* No Results */}
          {searchResults.musicians.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No se encontraron resultados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar tus filtros de búsqueda o usar términos diferentes
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              label="Búsqueda por Ubicación"
              onClick={() => setActiveTab(2)}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip
              label="Búsqueda por Instrumento"
              onClick={() => setActiveTab(2)}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip
              label="Búsqueda por Género"
              onClick={() => setActiveTab(2)}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MusicianSearch;
