// Componente principal Payments - MussikOn Admin System
// Página principal del sistema de pagos móviles

import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { BalanceCard } from './components/BalanceCard';
import { DepositForm } from './components/DepositForm';
import { BankAccountForm } from './components/BankAccountForm';
import { WithdrawalForm } from './components/WithdrawalForm';
import { DepositHistory } from './components/DepositHistory';
import { BankAccountsList } from './components/BankAccountsList';
import { TransactionHistory } from './components/TransactionHistory';
import ConnectionStatus from './components/ConnectionStatus';


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
      id={`payments-tabpanel-${index}`}
      aria-labelledby={`payments-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `payments-tab-${index}`,
    'aria-controls': `payments-tabpanel-${index}`,
  };
}

/**
 * Componente principal del sistema de pagos
 */
const Payments: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };



  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Pagos Móviles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona depósitos, retiros y transacciones de usuarios móviles
        </Typography>
        <ConnectionStatus showDetails={true} />
      </Box>

      {/* Balance Card */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <BalanceCard variant="detailed" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Resumen Rápido
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Sistema de pagos móviles en desarrollo. Próximamente más funcionalidades.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              • Subida de comprobantes de depósito
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Verificación administrativa
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Gestión de balances
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Sistema de retiros
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs de funcionalidades */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="payments tabs">
            <Tab label="Depósitos" {...a11yProps(0)} />
            <Tab label="Retiros" {...a11yProps(1)} />
            <Tab label="Cuentas Bancarias" {...a11yProps(2)} />
            <Tab label="Transacciones" {...a11yProps(3)} />
            <Tab label="Vouchers" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DepositForm 
                onSuccess={() => {
                  // Refrescar balance y historial
                  console.log('Depósito subido exitosamente');
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DepositHistory />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <WithdrawalForm 
                onSuccess={() => {
                  // Refrescar balance y historial
                  console.log('Retiro solicitado exitosamente');
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TransactionHistory />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <BankAccountForm 
                onSuccess={() => {
                  // Refrescar lista de cuentas
                  console.log('Cuenta bancaria registrada exitosamente');
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BankAccountsList />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <TransactionHistory />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Gestión de Vouchers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Funcionalidad de gestión de vouchers en desarrollo
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Payments; 