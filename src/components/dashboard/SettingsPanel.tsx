import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, RotateCcw, Wifi, Clock, Server } from 'lucide-react';
import { Settings as SettingsType } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  settings: SettingsType;
  updateSettings: (updates: Partial<SettingsType>) => void;
  resetSettings: () => void;
}

export const SettingsPanel = ({ settings, updateSettings, resetSettings }: SettingsPanelProps) => {
  const [open, setOpen] = useState(false);
  const [localUrl, setLocalUrl] = useState(settings.apiBaseUrl);

  const handleUrlBlur = () => {
    updateSettings({ apiBaseUrl: localUrl });
  };

  const refreshRateOptions = [
    { value: 250, label: '250ms' },
    { value: 500, label: '500ms' },
    { value: 1000, label: '1s' },
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
  ];

  const currentRefreshIndex = refreshRateOptions.findIndex(opt => opt.value === settings.refreshRate);
  const effectiveIndex = currentRefreshIndex >= 0 ? currentRefreshIndex : 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Simulation Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                settings.simulationMode ? 'bg-warning/10' : 'bg-success/10'
              )}>
                <Server className={cn(
                  'h-4 w-4',
                  settings.simulationMode ? 'text-warning' : 'text-success'
                )} />
              </div>
              <div>
                <Label className="text-sm font-medium">Simulation Mode</Label>
                <p className="text-xs text-muted-foreground">
                  {settings.simulationMode ? 'Using simulated data' : 'Connected to ESP32'}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.simulationMode}
              onCheckedChange={(checked) => updateSettings({ simulationMode: checked })}
            />
          </div>

          {/* API Endpoint */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="api-url" className="text-sm font-medium">ESP32 API Endpoint</Label>
            </div>
            <Input
              id="api-url"
              type="url"
              placeholder="http://192.168.1.100"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onBlur={handleUrlBlur}
              disabled={settings.simulationMode}
              className={cn(
                'font-mono text-sm',
                settings.simulationMode && 'opacity-50'
              )}
            />
            <p className="text-xs text-muted-foreground">
              Enter the IP address of your ESP32 controller
            </p>
          </div>

          {/* Refresh Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Refresh Rate</Label>
              </div>
              <span className="text-sm font-mono text-primary">
                {refreshRateOptions[effectiveIndex].label}
              </span>
            </div>
            <Slider
              value={[effectiveIndex]}
              onValueChange={([index]) => updateSettings({ refreshRate: refreshRateOptions[index].value })}
              max={refreshRateOptions.length - 1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Faster</span>
              <span>Slower</span>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
