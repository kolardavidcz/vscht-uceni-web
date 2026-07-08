import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'orange' | 'slate' | 'green' | 'red' | 'blue' | 'purple' | 'rose' | 'emerald';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'orange', className = '', children, ...props }) => {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border';
  
  const variantStyles = {
    orange: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange-text',
    slate: 'bg-slate-100 border-slate-200/80 text-slate-600',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    red: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-600',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
  };

  return (
    <span
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
