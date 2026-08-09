import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Flame, ArrowRight, Star, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSchoolsStore } from "@/data/useSchoolsStore";

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
      { property: "og:description", content: "Track your streak and discover featured ATS schools." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { schools } = useSchoolsStore();
  return (
    <AppShell>
      <div className="space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/15 text-2xl">
              <Flame className="size-6 text-or" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold">12-Day Streak!</h1>
              <p className="text-xs text-primary-foreground/80">
                Check in today to earn <strong>+10 points</strong>
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < 5 ? "bg-or" : "bg-white/25"}`}
              />
            ))}
          </div>
          <Link
            to="/streaks"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-or px-4 py-2 text-sm font-bold text-accent-foreground"
          >
            Check in <ArrowRight className="size-4" />
          </Link>
        </section>

        <Link
          to="/search"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-muted-foreground shadow-[var(--shadow-card)]"
        >
          <Search className="size-5" />
          <span className="text-sm">Search schools or specializations…</span>
        </Link>

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

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-foreground">Featured schools</h2>
            <Link to="/search" className="text-xs font-bold text-framboise">
              See all
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {schools.map((s) => (
              <Link
                key={s.id}
                to="/school/$schoolId"
                params={{ schoolId: s.id }}
                className="w-64 shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-32 w-full object-cover"
                />
                <div className="space-y-1.5 p-4">
                  <h3 className="font-display text-base font-extrabold text-foreground">{s.name}</h3>
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
        </section>
      </div>
    </AppShell>
  );
}