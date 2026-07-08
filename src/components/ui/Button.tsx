import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    
    // Base styles
    const baseStyle = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';
    
    // Variant styles
    const variantStyles = {
      primary: 'btn-primary text-white bg-linear-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-brand-orange-text shadow-md shadow-brand-orange/10',
      secondary: 'btn-secondary text-brand-orange-text border border-brand-orange/20 bg-white hover:bg-brand-ivory hover:border-brand-orange/40 shadow-sm',
      ghost: 'btn-ghost text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange-text rounded-xl',
      dark: 'btn-dark text-slate-300 bg-white/5 border border-white/8 hover:border-brand-orange/30 hover:bg-white/10 hover:text-white'
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
