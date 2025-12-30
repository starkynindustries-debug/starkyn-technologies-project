import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface EfficiencyBarProps {
  value: number;
  label?: string;
}

export const EfficiencyBar = ({ value, label = 'System Efficiency' }: EfficiencyBarProps) => {
  const getColorClass = () => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-chart-2';
    if (value >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  const getTextColor = () => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-accent';
    if (value >= 40) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="metric-card h-full">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className={cn(
          'text-3xl font-bold digital-display',
          getTextColor()
        )}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground font-medium">%</span>
      </div>
      
      <div className="space-y-1.5">
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'absolute h-full rounded-full transition-all duration-500 ease-out',
              getColorClass()
            )}
            style={{ width: `${Math.min(100, value)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/70">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
