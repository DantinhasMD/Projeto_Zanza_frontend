import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Navigation, Clock, TrendingUp, Users } from 'lucide-react';

interface RouteCardProps {
  id: number;
  origin: string;
  destination: string;
  geometry: {
    type: string;
    coordinates: number[][]; // GeoJSON coordinates [lng, lat]
  };
  distance?: number; // opcional, caso calcule depois
  duration?: number; // opcional, caso calcule depois
  safetyRating?: number; // opcional
  contributors?: number; // opcional
  safetyLevel?: 'safe' | 'warning' | 'danger'; // opcional
}

export function RouteCard({
  origin,
  destination,
  geometry,
  distance,
  duration,
  safetyRating = 0,
  contributors = 0,
  safetyLevel = 'safe',
}: RouteCardProps) {
  const getLevelColor = () => {
    if (safetyLevel === 'safe') return 'bg-[#34A853]';
    if (safetyLevel === 'warning') return 'bg-[#FBBC04]';
    return 'bg-[#EA4335]';
  };

  const getLevelText = () => {
    if (safetyLevel === 'safe') return 'Rota Segura';
    if (safetyLevel === 'warning') return 'Atenção';
    return 'Cuidado';
  };

  // Pegar coordenadas iniciais e finais do GeoJSON
  const startCoords = geometry?.coordinates?.[0];
  const endCoords = geometry?.coordinates?.[geometry.coordinates.length - 1];

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-xl transition-shadow border-l-4 rounded-2xl"
      style={{
        borderLeftColor:
          safetyLevel === 'safe'
            ? '#34A853'
            : safetyLevel === 'warning'
            ? '#FBBC04'
            : '#EA4335',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-600">{origin}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${getLevelColor()}`} />
            </div>
            <p className="text-sm">{destination}</p>
          </div>
        </div>
        <Badge className={`${getLevelColor()} text-white border-0`}>
          {safetyRating?.toFixed?.(1) ?? '0.0'} ★
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Navigation className="w-4 h-4" />
          <span>{distance ? `${(distance / 1000).toFixed(2)} km` : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{duration ? `${(duration / 60).toFixed(0)} min` : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{contributors ?? 0}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{getLevelText()}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>Baseado em dados da comunidade</span>
          </div>
        </div>
      </div>

      {startCoords && endCoords && (
        <div className="mt-2 text-xs text-gray-500">
          Início: {startCoords[1].toFixed(5)}, {startCoords[0].toFixed(5)} | Fim:{' '}
          {endCoords[1].toFixed(5)}, {endCoords[0].toFixed(5)}
        </div>
      )}
    </Card>
  );
}
