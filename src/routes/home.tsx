import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Flame, ArrowRight, Star, Users, Loader2, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { useUserStore } from "@/data/useUserStore";
import { useEffect } from "react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — School Guide" },
      {
        name: "description",
        content:
          "Your streak, featured Applied Technology Schools and quick search — all in one place.",
      },
      { property: "og:title", content: "Home — School Guide" },
      {
        property: "og:description",
        content: "Track your streak and discover featured ATS schools.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { schools, isLoading } = useSchoolsStore();
  const { session, hasCompletedOnboarding, currentStreak, points } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !hasCompletedOnboarding) {
      navigate({ to: "/profile", replace: true });
    }
  }, [session, hasCompletedOnboarding, navigate]);

  // Check if we are processing an OAuth redirect from Supabase
  const isOauthRedirect = typeof window !== "undefined" && window.location.hash.includes("access_token=");

  // Prevent showing the home screen if onboarding is incomplete or auth is still processing
  if ((session && !hasCompletedOnboarding) || isOauthRedirect) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4 px-4 py-5">
          {/* First Loading Card Skeleton */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex animate-pulse flex-col space-y-3 mt-2">
              <div className="flex justify-between gap-4">
                <div className="h-5 w-1/2 rounded-md bg-muted"></div>
                <div className="h-5 w-1/6 rounded-md bg-muted"></div>
              </div>
              <div className="h-3 w-1/3 rounded-md bg-muted"></div>
              <div className="h-3 w-1/2 rounded-md bg-muted"></div>
              <div className="h-3 w-full rounded-md bg-muted"></div>
            </div>
          </div>

          {/* Active Search Bar */}
          <Link
            to="/search"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-muted-foreground shadow-[var(--shadow-card)]"
          >
            <Search className="size-5" />
            <span className="text-sm">Search schools or specializations…</span>
          </Link>

          {/* Second Loading Card Skeleton */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex animate-pulse flex-col space-y-3 mt-2">
              <div className="flex justify-between gap-4">
                <div className="h-5 w-1/2 rounded-md bg-muted"></div>
                <div className="h-5 w-1/6 rounded-md bg-muted"></div>
              </div>
              <div className="h-3 w-1/3 rounded-md bg-muted"></div>
              <div className="h-3 w-1/2 rounded-md bg-muted"></div>
              <div className="h-3 w-full rounded-md bg-muted"></div>
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Featured schools
            </h2>
            <Link to="/search" className="text-xs font-bold text-framboise">
              See all
            </Link>
          </div>
        </div>
        <div className=" flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {/* Array.from creates a loop to show a fixed number of skeletons (e.g., 4) */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-64 shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
            >
              {/* Image Skeleton */}
              <div className="h-32 w-full animate-pulse bg-muted (or bg-gray-200/dark:bg-gray-800)" />

              <div className="space-y-2 p-4">
                {/* Title Skeleton */}
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />

                {/* Location Skeleton */}
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted" />

                {/* Rating and Students Row Skeleton */}
                <div className="flex items-center gap-3 pt-1">
                  {/* Rating Skeleton */}
                  <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
                  {/* Students Skeleton */}
                  <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 px-4 py-5">
        {session && (
          <section className="rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-white/15 text-2xl">
                <Flame className="size-6 text-or" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-extrabold">{currentStreak}-Day Streak!</h1>
                <p className="text-xs text-primary-foreground/80">
                  You have <strong>{points} points</strong>
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => {
                const progress = currentStreak === 0 ? 0 : (currentStreak % 7 === 0 ? 7 : currentStreak % 7);
                return (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i < progress ? "bg-or" : "bg-white/25"}`}
                  />
                );
              })}
            </div>
            <Link
              to="/streaks"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-or px-4 py-2 text-sm font-bold text-accent-foreground"
            >
              Check in <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        <Link
          to="/search"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-muted-foreground shadow-[var(--shadow-card)]"
        >
          <Search className="size-5" />
          <span className="text-sm">Search schools or specializations…</span>
        </Link>



        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Featured schools
            </h2>
            <Link to="/search" className="text-xs font-bold text-framboise">
              See all
            </Link>
          </div>
          {schools.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground">No schools available yet</p>
              <p className="text-xs text-muted-foreground mt-1">Check back later for new schools.</p>
            </div>
          ) : (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
              {[...schools]
                .sort((a, b) => (a.prime === b.prime ? 0 : a.prime ? -1 : 1))
                .map((s) => (
                  <Link
                    key={s.id}
                    to="/school/$schoolId"
                    params={{ schoolId: s.id }}
                    className="w-64 shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
                  >
                    <div className="relative">
                      <img
                        src={s.image}
                        alt={s.name}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="h-32 w-full object-cover"
                      />
                      {s.prime && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">
                          <BadgeCheck className="size-3" /> Prime partner
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 p-4">
                      <h3 className="font-display text-base font-extrabold text-foreground">
                        {s.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{s.location}</p>
                      <div className="flex items-center gap-3 pt-1 text-xs font-semibold">
                        <span className="flex items-center gap-1 text-abricot">
                          <Star className="size-3.5 fill-current" /> {s.rating}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="size-3.5" /> {s.students}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl bg-[image:var(--gradient-soft)] p-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-framboise">
            Admission season
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold text-indigo">
            32 schools are accepting applications
          </h2>
          <Link
            to="/search"
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-indigo px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Explore Now <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
