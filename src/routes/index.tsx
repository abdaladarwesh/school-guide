import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUserStore } from "@/data/useUserStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "School Guide — Find Your Applied Technology School in Egypt" },
      {
        name: "description",
        content:
          "Explore 32 Applied Technology Schools across Egypt: specializations, industry partners, salaries and admission requirements.",
      },
      { property: "og:title", content: "School Guide — Your ATS journey starts here" },
      {
        property: "og:description",
        content:
          "Browse Egypt's Applied Technology Schools, join the student community, and keep your learning streak alive.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = [
  {
    art: "🎓",
    title: "Find Your Future School",
    body: "Explore 32 Applied Technology Schools across Egypt. Browse specializations, partner companies and real career outcomes.",
    bullets: [
      "32 ATS schools nationwide",
      "Specializations & partners",
      "Career & salary outcomes",
    ],
    cta: "Continue",
  },
  {
    art: "🤝",
    title: "Connect & Grow Together",
    body: "Share experiences, ask questions and get honest answers from thousands of current ATS students and graduates.",
    bullets: ["Ask anything, anytime", "Thousands of students", "Advice from graduates"],
    cta: "Continue",
  },
  {
    art: "🔥",
    title: "Streaks, Badges & Rewards",
    body: "Check in daily, take quizzes and climb the leaderboard to unlock badges and exclusive rewards.",
    bullets: ["Daily check-in streaks", "Badges & leaderboard", "Exclusive Prime rewards"],
    cta: "Let's Explore! 🚀",
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const s = steps[step]!;
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const setOnboardingCompleted = useUserStore((state) => state.setOnboardingCompleted);

  if (hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  const next = () => {
    if (step === 2) {
      setOnboardingCompleted();
      navigate({ to: "/home" });
    } else {
      setStep(step + 1);
    }
  };

  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    setOnboardingCompleted();
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-[image:var(--gradient-hero)] px-6 pb-10 pt-14 text-primary-foreground">
      <div className="flex-1">
        <div className="mx-auto grid size-44 place-items-center rounded-[2.5rem] bg-white/12 text-7xl shadow-[var(--shadow-float)] ring-1 ring-white/20">
          <span className="animate-in zoom-in duration-500" key={s.art}>
            {s.art}
          </span>
        </div>
        <h1 className="mt-10 font-display text-4xl font-extrabold leading-tight">{s.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-primary-foreground/80">{s.body}</p>
        <ul className="mt-7 space-y-3">
          {s.bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-or text-xs font-bold text-accent-foreground">
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={
                i === step ? "h-2 w-7 rounded-full bg-or" : "h-2 w-2 rounded-full bg-white/35"
              }
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full rounded-2xl bg-or py-4 font-display text-lg font-extrabold text-accent-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
        >
          {s.cta}
        </button>
        {step < 2 && (
          <a
            href="/home"
            onClick={skip}
            className="block w-full rounded-2xl border border-white/30 py-3.5 text-center text-sm font-semibold text-primary-foreground/90"
          >
            Skip intro
          </a>
        )}
      </div>
    </div>
  );
}
