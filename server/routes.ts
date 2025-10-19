import type { Express } from "express";
import { storage } from "./serverless-storage";
import { pingMinecraftServer } from "./minecraft-ping";

// Ping servers if data is older than this threshold
const CACHE_TTL = 10000; // 10 seconds

// In-flight refresh promise to prevent concurrent pings
let refreshPromise: Promise<void> | null = null;

// Helper function to ping all servers if needed
async function refreshServersIfNeeded(): Promise<void> {
  // If already refreshing, wait for that to complete
  if (refreshPromise) {
    return refreshPromise;
  }

  // If data is fresh, no need to refresh
  if (!storage.shouldRefresh(CACHE_TTL)) {
    return Promise.resolve();
  }

  // Start a new refresh
  refreshPromise = (async () => {
    try {
      const servers = storage.getAllServers();
      const timestamp = Date.now();

      console.log('[Minetrack] Refreshing server data...');

      // Ping all servers in parallel
      const pingPromises = servers.map(async (server) => {
        try {
          const pingResult = await pingMinecraftServer(server);
          storage.updateServerStatus(server.id, pingResult);
          
          console.log(
            `[Minetrack] Pinged ${server.name}: ${pingResult.playerCount ?? 'offline'} players`
          );
        } catch (error) {
          console.error(`[Minetrack] Error pinging ${server.name}:`, error);
        }
      });

      await Promise.all(pingPromises);
      storage.setLastPingTime(timestamp);
    } finally {
      // Clear the promise so next refresh can start
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function registerRoutes(app: Express): void {
  // GET /api/servers - Get list of all configured servers
  app.get("/api/servers", async (req, res) => {
    try {
      const servers = storage.getAllServers();
      res.json({
        servers,
        lastUpdate: Date.now()
      });
    } catch (error) {
      console.error("[Minetrack] Error fetching servers:", error);
      res.status(500).json({ 
        error: "Failed to fetch servers",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/servers/status - Get current status of all servers
  // This endpoint pings servers on-demand if data is stale
  app.get("/api/servers/status", async (req, res) => {
    try {
      // Refresh data if it's stale (uses guard against concurrent requests)
      await refreshServersIfNeeded();

      const statuses = storage.getAllServerStatuses();
      res.json({
        statuses,
        lastUpdate: storage.getLastPingTime()
      });
    } catch (error) {
      console.error("[Minetrack] Error fetching server statuses:", error);
      res.status(500).json({ 
        error: "Failed to fetch server statuses",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/servers/:id/status - Get status of a specific server
  app.get("/api/servers/:id/status", async (req, res) => {
    try {
      const { id } = req.params;

      // Refresh data if it's stale
      await refreshServersIfNeeded();

      const status = storage.getServerStatus(id);
      
      if (!status) {
        return res.status(404).json({ 
          error: "Server not found",
          message: `No server found with ID: ${id}`
        });
      }

      res.json(status);
    } catch (error) {
      console.error("[Minetrack] Error fetching server status:", error);
      res.status(500).json({ 
        error: "Failed to fetch server status",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/ping - Force refresh all servers
  app.get("/api/ping", async (req, res) => {
    try {
      const servers = storage.getAllServers();
      const timestamp = Date.now();

      // Clear existing promise to force new refresh
      refreshPromise = null;
      storage.setLastPingTime(0); // Force refresh

      // Ping all servers in parallel
      const pingPromises = servers.map(async (server) => {
        const pingResult = await pingMinecraftServer(server);
        storage.updateServerStatus(server.id, pingResult);
        return {
          serverId: server.id,
          name: server.name,
          playerCount: pingResult.playerCount,
          error: pingResult.error
        };
      });

      const results = await Promise.all(pingPromises);
      storage.setLastPingTime(timestamp);

      res.json({
        results,
        timestamp
      });
    } catch (error) {
      console.error("[Minetrack] Error pinging servers:", error);
      res.status(500).json({ 
        error: "Failed to ping servers",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
