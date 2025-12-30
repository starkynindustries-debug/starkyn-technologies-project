import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMotorData } from '@/hooks/useMotorData';
import { useSettings } from '@/hooks/useSettings';
import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { MonitoringPanel } from '@/components/dashboard/MonitoringPanel';
import { SystemStatusPanel } from '@/components/dashboard/SystemStatusPanel';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { Zap, Sliders, Activity, Cpu, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  
  const {
    metrics,
    status,
    powerHistory,
    isRunning,
    targetPwm,
    setTargetPwm,
    startMotor,
    stopMotor,
    emergencyStop,
  } = useMotorData({ settings });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 glow-primary">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground brand-text tracking-widest">
                  STARKYN TECHNOLOGIES
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
                  Motor Control & Monitoring Platform
                </p>
              </div>
            </div>
            
            {/* Connection Status & Settings */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold',
                settings.simulationMode
                  ? 'bg-warning/10 text-warning'
                  : status.communicationStatus === 'stable' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
              )}>
                {settings.simulationMode ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-warning status-pulse" />
                    Simulation
                  </>
                ) : status.communicationStatus === 'stable' ? (
                  <>
                    <Wifi className="h-3.5 w-3.5" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5" />
                    Offline
                  </>
                )}
              </div>
              <SettingsPanel 
                settings={settings} 
                updateSettings={updateSettings} 
                resetSettings={resetSettings} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-11 bg-secondary/50">
            <TabsTrigger value="control" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-card">
              <Sliders className="h-4 w-4" />
              Control
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-card">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-card">
              <Cpu className="h-4 w-4" />
              Diagnostics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="mt-0">
            <ControlPanel
              targetPwm={targetPwm}
              setTargetPwm={setTargetPwm}
              isRunning={isRunning}
              startMotor={startMotor}
              stopMotor={stopMotor}
              emergencyStop={emergencyStop}
              currentRpm={metrics.rpm}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0">
            <MonitoringPanel metrics={metrics} powerHistory={powerHistory} status={status} />
          </TabsContent>

          <TabsContent value="status" className="mt-0">
            <SystemStatusPanel status={status} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-3 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary/50" />
              <span className="text-[11px] font-semibold text-foreground/70 brand-text tracking-widest">
                STARKYN TECHNOLOGIES
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="hidden sm:inline">Prototype Control Platform</span>
              <span className="text-border/50">•</span>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
