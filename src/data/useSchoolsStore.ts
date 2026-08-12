import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { schools as initialSchools, type School } from "./schools";
import { supabase, adminSupabase } from "@/lib/supabase";

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
      .from("school-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = client.storage.from("school-images").getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  export const useSchoolsStore = create<SchoolsState>()(
    persist(
      (set, get) => ({
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

            const { partnerRating, school_admins, ...restSchool } = school;
            const schoolToInsert = {
              ...restSchool,
              partner_rating: partnerRating,
              image: imageUrl,
              logo: logoUrl,
              gallery: galleryUrls,
            };

            const client = await getClient();
            const { error } = await client.from("schools").insert(schoolToInsert);

            if (error) {
              console.error("Error inserting school:", error);
              throw error;
            }

            if (school_admins && school_admins.length > 0) {
              const adminsToInsert = school_admins.map((a) => ({
                school_id: school.id,
                profile_id: a.profile_id,
              }));
              const { error: adminError } = await client.from("school_admins").insert(adminsToInsert);
              if (adminError) {
                console.error("Error inserting school admins:", adminError);
                throw adminError;
              }
            }

            const localSchool = { ...school, image: imageUrl, logo: logoUrl, gallery: galleryUrls, school_admins };

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

            const { partnerRating, id: _id, school_admins, ...restSchool } = updatedSchool;
            const schoolToUpdate = {
              ...restSchool,
              partner_rating: partnerRating,
              image: imageUrl,
              logo: logoUrl,
              gallery: galleryUrls,
            };

            const client = await getClient();
            const { error } = await client.from("schools").update(schoolToUpdate).eq("id", id);

            if (error) {
              console.error("Error updating school:", error);
              throw error;
            }

            let finalAdmins = school_admins;
            const { error: deleteError } = await client.from("school_admins").delete().eq("school_id", id);
            
            if (deleteError) {
              if (deleteError.code === '42501') {
                console.warn("RLS prevented deleting school admins. Ignoring.");
                finalAdmins = get().schools.find((s) => s.id === id)?.school_admins || [];
              } else {
                throw deleteError;
              }
            } else {
              if (school_admins && school_admins.length > 0) {
                const adminsToInsert = school_admins.map((a) => ({
                  school_id: id,
                  profile_id: a.profile_id,
                }));
                const { error: adminError } = await client.from("school_admins").insert(adminsToInsert);
                if (adminError) {
                  if (adminError.code === '42501') {
                    console.warn("RLS prevented inserting school admins. Ignoring.");
                    finalAdmins = get().schools.find((s) => s.id === id)?.school_admins || [];
                  } else {
                    console.error("Error inserting school admins:", adminError);
                    throw adminError;
                  }
                }
              }
            }

            const localSchool = {
              ...updatedSchool,
              image: imageUrl,
              logo: logoUrl,
              gallery: galleryUrls,
              school_admins: finalAdmins,
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
          const { error } = await adminSupabase.from("schools").delete().eq("id", id);
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
          const { data, error } = await supabase.from("schools").select("*, school_admins(profile_id, profiles(email, first_name, last_name))");
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
