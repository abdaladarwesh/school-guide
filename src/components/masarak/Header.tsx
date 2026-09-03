import { Link } from "@tanstack/react-router";
import { Search, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            {/* Logo placeholder */}
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="font-display text-xl font-bold text-primary tracking-tight">MASARAK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <div className="group relative flex cursor-pointer items-center gap-1 text-foreground/80 hover:text-foreground">
              Opportunities & Scholarships <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="group relative flex cursor-pointer items-center gap-1 text-foreground/80 hover:text-foreground">
              Technical Specialties <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              AI Assistant
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              Articles & Guidance
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search diplomas, ATS..."
              className="h-9 w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-background"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
