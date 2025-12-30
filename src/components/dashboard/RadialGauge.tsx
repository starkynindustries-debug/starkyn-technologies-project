import { cn } from '@/lib/utils';

interface RadialGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
  showTicks?: boolean;
}

export const RadialGauge = ({
  value,
  max,
  label,
  unit,
  size = 'md',
  colorClass = 'stroke-primary',
  showTicks = true,
}: RadialGaugeProps) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  // SVG arc calculations
  const sizeMap = { sm: 120, md: 160, lg: 200 };
  const svgSize = sizeMap[size];
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
  const radius = (svgSize - strokeWidth) / 2 - 10;
  const circumference = radius * Math.PI * 1.5; // 270 degree arc
  const offset = circumference - (percentage / 100) * circumference;
  
  const center = svgSize / 2;
  
  // Arc path for 270 degrees (from 135° to 405°, i.e., bottom-left to bottom-right via top)
  const startAngle = 135;
  const endAngle = 405;
  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };
  
  const start = polarToCartesian(startAngle, radius);
  const end = polarToCartesian(endAngle, radius);
  
  const arcPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}
  `;

  // Generate tick marks
  const ticks = showTicks ? Array.from({ length: 11 }, (_, i) => {
    const tickAngle = startAngle + (i / 10) * 270;
    const innerRadius = radius - 8;
    const outerRadius = radius + 4;
    const inner = polarToCartesian(tickAngle, innerRadius);
    const outer = polarToCartesian(tickAngle, outerRadius);
    const isMajor = i % 2 === 0;
    return { inner, outer, isMajor, value: Math.round((i / 10) * max) };
  }) : [];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-0"
        >
          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Tick marks */}
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              className={tick.isMajor ? 'stroke-muted-foreground' : 'stroke-border'}
              strokeWidth={tick.isMajor ? 2 : 1}
            />
          ))}
          
          {/* Value arc */}
          <path
            d={arcPath}
            fill="none"
            className={cn('gauge-transition', colorClass)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: 'drop-shadow(0 0 6px currentColor)',
            }}
          />
          
          {/* Center gradient overlay */}
          <circle
            cx={center}
            cy={center}
            r={radius - 20}
            className="fill-card"
          />
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            'font-mono font-bold digital-display',
            size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'
          )}>
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {unit}
          </span>
        </div>
      </div>
      
      <span className="mt-2 text-sm font-semibold text-foreground uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
};
