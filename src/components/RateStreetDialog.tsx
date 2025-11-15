import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star } from 'lucide-react';
import { Badge } from './ui/badge';

// ----------- ICONES -----------
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
const clickedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252035.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// ----------- CONSTANTES -----------
const CAMPINAS_CENTER: [number, number] = [-22.9056, -47.0608];
const CAMPINAS_BOUNDS = L.latLngBounds([-23.4000, -47.5000], [-22.6000, -46.7000]);
const safetyIssues = [
  'Interações indesejadas',
  'Baixa acessibilidade',
  'Iluminação precária',
  'Suja',
  'Desconfortável',
  'Área isolada',
  'Assalto Reportado',
  'Ausência de calçadas'
];

export type LatLng = { lat: number; lng: number } | null;

// ----------- MAP EVENTS -----------
function MapEvents({ setClickedLocation }: { setClickedLocation: (loc: LatLng) => void }) {
  useMapEvents({
    click(e) {
      setClickedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// ----------- MAP VIEW -----------
interface MapViewProps {
  userLocation: LatLng;
  setUserLocation: (loc: LatLng) => void;
  selectedLocation: LatLng;
  setSelectedLocation: (loc: LatLng) => void;
  disableMapInteraction: boolean;
}

function MapView({ userLocation, setUserLocation, selectedLocation, setSelectedLocation, disableMapInteraction }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(CAMPINAS_CENTER);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const userLatLng = L.latLng(latlng.lat, latlng.lng);
          if (CAMPINAS_BOUNDS.contains(userLatLng)) setUserLocation(latlng);
          else setUserLocation({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
          setMapCenter([latlng.lat, latlng.lng]);
          setMapReady(true);
        },
        () => {
          setUserLocation({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
          setMapCenter(CAMPINAS_CENTER);
          setMapReady(true);
        }
      );

      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setUserLocation({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
      setMapCenter(CAMPINAS_CENTER);
      setMapReady(true);
    }
  }, [setUserLocation]);

  if (!mapReady || !userLocation) return <div>Carregando mapa...</div>;

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
      maxBounds={CAMPINAS_BOUNDS}
      minZoom={12}
      maxZoom={17}
      dragging={!disableMapInteraction}
      scrollWheelZoom={!disableMapInteraction}
      doubleClickZoom={!disableMapInteraction}
      boxZoom={!disableMapInteraction}
      keyboard={!disableMapInteraction}
      touchZoom={!disableMapInteraction}
      attributionControl={false} // opcional
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap & CARTO" />

      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Tooltip permanent>Você está aqui</Tooltip>
      </Marker>

      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={clickedIcon}>
          <Tooltip permanent>Local selecionado</Tooltip>
        </Marker>
      )}

      <MapEvents setClickedLocation={setSelectedLocation} />
    </MapContainer>
  );
}

// ----------- RATE STREET DIALOG -----------
interface RateStreetDialogProps {
  location: LatLng;
  setLocation: Dispatch<SetStateAction<LatLng>>;
  onOpenChange?: (open: boolean) => void;
}

export function RateStreetDialog({ location, setLocation, onOpenChange }: RateStreetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  if (!location) return null;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal>
      <DialogTrigger asChild>
        <Button className="w-full rounded-2xl h-14 text-base text-white bg-[#34A853] hover:bg-[#2D9348]">
          Avaliar local
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[90vw] rounded-3xl max-h-[85vh] overflow-auto z-[10000]"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 10000,
          width: '360px',  
          maxWidth: '90vw',   
          maxHeight: '85vh',  
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()} // isso impede que clique vaze pro mapa
        autoFocus
      >
        <DialogHeader>
          <DialogTitle>Avalie esta rua</DialogTitle>
          <DialogDescription>
            Sua contribuição ajuda a comunidade do Zanza a se deslocar com mais segurança
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Local selecionado</Label>
            <p className="mt-1 text-sm text-gray-600">
              Latitude: {location.lat.toFixed(5)}, Longitude: {location.lng.toFixed(5)}
            </p>
          </div>

          <div>
            <Label>Como você avalia a segurança?</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= (hoveredRating || rating) ? 'fill-[#FBBC04] text-[#FBBC04]' : 'text-gray-300'}`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {["Muito perigoso","Perigoso","Moderado","Seguro","Muito seguro"][rating-1]}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label>Problemas identificados (opcional)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {safetyIssues.map(issue => (
                <Badge
                  key={issue}
                  variant={selectedIssues.includes(issue) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors rounded-full ${selectedIssues.includes(issue) ? 'bg-[#EA4335] hover:bg-[#D33426] border-0' : 'hover:bg-gray-100'}`}
                  onClick={() => toggleIssue(issue)}
                >
                  {issue}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comentário adicional (opcional)</Label>
            <Textarea id="comment" placeholder="Compartilhe mais detalhes..." className="mt-2 resize-none rounded-xl" rows={3} />
          </div>

          <Button
            className="w-full bg-[#4285F4] hover:bg-[#3367D6] rounded-2xl h-12"
            onClick={() => {
              console.log({ rating, selectedIssues, location });
              setIsOpen(false); 
              setLocation(null);
              setRating(0);
              setSelectedIssues([]);
              if (onOpenChange) onOpenChange(false);
            }}
          >
            Enviar avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ----------- USO PRINCIPAL -----------
export function StreetRatingMap({ hasAccount }: { hasAccount: boolean }) {
  const [userLocation, setUserLocation] = useState<LatLng>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng>(null);
  const [disableMap, setDisableMap] = useState(false);

  const locationToRate = selectedLocation || userLocation;

  return (
    <div className="relative h-full w-full">
      <MapView
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        disableMapInteraction={disableMap}
      />

      <div className="absolute bottom-4 left-4 right-4 z-[9999] pointer-events-auto">
        <div className="bg-white rounded-3xl p-4 shadow-2xl">
          {hasAccount ? (
            locationToRate ? (
              <>
                <RateStreetDialog
                  location={locationToRate}
                  setLocation={selectedLocation ? setSelectedLocation : setUserLocation}
                  onOpenChange={(open) => setDisableMap(open)}
                />
                <p className="text-xs text-gray-600 text-center mt-3">
                  {selectedLocation ? "Localização selecionada:" : "Sua localização atual:"}{" "}
                  <span className="text-gray-900">
                    {locationToRate
                      ? `${locationToRate.lat.toFixed(5)}, ${locationToRate.lng.toFixed(5)}`
                      : "Não definida"}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-600 text-center mt-3">
                Carregando localização...
              </p>
            )
          ) : (
            <>
              <Button
                className="w-full bg-gray-400 text-white rounded-2xl h-14 text-base cursor-not-allowed"
                disabled
              >
                Avaliar local
              </Button>
              <p className="text-xs text-gray-600 text-center mt-3">
                <span className="text-[#EA4335]">
                  Crie uma conta para avaliar locais
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
