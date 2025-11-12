import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, // Começa como true para verificar o localStorage
  error: null,

  init: () => {
    try {
      const token = localStorage.getItem('auth-token');
      // A forma simples e direta de atualizar o estado.
      // Define o token encontrado e sinaliza que a carga inicial terminou.
      set({ token, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize auth state from storage", error);
      // Garante que o loading termine mesmo em caso de erro.
      set({ isLoading: false });
    }
  },
  
  login: async (email, password) => {
    // Sinaliza o início da operação de login.
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.access_token;

      // PRIMEIRO, persistimos o token. É a operação mais crítica.
      localStorage.setItem('auth-token', token);

      // DEPOIS, atualizamos o estado. A UI irá reagir a esta mudança.
      set({ token, isLoading: false, user: null /* Opcional: decodificar o token para obter os dados do usuário aqui */ });

      return true; // Sucesso
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      // Atualiza o estado com a mensagem de erro para ser exibida na UI.
      set({ error: errorMessage, isLoading: false, token: null });
      return false; // Falha
    }
  },

  logout: () => {
    // PRIMEIRO, removemos o token da persistência.
    localStorage.removeItem('auth-token');
    
    // DEPOIS, limpamos o estado da aplicação.
    set({ token: null, user: null, error: null, isLoading: false });
  },
}));