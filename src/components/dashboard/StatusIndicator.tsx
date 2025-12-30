import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Circle } from 'lucide-react';

type StatusType = 'online' | 'offline' | 'stable' | 'interrupted' | 'idle' | 'running' | 'fault';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  showPulse?: boolean;
}

const statusConfig: Record<StatusType, { 
  icon: typeof CheckCircle2; 
  colorClass: string; 
  bgClass: string;
  text: string;
}> = {
  online: {
    icon: CheckCircle2,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    text: 'Online',
  },
  offline: {
    icon: XCircle,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    text: 'Offline',
  },
  stable: {
    icon: CheckCircle2,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    text: 'Stable',
  },
  interrupted: {
    icon: AlertTriangle,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
    text: 'Interrupted',
  },
  idle: {
    icon: Circle,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
    text: 'Idle',
  },
  running: {
    icon: CheckCircle2,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    text: 'Running',
  },
  fault: {
    icon: XCircle,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    text: 'Fault',
  },
};

export const StatusIndicator = ({ status, label, showPulse = false }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full',
        config.bgClass
      )}>
        <div className="relative">
          <Icon className={cn('h-4 w-4', config.colorClass)} />
          {showPulse && status === 'running' && (
            <span className="absolute inset-0 rounded-full animate-ping bg-success/40" />
          )}
        </div>
        <span className={cn('text-sm font-semibold', config.colorClass)}>
          {config.text}
        </span>
      </div>
    </div>
  );
};
