import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  full_name: string;
  username?: string;
  email: string;
  phone?: string;
  role: 'user' | 'seller' | 'shelter' | 'ngo' | 'veterinarian' | 'groomer' | 'admin' | 'super_admin';

  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  is_identity_verified?: boolean;
  verification_status?: string;
  profile_photo?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) =>
        set((state) => ({
          user,
          token: token !== undefined ? token : state.token,
          isAuthenticated: !!user,
        })),
      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'pawconnect-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
