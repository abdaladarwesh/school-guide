import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Star, Users, BadgeCheck, Loader2, List, LayoutGrid } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSchoolsStore } from "@/data/useSchoolsStore";

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
  const { schools, isLoading } = useSchoolsStore();
  const [city, setCity] = useState("All");
  const [field, setField] = useState("All");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    schools.forEach((s) => {
      if (s.city) cities.add(s.city);
    });
    return ["All", ...Array.from(cities).sort()];
  }, [schools]);

  const uniqueFields = useMemo(() => {
    const fields = new Set<string>();
    schools.forEach((s) => {
      if (s.main_field_of_study) fields.add(s.main_field_of_study);
    });
    return ["All", ...Array.from(fields).sort()];
  }, [schools]);

  const results = useMemo(
    () =>
      schools.filter(
        (s) =>
          (city === "All" || s.city === city) &&
          (field === "All" || s.main_field_of_study === field) &&
          (q.trim() === "" ||
            `${s.name} ${s.specializations.map((x) => x.name).join(" ")}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [city, field, q, schools],
  );

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-5 px-4 py-5">
          {/* Static Title (Prevents layout jump) */}
          <h1 className="font-display text-2xl font-extrabold text-foreground">Schools Explorer</h1>

          {/* Search Bar Skeleton */}
          <div className="flex animate-pulse items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
            <div className="size-5 shrink-0 rounded-full bg-muted" />
            <div className="h-4 w-48 rounded-md bg-muted" />
          </div>

          {/* Filters Skeleton */}
          <div className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-hidden px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-muted" />
              ))}
            </div>
            <div className="-mx-4 flex gap-2 overflow-hidden px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted" />
              ))}
            </div>
          </div>

          {/* Results Count Skeleton */}
          <div className="h-3.5 w-24 animate-pulse rounded-md bg-muted" />

          {/* School Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="block overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
              >
                {/* Hero Image Skeleton */}
                <div className="h-36 w-full animate-pulse bg-muted" />

                <div className="space-y-3 p-4">
                  {/* Title & Rating Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-full space-y-2">
                      <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
                      <div className="h-3 w-1/3 animate-pulse rounded-md bg-muted" />
                    </div>
                    {/* Rating Badge Skeleton */}
                    <div className="h-6 w-12 shrink-0 animate-pulse rounded-full bg-muted" />
                  </div>

                  {/* Partner & Students Row */}
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  </div>

                  {/* Specialization Tags Row */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

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

        <div className="space-y-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {uniqueCities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  city === c
                    ? "bg-indigo text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {c === "All" ? "All Cities" : c}
              </button>
            ))}
          </div>
          
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {uniqueFields.map((f) => (
              <button
                key={f}
                onClick={() => setField(f)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  field === f
                    ? "bg-framboise text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {f === "All" ? "All Fields" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            {results.length} schools found
          </p>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>

        <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-2 gap-3"}>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
              <div className="rounded-full bg-muted p-4 mb-4">
                <SearchIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-display font-extrabold text-foreground">No schools found</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                We couldn't find any schools matching your search criteria. Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            results.map((s) => (
              <Link
                key={s.id}
                to="/school/$schoolId"
                params={{ schoolId: s.id }}
                className={viewMode === "list" 
                  ? "block overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]" 
                  : "flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]"}
              >
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    width={viewMode === "list" ? 1024 : 500}
                    height={viewMode === "list" ? 640 : 312}
                    className={`${viewMode === "list" ? "h-36" : "h-28"} w-full object-cover`}
                  />
                  {s.prime && (
                    <span className={`absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] text-accent-foreground ${viewMode === "list" ? "px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" : "p-1.5"}`}>
                      <BadgeCheck className="size-3" /> {viewMode === "list" && "Prime partner"}
                    </span>
                  )}
                </div>
                
                {viewMode === "list" ? (
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-lg font-extrabold text-foreground">
                          {s.name}
                        </h2>
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
                ) : (
                  <div className="flex flex-1 flex-col p-3">
                    <h2 className="font-display text-sm font-extrabold text-foreground line-clamp-2 leading-tight">
                      {s.name}
                    </h2>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground truncate max-w-[60%]">{s.location}</span>
                      <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-abricot">
                        <Star className="size-3 fill-current" /> {s.rating}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
