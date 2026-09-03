import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Clock, Building, Bookmark, Loader2, List, LayoutGrid } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Opportunities Explorer — MASARAK" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { opportunities, isLoading } = useOpportunitiesStore();
  const [funding, setFunding] = useState("All");
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const uniqueFunding = useMemo(() => {
    const types = new Set<string>();
    opportunities.forEach((o) => {
      if (o.funding_type) types.add(o.funding_type);
    });
    return ["All", ...Array.from(types).sort()];
  }, [opportunities]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    opportunities.forEach((o) => {
      if (o.category) cats.add(o.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [opportunities]);

  const results = useMemo(
    () =>
      opportunities.filter(
        (o) =>
          (funding === "All" || o.funding_type === funding) &&
          (category === "All" || o.category === category) &&
          (q.trim() === "" ||
            `${o.title} ${o.institution} ${o.location}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [funding, category, q, opportunities],
  );

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 py-6">
        <h1 className="font-display text-2xl font-extrabold text-foreground">Explore Opportunities</h1>

        <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <SearchIcon className="size-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search scholarships, internships, countries..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="space-y-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {uniqueFunding.map((f) => (
              <button
                key={f}
                onClick={() => setFunding(f)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  funding === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {f === "All" ? "All Funding" : f}
              </button>
            ))}
          </div>
          
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {uniqueCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  category === c
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {c === "All" ? "All Categories" : c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold text-muted-foreground">
            {results.length} programs found
          </p>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
              <h3 className="text-lg font-display font-extrabold text-foreground">No matches found</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Try adjusting your filters or search term to find more opportunities.
              </p>
            </div>
          ) : (
            results.map((o) => (
              <Link
                key={o.id}
                to="/opportunity/$oppId"
                params={{ oppId: o.id }}
                className={viewMode === "list" 
                  ? "flex flex-col sm:flex-row gap-4 overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)] p-4 border border-border transition-all hover:shadow-lg" 
                  : "flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] border border-border transition-all hover:shadow-lg"}
              >
                {o.image ? (
                  <img
                    src={o.image}
                    alt={o.title}
                    loading="lazy"
                    className={`${viewMode === "list" ? "h-32 w-full sm:w-32 rounded-2xl" : "h-28 w-full"} object-cover`}
                  />
                ) : (
                  <div className={`${viewMode === "list" ? "h-32 w-full sm:w-32 rounded-2xl" : "h-28 w-full"} bg-muted flex items-center justify-center`}>
                    <Building className="size-8 text-muted-foreground/50" />
                  </div>
                )}
                
                <div className={`flex flex-col flex-1 ${viewMode === "grid" ? "p-3" : ""}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{o.category}</span>
                    {viewMode === "list" && <Bookmark className="size-4 text-muted-foreground" />}
                  </div>
                  
                  <h2 className={`font-display font-extrabold text-foreground leading-tight ${viewMode === "list" ? "text-lg mb-2" : "text-sm line-clamp-2 mb-2"}`}>
                    {o.title}
                  </h2>
                  
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3 flex-1">
                    <span className="flex items-center gap-1.5"><Building className="size-3.5"/> {o.institution}</span>
                    <span className="flex items-center gap-1.5 text-xs"><Clock className="size-3.5"/> {o.deadline}</span>
                  </div>
                  
                  {o.funding_type && (
                    <div className="mt-auto">
                      <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent-foreground ring-1 ring-inset ring-accent/20">
                        {o.funding_type}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
