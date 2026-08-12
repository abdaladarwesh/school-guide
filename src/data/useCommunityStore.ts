import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Post {
  id: string;
  author_id: string;
  profiles?: { first_name: string; last_name: string; avatar_url: string | null; age: string | null; school_id: string | null; email?: string | null; };
  tag: string;
  time: string;
  body: string;
  image_urls?: string[];
  likes: number;
  replies: number;
  school_id?: string;
  created_at?: string;
}

export function useCommunityPosts(schoolId: string) {
  return useQuery({
    queryKey: ["community-posts", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*, profiles(first_name, last_name, avatar_url, age, school_id, email)")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load community posts");
        throw error;
      }

      return data as Post[];
    },
  });
}

export function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      post: Omit<Post, "id" | "likes" | "replies" | "time" | "profiles"> & { school_id: string },
    ) => {
      const { useUserStore } = await import("@/data/useUserStore");
      const session = useUserStore.getState().session;
      if (!session) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          ...post,
          author_id: session.user.id,
          time: "Just now", // Can be computed from created_at in the future, fallback for now
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts", data.school_id] });
      toast.success("Question posted successfully!");

      // Record interaction for streaks
      await supabase.rpc("record_interaction");

      // Refetch user data to update UI (streak/points)
      const { useUserStore } = await import("@/data/useUserStore");
      const session = useUserStore.getState().session;
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, points, unlocked_badges")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          useUserStore.getState().setUserData({
            current_streak: profile.current_streak,
            points: profile.points,
            unlocked_badges: profile.unlocked_badges,
          });
        }
      }
    },
    onError: (error) => {
      toast.error("Failed to post question: " + error.message);
    },
  });
}

export interface Reply {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_id: string;
  profiles?: { first_name: string; last_name: string; avatar_url: string | null; age: string | null; school_id: string | null; email?: string | null; };
  body: string;
  created_at: string;
}

export function useReplies(postId: string) {
  return useQuery({
    queryKey: ["community-replies", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_replies")
        .select("*, profiles(first_name, last_name, avatar_url, age, school_id, email)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return data as Reply[];
    },
  });
}

export function useAddReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, body, parentId }: { postId: string; body: string; parentId?: string | null }) => {
      const { useUserStore } = await import("@/data/useUserStore");
      const session = useUserStore.getState().session;
      if (!session) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("community_replies")
        .insert({
          post_id: postId,
          parent_id: parentId || null,
          author_id: session.user.id,
          body,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["community-replies", data.post_id] });
      // We also need to invalidate the post since its reply count increased
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Reply posted!");

      // Record interaction and grant Helper badge
      await supabase.rpc("record_interaction");
      await supabase.rpc("grant_badge", { badge_id: "helper" });

      // Refetch user data to update UI (streak/points/badges)
      const { useUserStore } = await import("@/data/useUserStore");
      const session = useUserStore.getState().session;
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, points, unlocked_badges")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          useUserStore.getState().setUserData({
            current_streak: profile.current_streak,
            points: profile.points,
            unlocked_badges: profile.unlocked_badges,
          });
        }
      }
    },
    onError: (error) => {
      toast.error("Failed to post reply: " + error.message);
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc("like_community_post", { post_id: postId });

      if (error) {
        throw error;
      }
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
    onError: (error) => {
      toast.error("Failed to like post: " + error.message);
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc("unlike_community_post", { post_id: postId });

      if (error) {
        throw error;
      }
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
    onError: (error) => {
      toast.error("Failed to unlike post: " + error.message);
    },
  });
}
