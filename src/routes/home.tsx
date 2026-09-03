import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Loader2, Bookmark, Sparkles, Clock, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";
import { useUserStore } from "@/data/useUserStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Dashboard — MASARAK" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { opportunities, isLoading } = useOpportunitiesStore();
  const { session, hasCompletedOnboarding, savedOpportunities, toggleSavedOpportunity } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !hasCompletedOnboarding) {
      navigate({ to: "/profile", replace: true });
    }
  }, [session, hasCompletedOnboarding, navigate]);

  const isOauthRedirect = typeof window !== "undefined" && window.location.hash.includes("access_token=");

  if ((session && !hasCompletedOnboarding) || isOauthRedirect) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const savedOpps = opportunities.filter((o) => savedOpportunities.includes(o.id));
  const suggestedOpps = opportunities.filter((o) => !savedOpportunities.includes(o.id)).slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6 px-4 py-6">
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold text-foreground">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">Track your applications and discover new scholarships.</p>
        </div>

        {/* AI Match Banner */}
        <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-float)] relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Sparkles className="size-32 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md mb-4">
              <Sparkles className="size-3 text-accent" /> AI Match Updated
            </div>
            <h2 className="font-display text-xl font-bold mb-2">We found 3 new matches!</h2>
            <p className="text-sm text-primary-foreground/90 max-w-[85%] mb-5">
              Based on your mechatronics diploma, you have high chances of acceptance in these new German programs.
            </p>
            <Button className="bg-accent text-accent-foreground hover:bg-white hover:text-primary rounded-xl font-bold shadow-md">
              View AI Matches
            </Button>
          </div>
        </div>

        {/* Saved Opportunities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Bookmark className="size-5 text-primary" /> Saved Programs
            </h2>
          </div>
          
          {savedOpps.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Bookmark className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground">No saved programs yet</p>
              <p className="text-xs text-muted-foreground mt-1">Explore and save opportunities to track them here.</p>
              <Button variant="outline" asChild className="mt-4 rounded-xl">
                <Link to="/search">Explore Opportunities</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedOpps.map((opp) => (
                <div key={opp.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                  {opp.image && (
                    <img src={opp.image} alt={opp.title} className="w-full sm:w-24 h-24 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-card-foreground line-clamp-1">{opp.title}</h3>
                        <button onClick={() => toggleSavedOpportunity(opp.id)} className="text-primary hover:text-primary/80">
                          <Bookmark className="size-5 fill-current" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{opp.institution}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        <Clock className="size-3" /> {opp.deadline}
                      </span>
                      <Button variant="ghost" size="sm" asChild className="h-8 text-xs font-semibold">
                        <Link to="/opportunity/$oppId" params={{ oppId: opp.id }}>
                          View Details <ExternalLink className="size-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Suggested For You */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Suggested For You</h2>
            <Link to="/search" className="text-sm font-bold text-primary hover:underline">View all</Link>
          </div>
          
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
            {suggestedOpps.map((opp) => (
              <div key={opp.id} className="w-64 shrink-0 snap-start flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="h-32 relative bg-muted">
                  {opp.image ? (
                    <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">{opp.institution}</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleSavedOpportunity(opp.id); }}
                      className="p-1.5 bg-background/80 backdrop-blur rounded-full text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{opp.category}</span>
                  <h3 className="font-bold text-sm text-card-foreground line-clamp-2 mb-1">{opp.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{opp.location}</p>
                  <Button variant="outline" size="sm" asChild className="mt-auto w-full rounded-lg text-xs">
                    <Link to="/opportunity/$oppId" params={{ oppId: opp.id }}>Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </AppShell>
  );
}
