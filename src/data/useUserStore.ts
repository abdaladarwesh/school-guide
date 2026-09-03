import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface UserState {
  session: Session | null;
  role: "student" | "admin" | null;
  adminSession: Session | null;
  adminRole: "student" | "admin" | null;
  hasCompletedOnboarding: boolean;
  savedOpportunities: string[];
  setSession: (session: Session | null, role?: "student" | "admin" | null) => void;
  setAdminSession: (session: Session | null, role?: "student" | "admin" | null) => void;
  setUserData: (data: any) => void;
  setOnboardingCompleted: () => void;
  toggleSavedOpportunity: (oppId: string) => void;
  logout: () => Promise<void>;
  adminLogout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      role: null,
      adminSession: null,
      adminRole: null,
      hasCompletedOnboarding: false,
      savedOpportunities: [],
      setSession: (session, role = null) => set({ session, role }),
      setAdminSession: (adminSession, adminRole = null) => set({ adminSession, adminRole }),
      setUserData: (data) =>
        set((state) => ({
          // We can sync other backend profile data here if needed
        })),
      setOnboardingCompleted: () => set({ hasCompletedOnboarding: true }),
      toggleSavedOpportunity: (oppId) => {
        const current = get().savedOpportunities;
        if (current.includes(oppId)) {
          set({ savedOpportunities: current.filter(id => id !== oppId) });
        } else {
          set({ savedOpportunities: [...current, oppId] });
        }
      },
      logout: async () => {
        const { supabase } = await import("@/lib/supabase");
        await supabase.auth.signOut();
        set({ session: null, role: null });
      },
      adminLogout: async () => {
        const { adminSupabase } = await import("@/lib/supabase");
        await adminSupabase.auth.signOut();
        set({ adminSession: null, adminRole: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
