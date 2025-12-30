import { cn } from '@/lib/utils';
import { Activity, Thermometer, Wifi, Monitor } from 'lucide-react';
import type { SystemStatus } from '@/hooks/useMotorData';

interface CompactStatusPanelProps {
  status: SystemStatus;
}

interface StatusItemProps {
  label: string;
  value: string;
  status: 'success' | 'warning' | 'critical' | 'neutral';
  icon: React.ReactNode;
}

const StatusItem = ({ label, value, status, icon }: StatusItemProps) => {
  const statusColors = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    critical: 'bg-critical/10 text-critical',
    neutral: 'bg-muted text-muted-foreground',
  };

  const dotColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    critical: 'bg-critical',
    neutral: 'bg-muted-foreground',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground/70">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold',
        statusColors[status]
      )}>
        <span className={cn(
          'h-1.5 w-1.5 rounded-full',
          dotColors[status],
          status === 'success' && 'animate-pulse'
        )} />
        {value}
      </div>
    </div>
  );
};

export const CompactStatusPanel = ({ status }: CompactStatusPanelProps) => {
  const motorStatusMap = {
    idle: { value: 'Idle', status: 'neutral' as const },
    running: { value: 'Running', status: 'success' as const },
    fault: { value: 'Fault', status: 'critical' as const },
  };

  const thermalStatusMap = {
    normal: { value: 'Normal', status: 'success' as const },
    warning: { value: 'Warning', status: 'warning' as const },
    critical: { value: 'Critical', status: 'critical' as const },
  };

  const commStatusMap = {
    stable: { value: 'Stable', status: 'success' as const },
    unstable: { value: 'Unstable', status: 'warning' as const },
    disconnected: { value: 'Offline', status: 'critical' as const },
  };

  return (
    <div className="metric-card h-full">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <Monitor className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">System Status</span>
      </div>
      
      <div className="space-y-0">
        <StatusItem
          label="Motor"
          value={motorStatusMap[status.motorState].value}
          status={motorStatusMap[status.motorState].status}
          icon={<Activity className="h-3.5 w-3.5" />}
        />
        <StatusItem
          label="Thermal"
          value={thermalStatusMap[status.thermalState].value}
          status={thermalStatusMap[status.thermalState].status}
          icon={<Thermometer className="h-3.5 w-3.5" />}
        />
        <StatusItem
          label="Communication"
          value={commStatusMap[status.communicationStatus].value}
          status={commStatusMap[status.communicationStatus].status}
          icon={<Wifi className="h-3.5 w-3.5" />}
        />
      </div>
    </div>
  );
};