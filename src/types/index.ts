export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}

export interface AvaliacaoResponseDTO {
  // adicione os campos que AvaliacaoResponseDTO tem no backend
  id: number;
  comentario: string;
  nota: number;
}

export interface ContatoEmergenciaResponseDTO {
  // adicione os campos que ContatoEmergenciaResponseDTO tem no backend
  nome: string;
  telefone: string;
  parentesco: string;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataCadastro: string; // LocalDateTime do backend vira string no frontend
  pontuacao: number;
  nivel: string;
  avaliacoes: AvaliacaoResponseDTO[];
  contatos: ContatoEmergenciaResponseDTO[];
}


/*export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Street & Safety Types
export interface Street {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  safetyLevel: 'safe' | 'warning' | 'danger';
  averageRating: number;
  totalReviews: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StreetReview {
  id: string;
  streetId: string;
  userId: string;
  rating: number;
  issues: string[];
  comment?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

export interface CreateReviewRequest {
  streetId?: string;
  streetName: string;
  neighborhood: string;
  rating: number;
  issues: string[];
  comment?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Route Types
export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  safetyRating: number;
  contributors: number;
  safetyLevel: 'safe' | 'warning' | 'danger';
  waypoints: Waypoint[];
  createdAt: string;
  updatedAt: string;
}

export interface Waypoint {
  latitude: number;
  longitude: number;
  order: number;
}

export interface RouteRequest {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  preferences?: {
    preferSafety: boolean;
    avoidDangerousAreas: boolean;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

// Community Types
export interface CommunityStats {
  totalUsers: number;
  totalReviews: number;
  safeStreetsPercentage: number;
  warningStreetsPercentage: number;
  dangerousStreetsPercentage: number;
}

export interface Neighborhood {
  name: string;
  rating: number;
  reviews: number;
  safetyLevel: 'safe' | 'warning' | 'danger';
}

export interface DangerArea {
  name: string;
  rating: number;
  reviews: number;
  primaryIssue: string;
}

export interface RecentActivity {
  id: string;
  userName: string;
  userInitials: string;
  streetName: string;
  rating: number;
  timeAgo: string;
  createdAt: string;
}

// Point of Interest Types
export interface PointOfInterest {
  id: string;
  name: string;
  type: 'pharmacy' | 'market' | 'store' | 'cafe' | 'office' | 'other';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  safetyRating?: number;
}

// Filter Types
export interface FilterOptions {
  neighborhoods?: string[];
  timeOfDay?: ('morning' | 'afternoon' | 'evening' | 'night')[];
  safetyLevels?: ('safe' | 'warning' | 'danger')[];
  minRating?: number;
  maxRating?: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
  timestamp: string;
} */
