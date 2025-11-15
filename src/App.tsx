import { useEffect, useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MapView, CAMPINAS_BOUNDS } from './components/MapView';
import { FilterSheet } from './components/FilterSheet';
import { RouteCard } from './components/RouteCard';
import { RateStreetDialog } from './components/RateStreetDialog';
import { UserProfile } from './components/UserProfile';
import { Button } from './components/ui/button'; 
import { Input } from './components/ui/input'; 
import { Badge } from './components/ui/badge';
import { Map, Route, Users, Menu, TrendingUp, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import CommunityTab from './components/CommunityTab';
import logoZanza from 'figma:asset/a6af01a5f20ad621f10a0752d79f45c452dd080e.png';
import * as L from 'leaflet';
import api from './services/api';
import { authService } from './services/auth.service';
import type { UsuarioResponseDTO } from '../src/types';

interface User {
  name: string;
  level: number;
  totalReviews: number;
  collaboratorName?: string;
  reviews: { id: number; trecho: string; nota: number }[];
  }

  const mapUser = (u: UsuarioResponseDTO): User => ({
    name: u.nome,
    level: u.pontuacao,
    totalReviews: u.avaliacoes.length,
    collaboratorName: undefined, 
    reviews: u.avaliacoes.map(a => ({ id: a.id, trecho: a.comentario, nota: a.nota })),
  });

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [hasAccount, setHasAccount] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    const u = authService.getUser();
    return u ? mapUser(u) : null;
  });

  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'community'>('map');
  const [disableMap, setDisableMap] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  const [communityStats, setCommunityStats] = useState<any | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  const [searchQuery, setSearchQuery] = useState('Centro');
  const [goToLocation, setGoToLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLogin = (userData: UsuarioResponseDTO | null, hasAcc: boolean) => {
    if (userData) {
      setUser(mapUser(userData));
    } else {
      setUser(null); 
    }
    setIsLoggedIn(true);
    setHasAccount(hasAcc);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
    setHasAccount(false);
  };

  // Buscar rotas
  useEffect(() => {
    if (activeTab === 'routes') {
      setLoadingRoutes(true);
      api
        .get('/routes')
        .then((res) => setRoutes(res.data))
        .catch((err) => console.error('Erro ao carregar rotas:', err))
        .finally(() => setLoadingRoutes(false));
    }
  }, [activeTab]);

  // Buscar dados da comunidade
  useEffect(() => {
    if (activeTab === 'community') {
      setLoadingCommunity(true);
      api
        .get('/community')
        .then((res) => {
          setCommunityStats(res.data.stats);
          setNeighborhoods(res.data.neighborhoods);
          setWarnings(res.data.warnings);
        })
        .catch((err) => console.error('Erro ao carregar dados da comunidade:', err))
        .finally(() => setLoadingCommunity(false));
    }
  }, [activeTab]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#f5f5f3] max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white px-4 py-4 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={logoZanza} alt="Zanza" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl">Zanza</h1>
              <p className="text-xs text-gray-600">Rotas seguras em Campinas para pedestres</p>
            </div>
          </div>

          {/* Menu lateral */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-l-3xl overflow-y-auto">
              <div className="space-y-4 mt-6">
                <UserProfile
                  name={user?.name ?? 'Usuário'}
                  level={user?.level ?? 1}
                  totalReviews={user?.totalReviews ?? 0}
                  hasAccount={hasAccount}
                  collaboratorName={user?.collaboratorName}
                  reviews={user?.reviews ?? []}
                />
                {hasAccount && (
                  <div className="space-y-2 pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start">
                      Configurações
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => window.open('https://github.com/DantinhasMD/Projeto_Zanza', '_blank')}
                    >
                      Sobre o projeto
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#EA4335] hover:text-[#EA4335]"
                      onClick={handleLogout}
                    >
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Barra de busca e filtros */}
        {activeTab === 'map' && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite um endereço"
                className="bg-[#f5f5f3] border-gray-200 rounded-xl"
              />
            </div>
            <Button
              onClick={async () => {
                if (!searchQuery) return;

                try {
                  const query = encodeURIComponent(`${searchQuery}, Campinas, Brazil`);
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
                  const data = await res.json();

                  if (!data.length) {
                    alert("Endereço não encontrado em Campinas!");
                    return;
                  }

                  const { lat, lon } = data[0];
                  const latLng = { lat: parseFloat(lat), lng: parseFloat(lon) };

                  if (CAMPINAS_BOUNDS.contains(L.latLng(latLng.lat, latLng.lng))) {
                    setSelectedLocation(latLng);
                    setGoToLocation(latLng);
                  } else {
                    alert("Endereço fora de Campinas!");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Erro ao buscar endereço!");
                }
              }}
            >
              Buscar
            </Button>

            <FilterSheet />
          </div>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'map' && (
          <div className="relative h-full">
            <MapView
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
            <div className="absolute bottom-4 left-4 right-4 z-[9999] pointer-events-auto">
              <div className="bg-white rounded-3xl p-4 shadow-2xl">
                {hasAccount ? (
                  <>
                    <RateStreetDialog
                      location={selectedLocation}
                      setLocation={setSelectedLocation}
                      onOpenChange={(open) => setDisableMap(open)}
                    />
                    <p className="text-xs text-gray-600 text-center mt-3">
                      Sua localização atual:{" "}
                      <span className="text-gray-900">
                        {userLocation
                          ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                          : "Não definida"}
                      </span>
                    </p>
                  </>
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
        )}

        {activeTab === 'routes' && (
          <div className="h-full overflow-y-auto p-4 space-y-3 pb-24 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2>Rotas recomendadas</h2>
                <p className="text-sm text-gray-500">
                  Baseado em avaliações da comunidade
                </p>
              </div>
            </div>
            {loadingRoutes ? (
              <p className="text-center text-gray-500">Carregando rotas...</p>
            ) : routes.length > 0 ? (
              routes.map((route) => <RouteCard key={route.id} {...route} />)
            ) : (
              <p className="text-center text-gray-400">Nenhuma rota encontrada.</p>
            )}
          </div>
        )}

         {/* Aba Comunidade */}
        {activeTab === 'community' && <CommunityTab />}
      </main>

      {/* Navegação inferior */}
      <nav className="bg-white border-t px-2 py-3 shadow-lg rounded-t-3xl">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors ${
              activeTab === 'map' ? 'text-[#4285F4]' : 'text-gray-400'
            }`}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">Mapa</span>
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors ${
              activeTab === 'routes' ? 'text-[#4285F4]' : 'text-gray-400'
            }`}
          >
            <Route className="w-6 h-6" />
            <span className="text-xs">Rotas</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors ${
              activeTab === 'community' ? 'text-[#4285F4]' : 'text-gray-400'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Comunidade</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
