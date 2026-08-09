import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Star, Users, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { cities } from "@/data/schools";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Schools Explorer — School Guide" },
      {
        name: "description",
        content:
          "Filter Applied Technology Schools by city and see ratings, partners, student counts and specializations.",
      },
      { property: "og:title", content: "Schools Explorer — School Guide" },
      {
        property: "og:description",
        content: "Browse and filter Egypt's Applied Technology Schools by location.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { schools } = useSchoolsStore();
  const [city, setCity] = useState("All");
  const [q, setQ] = useState("");

  const results = useMemo(
    () =>
      schools.filter(
        (s) =>
          (city === "All" || s.city === city) &&
          (q.trim() === "" ||
            `${s.name} ${s.specializations.map((x) => x.name).join(" ")}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [city, q],
  );

  return (
    <AppShell>
      <div className="space-y-5 px-4 py-5">
        <h1 className="font-display text-2xl font-extrabold text-foreground">Schools Explorer</h1>

        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <SearchIcon className="size-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="School or specialization"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                city === c
                  ? "bg-indigo text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground">{results.length} schools found</p>

        <div className="space-y-4">
          {results.map((s) => (
            <Link
              key={s.id}
              to="/school/$schoolId"
              params={{ schoolId: s.id }}
              className="block overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
            >
              <div className="relative">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-36 w-full object-cover"
                />
                {s.prime && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">
                    <BadgeCheck className="size-3" /> Prime partner
                  </span>
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-foreground">{s.name}</h2>
                    <p className="text-xs text-muted-foreground">{s.location}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-bold text-abricot">
                    <Star className="size-3.5 fill-current" /> {s.rating}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="rounded-md bg-nuage/40 px-2 py-1 text-indigo">{s.partner}</span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> {s.students} students
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.specializations.slice(0, 3).map((sp) => (
                    <span
                      key={sp.name}
                      className="rounded-full bg-blush/60 px-2.5 py-1 text-[11px] font-semibold text-framboise"
                    >
                      {sp.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}