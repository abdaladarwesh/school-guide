import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Opportunity } from "./opportunities";
import { supabase, adminSupabase } from "@/lib/supabase";

interface OpportunitiesState {
  opportunities: Opportunity[];
  isLoading: boolean;
  addOpportunity: (opportunity: Opportunity, imageFile?: File) => Promise<void>;
  updateOpportunity: (id: string, updatedOpportunity: Opportunity, imageFile?: File) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  fetchOpportunities: () => Promise<void>;
}

const getClient = async () => {
  const { data: { session: adminSession } } = await adminSupabase.auth.getSession();
  return adminSession ? adminSupabase : supabase;
};

const uploadFile = async (file: File, folder: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;
  const client = await getClient();

  const { error: uploadError } = await client.storage
    .from("opportunity-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  const { data: publicUrlData } = client.storage.from("opportunity-images").getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: [],
      isLoading: true,
      addOpportunity: async (opportunity, imageFile) => {
        set({ isLoading: true });
        try {
          let imageUrl = opportunity.image;
          if (imageFile) imageUrl = await uploadFile(imageFile, opportunity.id);

          const opportunityToInsert = { ...opportunity, image: imageUrl };
          const client = await getClient();
          const { error } = await client.from("opportunities").insert(opportunityToInsert);

          if (error) throw error;
          
          set((state) => ({ opportunities: [...state.opportunities, opportunityToInsert], isLoading: false }));
        } catch (error) {
          console.error("Failed to add opportunity:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      updateOpportunity: async (id, updatedOpportunity, imageFile) => {
        set({ isLoading: true });
        try {
          let imageUrl = updatedOpportunity.image;
          if (imageFile) imageUrl = await uploadFile(imageFile, id);

          const opportunityToUpdate = { ...updatedOpportunity, image: imageUrl };
          const client = await getClient();
          const { error } = await client.from("opportunities").update(opportunityToUpdate).eq("id", id);

          if (error) throw error;
          
          set((state) => ({
            opportunities: state.opportunities.map((o) => (o.id === id ? opportunityToUpdate : o)),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to update opportunity:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      deleteOpportunity: async (id) => {
        set({ isLoading: true });
        try {
          const { error } = await adminSupabase.from("opportunities").delete().eq("id", id);
          if (error) throw error;
          
          set((state) => ({
            opportunities: state.opportunities.filter((o) => o.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to delete opportunity:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      fetchOpportunities: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.from("opportunities").select("*");
          if (error) {
            console.error("Error fetching opportunities:", error);
            set({ isLoading: false });
            return;
          }
          if (data) {
            set({ opportunities: data as Opportunity[], isLoading: false });
          } else {
            set({ opportunities: [], isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch opportunities:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "opportunities-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ opportunities: state.opportunities }),
    },
  )
);
