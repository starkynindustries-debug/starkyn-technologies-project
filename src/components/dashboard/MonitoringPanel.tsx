import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialGauge } from './RadialGauge';
import { MetricCard } from './MetricCard';
import { ThermalMonitor } from './ThermalMonitor';
import { EfficiencyBar } from './EfficiencyBar';
import { LiveChart } from './LiveChart';
import { CompactStatusPanel } from './CompactStatusPanel';
import { Zap, Activity, Gauge, BatteryCharging, BarChart3, Thermometer } from 'lucide-react';
import type { MotorMetrics, PowerHistoryPoint, SystemStatus } from '@/hooks/useMotorData';

interface MonitoringPanelProps {
  metrics: MotorMetrics;
  powerHistory: PowerHistoryPoint[];
  status: SystemStatus;
}

export const MonitoringPanel = ({ metrics, powerHistory, status }: MonitoringPanelProps) => {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Status Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CompactStatusPanel status={status} />
        <ThermalMonitor 
          temperature={metrics.temperature} 
          thermalState={status.thermalState} 
        />
        <EfficiencyBar value={metrics.efficiency} />
      </div>

      {/* Radial Gauges Section */}
      <Card className="enterprise-card">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="section-header">
            <Activity className="h-4 w-4 text-primary" />
            Real-Time Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
            <RadialGauge
              value={metrics.rpm}
              max={3000}
              label="Motor Speed"
              unit="RPM"
              size="lg"
              colorClass="stroke-gauge-rpm"
            />
            <RadialGauge
              value={metrics.voltage}
              max={48}
              label="Supply Voltage"
              unit="V"
              size="lg"
              colorClass="stroke-gauge-voltage"
            />
            <RadialGauge
              value={metrics.current}
              max={20}
              label="Load Current"
              unit="A"
              size="lg"
              colorClass="stroke-gauge-current"
            />
          </div>
        </CardContent>
      </Card>

      {/* Digital Readouts - 5 Uniform Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          value={metrics.rpm}
          unit="RPM"
          label="Speed"
          icon={Gauge}
          precision={0}
          colorClass="text-chart-1"
          iconBgClass="bg-chart-1/10"
        />
        <MetricCard
          value={metrics.voltage}
          unit="V"
          label="Voltage"
          icon={Zap}
          precision={1}
          colorClass="text-chart-2"
          iconBgClass="bg-chart-2/10"
        />
        <MetricCard
          value={metrics.current}
          unit="A"
          label="Current"
          icon={Activity}
          precision={2}
          colorClass="text-chart-4"
          iconBgClass="bg-chart-4/10"
        />
        <MetricCard
          value={metrics.power}
          unit="W"
          label="Power"
          icon={BatteryCharging}
          precision={1}
          colorClass="text-chart-3"
          iconBgClass="bg-chart-3/10"
        />
        <MetricCard
          value={metrics.temperature}
          unit="°C"
          label="Temperature"
          icon={Thermometer}
          precision={1}
          colorClass="text-chart-5"
          iconBgClass="bg-chart-5/10"
        />
      </div>

      {/* Live Power Chart */}
      <Card className="enterprise-card">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="section-header">
            <BarChart3 className="h-4 w-4 text-primary" />
            Power Consumption History
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[240px]">
            <LiveChart data={powerHistory} title="" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};