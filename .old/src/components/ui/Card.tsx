import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark';
  hoverEffects?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'light', hoverEffects = false, className = '', children, ...props }, ref) => {
    
    // Core styling based on pageTheme/variant
    const baseStyle = 'transition-all duration-300';
    
    const variantStyle = variant === 'dark'
      ? 'card-surface-dark'
      : 'card-surface';
      
    const hoverStyle = hoverEffects
      ? variant === 'dark'
        ? 'hover:scale-[1.02] hover:border-brand-orange/40 hover:shadow-[0_20px_50px_rgba(249,93,18,0.15)] cursor-pointer'
        : 'hover:scale-[1.02] hover:border-brand-orange/30 hover:shadow-[0_15px_30px_rgba(249,93,18,0.06)] cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyle} ${variantStyle} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
