import { useState } from "react";
import { Clock, Bookmark, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["All", "Full Funding", "Vocational", "ATS", "Europe"];

const opportunities = [
  {
    id: 1,
    title: "Full Scholarship for Applied Technology Students in Germany",
    institution: "Technical University of Munich",
    logo: "TUM",
    badge: "Available for Technical Diplomas",
    funding: "Full Funding",
    deadline: "20 days left",
    category: "Full Funding"
  },
  {
    id: 2,
    title: "Mechatronics Vocational Training Program",
    institution: "Siemens Academy",
    logo: "SA",
    badge: "Available for ATS Graduates",
    funding: "Partial Funding",
    deadline: "5 days left",
    category: "Vocational"
  },
  {
    id: 3,
    title: "IT & Software Engineering Bachelor Transfer",
    institution: "Berlin Institute of Technology",
    logo: "TUB",
    badge: "Available for Tech Universities",
    funding: "Full Funding",
    deadline: "1 month left",
    category: "Europe"
  }
];

export function OpportunitiesFeed() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" 
    ? opportunities 
    : opportunities.filter(o => o.category === activeTab || o.funding === activeTab);

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Latest Opportunities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hand-picked scholarships and internships matching your technical background.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-white text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div key={opp.id} className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border/50">
                    {opp.logo}
                  </div>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent-foreground ring-1 ring-inset ring-accent/20">
                    {opp.funding}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {opp.badge}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-card-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                  {opp.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {opp.institution}
                </div>
              </div>
              
              <div className="border-t border-border p-4 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium text-orange-600">
                  <Clock className="h-4 w-4" />
                  {opp.deadline}
                </div>
                <Button variant="link" className="font-semibold text-primary p-0 h-auto">
                  Read Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="rounded-full font-semibold border-border">
            View All Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
