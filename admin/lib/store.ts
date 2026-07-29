import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AdminRole = 'admin' | 'super_admin';

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: AdminRole;
  is_email_verified?: boolean;
  verification_status?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AdminUser | null, token?: string | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminAuthState>()(
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
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'pawconnect-admin-auth',          // separate localStorage key from public site
      storage: createJSONStorage(() => localStorage),
    }
  )
);
