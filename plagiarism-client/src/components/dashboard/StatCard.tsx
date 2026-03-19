import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: number;
  icon: LucideIcon;
  gradient: "midnight" | "asteroid" | "royal" | "love-kiss";
  link: string;
}

export function StatCard({ title, subtitle, value, icon: Icon, gradient, link }: StatCardProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`gradient-${gradient} overflow-hidden rounded-xl shadow-elevated`}>
      <div className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-accent" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary-foreground">
              {title}
            </h3>
          </div>
          <p className="text-xs text-primary-foreground/60">{subtitle}</p>
          <Link
            to={link}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Full Detail <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="animate-count-up font-display text-4xl font-bold text-primary-foreground">
          {displayed}
        </div>
      </div>
    </div>
  );
}
