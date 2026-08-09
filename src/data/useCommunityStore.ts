import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Post {
  id: string;
  author: string;
  tag: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
}

interface CommunityState {
  postsBySchool: Record<string, Post[]>;
  addPost: (schoolId: string, post: Omit<Post, 'id' | 'likes' | 'replies' | 'time'>) => void;
}

export const initialPosts: Post[] = [
  {
    id: "1",
    author: "Youssef A.",
    tag: "ATS New Cairo",
    time: "2h",
    body: "Finished my first Valeo rotation this week — the PLC lab is nothing like the videos, way more hands-on. Ask me anything!",
    likes: 128,
    replies: 24,
  },
  {
    id: "2",
    author: "Mariam H.",
    tag: "Admissions",
    time: "5h",
    body: "Does the 85% minimum include the practical subjects? My prep certificate is 84.6% and I'm nervous about the cutoff.",
    likes: 61,
    replies: 39,
  },
  {
    id: "3",
    author: "Kareem S.",
    tag: "Careers",
    time: "1d",
    body: "Graduated from Alexandria Industrial in 2023, now an automation technician at 17k/month. The dual certificate really does open doors.",
    likes: 245,
    replies: 52,
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      postsBySchool: {},
      addPost: (schoolId, newPost) => set((state) => {
        const existingPosts = state.postsBySchool[schoolId] || initialPosts;
        const post: Post = {
          ...newPost,
          id: Math.random().toString(36).substring(7),
          time: "Just now",
          likes: 0,
          replies: 0,
        };
        return {
          postsBySchool: {
            ...state.postsBySchool,
            [schoolId]: [post, ...existingPosts],
          },
        };
      }),
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
