import { create } from 'zustand';

export interface User {
  id: number | string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  phone?: string;
  course?: string;
  is_blocked?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const STORAGE_KEY = 'kfreelance_auth_user';

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  login: (user) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to persist user session", e);
    }
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear user session", e);
    }
    set({ user: null, isAuthenticated: false });
  },
}));
