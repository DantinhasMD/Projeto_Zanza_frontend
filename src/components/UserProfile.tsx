import { Badge } from './ui/badge';
import { Star, PersonStanding } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Review {
  id: number;
  trecho: string;
  nota: number;
}

interface UserProfileProps {
  name: string;
  level: number;
  totalReviews: number;
  hasAccount: boolean;
  collaboratorName?: string;
  reviews: Review[]; // histórico do usuário vindo do backend
}

interface FrontendUser {
  name: string;
  level: number;
  totalReviews: number;
  collaboratorName?: string;
  reviews: {
    id: number;
    trecho: string;
    nota: number;
  }[];
}

export function UserProfile({
  name,
  level,
  totalReviews,
  hasAccount,
  collaboratorName,
  reviews
}: UserProfileProps) {
  let navigate: any;
  try {
    navigate = useNavigate();
  } catch {
    navigate = (path: string) => console.warn("Navegação ignorada: fora do Router ->", path);
  }

  const getProgressColor = () => {
    if (totalReviews < 50) return 'bg-[#EA4335]';
    if (totalReviews < 100) return 'bg-[#FBBC04]';
    if (totalReviews < 200) return 'bg-[#4285F4]';
    return 'bg-[#34A853]';
  };

  const getTitle = () => {
    if (totalReviews < 50) return 'Iniciante';
    if (totalReviews < 100) return 'Contribuidor ativo';
    if (totalReviews < 200) return 'Contribuidor avançado';
    return 'Especialista da comunidade';
  };

  const getTitleStyle = () => {
    if (totalReviews < 50) return 'text-gray-500';
    if (totalReviews < 100) return 'text-yellow-600 font-medium';
    if (totalReviews < 200) return 'text-blue-600 font-semibold';
    return 'text-green-600 font-bold text-lg';
  };

  const progressPercentage = Math.min((totalReviews / 250) * 100, 100);

  if (!hasAccount) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center">
        <p className="text-gray-600 mb-2">Usuário sem conta</p>
        <p className="text-sm text-gray-500">
          Crie uma conta para avaliar locais e acompanhar seu histórico de avaliações.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-[calc(100vh-120px)] space-y-4">
      {/* Perfil */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg text-gray-900 font-medium">{name}</h3>
            {collaboratorName && (
              <p className="text-sm text-gray-500 italic">Colaborador: {collaboratorName}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="rounded-full">Nível {level}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-500">
                  {(Math.min(5, 2.5 + totalReviews / 60)).toFixed(1)} ★
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Avaliações</p>
            <p className="text-2xl text-[#4285F4] font-semibold">{totalReviews}</p>
          </div>
        </div>

        {/* Barra de progresso animada */}
        <div className="space-y-2 relative">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Contribuição</span>
            <span>{totalReviews}/250</span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`absolute left-0 top-0 h-full ${getProgressColor()} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute -top-2"
              initial={{ left: 0 }}
              animate={{ left: `calc(${progressPercentage}% - 12px)` }}
              transition={{ duration: 1 }}
            >
              <PersonStanding className="w-5 h-5 text-gray-700" />
            </motion.div>
          </div>
          <p className={`mt-2 ${getTitleStyle()}`}>{getTitle()}</p>
        </div>
      </div>

      {/* Histórico */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[#FBBC04]" />
          <h3 className="text-base font-medium">Histórico de avaliações</h3>
        </div>

        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer mb-2"
              onClick={() => navigate(`/mapa?avaliacao=${r.id}`)}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{r.trecho}</p>
                <Badge className="bg-[#34A853] text-white border-0 rounded-full">
                  {r.nota} ★
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">Nenhuma avaliação realizada.</p>
        )}
      </div>
    </div>
  );
}
