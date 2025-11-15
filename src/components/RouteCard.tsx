import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Navigation, Clock, TrendingUp, Users } from 'lucide-react';

interface RouteCardProps {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  safetyRating: number;
  contributors: number;
  safetyLevel: 'safe' | 'warning' | 'danger';
}

export function RouteCard({ 
  origin, 
  destination, 
  distance, 
  duration, 
  safetyRating, 
  contributors,
  safetyLevel 
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

  return (
    <Card className="p-4 cursor-pointer hover:shadow-xl transition-shadow border-l-4 rounded-2xl" style={{
      borderLeftColor: safetyLevel === 'safe' ? '#34A853' : safetyLevel === 'warning' ? '#FBBC04' : '#EA4335'
    }}>
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
          {safetyRating.toFixed(1)} ★
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Navigation className="w-4 h-4" />
          <span>{distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{contributors}</span>
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
    </Card>
  );
}
