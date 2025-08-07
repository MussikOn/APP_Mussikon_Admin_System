import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Chip,
  Typography,
  Button,
  CircularProgress,
  Collapse
} from '@mui/material';
import {
  Wifi as WifiIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { testBasicConnection } from '../../../utils/simpleConnectionTest';
import { API_CONFIG } from '../../../config/apiConfig';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ showDetails = false }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      const result = await testBasicConnection();
      setIsConnected(result.success);
      setLastCheck(new Date());
      
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setIsConnected(false);
      setErrorMessage(error.message || 'Error al verificar conexión');
      setLastCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'default';
    return isConnected ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    if (isChecking) return <CircularProgress size={16} />;
    if (isConnected === null) return <WifiIcon />;
    return isConnected ? <CheckCircleIcon /> : <ErrorIcon />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Verificando...';
    if (isConnected === null) return 'Desconocido';
    return isConnected ? 'Conectado' : 'Desconectado';
  };

  const formatLastCheck = () => {
    if (!lastCheck) return 'Nunca';
    return lastCheck.toLocaleTimeString();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          icon={getStatusIcon()}
          label={getStatusText()}
          color={getStatusColor()}
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          Última verificación: {formatLastCheck()}
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={checkConnection}
          disabled={isChecking}
          sx={{ ml: 'auto' }}
        >
          Verificar
        </Button>
      </Box>

      {showDetails && (
        <Collapse in={showDetails}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              URL del Backend: {API_CONFIG.BASE_URL}
            </Typography>
            
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Alert>
            )}
            
            {isConnected && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Conexión establecida correctamente con el backend
              </Alert>
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default ConnectionStatus; 