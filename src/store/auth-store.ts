import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "client";
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  mustChangePassword: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setMustChangePassword: (mustChangePassword: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      mustChangePassword: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setMustChangePassword: (mustChangePassword) =>
        set({ mustChangePassword }),
      signOut: () => set({ user: null, mustChangePassword: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
