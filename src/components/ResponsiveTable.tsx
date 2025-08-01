import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { responsiveTypography } from '../theme/breakpoints';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  render?: (value: any, row: any) => React.ReactNode;
  mobile?: boolean; // Si se muestra en móvil
  width?: string | number;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: {
    icon: React.ReactNode;
    tooltip: string;
    onClick: (row: any) => void;
    color?: string;
  }[];
  emptyMessage?: string;
  sx?: any;
}

/**
 * Componente de tabla responsiva que se convierte en cards en móvil
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  onRowClick,
  actions = [],
  emptyMessage = 'No hay datos para mostrar',
  sx
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filtrar columnas que se muestran en móvil
  const mobileColumns = columns.filter(col => col.mobile !== false);

  if (isMobile) {
    return (
      <Box sx={{ ...sx }}>
        {data.length === 0 ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((row, index) => (
              <Card
                key={row.id || index}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': onRowClick ? {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  } : {},
                  ...sx
                }}
                onClick={() => onRowClick?.(row)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {mobileColumns.map((column) => {
                      const value = row[column.id];
                      const content = column.render ? column.render(value, row) : value;
                      
                      return (
                        <Box
                          key={column.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 0.5
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 600,
                              minWidth: '80px',
                              fontSize: responsiveTypography.caption.xs
                            }}
                          >
                            {column.label}:
                          </Typography>
                          <Box sx={{ 
                            flex: 1, 
                            textAlign: 'right',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            {content}
                          </Box>
                        </Box>
                      );
                    })}
                    
                    {/* Acciones */}
                    {actions.length > 0 && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 1, 
                        mt: 1,
                        pt: 1,
                        borderTop: `1px solid ${theme.palette.divider}`
                      }}>
                        {actions.map((action, actionIndex) => (
                          <Tooltip key={actionIndex} title={action.tooltip}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              sx={{
                                color: action.color || 'primary.main',
                                '&:hover': {
                                  background: `${action.color || theme.palette.primary.main}20`
                                }
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // Vista de tabla para desktop
  return (
    <TableContainer sx={{ ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: responsiveTypography.body2.md,
                  width: column.width
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {actions.length > 0 && (
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: responsiveTypography.body2.md,
                  width: '120px'
                }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                sx={{ textAlign: 'center', py: 4 }}
              >
                <Typography variant="body1" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick ? {
                    backgroundColor: theme.palette.action.hover
                  } : {},
                  transition: 'background-color 0.2s ease'
                }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  const content = column.render ? column.render(value, row) : value;
                  
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        fontSize: responsiveTypography.body2.md,
                        width: column.width
                      }}
                    >
                      {content}
                    </TableCell>
                  );
                })}
                
                {/* Acciones */}
                {actions.length > 0 && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {actions.map((action, actionIndex) => (
                        <Tooltip key={actionIndex} title={action.tooltip}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            sx={{
                              color: action.color || 'primary.main',
                              '&:hover': {
                                background: `${action.color || theme.palette.primary.main}20`
                              }
                            }}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable; 