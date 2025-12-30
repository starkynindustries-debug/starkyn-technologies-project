import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  value: number;
  unit: string;
  label: string;
  icon: LucideIcon;
  precision?: number;
  colorClass?: string;
  iconBgClass?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MetricCard = ({
  value,
  unit,
  label,
  icon: Icon,
  precision = 1,
  colorClass = 'text-primary',
  iconBgClass = 'bg-primary/10',
  size = 'md',
}: MetricCardProps) => {
  const formattedValue = value.toFixed(precision);
  
  const sizeClasses = {
    sm: { value: 'text-2xl', label: 'text-xs', icon: 'h-4 w-4', padding: 'p-2' },
    md: { value: 'text-3xl', label: 'text-xs', icon: 'h-5 w-5', padding: 'p-2.5' },
    lg: { value: 'text-4xl', label: 'text-sm', icon: 'h-6 w-6', padding: 'p-3' },
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'rounded-lg',
          iconBgClass,
          sizeClasses[size].padding
        )}>
          <Icon className={cn(sizeClasses[size].icon, 'text-muted-foreground')} />
        </div>
        <span className={cn(
          'section-title',
          sizeClasses[size].label
        )}>
          {label}
        </span>
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className={cn(
          'font-bold digital-display leading-none',
          sizeClasses[size].value,
          colorClass
        )}>
          {formattedValue}
        </span>
        <span className="text-base text-muted-foreground font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
};