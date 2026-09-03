import { Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 lg:px-16 lg:py-20 shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 text-white/5">
            <Sparkles className="w-96 h-96" />
          </div>

          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-accent" />
                MASARAK AI Assistant
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
                Let AI guide you to the best scholarship for your technical specialty
              </h2>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                  <div>
                    <strong className="block text-white">Smart Matching</strong>
                    Upload your technical school certificate and practical projects to get instantly matched with the right programs.
                  </div>
                </li>
                <li className="flex gap-3 text-primary-foreground/90">
                  <FileText className="h-6 w-6 text-accent shrink-0" />
                  <div>
                    <strong className="block text-white">Automated Application Support</strong>
                    AI guides you step-by-step through translating your vocational portfolio and writing winning motivation letters.
                  </div>
                </li>
              </ul>
              
              <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-white hover:text-primary font-bold px-8 py-6 text-lg transition-colors shadow-lg">
                Try the AI Assistant Now
              </Button>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl p-6 flex flex-col">
                {/* Mockup of AI chat */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                    AI
                  </div>
                  <div>
                    <div className="font-bold text-white">MASARAK Assistant</div>
                    <div className="text-xs text-white/60">Online</div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-white w-5/6">
                    Hello! I see you have a diploma in Mechatronics. I found 3 fully-funded internships in Germany that perfectly match your practical projects.
                  </div>
                  <div className="bg-primary-foreground/10 self-end rounded-2xl rounded-tr-sm p-3 text-sm text-white w-5/6 ml-auto border border-white/20">
                    That's amazing! Can you help me translate my portfolio?
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-white w-5/6">
                    Absolutely! Upload your Arabic portfolio here and I'll adapt it into a professional German format focusing on your hands-on skills.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
