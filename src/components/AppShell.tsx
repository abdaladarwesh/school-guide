import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { useUserStore } from "@/data/useUserStore";

export function AppShell({ children }: { children: ReactNode }) {
  const { session } = useUserStore();

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/home" className="flex items-center gap-2">
          {/* Using a placeholder MASARAK logo */}
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground">
            M
          </div>
          <span className="font-display text-lg font-extrabold text-foreground tracking-tight">MASARAK</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {session ? (
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
                className="size-8 object-cover bg-muted font-display text-xs font-bold text-primary uppercase"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              <LogIn className="size-4" /> Login
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
