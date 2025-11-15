import { useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/location.service';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  watchLocation: () => void;
  stopWatching: () => void;
}

/**
 * Custom hook for geolocation
 */
export function useLocation(autoWatch: boolean = false): UseLocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  const requestLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const coords = await locationService.getCurrentLocation();
      setLocation(coords);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter localização');
      
      // Try to use last known location
      const lastLocation = locationService.getLastLocation();
      if (lastLocation) {
        setLocation(lastLocation);
      } else {
        // Use default location
        setLocation(locationService.getDefaultLocation());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const watchLocation = useCallback(() => {
    if (isWatching) return;

    setIsWatching(true);
    setError(null);

    locationService.watchLocation(
      (coords) => {
        setLocation(coords);
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, [isWatching]);

  const stopWatching = useCallback(() => {
    if (!isWatching) return;

    locationService.stopWatchingLocation();
    setIsWatching(false);
  }, [isWatching]);

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoWatch) {
      requestLocation();
    }

    // Cleanup on unmount
    return () => {
      if (isWatching) {
        stopWatching();
      }
    };
  }, [autoWatch]);

  return {
    location,
    loading,
    error,
    requestLocation,
    watchLocation,
    stopWatching,
  };
}

/**
 * Custom hook for distance calculation
 */
export function useDistance(
  from: Coordinates | null,
  to: Coordinates | null
): number | null {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (from && to) {
      const calculatedDistance = locationService.calculateDistance(from, to);
      setDistance(calculatedDistance);
    } else {
      setDistance(null);
    }
  }, [from, to]);

  return distance;
}

/**
 * Custom hook for checking if user is near a location
 */
export function useNearby(
  targetLocation: Coordinates | null,
  radiusMeters: number = 100
): boolean {
  const { location } = useLocation(true);
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    if (location && targetLocation) {
      const distance = locationService.calculateDistance(location, targetLocation);
      setIsNearby(distance <= radiusMeters);
    } else {
      setIsNearby(false);
    }
  }, [location, targetLocation, radiusMeters]);

  return isNearby;
}
