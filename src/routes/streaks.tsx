import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flame, Trophy, Lock, Loader2, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useUserStore } from "@/data/useUserStore";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/streaks")({
  head: () => ({
    meta: [
      { title: "Streaks & Badges — School Guide" },
      {
        name: "description",
        content: "Check in daily, earn points, unlock badges and climb the ATS leaderboard.",
      },
      { property: "og:title", content: "Streaks & Badges — School Guide" },
      {
        property: "og:description",
        content: "Daily check-ins, badges and rewards for ATS students.",
      },
    ],
  }),
  component: StreaksPage,
});



function StreaksPage() {
  const { isSubscribed, currentStreak, points, unlockedBadges, schoolId, session } = useUserStore();

  const { data: realLeaderboard = [], isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, current_streak, unlocked_badges, tier, is_subscribed")
        .eq("school_id", schoolId)
        .order("current_streak", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!schoolId && isSubscribed,
  });

  const { data: allBadges = [] } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const displayBadges = allBadges.map((b) => ({
    ...b,
    unlocked: unlockedBadges.includes(b.id),
  }));

  // Sort badges so unlocked ones appear first
  displayBadges.sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1));

  // Find our rank
  const myRank = realLeaderboard.findIndex((u) => u.id === session?.user.id) + 1;
  const myPremiumBadge = displayBadges.find((b) => b.is_premium && b.unlocked);

  return (
    <AppShell>
      <div className="space-y-6 px-4 py-5">
        <section
          className={`relative overflow-hidden rounded-3xl p-6 text-center shadow-[var(--shadow-float)] transition-colors ${
            isSubscribed
              ? "bg-[image:var(--gradient-warm)] text-accent-foreground"
              : "bg-card text-muted-foreground border-2 border-border"
          }`}
        >
          {!isSubscribed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur-md p-4">
              <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-indigo text-primary-foreground shadow-lg">
                <Lock className="size-6" />
              </div>
              <p className="text-base font-extrabold text-foreground font-display">
                Streaks are Locked
              </p>
              <p className="mt-1 mb-4 text-xs font-semibold text-muted-foreground text-center max-w-[200px]">
                Subscribe to Plus or Max to unlock streaks & exclusive communities.
              </p>
              <Link
                to="/prime"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-transform active:scale-95"
              >
                View Premium Plans
              </Link>
            </div>
          )}

          <div className={!isSubscribed ? "opacity-30 blur-[2px]" : ""}>
            <Flame className="mx-auto size-12" strokeWidth={2.4} />
            <p className="mt-2 font-display text-5xl font-extrabold">{currentStreak}</p>
            <p className="text-sm font-bold uppercase tracking-widest">day streak</p>
            <p className="mt-4 text-sm font-semibold opacity-90 px-4">
              Interact daily in communities to keep your streak alive! (+10 pts/day)
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="font-display text-2xl font-extrabold text-framboise">
              {points.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">Total points</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="font-display text-2xl font-extrabold text-indigo">
              {myRank > 0 ? `#${myRank}` : "-"}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">Leaderboard rank</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            <TooltipProvider>
              {displayBadges.map((b) => (
                <Tooltip key={b.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative cursor-help rounded-2xl p-3 text-center transition-all ${
                        b.unlocked
                          ? b.is_premium
                            ? "bg-[image:var(--gradient-warm)] text-accent-foreground shadow-lg"
                            : "bg-blush/60 text-foreground"
                          : "bg-muted opacity-60 grayscale"
                      }`}
                    >
                      <div className="absolute right-3 top-3 ">
                        <Info className="size-3" />
                      </div>
                      <span className="text-2xl drop-shadow-md">{b.emoji}</span>
                      <p
                        className={`mt-1 text-[11px] font-bold ${b.is_premium && b.unlocked ? "text-accent-foreground" : "text-foreground/80"}`}
                      >
                        {b.name}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5}>
                    <p className="max-w-[150px] text-center text-xs">{b.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-extrabold text-foreground">
            <Trophy className="size-5 text-or" /> Leaderboard
          </h2>
          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
            {!schoolId ? (
              <div className="p-6 text-center text-sm font-semibold text-muted-foreground">
                Join a school in your profile to see the leaderboard!
              </div>
            ) : isLeaderboardLoading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : realLeaderboard.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-muted-foreground">
                No users found on this leaderboard yet.
              </div>
            ) : (
              realLeaderboard.map((u, i) => {
                const isMe = u.id === session?.user.id;
                const hasPremium = u.is_subscribed && (u.tier === "plus" || u.tier === "max");

                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 ${
                      isMe ? "bg-nuage/25" : ""
                    }`}
                  >
                    <span className="font-display text-sm font-extrabold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-foreground">
                      {isMe
                        ? "You"
                        : `${u.first_name || "Anonymous"} ${u.last_name ? u.last_name[0] + "." : ""}`}{" "}
                      {hasPremium && (
                        <span className="ml-1 text-xs">{u.tier === "max" ? "💎" : "✨"}</span>
                      )}
                    </span>
                    <span className="text-sm font-bold text-framboise">
                      {u.current_streak}{" "}
                      <span className="text-[10px] text-muted-foreground">days</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
