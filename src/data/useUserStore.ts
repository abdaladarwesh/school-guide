import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface UserState {
  isSubscribed: boolean;
  tier: "none" | "plus" | "max";
  session: Session | null;
  role: "student" | "admin" | null;
  hasCompletedOnboarding: boolean;
  currentStreak: number;
  points: number;
  unlockedBadges: string[];
  schoolId: string | null;
  setSubscribed: (val: boolean, tier?: "none" | "plus" | "max") => void;
  setSession: (session: Session | null, role?: "student" | "admin" | null) => void;
  setUserData: (data: {
    current_streak?: number;
    points?: number;
    unlocked_badges?: string[];
    school_id?: string | null;
  }) => void;
  setOnboardingCompleted: () => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isSubscribed: false,
      tier: "none",
      session: null,
      role: null,
      hasCompletedOnboarding: false,
      currentStreak: 0,
      points: 0,
      unlockedBadges: [],
      schoolId: null,
      setSubscribed: (val, tier = "none") => set({ isSubscribed: val, tier }),
      setSession: (session, role = null) => set({ session, role }),
      setUserData: (data) =>
        set((state) => ({
          currentStreak: data.current_streak ?? state.currentStreak,
          points: data.points ?? state.points,
          unlockedBadges: data.unlocked_badges ?? state.unlockedBadges,
          schoolId: data.school_id !== undefined ? data.school_id : state.schoolId,
        })),
      setOnboardingCompleted: () => set({ hasCompletedOnboarding: true }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, role: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
