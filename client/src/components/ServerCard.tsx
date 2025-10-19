import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServerStatus } from "@shared/schema";
import { Users, Wifi, WifiOff, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ServerCardProps {
  status: ServerStatus;
}

export function ServerCard({ status }: ServerCardProps) {
  const { server, currentPlayerCount, maxPlayers, isOnline, error, ping, recordPlayerCount, recordTimestamp, favicon } = status;

  const playerPercentage = maxPlayers && currentPlayerCount ? (currentPlayerCount / maxPlayers) * 100 : 0;

  return (
    <Card 
      className="p-6 hover-elevate active-elevate-2 transition-all duration-200"
      data-testid={`card-server-${server.id}`}
      style={{ borderLeft: `4px solid ${server.color || 'hsl(var(--primary))'}` }}
    >
      <div className="flex items-start gap-4">
        {/* Server Favicon */}
        <div className="flex-shrink-0">
          {favicon ? (
            <img 
              src={favicon} 
              alt={`${server.name} icon`}
              className="w-12 h-12 rounded-md"
              data-testid={`img-favicon-${server.id}`}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-md bg-muted flex items-center justify-center"
              data-testid={`img-favicon-placeholder-${server.id}`}
            >
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Server Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 
              className="font-semibold text-lg truncate"
              data-testid={`text-servername-${server.id}`}
            >
              {server.name}
            </h3>
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="flex-shrink-0"
              data-testid={`badge-status-${server.id}`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>

          <p 
            className="text-sm text-muted-foreground mb-3 truncate font-mono"
            data-testid={`text-serverip-${server.id}`}
          >
            {server.ip}
            {server.port && server.port !== 25565 && `:${server.port}`}
          </p>

          {isOnline && currentPlayerCount !== null ? (
            <div className="space-y-3">
              {/* Player Count */}
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-3xl font-bold font-mono"
                  data-testid={`text-playercount-${server.id}`}
                >
                  {currentPlayerCount.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  / {maxPlayers?.toLocaleString() || '?'}
                </span>
                <Users className="w-4 h-4 text-muted-foreground ml-1" />
              </div>

              {/* Player Count Bar */}
              {maxPlayers && (
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(playerPercentage, 100)}%` }}
                    data-testid={`bar-playercount-${server.id}`}
                  />
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {ping !== null && (
                  <div 
                    className="flex items-center gap-1"
                    data-testid={`text-ping-${server.id}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono">{ping}ms</span>
                  </div>
                )}
                {recordPlayerCount !== null && (
                  <div 
                    className="flex items-center gap-1"
                    data-testid={`text-record-${server.id}`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Record: {recordPlayerCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : error ? (
            <div 
              className="text-destructive text-sm"
              data-testid={`text-error-${server.id}`}
            >
              {error.message}
            </div>
          ) : (
            <div 
              className="text-muted-foreground text-sm animate-pulse"
              data-testid={`text-loading-${server.id}`}
            >
              Pinging...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
