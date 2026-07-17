import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
  backTo?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
};

export function PageShell({
  title,
  subtitle,
  theme = "light",
  backTo = "/",
  actions,
  children,
  className,
  maxWidth = "max-w-6xl",
}: Props) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isDark ? "bg-brand-espresso text-slate-100" : "bg-stone-50 text-stone-900",
        className
      )}
    >
      <header className={isDark ? "page-header-dark" : "page-header"}>
        <div
          className={cn(
            maxWidth,
            "mx-auto px-4 py-4 sm:py-5 flex items-center gap-3"
          )}
        >
          <Link
            to={backTo}
            className={cn(
              "p-2.5 rounded-xl border shrink-0 transition-colors",
              isDark
                ? "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                : "border-white/15 text-white/90 hover:bg-white/10"
            )}
            title="Zpět"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                "font-display text-lg sm:text-2xl font-black tracking-tight truncate",
                isDark
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-amber-100"
                  : "text-white"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "text-xs font-medium tracking-wide truncate",
                  isDark ? "text-brand-peach" : "text-orange-100/80"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      </header>
      <main className={cn(maxWidth, "w-full mx-auto px-4 py-6 sm:py-8 flex-1")}>
        {children}
      </main>
    </div>
  );
}
