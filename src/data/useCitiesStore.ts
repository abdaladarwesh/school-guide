import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase, adminSupabase } from "@/lib/supabase";

export interface City {
  id: string;
  name: string;
}

interface CitiesState {
  cities: City[];
  isLoading: boolean;
  fetchCities: () => Promise<void>;
  addCity: (name: string) => Promise<City>;
}

export const useCitiesStore = create<CitiesState>()(
  persist(
    (set) => ({
      cities: [],
      isLoading: false,
      fetchCities: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from("cities")
            .select("*")
            .order("name", { ascending: true });
            
          if (error) throw error;
          
          set({ cities: data || [], isLoading: false });
        } catch (error) {
          console.error("Error fetching cities:", error);
          set({ isLoading: false });
        }
      },
      addCity: async (name: string) => {
        set({ isLoading: true });
        try {
          // Add to DB
          const { data, error } = await adminSupabase
            .from("cities")
            .insert([{ name }])
            .select()
            .single();
            
          if (error) throw error;
          
          // Update local state
          set((state) => ({ 
            cities: [...state.cities, data].sort((a, b) => a.name.localeCompare(b.name)),
            isLoading: false 
          }));
          
          return data;
        } catch (error) {
          console.error("Error adding city:", error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "cities-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cities: state.cities }),
    }
  )
);
