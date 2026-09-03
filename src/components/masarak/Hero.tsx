import { Search, GraduationCap, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full bg-[image:var(--gradient-hero)] pt-24 pb-32 text-primary-foreground overflow-hidden">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
          The largest scholarship and career opportunity platform for technical and vocational education students.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/90 sm:text-xl text-balance">
          Discover scholarships and practical internships abroad specifically designed for your certificates and practical experience.
        </p>
        
        {/* Smart Search Bar */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl bg-white/10 p-2 sm:p-3 backdrop-blur-md shadow-[var(--shadow-float)] border border-white/20">
          <div className="flex flex-col sm:flex-row gap-2 bg-background rounded-xl p-2 sm:p-3 shadow-inner">
            
            {/* Filter 1: Degree/Certificate */}
            <div className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 sm:border-r border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Degree</span>
                <span className="text-sm font-medium text-foreground truncate">Select Certificate</span>
              </div>
            </div>
            
            {/* Filter 2: Specialty */}
            <div className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 sm:border-r border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <Briefcase className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Specialty</span>
                <span className="text-sm font-medium text-foreground truncate">IT, Mechatronics...</span>
              </div>
            </div>

            {/* Filter 3: Destination */}
            <div className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Destination</span>
                <span className="text-sm font-medium text-foreground truncate">Europe, Asia...</span>
              </div>
            </div>
            
            <Button size="lg" className="sm:ml-2 h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 shadow-md">
              <Search className="mr-2 h-5 w-5" />
              Find Opportunity
            </Button>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}
