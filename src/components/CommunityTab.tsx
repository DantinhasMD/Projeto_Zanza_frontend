import { useState, useEffect } from "react";
import axios from "axios";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { NewsTicker } from "./NewsTicker";

interface CommunityTabProps {
  data: {
    activeUsersCount: number;
    totalReviews: number;
    topBairros: any[];
    topRuasAtencao: any[];
  } | null;
  loading: boolean;
}

export default function CommunityTab() {
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [communityStats, setCommunityStats] = useState<{ activeUsers: number; totalReviews: number }>({ activeUsers: 0, totalReviews: 0 });
  const [neighborhoods, setNeighborhoods] = useState<{ name: string; reviews: number; rating: number }[]>([]);
  const [warnings, setWarnings] = useState<{ name: string; issue: string; rating: number }[]>([]);

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        setLoadingCommunity(true);

        const [usersRes, reviewsRes] = await Promise.all([
          axios.get("/usuarios"),
          axios.get("/avaliacoes")
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

        // Usuários e avaliações
        setCommunityStats({ activeUsers: users.length, totalReviews: reviews.length });

        // Bairros mais seguros (3 maiores média de notaFinal)
        const bairroMap: Record<string, { total: number; count: number }> = {};
        reviews.forEach((av: any) => {
          const bairroName = av.bairroSegmento?.bairro?.nome;
          if (!bairroName) return;
          if (!bairroMap[bairroName]) bairroMap[bairroName] = { total: 0, count: 0 };
          bairroMap[bairroName].total += av.notaFinal ?? 0;
          bairroMap[bairroName].count += 1;
        });
        const bairrosArray = Object.entries(bairroMap)
          .map(([name, data]) => ({ name, reviews: data.count, rating: +(data.total / data.count).toFixed(1) }))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setNeighborhoods(bairrosArray);

        // Ruas atenção redobrada (5 piores média de notaFinal)
        const ruaMap: Record<string, { total: number; count: number; issues: string[] }> = {};
        reviews.forEach((av: any) => {
          const ruaName = av.bairroSegmento?.ruaSegmento?.nome || av.bairroSegmento?.ruaSegmento?.nomeSegmento;
          if (!ruaName) return;
          if (!ruaMap[ruaName]) ruaMap[ruaName] = { total: 0, count: 0, issues: [] };
          ruaMap[ruaName].total += av.notaFinal ?? 0;
          ruaMap[ruaName].count += 1;
          if (av.comentario) ruaMap[ruaName].issues.push(av.comentario);
        });
        const ruasArray = Object.entries(ruaMap)
          .map(([name, data]) => ({ name, issue: data.issues[0] || "Nenhum problema relatado", rating: +(data.total / data.count).toFixed(1) }))
          .sort((a, b) => a.rating - b.rating)
          .slice(0, 5);
        setWarnings(ruasArray);

      } catch (error) {
        console.error("Erro ao carregar dados da comunidade:", error);
      } finally {
        setLoadingCommunity(false);
      }
    }

    fetchCommunityData();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 bg-[#f5f5f3]">
      {loadingCommunity ? <p className="text-center text-gray-500 mt-8">Carregando dados...</p> : (
        <>
          <div className="mb-6 mt-6">
            <h2 className="mb-2">Dados da comunidade</h2>
            <p className="text-sm text-gray-500">Estatísticas colaborativas de Campinas</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#4285F4] to-[#3367D6] rounded-3xl p-5 text-white shadow-lg">
              <Users className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-3xl mb-1">{communityStats.activeUsers}</p>
              <p className="text-sm opacity-90">Usuários ativos</p>
            </div>
            <div className="bg-gradient-to-br from-[#34A853] to-[#2D9348] rounded-3xl p-5 text-white shadow-lg">
              <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-3xl mb-1">{communityStats.totalReviews}</p>
              <p className="text-sm opacity-90">Avaliações</p>
            </div>
          </div>

          {/* Bairros */}
          <div className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3>Bairros mais seguros</h3>
              <Badge variant="outline" className="rounded-full">Top 3</Badge>
            </div>
            <div className="space-y-3">
              {(neighborhoods.length ? neighborhoods : [{ name: "Nenhum dado fornecido", reviews: 0, rating: 0 }]).map((n, i) => (
                <div key={n.name + i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#34A853] to-[#2D9348] text-white rounded-full flex items-center justify-center shadow-sm">{i + 1}</div>
                    <div>
                      <p className="font-medium">{n.name}</p>
                      <p className="text-xs text-gray-500">{n.reviews} avaliações</p>
                    </div>
                  </div>
                  <Badge className="bg-[#34A853] text-white border-0 rounded-full">{n.rating} ★</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Ruas atenção redobrada */}
          <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#EA4335]" />
              <h3>Atenção redobrada</h3>
            </div>
            <div className="space-y-3">
              {(warnings.length ? warnings : [{ name: "Nenhum dado fornecido", issue: "Nenhum problema relatado", rating: 0 }]).map((w, i) => (
                <div key={w.name + i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#EA4335] to-[#D33426] text-white rounded-full flex items-center justify-center shadow-sm">{i + 1}</div>
                    <div>
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-gray-500">{w.issue}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#EA4335] text-white border-0 rounded-full">{w.rating} ★</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* NewsTicker */}
          <div className="bg-white rounded-3xl p-5 shadow-sm mb-4 min-h-[260px]">
            <NewsTicker />
          </div>
        </>
      )}
    </div>
  );
}
