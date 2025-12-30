import { cn } from '@/lib/utils';
import { Thermometer } from 'lucide-react';

interface ThermalMonitorProps {
  temperature: number;
  thermalState: 'normal' | 'warning' | 'critical';
}

export const ThermalMonitor = ({ temperature, thermalState }: ThermalMonitorProps) => {
  const stateConfig = {
    normal: {
      bgColor: 'bg-success/10',
      borderColor: 'border-border',
      textColor: 'text-success',
      barColor: 'bg-success',
      label: 'Normal',
      animation: '',
    },
    warning: {
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/40',
      textColor: 'text-warning',
      barColor: 'bg-warning',
      label: 'Warning',
      animation: 'thermal-warning',
    },
    critical: {
      bgColor: 'bg-critical/10',
      borderColor: 'border-critical/50',
      textColor: 'text-critical',
      barColor: 'bg-critical',
      label: 'Critical',
      animation: 'thermal-critical',
    },
  };

  const config = stateConfig[thermalState];
  
  // Temperature bar calculation (25°C to 85°C range)
  const minTemp = 25;
  const maxTemp = 85;
  const percentage = Math.min(100, Math.max(0, ((temperature - minTemp) / (maxTemp - minTemp)) * 100));

  return (
    <div className={cn(
      'metric-card h-full transition-all duration-300',
      config.borderColor,
      config.animation
    )}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Motor Temperature</span>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold',
          config.bgColor,
          config.textColor
        )}>
          <span className={cn(
            'h-1.5 w-1.5 rounded-full',
            config.barColor,
            thermalState !== 'normal' && 'status-pulse'
          )} />
          {config.label}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className={cn(
          'text-3xl font-bold digital-display',
          config.textColor
        )}>
          {temperature.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground font-medium">°C</span>
      </div>

      {/* Temperature bar */}
      <div className="space-y-1.5">
        <div className="h-2 bg-muted rounded-full overflow-hidden relative">
          {/* Zone indicators */}
          <div className="absolute inset-0 flex">
            <div className="flex-[50] bg-success/10" />
            <div className="flex-[33] bg-warning/10" />
            <div className="flex-[17] bg-critical/10" />
          </div>
          {/* Current temperature indicator */}
          <div 
            className={cn(
              'absolute top-0 left-0 h-full rounded-full transition-all duration-500',
              config.barColor
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/70">
          <span>25°C</span>
          <span>55°C</span>
          <span>75°C</span>
          <span>85°C</span>
        </div>
      </div>
      
      <p className="mt-2 text-[10px] text-muted-foreground">
        Real-time thermal condition
      </p>
    </div>
  );
};