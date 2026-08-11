import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Check, Sparkles, Users, AlertTriangle, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useUserStore } from "@/data/useUserStore";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/prime")({
  head: () => ({
    meta: [
      { title: "Subscriptions — School Guide" },
      {
        name: "description",
        content:
          "Unlock Plus for communities and enhanced search, or Max for an AI advisor and mentor sessions.",
      },
      { property: "og:title", content: "Subscriptions — School Guide" },
      {
        property: "og:description",
        content: "Choose the right plan to boost your education journey.",
      },
    ],
  }),
  component: SubscriptionsPage,
});

const plusPerks = [
  "Join exclusive student communities",
  "Enhanced search results & filters",
  "Custom profile themes",
];

const maxPerks = [
  "Everything in Plus",
  "AI School Advisor to match your interests",
  "1-on-1 sessions with ATS mentors",
  "Priority review on your applications",
  "Exclusive partner company open days",
];

function SubscriptionsPage() {
  const navigate = useNavigate();
  const { tier, setSubscribed, session } = useUserStore();
  const [cancelStep, setCancelStep] = useState(0);

  const handleSubscribe = async (selectedTier: "plus" | "max") => {
    if (!session?.user) {
      toast.error("You must have an account first");
      navigate({ to: "/login" });
      return;
    }

    setSubscribed(true, selectedTier);
    const { error } = await supabase
      .from("profiles")
      .update({ tier: selectedTier, is_subscribed: true })
      .eq("id", session.user.id);
    if (error) {
      console.error("Error updating subscription:", error.message);
    } else {
      if (selectedTier === "plus" || selectedTier === "max") {
        await supabase.rpc("grant_badge", { badge_id: "plus_member" });
      }
      if (selectedTier === "max") {
        await supabase.rpc("grant_badge", { badge_id: "max_member" });
      }

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

    navigate({ to: "/search" });
  };

  const handleUnsubscribe = async () => {
    setSubscribed(false, "none");
    if (session?.user) {
      const { error } = await supabase
        .from("profiles")
        .update({ tier: "none", is_subscribed: false })
        .eq("id", session.user.id);
      if (error) console.error("Error updating subscription:", error.message);
    }
    setCancelStep(0);
  };

  return (
    <AppShell>
      <div className="space-y-8 px-4 py-6 pb-24">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-foreground">Choose Your Plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock premium tools and communities to find your perfect school.
          </p>
        </div>

        {/* Plus Tier */}


        {/* Max Tier */}
        <section className="relative rounded-3xl bg-[image:var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-float)]">
          <div className="absolute -top-4 right-4 rounded-full bg-[image:var(--gradient-warm)] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-accent-foreground shadow-lg">
            Recommended
          </div>

          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/20 text-or">
              <Crown className="size-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold">Max</h2>
              <p className="text-sm font-semibold text-primary-foreground/80">
                AI Advisor & Mentorship
              </p>
            </div>
          </div>

          <p className="mt-5 font-display text-3xl font-extrabold">
            EGP 99<span className="text-base font-semibold">/month</span>
          </p>

          <ul className="mt-6 space-y-3">
            {maxPerks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-framboise text-primary-foreground">
                  <Sparkles className="size-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          {tier === "max" ? (
            <button
              className="mt-6 w-full rounded-2xl bg-white/20 py-3.5 font-display text-lg font-extrabold text-primary-foreground"
              disabled
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleSubscribe("max")}
              className="mt-6 w-full rounded-2xl bg-or py-3.5 font-display text-lg font-extrabold text-accent-foreground shadow-lg transition-transform active:scale-95"
            >
              {tier === "plus" ? "Upgrade to Max" : "Go Max"}
            </button>
          )}
        </section>

        <section className="relative rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] border-2 border-indigo/10">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-nuage/30 text-indigo">
              <Users className="size-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-foreground">Plus</h2>
              <p className="text-sm font-semibold text-muted-foreground">Community & Discovery</p>
            </div>
          </div>

          <p className="mt-5 font-display text-3xl font-extrabold text-foreground">
            EGP 49<span className="text-base font-semibold text-muted-foreground">/month</span>
          </p>

          <ul className="mt-6 space-y-3">
            {plusPerks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-indigo/10 text-indigo">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          {tier === "plus" ? (
            <button
              className="mt-6 w-full rounded-2xl bg-secondary py-3.5 font-display text-lg font-extrabold text-secondary-foreground"
              disabled
            >
              Current Plan
            </button>
          ) : tier === "max" ? (
            <button
              className="mt-6 w-full rounded-2xl bg-secondary py-3.5 font-display text-lg font-extrabold text-secondary-foreground"
              disabled
            >
              Included in Max
            </button>
          ) : (
            <button
              onClick={() => handleSubscribe("plus")}
              className="mt-6 w-full rounded-2xl bg-indigo/10 py-3.5 font-display text-lg font-extrabold text-indigo transition-colors hover:bg-indigo hover:text-primary-foreground"
            >
              Get Plus
            </button>
          )}
        </section>

        {tier !== "none" && (
          <div className="pt-8 text-center">
            <button
              onClick={() => setCancelStep(1)}
              className="text-sm font-bold text-muted-foreground hover:text-foreground underline decoration-muted-foreground/30 underline-offset-4"
            >
              Cancel my subscription
            </button>
          </div>
        )}
      </div>

      {cancelStep > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/80 p-4 backdrop-blur-sm sm:justify-center">
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-10 rounded-3xl bg-card p-6 shadow-2xl ring-2 ring-destructive sm:zoom-in-95">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              <AlertTriangle className="size-8" />
            </div>

            <h2 className="text-center font-display text-2xl font-extrabold text-destructive">
              Danger: Cancel Subscription?
            </h2>

            <p className="mt-4 text-center text-sm font-semibold leading-relaxed text-foreground/90">
              This is a <strong className="text-destructive">critical action</strong>. You will
              immediately lose all premium benefits, AI advisor access, and exclusive communities.
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Are you absolutely sure you want to throw away your progress?
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => setCancelStep(0)}
                className="w-full rounded-2xl bg-indigo py-4 font-display text-lg font-extrabold text-primary-foreground shadow-lg transition-transform active:scale-95"
              >
                No, keep my benefits
              </button>

              <button
                onClick={handleUnsubscribe}
                className="w-full py-2 text-xs font-bold uppercase tracking-widest text-destructive hover:text-destructive/80"
              >
                Yes, cancel everything
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
