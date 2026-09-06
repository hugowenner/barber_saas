"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types/admin";
import { MOCK_ADMIN_USER } from "@/data/admin/users";

/**
 * Mock admin auth store.
 *
 * This is a placeholder until NextAuth lands. Any email/password combination
 * "logs in" as the mock admin user. The persistence lets a refresh keep the
 * session — mimicking real auth behavior.
 *
 * Swap point: replace this with `useSession()` from NextAuth once the real
 * credentials provider is wired up.
 */

interface AdminAuthState {
  user: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (_email, _password) => {
        // Mock: accept anything non-empty.
        set({ user: MOCK_ADMIN_USER });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "barber-house-admin-auth",
    },
  ),
);
