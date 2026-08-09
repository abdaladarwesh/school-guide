import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useUserStore } from "@/data/useUserStore";

export const Route = createFileRoute("/streaks")({
  head: () => ({
    meta: [
      { title: "Streaks & Badges — School Guide" },
      {
        name: "description",
        content: "Check in daily, earn points, unlock badges and climb the ATS leaderboard.",
      },
      { property: "og:title", content: "Streaks & Badges — School Guide" },
      { property: "og:description", content: "Daily check-ins, badges and rewards for ATS students." },
    ],
  }),
  component: StreaksPage,
});

const defaultBadges = [
  { emoji: "🔥", name: "Week Warrior", unlocked: true },
  { emoji: "📚", name: "Quiz Master", unlocked: true },
  { emoji: "🤝", name: "Helper", unlocked: true },
  { emoji: "🏅", name: "Top 100", unlocked: false },
  { emoji: "🚀", name: "30-Day Club", unlocked: false },
  { emoji: "👑", name: "Legend", unlocked: false },
];

const leaderboard = [
  { name: "Salma R.", pts: 3420 },
  { name: "Omar T.", pts: 3180 },
  { name: "You", pts: 2965 },
  { name: "Hana M.", pts: 2740 },
];

function StreaksPage() {
  const [checked, setChecked] = useState(false);
  const { tier } = useUserStore();

  const tierBadge = tier === 'max' 
    ? [{ emoji: "💎", name: "Max Member", unlocked: true, isPremium: true }] 
    : tier === 'plus' 
    ? [{ emoji: "✨", name: "Plus Member", unlocked: true, isPremium: true }] 
    : [];

  const displayBadges = [...tierBadge, ...defaultBadges];

  return (
    <AppShell>
      <div className="space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-[image:var(--gradient-warm)] p-6 text-center text-accent-foreground shadow-[var(--shadow-float)]">
          <Flame className="mx-auto size-12" strokeWidth={2.4} />
          <p className="mt-2 font-display text-5xl font-extrabold">{checked ? 13 : 12}</p>
          <p className="text-sm font-bold uppercase tracking-widest">day streak</p>
          <button
            onClick={() => setChecked(true)}
            disabled={checked}
            className="mt-4 w-full rounded-2xl bg-indigo py-3.5 font-display font-extrabold text-primary-foreground disabled:opacity-60"
          >
            {checked ? "Checked in — +10 points 🎉" : "Check in today (+10 points)"}
          </button>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="font-display text-2xl font-extrabold text-framboise">
              {checked ? "2,975" : "2,965"}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">Total points</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="font-display text-2xl font-extrabold text-indigo">#3</p>
            <p className="text-xs font-semibold text-muted-foreground">Leaderboard rank</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {displayBadges.map((b) => (
              <div
                key={b.name}
                className={`rounded-2xl p-3 text-center transition-all ${
                  b.unlocked 
                    ? (b as any).isPremium 
                      ? "bg-[image:var(--gradient-warm)] text-accent-foreground shadow-lg scale-105" 
                      : "bg-blush/60" 
                    : "bg-muted opacity-60"
                }`}
              >
                <span className="text-2xl drop-shadow-md">{b.emoji}</span>
                <p className={`mt-1 text-[11px] font-bold ${(b as any).isPremium ? "text-accent-foreground" : "text-foreground/80"}`}>{b.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-extrabold text-foreground">
            <Trophy className="size-5 text-or" /> Leaderboard
          </h2>
          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
            {leaderboard.map((u, i) => (
              <div
                key={u.name}
                className={`flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 ${
                  u.name === "You" ? "bg-nuage/25" : ""
                }`}
              >
                <span className="font-display text-sm font-extrabold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {u.name} {u.name === "You" && tierBadge.length > 0 && <span className="ml-1 text-xs">{tierBadge[0].emoji}</span>}
                </span>
                <span className="text-sm font-bold text-framboise">{u.pts}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}