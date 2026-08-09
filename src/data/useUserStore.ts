import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserState {
  isSubscribed: boolean;
  tier: 'none' | 'plus' | 'max';
  session: Session | null;
  role: 'student' | 'admin' | null;
  hasCompletedOnboarding: boolean;
  setSubscribed: (val: boolean, tier?: 'none' | 'plus' | 'max') => void;
  setSession: (session: Session | null, role?: 'student' | 'admin' | null) => void;
  setOnboardingCompleted: () => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isSubscribed: false,
      tier: 'none',
      session: null,
      role: null,
      hasCompletedOnboarding: false,
      setSubscribed: (val, tier = 'none') => set({ isSubscribed: val, tier }),
      setSession: (session, role = null) => set({ session, role }),
      setOnboardingCompleted: () => set({ hasCompletedOnboarding: true }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, role: null });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
