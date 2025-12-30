import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from './StatusIndicator';
import { AlertTriangle, Clock, Cpu, Wifi, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SystemStatus, Alert } from '@/hooks/useMotorData';

interface SystemStatusPanelProps {
  status: SystemStatus;
}

const AlertItem = ({ alert }: { alert: Alert }) => {
  const colorMap = {
    error: 'border-destructive/50 bg-destructive/5 text-destructive',
    warning: 'border-warning/50 bg-warning/5 text-warning',
    info: 'border-primary/50 bg-primary/5 text-primary',
  };

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border',
      colorMap[alert.type]
    )}>
      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{alert.message}</p>
        <p className="text-xs opacity-70 mt-0.5">
          {alert.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export const SystemStatusPanel = ({ status }: SystemStatusPanelProps) => {
  const formattedTime = status.lastUpdate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Grid */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StatusIndicator
            status={status.motorState}
            label="Motor State"
            showPulse={status.motorState === 'running'}
          />
          <StatusIndicator
            status={status.controllerStatus}
            label="Controller"
          />
          <StatusIndicator
            status={status.communicationStatus}
            label="Communication"
          />
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Connection Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Protocol
              </p>
              <p className="font-mono font-semibold">HTTP/REST</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Refresh Rate
              </p>
              <p className="font-mono font-semibold">1000 ms</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Last Update
              </p>
              <p className="font-mono font-semibold text-lg">{formattedTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status.alerts.length > 0 ? (
            <div className="space-y-3">
              {status.alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active alerts</p>
              <p className="text-xs mt-1">System operating normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
