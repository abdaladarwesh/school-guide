import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BadgeCheck, Sparkles, TrendingUp, Search, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrimeUpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function PrimeUpsellModal({ open, onOpenChange, onUpgrade }: PrimeUpsellModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:w-[95vw] md:max-w-md p-0 overflow-x-hidden overflow-y-auto max-h-[90vh] border-0 bg-transparent shadow-2xl min-w-0">
        <div className="relative bg-slate-900 text-white overflow-hidden rounded-2xl min-w-0">
          {/* Background Gradients & Effects */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#1e1b4b,#0f172a)]" />
          <div className="absolute -top-32 -right-32 size-64 rounded-full bg-amber-500/20 blur-3xl opacity-70 animate-pulse" />
          <div className="absolute -bottom-32 -left-32 size-64 rounded-full bg-indigo-500/20 blur-3xl opacity-70" />

          <div className="relative p-4 sm:p-8 flex flex-col items-center text-center min-w-0">
            {/* Header Icon */}
            <div className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 mb-6 shrink-0">
              <Crown className="size-8 text-white drop-shadow-md" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Sparkles className="size-2.5 text-amber-500" />
              </div>
            </div>

            <h2 className="text-3xl font-display font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 break-words w-full">
              Upgrade to Prime
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto mb-8 break-words">
              Stand out to thousands of prospective students. Prime features give your school unmatched visibility and prestige on the platform.
            </p>

            {/* Benefits List */}
            <div className="w-full space-y-3 mb-8 text-left">
              {[
                {
                  icon: Search,
                  title: "Top of Search Results",
                  description: "Always appear before non-prime schools when students search.",
                },
                {
                  icon: BadgeCheck,
                  title: "Exclusive Prime Badge",
                  description: "A gorgeous verified badge that builds instant trust and authority.",
                },
                {
                  icon: TrendingUp,
                  title: "Enhanced Analytics",
                  description: "Get detailed insights into student demographics and views.",
                },
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="shrink-0 grid size-10 place-items-center rounded-lg bg-amber-500/20 text-amber-300">
                    <benefit.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{benefit.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing & CTA */}
            <div className="w-full">
              <div className="flex items-end justify-center gap-1.5 mb-6">
                <span className="text-3xl font-extrabold text-white">$49</span>
                <span className="text-sm font-medium text-slate-400 mb-1">/ month</span>
              </div>
              
              <div className="grid gap-3">
                <Button
                  size="lg"
                  type="button"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={onUpgrade}
                >
                  <Sparkles className="size-4 mr-2" /> Upgrade to Prime
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/10 font-semibold"
                  onClick={() => onOpenChange(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
