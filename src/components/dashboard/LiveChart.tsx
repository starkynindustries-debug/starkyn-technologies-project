import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PowerHistoryPoint } from '@/hooks/useMotorData';

interface LiveChartProps {
  data: PowerHistoryPoint[];
  title: string;
}

export const LiveChart = ({ data, title }: LiveChartProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
        {title}
      </h4>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-border/50" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={45}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
            <Line 
              type="monotone" 
              dataKey="power" 
              name="Power (W)"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Current (A)"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
