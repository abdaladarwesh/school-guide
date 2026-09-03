import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, Users, Crown, LogIn, LogOut } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { useUserStore } from "@/data/useUserStore";

export function AppShell({ children }: { children: ReactNode }) {
  const { tier, session, logout } = useUserStore();

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-end gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <img src="/favicon-96x96.png" alt="logo" className="size-6 rounded-full object-cover border-2 aspect-square border-[#ea7d35]" />
          <span className="font-display text-lg font-extrabold text-indigo">School Guide</span>
        </Link>
        <div className="flex items-center gap-2">
          {tier === "plus" && (
            <Link
              to="/prime"
              className="flex items-center gap-1 rounded-full bg-indigo/10 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo"
            >
              <Users className="size-3" /> Plus
            </Link>
          )}

          {tier === "max" && (
            <Link
              to="/prime"
              className="flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground"
            >
              <Crown className="size-3" /> Max
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="rounded-full aspect-square overflow-hidden border border-border hover:opacity-80 transition-opacity"
              >
                <img
                  src={
                    session.user.user_metadata?.["avatar_url"] ||
                    `https://ui-avatars.com/api/?name=${session.user.email?.charAt(0)}&background=random`
                  }
                  alt="Profile"
                  className="size-8 object-cover bg-blush font-display text-xs font-bold text-framboise uppercase"
                />
              </Link>
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
