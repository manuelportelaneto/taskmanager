import { create } from 'zustand';
import api from '../lib/api';

// A interface de User pode ser mais simples,
// pois o login só retorna o token por enquanto.
interface User {
  id: string;
  email: string;
}

// Expandir o estado para incluir 'isLoading' e 'error'
interface AuthState {
  token: string | null;
  user: User | null; // A Ação de Login preencherá isso futuramente se necessário
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>; // Retorna boolean para indicar sucesso
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, // Inicia como true na primeira carga da aplicação
  error: null,

  init: () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        set((state) => ({ ...state, token, isLoading: false }));
      } else {
        set((state) => ({ ...state, isLoading: false })); // Já terminou a verificação
      }
    } catch (error) {
        console.error("Failed to read from local storage", error);
        set((state) => ({ ...state, isLoading: false })); // Termina o loading mesmo com erro
    }
  },
  
  login: async (email, password) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      const token = data.access_token;
      
      set((state) => ({ ...state, token, user: null, isLoading: false })); // Podemos extrair o 'user' do token JWT decodificado no futuro
      localStorage.setItem('auth-token', token);
      
      return true; // Retorna sucesso
    } catch (error: any) {
      // O `error` do Axios geralmente está em `error.response.data.message`
      const errorMessage = error.response?.data?.message || 'Invalid email or password.';
      set((state) => ({ ...state, error: errorMessage, isLoading: false }));
      return false; // Retorna falha
    }
  },

  logout: () => {
    set((state) => ({ ...state, token: null, user: null, error: null }));
    localStorage.removeItem('auth-token');
  },
}));