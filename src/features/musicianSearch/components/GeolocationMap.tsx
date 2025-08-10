import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import type { MusicianProfile } from '../types';

// Declaraciones de tipos para Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
        LatLngBounds: any;
        MapTypeId: {
          ROADMAP: any;
        };
        Size: any;
        Point: any;
      };
    };
  }
}

interface GeolocationMapProps {
  musicians: MusicianProfile[];
  onMusicianSelect: (musician: MusicianProfile) => void;
  userLocation?: { lat: number; lng: number };
}

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  musician: MusicianProfile;
  marker: any;
}

const GeolocationMap: React.FC<GeolocationMapProps> = ({
  musicians,
  onMusicianSelect,
  userLocation
}) => {
  const [map, setMap] = useState<any>(null);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [musicianMarkers, setMusicianMarkers] = useState<MapMarker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          setIsMapLoaded(true);
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsMapLoaded(true);
          setMapError(null);
        };
        
        script.onerror = () => {
          setMapError('Error al cargar Google Maps');
        };

        document.head.appendChild(script);
      } catch (error) {
        setMapError('Error al cargar Google Maps');
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstanceRef.current) {
      try {
        if (!window.google || !window.google.maps) {
          return;
        }

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: userLocation || { lat: 40.4168, lng: -3.7038 }, // Madrid default
          zoom: 12,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = mapInstance;
        setMap(mapInstance);

        // Add user location marker if available
        if (userLocation) {
          const userMarkerInstance = new window.google.maps.Marker({
            position: userLocation,
            map: mapInstance,
            title: 'Tu ubicación',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }
          });

          setUserMarker(userMarkerInstance);
        }

        // Create info window
        const infoWindowInstance = new window.google.maps.InfoWindow();
        setInfoWindow(infoWindowInstance);

      } catch (error) {
        setMapError('Error al inicializar el mapa');
      }
    }
  }, [isMapLoaded, userLocation]);

  useEffect(() => {
    if (map && musicians.length > 0) {
      // Clear existing markers
      musicianMarkers.forEach(marker => {
        if (marker.marker) {
          marker.marker.setMap(null);
        }
      });

      // Create new markers for musicians
      const newMarkers: MapMarker[] = musicians.map(musician => {
        if (musician.location && musician.location.coordinates) {
          const marker = new window.google.maps.Marker({
            position: {
              lat: musician.location.coordinates.lat,
              lng: musician.location.coordinates.lng
            },
            map: map,
            title: musician.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#FF6B6B" stroke="white" stroke-width="2"/>
                  <path d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 16 12 12" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }
          });

          // Add click listener
          marker.addListener('click', () => {
            showMusicianInfo(musician, marker);
          });

          return {
            id: musician.id,
            position: {
              lat: musician.location.coordinates.lat,
              lng: musician.location.coordinates.lng
            },
            musician,
            marker
          };
        }
        return null;
      }).filter(Boolean) as MapMarker[];

      setMusicianMarkers(newMarkers);
    }
  }, [map, musicians]);

  const showMusicianInfo = (musician: MusicianProfile, marker: any) => {
    if (infoWindow && map) {
      const content = `
        <div style="padding: 16px; max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; color: #1976d2;">${musician.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666;">
            ${musician.instruments?.map(i => i.name).join(', ') || 'Sin instrumentos'}
          </p>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #f57c00; margin-right: 4px;">★</span>
            <span style="color: #666;">${musician.rating || 'Sin calificación'}</span>
          </div>
          <p style="margin: 0 0 8px 0; color: #666;">
            ${musician.location?.city || 'Ubicación no disponible'}
          </p>
          <button 
            onclick="window.selectMusician('${musician.id}')"
            style="
              background: #1976d2; 
              color: white; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 4px; 
              cursor: pointer;
              width: 100%;
            "
          >
            Ver perfil
          </button>
        </div>
      `;

      infoWindow.setContent(content);
      infoWindow.open(map, marker);

      // Add global function for button click
      (window as any).selectMusician = (musicianId: string) => {
        const musician = musicians.find(m => m.id === musicianId);
        if (musician) {
          onMusicianSelect(musician);
        }
      };
    }
  };

  const centerOnUser = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(15);
    }
  };

  const centerOnMusicians = () => {
    if (map && musicianMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      musicianMarkers.forEach(marker => {
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }
  };

  if (mapError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {mapError}
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Paper>
    );
  }

  if (!isMapLoaded) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando mapa...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<LocationIcon />}
          onClick={centerOnUser}
          disabled={!userLocation}
        >
          Mi ubicación
        </Button>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={centerOnMusicians}
          disabled={musicianMarkers.length === 0}
        >
          Ver músicos
        </Button>
      </Box>

      <Paper sx={{ overflow: 'hidden' }}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '500px',
            minHeight: '400px'
          }}
        />
      </Paper>

      {musicianMarkers.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Músicos en el mapa ({musicianMarkers.length})
          </Typography>
          <Grid container spacing={2}>
            {musicianMarkers.map(marker => (
              <Grid item xs={12} sm={6} md={4} key={marker.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => onMusicianSelect(marker.musician)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 1 }}>
                        {marker.musician.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" noWrap>
                          {marker.musician.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {marker.musician.instruments?.map(i => i.name).join(', ') || 'Sin instrumentos'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={marker.musician.rating || 0}
                        readOnly
                        size="small"
                        emptyIcon={<StarBorderIcon fontSize="small" />}
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {marker.musician.rating || 'Sin calificación'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {marker.musician.location?.city || 'Ubicación no disponible'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default GeolocationMap;
