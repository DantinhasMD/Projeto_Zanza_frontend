import api from './api';
import type { UsuarioRequestDTO, UsuarioResponseDTO } from '../types';

const STORAGE_KEY = 'zanza_user';

class AuthService {
  async login(email: string, senha: string): Promise<UsuarioResponseDTO | null> {
    try {
      const res = await api.post<UsuarioResponseDTO>('/usuarios/autenticar', null, {
        params: { email, senha },
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error('Erro ao autenticar:', err);
      return null;
    }
  }

  async register(dto: UsuarioRequestDTO): Promise<UsuarioResponseDTO | null> {
    try {
      const res = await api.post<UsuarioResponseDTO>('/usuarios/criar', dto);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error('Erro ao registrar usuário:', err);
      return null;
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  getUser() {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEY);
  }
}

export const authService = new AuthService();