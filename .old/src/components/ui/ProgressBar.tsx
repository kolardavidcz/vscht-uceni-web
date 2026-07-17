import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: React.ReactNode;
  variant?: 'orange' | 'green';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  label, 
  variant = 'orange', 
  className = '' 
}) => {
  
  const barColor = variant === 'orange'
    ? 'bg-linear-to-r from-brand-orange to-orange-500 shadow-[0_0_8px_rgba(249,93,18,0.4)]'
    : 'bg-linear-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]';

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="bg-slate-200/50 dark:bg-white/5 rounded-full p-[1px] border border-slate-300/30 dark:border-white/5 backdrop-blur-xs h-3">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};
