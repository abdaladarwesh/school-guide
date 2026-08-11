import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase, adminSupabase } from "@/lib/supabase";

export interface FieldOfStudy {
  id: string;
  name: string;
}

interface FieldsOfStudyState {
  fields: FieldOfStudy[];
  isLoading: boolean;
  fetchFields: () => Promise<void>;
  addField: (name: string) => Promise<FieldOfStudy>;
}

export const useFieldsOfStudyStore = create<FieldsOfStudyState>()(
  persist(
    (set) => ({
      fields: [],
      isLoading: false,
      fetchFields: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from("fields_of_study")
            .select("*")
            .order("name", { ascending: true });
            
          if (error) throw error;
          
          set({ fields: data || [], isLoading: false });
        } catch (error) {
          console.error("Error fetching fields of study:", error);
          set({ isLoading: false });
        }
      },
      addField: async (name: string) => {
        set({ isLoading: true });
        try {
          // Add to DB
          const { data, error } = await adminSupabase
            .from("fields_of_study")
            .insert([{ name }])
            .select()
            .single();
            
          if (error) throw error;
          
          // Update local state
          set((state) => ({ 
            fields: [...state.fields, data].sort((a, b) => a.name.localeCompare(b.name)),
            isLoading: false 
          }));
          
          return data;
        } catch (error) {
          console.error("Error adding field of study:", error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "fields-of-study-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ fields: state.fields }),
    }
  )
);
