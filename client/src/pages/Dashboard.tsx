import { useQuery } from "@tanstack/react-query";
import { ServerCard } from "@/components/ServerCard";
import { ServerGraph } from "@/components/ServerGraph";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ServerListSkeleton } from "@/components/ServerListSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { queryClient } from "@/lib/queryClient";
import type { ServerStatusListResponse } from "@shared/schema";

// Poll every 5 seconds for updates
const POLL_INTERVAL = 5000;

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery<ServerStatusListResponse>({
    queryKey: ['/api/servers/status'],
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/servers/status'] });
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        lastUpdate={data?.lastUpdate || null}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Server Cards Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Servers</h2>
            {isLoading && !data ? (
              <ServerListSkeleton />
            ) : error ? (
              <ErrorState 
                message={error instanceof Error ? error.message : 'Failed to load servers'}
                onRetry={handleRefresh}
              />
            ) : !data?.statuses || data.statuses.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2" data-testid="container-serverlist">
                {data.statuses.map((status) => (
                  <ServerCard key={status.serverId} status={status} />
                ))}
              </div>
            )}
          </section>

          {/* Historical Graph */}
          {data?.statuses && data.statuses.length > 0 && (
            <section>
              <ServerGraph statuses={data.statuses} />
            </section>
          )}
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Minetrack - Real-time Minecraft server monitoring without WebSockets
          </p>
          <p className="mt-2">
            Updates automatically every {POLL_INTERVAL / 1000} seconds
          </p>
        </div>
      </footer>
    </div>
  );
}
