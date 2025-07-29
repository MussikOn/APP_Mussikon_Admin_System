import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import type { Image } from '../types/image';

interface ImageCardNFTProps {
  image: Image;
  onDelete?: (imageId: string) => void;
  onDownload?: (image: Image) => void;
  onShare?: (image: Image) => void;
}

const ImageCardNFT: React.FC<ImageCardNFTProps> = ({
  image,
  onDelete,
  onDownload,
  onShare
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: Image['category']) => {
    switch (category) {
      case 'profile': return 'primary';
      case 'post': return 'secondary';
      case 'event': return 'success';
      case 'gallery': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 4,
        background: 'rgba(31, 38, 135, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 16px 40px 0 rgba(31, 38, 135, 0.37)',
        }
      }}
    >
      {/* Imagen */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <img
          src={image.url}
          alt={image.originalName}
          style={{
            width: '100%',
            borderRadius: 16,
            objectFit: 'cover',
            height: 180
          }}
        />
        
        {/* Overlay con acciones */}
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1
        }}>
          <Tooltip title={image.isPublic ? 'Pública' : 'Privada'}>
            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Información */}
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 700,
            mb: 1,
            fontSize: '1.1rem'
          }}
        >
          {image.originalName}
        </Typography>

        {image.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#b0b8c1',
              mb: 2,
              lineHeight: 1.4
            }}
          >
            {image.description}
          </Typography>
        )}

        {/* Chips de información */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={image.category}
            color={getCategoryColor(image.category) as any}
            size="small"
            sx={{
              background: 'rgba(127,95,255,0.12)',
              color: '#fff',
              fontWeight: 600
            }}
          />
          <Chip
            label={formatFileSize(image.size)}
            size="small"
            sx={{
              background: 'rgba(0,224,255,0.12)',
              color: '#fff',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {image.tags.slice(0, 3).map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#b0b8c1',
                  fontSize: '0.75rem'
                }}
              />
            ))}
            {image.tags.length > 3 && (
              <Chip
                label={`+${image.tags.length - 3}`}
                size="small"
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#b0b8c1'
                }}
              />
            )}
          </Box>
        )}

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Descargar">
              <IconButton
                size="small"
                onClick={() => onDownload?.(image)}
                sx={{ color: '#00e0ff' }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Compartir">
              <IconButton
                size="small"
                onClick={() => onShare?.(image)}
                sx={{ color: '#b993d6' }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                onClick={() => onDelete?.(image.id)}
                sx={{ color: '#ff2eec' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImageCardNFT; 