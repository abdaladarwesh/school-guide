import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { schools as initialSchools, type School } from './schools';
import { supabase } from '@/lib/supabase';

interface SchoolsState {
  schools: School[];
  isLoading: boolean;
  addSchool: (school: School) => void;
  updateSchool: (id: string, updatedSchool: School) => void;
  deleteSchool: (id: string) => void;
  fetchSchools: () => Promise<void>;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set) => ({
      schools: initialSchools,
      isLoading: false,
      addSchool: (school) => set((state) => ({ schools: [...state.schools, school] })),
      updateSchool: (id, updatedSchool) =>
        set((state) => ({
          schools: state.schools.map((s) => (s.id === id ? updatedSchool : s)),
        })),
      deleteSchool: (id) =>
        set((state) => ({
          schools: state.schools.filter((s) => s.id !== id),
        })),
      fetchSchools: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.from('schools').select('*');
          if (error) {
            console.error('Error fetching schools from Supabase:', error);
            set({ isLoading: false });
            return;
          }
          if (data && data.length > 0) {
            set({ schools: data as School[], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch schools:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'schools-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
