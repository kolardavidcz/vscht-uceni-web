import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "light" | "dark";
  hover?: boolean;
  children: ReactNode;
};

export function Card({
  variant = "light",
  hover = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variant === "light" &&
          "bg-gradient-to-br from-white/90 via-brand-ivory/80 to-brand-peach/70 border border-brand-peach/50 shadow-sm",
        variant === "dark" &&
          "bg-gradient-to-br from-brand-espresso/90 via-brand-mocha/50 to-brand-espresso/90 border border-brand-orange/15 shadow-xl",
        hover &&
          "cursor-pointer hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg hover:shadow-brand-orange/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
