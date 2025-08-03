import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ZoomIn as ZoomInIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import type { MobilePayment } from '../../../services/mobilePaymentsService';

interface PaymentCardProps {
  payment: MobilePayment;
  onVerify: (payment: MobilePayment) => void;
  onReject: (payment: MobilePayment) => void;
  onViewImage: (imageUrl: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPaymentMethodText: (method: string) => string;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onVerify,
  onReject,
  onViewImage,
  getStatusColor,
  getStatusText,
  getPaymentMethodText,
  formatDate,
  formatCurrency
}) => {
  const statusColor = getStatusColor(payment.status);
  const isPending = payment.status === 'pending';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: `1px solid ${statusColor === 'warning' ? '#ff9800' : statusColor === 'success' ? '#4caf50' : statusColor === 'error' ? '#f44336' : '#e0e0e0'}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          borderColor: statusColor === 'warning' ? '#ff9800' : statusColor === 'success' ? '#4caf50' : statusColor === 'error' ? '#f44336' : '#1976d2'
        }
      }}
    >
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header compacto */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {payment.user?.name} {payment.user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(payment.createdAt)}
            </Typography>
          </Box>
          <Chip
            label={getStatusText(payment.status)}
            color={statusColor as any}
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              fontWeight: 600
            }}
          />
        </Box>

        {/* Monto destacado */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '1.5rem'
            }}
          >
            {formatCurrency(payment.amount, payment.currency)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 0.5
            }}
          >
            {payment.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Información compacta */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PaymentIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {getPaymentMethodText(payment.paymentMethod)}
            </Typography>
          </Box>
          
          {payment.eventName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {payment.eventName}
              </Typography>
            </Box>
          )}

          {payment.notes && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                "{payment.notes}"
              </Typography>
            </Box>
          )}
        </Box>

        {/* Comprobante compacto */}
        {payment.proofImage && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
              <img
                src={payment.proofImage}
                alt="Comprobante"
                style={{
                  width: '100%',
                  height: 80,
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                onClick={() => onViewImage(payment.proofImage!)}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 1 }
                }}
                onClick={() => onViewImage(payment.proofImage!)}
              >
                <Tooltip title="Ver comprobante">
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}

        {/* Acciones */}
        {isPending && (
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={() => onVerify(payment)}
              sx={{
                flex: 1,
                py: 0.75,
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.dark'
                }
              }}
            >
              Verificar
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              onClick={() => onReject(payment)}
              sx={{
                flex: 1,
                py: 0.75,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  backgroundColor: 'error.light'
                }
              }}
            >
              Rechazar
            </Button>
          </Box>
        )}

        {/* Estado de verificación/rechazo */}
        {payment.status === 'verified' && payment.verificationNotes && (
          <Box sx={{ mt: 1.5, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
            <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
              ✓ Verificado: {payment.verificationNotes}
            </Typography>
          </Box>
        )}

        {payment.status === 'rejected' && payment.rejectionReason && (
          <Box sx={{ mt: 1.5, p: 1, backgroundColor: 'error.light', borderRadius: 1 }}>
            <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>
              ✗ Rechazado: {payment.rejectionReason}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCard; 