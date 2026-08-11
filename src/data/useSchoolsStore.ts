import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { schools as initialSchools, type School } from "./schools";
import { supabase } from "@/lib/supabase";

interface SchoolsState {
  schools: School[];
  isLoading: boolean;
  addSchool: (
    school: School,
    imageFile?: File,
    logoFile?: File,
    galleryFiles?: File[],
  ) => Promise<void>;
  updateSchool: (
    id: string,
    updatedSchool: School,
    imageFile?: File,
    logoFile?: File,
    galleryFiles?: File[],
  ) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  fetchSchools: () => Promise<void>;
}

const uploadFile = async (file: File, folder: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("school-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from("school-images").getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set) => ({
      schools: [],
      isLoading: true,
      addSchool: async (school, imageFile, logoFile, galleryFiles) => {
        set({ isLoading: true });
        try {
          let imageUrl = school.image;
          let logoUrl = school.logo;
          let galleryUrls = school.gallery || [];

          if (imageFile) imageUrl = await uploadFile(imageFile, school.id);
          if (logoFile) logoUrl = await uploadFile(logoFile, `${school.id}/logo`);

          if (galleryFiles && galleryFiles.length > 0) {
            const uploadedGallery = await Promise.all(
              galleryFiles.map((file) => uploadFile(file, `${school.id}/gallery`)),
            );
            galleryUrls = [...galleryUrls, ...uploadedGallery];
          }

          const { partnerRating, ...restSchool } = school;
          const schoolToInsert = {
            ...restSchool,
            partner_rating: partnerRating,
            image: imageUrl,
            logo: logoUrl,
            gallery: galleryUrls,
          };

          const { error } = await supabase.from("schools").insert(schoolToInsert);

          if (error) {
            console.error("Error inserting school:", error);
            throw error;
          }

          const localSchool = { ...school, image: imageUrl, logo: logoUrl, gallery: galleryUrls };

          set((state) => ({ schools: [...state.schools, localSchool], isLoading: false }));
        } catch (error) {
          console.error("Failed to add school:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      updateSchool: async (id, updatedSchool, imageFile, logoFile, galleryFiles) => {
        set({ isLoading: true });
        try {
          let imageUrl = updatedSchool.image;
          let logoUrl = updatedSchool.logo;
          let galleryUrls = updatedSchool.gallery || [];

          if (imageFile) imageUrl = await uploadFile(imageFile, id);
          if (logoFile) logoUrl = await uploadFile(logoFile, `${id}/logo`);

          if (galleryFiles && galleryFiles.length > 0) {
            const uploadedGallery = await Promise.all(
              galleryFiles.map((file) => uploadFile(file, `${id}/gallery`)),
            );
            galleryUrls = [...galleryUrls, ...uploadedGallery];
          }

          const { partnerRating, id: _id, ...restSchool } = updatedSchool;
          const schoolToUpdate = {
            ...restSchool,
            partner_rating: partnerRating,
            image: imageUrl,
            logo: logoUrl,
            gallery: galleryUrls,
          };

          const { error } = await supabase.from("schools").update(schoolToUpdate).eq("id", id);

          if (error) {
            console.error("Error updating school:", error);
            throw error;
          }

          const localSchool = {
            ...updatedSchool,
            image: imageUrl,
            logo: logoUrl,
            gallery: galleryUrls,
          };

          set((state) => ({
            schools: state.schools.map((s) => (s.id === id ? localSchool : s)),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to update school:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      deleteSchool: async (id) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.from("schools").delete().eq("id", id);
          if (error) {
            console.error("Error deleting school:", error);
            throw error;
          }
          set((state) => ({
            schools: state.schools.filter((s) => s.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to delete school:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      fetchSchools: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.from("schools").select("*");
          if (error) {
            console.error("Error fetching schools from Supabase:", error);
            set({ isLoading: false });
            return;
          }
          if (data) {
            const mappedSchools: School[] = data.map((d: any) => {
              const { partner_rating, ...rest } = d;
              return {
                ...rest,
                prime: rest.prime === true || rest.prime === "true",
                partnerRating: partner_rating,
              } as School;
            });
            set({ schools: mappedSchools, isLoading: false });
          } else {
            set({ schools: [], isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch schools:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "schools-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ schools: state.schools }),
    },
  ),
);
