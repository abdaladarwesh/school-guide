import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, Users, Crown, LogIn, LogOut } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { useUserStore } from "@/data/useUserStore";

export function AppShell({ children }: { children: ReactNode }) {
  const { tier, session, logout } = useUserStore();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <button aria-label="Menu" className="rounded-xl p-2 text-foreground/70 hover:bg-muted">
          <Menu className="size-5" />
        </button>
        <Link to="/home" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-warm)] text-sm">
            🎓
          </span>
          <span className="font-display text-lg font-extrabold text-indigo">School Guide</span>
        </Link>
        <div className="flex items-center gap-2">
          
          {tier === 'plus' && (
            <Link
              to="/prime"
              className="flex items-center gap-1 rounded-full bg-indigo/10 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo"
            >
              <Users className="size-3" /> Plus
            </Link>
          )}

          {(tier === 'max') && (
            <Link
              to="/prime"
              className="flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground"
            >
              <Crown className="size-3" /> Max
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <img src={session.user.user_metadata["avatar_url"]} alt="" className="grid size-8 place-items-center rounded-full bg-blush font-display text-xs font-bold text-framboise uppercase"/>
              <button 
                onClick={logout}
                className="p-2 rounded-xl text-foreground/70 hover:bg-muted"
                aria-label="Logout"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              <LogIn className="size-3" /> Login
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}