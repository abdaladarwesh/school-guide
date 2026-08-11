import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LikedPostsState {
  likedPostIds: string[];
  addLikedPost: (id: string) => void;
  removeLikedPost: (id: string) => void;
  hasLiked: (id: string) => boolean;
}

export const useLikedPostsStore = create<LikedPostsState>()(
  persist(
    (set, get) => ({
      likedPostIds: [],
      addLikedPost: (id) =>
        set((state) => ({
          likedPostIds: state.likedPostIds.includes(id)
            ? state.likedPostIds
            : [...state.likedPostIds, id],
        })),
      removeLikedPost: (id) =>
        set((state) => ({
          likedPostIds: state.likedPostIds.filter((postId) => postId !== id),
        })),
      hasLiked: (id) => get().likedPostIds.includes(id),
    }),
    {
      name: "liked-posts-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
