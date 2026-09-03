import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";
import { useUserStore } from "@/data/useUserStore";
import { 
  ArrowLeft, MapPin, Building, Bookmark, Share2, 
  Clock, DollarSign, GraduationCap, CheckCircle2, ChevronRight, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/opportunity/$oppId")({
  component: OpportunityDetails,
});

function OpportunityDetails() {
  const { oppId } = Route.useParams();
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunitiesStore();
  const { savedOpportunities, toggleSavedOpportunity } = useUserStore();
  
  const opp = opportunities.find(o => o.id === oppId);
  const isSaved = savedOpportunities.includes(oppId);

  if (isLoading || !opp) {
    return (
      <AppShell>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground font-medium">Loading opportunity...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-full inline-block mb-2">
                <FileText className="size-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">Opportunity Not Found</h2>
              <p className="text-muted-foreground mb-4">This program may have been removed or expired.</p>
              <Button onClick={() => navigate({ to: "/search" })} className="rounded-full">
                Browse Other Programs
              </Button>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header Image & Quick Actions */}
      <div className="relative h-64 w-full bg-muted">
        {opp.image ? (
          <img src={opp.image} alt={opp.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/80 to-primary text-white">
            <Building className="size-16 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Top bar (Back, Share, Save) */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full h-10 w-10 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none">
              <Share2 className="size-5" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full h-10 w-10 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none"
              onClick={() => toggleSavedOpportunity(opp.id)}
            >
              <Bookmark className={`size-5 ${isSaved ? "fill-current text-accent" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
              {opp.category}
            </span>
            {opp.badge && (
              <span className="inline-flex items-center rounded-md bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/30">
                {opp.badge}
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {opp.title}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:max-w-4xl lg:mx-auto space-y-8">
        
        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Building className="size-3"/> Institution</span>
            <span className="text-sm font-semibold text-foreground">{opp.institution}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MapPin className="size-3"/> Location</span>
            <span className="text-sm font-semibold text-foreground">{opp.location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><DollarSign className="size-3"/> Funding</span>
            <span className="text-sm font-semibold text-foreground">{opp.funding_type || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Clock className="size-3"/> Deadline</span>
            <span className="text-sm font-semibold text-orange-600">{opp.deadline || "Ongoing"}</span>
          </div>
        </div>

        {/* AI Assistant Callout */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex gap-4 items-start sm:items-center flex-col sm:flex-row">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-primary mb-1">Apply with MASARAK AI</h3>
            <p className="text-sm text-muted-foreground">Let our AI analyze your technical diploma and generate a tailored motivation letter for this specific program.</p>
          </div>
          <Button className="w-full sm:w-auto shrink-0 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90">
            Generate Application
          </Button>
        </div>

        {/* About Section */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">About the Program</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            {opp.about ? (
              <p>{opp.about}</p>
            ) : (
              <p>Detailed information about this opportunity is currently unavailable.</p>
            )}
          </div>
        </section>

        {/* Requirements Section */}
        {opp.requirements && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">Eligibility & Requirements</h2>
            <div className="grid gap-3">
              {Object.entries(opp.requirements as Record<string, string>).map(([key, value]) => (
                <div key={key} className="flex gap-3 items-start p-3 rounded-xl bg-muted/50 border border-border/50">
                  <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="capitalize font-bold text-sm text-foreground block mb-0.5">{key}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sticky Apply Button for Mobile, Standard for Desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:p-0 sm:pt-4">
          <Button className="w-full h-14 rounded-xl font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-[var(--shadow-float)]">
            Start Application <ChevronRight className="ml-2 size-5" />
          </Button>
        </div>
        
        {/* Spacer for mobile bottom fixed button */}
        <div className="h-16 sm:hidden" />
      </div>
    </AppShell>
  );
}
