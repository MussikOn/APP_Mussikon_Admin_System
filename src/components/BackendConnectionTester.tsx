import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Wifi as WifiIcon,
  Speed as SpeedIcon,
  BugReport as BugReportIcon,
} from "@mui/icons-material";
import {
  runBackendConnectionTests,
  checkBackendHealth,
  type BackendConnectionSummary,
  type ConnectionTestResult,
} from "../utils/backendConnectionTest";
import { API_CONFIG } from "../config/apiConfig";

const BackendConnectionTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BackendConnectionSummary | null>(null);
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      // Primero verificar si el backend está disponible
      const isHealthy = await checkBackendHealth();
      setHealthStatus(isHealthy);

      if (!isHealthy) {
        setError(
          "El backend no está disponible. Verifica que el servidor esté ejecutándose."
        );
        setIsRunning(false);
        return;
      }

      // Ejecutar todas las pruebas
      const testResults = await runBackendConnectionTests();
      setResults(testResults);
    } catch (err: any) {
      setError(err.message || "Error al ejecutar las pruebas");
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? "success" : "error";
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircleIcon color="success" />
    ) : (
      <ErrorIcon color="error" />
    );
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const groupResultsByCategory = (results: ConnectionTestResult[]) => {
    const categories: Record<string, ConnectionTestResult[]> = {
      "Sistema de Pagos": [],
      Autenticación: [],
      "Gestión de Usuarios": [],
      "Gestión de Eventos": [],
      Analytics: [],
      "Gestión de Imágenes": [],
    };

    results.forEach((result) => {
      if (result.endpoint.includes("/payment-system")) {
        categories["Sistema de Pagos"].push(result);
      } else if (result.endpoint.includes("/auth")) {
        categories["Autenticación"].push(result);
      } else if (result.endpoint.includes("/admin/users")) {
        categories["Gestión de Usuarios"].push(result);
      } else if (result.endpoint.includes("/admin/events")) {
        categories["Gestión de Eventos"].push(result);
      } else if (result.endpoint.includes("/analytics")) {
        categories["Analytics"].push(result);
      } else if (result.endpoint.includes("/imgs")) {
        categories["Gestión de Imágenes"].push(result);
      }
    });

    return categories;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Verificador de Conexión con Backend
      </Typography>

      {/* Información del Backend */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <WifiIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Información del Backend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            URL Base: <strong>{API_CONFIG.BASE_URL}</strong>
          </Typography>
          {healthStatus !== null && (
            <Alert
              severity={healthStatus ? "success" : "error"}
              sx={{ mt: 2 }}
              icon={healthStatus ? <CheckCircleIcon /> : <ErrorIcon />}
            >
              {healthStatus ? "Backend disponible" : "Backend no disponible"}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Botón de Prueba */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleRunTests}
          disabled={isRunning}
          startIcon={
            isRunning ? <CircularProgress size={20} /> : <BugReportIcon />
          }
          size="large"
        >
          {isRunning ? "Ejecutando Pruebas..." : "Ejecutar Pruebas de Conexión"}
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Resultados de las Pruebas
            </Typography>

            {/* Resumen General */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Resumen General
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`Total: ${results.totalTests}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Exitosas: ${results.successfulTests}`}
                  color="success"
                  icon={<CheckCircleIcon />}
                />
                <Chip
                  label={`Fallidas: ${results.failedTests}`}
                  color="error"
                  icon={<ErrorIcon />}
                />
                <Chip
                  label={`Tasa de Éxito: ${results.successRate.toFixed(1)}%`}
                  color={
                    results.successRate >= 80
                      ? "success"
                      : results.successRate >= 60
                      ? "warning"
                      : "error"
                  }
                />
                <Chip
                  label={`Tiempo Promedio: ${formatResponseTime(
                    results.averageResponseTime
                  )}`}
                  color="info"
                  icon={<SpeedIcon />}
                />
              </Box>
            </Box>

            {/* Resultados Detallados por Categoría */}
            <Typography variant="subtitle1" gutterBottom>
              Resultados Detallados
            </Typography>

            {Object.entries(groupResultsByCategory(results.results)).map(
              ([category, categoryResults]) => {
                if (categoryResults.length === 0) return null;

                const successCount = categoryResults.filter(
                  (r) => r.success
                ).length;
                const totalCount = categoryResults.length;
                const successRate = (successCount / totalCount) * 100;

                return (
                  <Accordion key={category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography sx={{ flexGrow: 1 }}>{category}</Typography>
                        <Chip
                          label={`${successCount}/${totalCount}`}
                          color={
                            successRate >= 80
                              ? "success"
                              : successRate >= 60
                              ? "warning"
                              : "error"
                          }
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`${successRate.toFixed(0)}%`}
                          color={
                            successRate >= 80
                              ? "success"
                              : successRate >= 60
                              ? "warning"
                              : "error"
                          }
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {categoryResults.map((result, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                {getStatusIcon(result.success)}
                              </ListItemIcon>
                              <ListItemText
                                primary={result.endpoint}
                                secondary={
                                  result.success
                                    ? `Status: ${
                                        result.status
                                      } | Tiempo: ${formatResponseTime(
                                        result.responseTime || 0
                                      )}`
                                    : `Error: ${result.error} | Status: ${result.status}`
                                }
                              />
                              <Chip
                                label={formatResponseTime(
                                  result.responseTime || 0
                                )}
                                color={getStatusColor(result.success)}
                                size="small"
                                variant="outlined"
                              />
                            </ListItem>
                            {index < categoryResults.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                );
              }
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
            Este verificador prueba la conectividad con todos los endpoints del
            backend. Asegúrate de que el servidor backend esté ejecutándose en{" "}
            {API_CONFIG.BASE_URL}
            antes de ejecutar las pruebas.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Las pruebas incluyen endpoints de autenticación, sistema de pagos,
            gestión de usuarios, eventos, analytics y gestión de imágenes.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BackendConnectionTester;
