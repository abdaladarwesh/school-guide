import { useEffect, useState, useRef } from "react";
import { Users, Globe2, Handshake, BrainCircuit } from "lucide-react";

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, elementRef };
}

interface StatItemProps {
  icon: React.ReactNode;
  endValue: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

function StatItem({ icon, endValue, suffix = "", prefix = "", label }: StatItemProps) {
  const { count, elementRef } = useCountUp(endValue);

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
      <div className="mb-4 rounded-full bg-secondary/30 p-4 text-primary">
        {icon}
      </div>
      <div className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem 
          icon={<Users className="h-8 w-8" />}
          prefix="+"
          endValue={10000}
          label="Technical Students Reached"
        />
        <StatItem 
          icon={<Globe2 className="h-8 w-8" />}
          prefix="+"
          endValue={250}
          label="International Scholarships"
        />
        <StatItem 
          icon={<Handshake className="h-8 w-8" />}
          prefix="+"
          endValue={50}
          label="Partnered Technical Institutes"
        />
        <StatItem 
          icon={<BrainCircuit className="h-8 w-8" />}
          endValue={95}
          suffix="%"
          label="AI Match Accuracy Rate"
        />
      </div>
    </section>
  );
}
