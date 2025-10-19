import { Card } from "@/components/ui/card";
import { ServerStatus } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface ServerGraphProps {
  statuses: ServerStatus[];
}

export function ServerGraph({ statuses }: ServerGraphProps) {
  // Combine all server graph data into a single timeline
  const graphData = combineGraphData(statuses);

  if (graphData.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">
          No historical data available yet. Data will appear after the first ping cycle.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="card-graph">
      <h2 className="text-xl font-semibold mb-4">Player Count History</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="timestamp" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm')}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--popover-border))',
              borderRadius: '6px',
              color: 'hsl(var(--popover-foreground))',
            }}
            labelFormatter={(timestamp) => format(new Date(timestamp as number), 'MMM d, HH:mm:ss')}
          />
          <Legend />
          {statuses.map((status) => (
            <Line
              key={status.serverId}
              type="monotone"
              dataKey={status.serverId}
              name={status.server.name}
              stroke={status.server.color || 'hsl(var(--primary))'}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

function combineGraphData(statuses: ServerStatus[]) {
  const timestampMap = new Map<number, any>();

  // Collect all unique timestamps
  statuses.forEach((status) => {
    status.graphData.forEach((point) => {
      if (!timestampMap.has(point.timestamp)) {
        timestampMap.set(point.timestamp, { timestamp: point.timestamp });
      }
    });
  });

  // Fill in player counts for each server at each timestamp
  statuses.forEach((status) => {
    status.graphData.forEach((point) => {
      const dataPoint = timestampMap.get(point.timestamp);
      if (dataPoint) {
        dataPoint[status.serverId] = point.playerCount;
      }
    });
  });

  // Convert to array and sort by timestamp
  return Array.from(timestampMap.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-100); // Keep last 100 points for performance
}
