import { Link } from "@tanstack/react-router";
import { Home, Search, Users, Flame, Crown } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/streaks", label: "Streaks", icon: Flame },
  { to: "/prime", label: "Prime", icon: Crown },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed w-full inset-x-0 bottom-0 z-40 mx-auto flex items-stretch justify-between border-t border-border bg-card/95 px-2 pb-2 pt-1.5 backdrop-blur">
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="group flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-muted-foreground transition-colors data-[status=active]:text-framboise"
        >
          <Icon className="size-5" strokeWidth={2.2} />
          <span className="text-[10px] font-semibold tracking-wide">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
