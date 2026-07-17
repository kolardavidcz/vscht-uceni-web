import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Matches original app badge variants used by PA2→AG1 overview */
type BadgeVariant =
  | "orange"
  | "slate"
  | "stone"
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "rose"
  | "emerald"
  | "amber"
  | "success"
  | "danger";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  /** Preferred new API */
  tone?: BadgeVariant;
  /** Original API alias */
  variant?: BadgeVariant;
};

const styles: Record<BadgeVariant, string> = {
  orange: "bg-brand-orange/10 border-brand-orange/20 text-brand-orange-text",
  slate: "bg-slate-100 border-slate-200/80 text-slate-600",
  stone: "bg-stone-100 border-stone-200 text-stone-600",
  green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
  red: "bg-rose-500/10 border-rose-500/20 text-rose-600",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-600",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-600",
  rose: "bg-rose-500/10 border-rose-500/20 text-rose-600",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  danger: "bg-rose-50 border-rose-200 text-rose-700",
};

export function Badge({
  children,
  tone,
  variant,
  className,
  ...props
}: Props) {
  const key = tone ?? variant ?? "orange";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
        styles[key],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
