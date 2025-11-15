import { useEffect, useState } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CAMPINAS_CENTER: [number, number] = [-22.9056, -47.0608];
export const CAMPINAS_BOUNDS = L.latLngBounds([-23.4000, -47.5000], [-22.6000, -46.7000]);

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const clickedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

interface MapViewProps {
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
  setSelectedLocation: (loc: { lat: number; lng: number }) => void;
  goToLocation?: { lat: number; lng: number } | null; // ponto para centralizar mapa
}

// Hook para centralizar mapa em qualquer ponto
function FlyTo({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

// Captura clique no mapa para atualizar selectedLocation
function MapEvents({ setSelectedLocation }: { setSelectedLocation: (loc: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function MapView({
  userLocation,
  setUserLocation,
  selectedLocation,
  setSelectedLocation,
  goToLocation,
}: MapViewProps) {
  // Estado para centralizar mapa no usuário inicialmente ou no ponto buscado
  const [centerPosition, setCenterPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Buscar localização inicial do usuário
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const userLatLng = L.latLng(latlng.lat, latlng.lng);
          if (CAMPINAS_BOUNDS.contains(userLatLng)) {
            setUserLocation(latlng);
            setCenterPosition(latlng); // centraliza no usuário
          } else {
            setUserLocation({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
            setCenterPosition({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
          }
        },
        () => {
          setUserLocation({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
          setCenterPosition({ lat: CAMPINAS_CENTER[0], lng: CAMPINAS_CENTER[1] });
        }
      );
    } else if (userLocation) {
      setCenterPosition(userLocation);
    }
  }, [userLocation, setUserLocation]);

  // Atualiza centralização quando houver busca
  useEffect(() => {
    if (goToLocation) {
      setCenterPosition(goToLocation);
      setSelectedLocation(goToLocation);
    }
  }, [goToLocation, setSelectedLocation]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={centerPosition || CAMPINAS_CENTER}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        maxBounds={CAMPINAS_BOUNDS}
        minZoom={15}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap & CARTO"
        />

        {/* Marcador do usuário (isolado) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {/* Marcador do clique ou da busca */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={clickedIcon}>
            <Popup>Ponto selecionado</Popup>
          </Marker>
        )}

        <MapEvents setSelectedLocation={setSelectedLocation} />
        <FlyTo position={centerPosition} />
      </MapContainer>
    </div>
  );
}
