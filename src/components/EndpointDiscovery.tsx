import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { runEndpointDiscovery, runCommonEndpointTest, type EndpointDiscoveryResult } from '../utils/discoverEndpoints';
import { API_CONFIG } from '../config/apiConfig';

const EndpointDiscovery: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<EndpointDiscoveryResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunDiscovery = async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);

    try {
      const discoveryResults = await runEndpointDiscovery();
      setResults(discoveryResults);
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar el descubrimiento');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCommonTest = async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);

    try {
      const testResults = await runCommonEndpointTest();
      setResults(testResults);
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar la prueba común');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 400) return <CheckCircleIcon color="success" />;
    if (status >= 400 && status < 500) return <WarningIcon color="warning" />;
    if (status >= 500) return <ErrorIcon color="error" />;
    return <HelpIcon color="disabled" />;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 400) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };



  const workingEndpoints = results.filter(r => r.status >= 200 && r.status < 400);
  const authRequiredEndpoints = results.filter(r => r.status >= 400 && r.status < 500);
  const serverErrorEndpoints = results.filter(r => r.status >= 500);
  const unavailableEndpoints = results.filter(r => !r.available);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Descubridor de Endpoints
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Descubre qué endpoints están realmente disponibles en el backend
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información del Backend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            URL Base: <strong>{API_CONFIG.BASE_URL}</strong>
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRunDiscovery}
          disabled={isRunning}
          startIcon={isRunning ? <CircularProgress size={20} /> : <SearchIcon />}
          size="large"
        >
          {isRunning ? 'Descubriendo...' : 'Descubrimiento Completo'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleRunCommonTest}
          disabled={isRunning}
          startIcon={isRunning ? <CircularProgress size={20} /> : <SearchIcon />}
          size="large"
        >
          {isRunning ? 'Probando...' : 'Prueba Rápida'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Resultados del Descubrimiento
            </Typography>

            {/* Resumen */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Resumen
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Funcionando: ${workingEndpoints.length}`}
                  color="success"
                  icon={<CheckCircleIcon />}
                />
                <Chip
                  label={`Requiere Auth: ${authRequiredEndpoints.length}`}
                  color="warning"
                  icon={<WarningIcon />}
                />
                <Chip
                  label={`Error Servidor: ${serverErrorEndpoints.length}`}
                  color="error"
                  icon={<ErrorIcon />}
                />
                <Chip
                  label={`No Disponible: ${unavailableEndpoints.length}`}
                  color="default"
                  icon={<HelpIcon />}
                />
              </Box>
            </Box>

            {/* Endpoints Funcionando */}
            {workingEndpoints.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="success.main">
                  🟢 Endpoints Funcionando
                </Typography>
                <List dense>
                  {workingEndpoints.map((endpoint, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(endpoint.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={endpoint.endpoint}
                          secondary={`Status: ${endpoint.status} | Tiempo: ${endpoint.responseTime}ms`}
                        />
                        <Chip
                          label={`${endpoint.status}`}
                          color={getStatusColor(endpoint.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < workingEndpoints.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/* Endpoints que Requieren Auth */}
            {authRequiredEndpoints.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="warning.main">
                  🟡 Endpoints que Requieren Autenticación
                </Typography>
                <List dense>
                  {authRequiredEndpoints.map((endpoint, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(endpoint.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={endpoint.endpoint}
                          secondary={`Status: ${endpoint.status} | Tiempo: ${endpoint.responseTime}ms`}
                        />
                        <Chip
                          label={`${endpoint.status}`}
                          color={getStatusColor(endpoint.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < authRequiredEndpoints.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/* Errores del Servidor */}
            {serverErrorEndpoints.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="error.main">
                  🔴 Errores del Servidor
                </Typography>
                <List dense>
                  {serverErrorEndpoints.map((endpoint, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(endpoint.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={endpoint.endpoint}
                          secondary={`Status: ${endpoint.status} | Tiempo: ${endpoint.responseTime}ms`}
                        />
                        <Chip
                          label={`${endpoint.status}`}
                          color={getStatusColor(endpoint.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < serverErrorEndpoints.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/* Endpoints No Disponibles */}
            {unavailableEndpoints.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="text.secondary">
                  ❌ Endpoints No Disponibles
                </Typography>
                <List dense>
                  {unavailableEndpoints.slice(0, 10).map((endpoint, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(endpoint.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={endpoint.endpoint}
                          secondary={`Error: ${endpoint.error || 'No disponible'} | Tiempo: ${endpoint.responseTime}ms`}
                        />
                      </ListItem>
                      {index < Math.min(unavailableEndpoints.length, 10) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                {unavailableEndpoints.length > 10 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ... y {unavailableEndpoints.length - 10} más
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instrucciones */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Instrucciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Descubrimiento Completo:</strong> Prueba 60+ endpoints posibles para encontrar todos los disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Prueba Rápida:</strong> Prueba solo los endpoints más comunes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>🟢 Funcionando:</strong> Endpoints que responden correctamente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>🟡 Requiere Auth:</strong> Endpoints que existen pero necesitan autenticación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>🔴 Error Servidor:</strong> Endpoints que causan errores del servidor
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EndpointDiscovery; 