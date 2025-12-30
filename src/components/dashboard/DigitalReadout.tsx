import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface DigitalReadoutProps {
  value: number;
  unit: string;
  label: string;
  icon?: LucideIcon;
  precision?: number;
  colorClass?: string;
  trend?: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
}

export const DigitalReadout = ({
  value,
  unit,
  label,
  icon: Icon,
  precision = 1,
  colorClass = 'text-primary',
  trend,
  size = 'md',
}: DigitalReadoutProps) => {
  const formattedValue = value.toFixed(precision);
  
  const sizeClasses = {
    sm: { value: 'text-xl', label: 'text-xs', icon: 'h-4 w-4' },
    md: { value: 'text-2xl', label: 'text-sm', icon: 'h-5 w-5' },
    lg: { value: 'text-3xl', label: 'text-base', icon: 'h-6 w-6' },
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-border/50">
      {Icon && (
        <Icon className={cn(sizeClasses[size].icon, 'mb-2 text-muted-foreground')} />
      )}
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          'font-mono font-bold digital-display',
          sizeClasses[size].value,
          colorClass
        )}>
          {formattedValue}
        </span>
        <span className="text-muted-foreground font-medium">
          {unit}
        </span>
        
        {trend && (
          <span className={cn(
            'ml-1 text-xs',
            trend === 'up' && 'text-success',
            trend === 'down' && 'text-destructive',
            trend === 'stable' && 'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'}
          </span>
        )}
      </div>
      
      <span className={cn(
        'mt-1 text-muted-foreground font-medium uppercase tracking-wide',
        sizeClasses[size].label
      )}>
        {label}
      </span>
    </div>
  );
};
