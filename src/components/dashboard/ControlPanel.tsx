import { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, AlertOctagon, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  targetPwm: number;
  setTargetPwm: (value: number) => void;
  isRunning: boolean;
  startMotor: () => void;
  stopMotor: () => void;
  emergencyStop: () => void;
  currentRpm: number;
}

export const ControlPanel = ({
  targetPwm,
  setTargetPwm,
  isRunning,
  startMotor,
  stopMotor,
  emergencyStop,
  currentRpm,
}: ControlPanelProps) => {
  const handleSliderChange = useCallback((value: number[]) => {
    setTargetPwm(value[0]);
  }, [setTargetPwm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
    setTargetPwm(value);
  }, [setTargetPwm]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* PWM Speed Control */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="h-5 w-5 text-primary" />
            Speed Control (PWM)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duty Cycle</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={targetPwm}
                  onChange={handleInputChange}
                  className="w-20 text-center font-mono text-lg"
                  disabled={!isRunning}
                />
                <span className="text-muted-foreground font-medium">%</span>
              </div>
            </div>
            
            <Slider
              value={[targetPwm]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              disabled={!isRunning}
              className="py-4"
            />
            
            {/* Scale markers */}
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {[0, 25, 50, 75, 100].map((preset) => (
              <Button
                key={preset}
                variant={targetPwm === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTargetPwm(preset)}
                disabled={!isRunning}
                className="flex-1"
              >
                {preset}%
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motor Control Buttons */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Motor Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Start Button */}
            <Button
              size="lg"
              onClick={startMotor}
              disabled={isRunning}
              className={cn(
                'h-20 text-lg font-semibold transition-all',
                !isRunning && 'bg-success hover:bg-success/90 text-success-foreground'
              )}
            >
              <Play className="mr-2 h-6 w-6" />
              START
            </Button>

            {/* Stop Button */}
            <Button
              size="lg"
              variant="secondary"
              onClick={stopMotor}
              disabled={!isRunning}
              className="h-20 text-lg font-semibold"
            >
              <Square className="mr-2 h-6 w-6" />
              STOP
            </Button>
          </div>

          {/* Emergency Stop */}
          <Button
            size="lg"
            variant="destructive"
            onClick={emergencyStop}
            className="w-full h-16 mt-4 text-lg font-bold uppercase tracking-wider"
          >
            <AlertOctagon className="mr-2 h-6 w-6" />
            Emergency Stop
          </Button>

          {/* Current Status */}
          <div className={cn(
            'mt-4 p-4 rounded-lg text-center transition-all',
            isRunning 
              ? 'bg-success/10 border border-success/30' 
              : 'bg-muted border border-border/50'
          )}>
            <div className="flex items-center justify-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full',
                isRunning ? 'bg-success pulse-glow' : 'bg-muted-foreground'
              )} />
              <span className={cn(
                'font-semibold text-lg',
                isRunning ? 'text-success' : 'text-muted-foreground'
              )}>
                {isRunning ? 'MOTOR RUNNING' : 'MOTOR STOPPED'}
              </span>
            </div>
            {isRunning && (
              <p className="text-sm text-muted-foreground mt-1">
                Current Speed: {currentRpm.toLocaleString()} RPM
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
