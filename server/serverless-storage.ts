import { 
  type Server, 
  type ServerStatus, 
  type GraphDataPoint,
  type PingResponse 
} from "@shared/schema";

// Simple in-memory cache that works per-request
// In a real Vercel deployment, you'd use Vercel KV, Redis, or a database
class ServerlessStorage {
  private static instance: ServerlessStorage;
  private servers: Server[] = [];
  private serverStatuses: Map<string, ServerStatus> = new Map();
  private lastPingTime: number = 0;
  private graphDataMaxLength = 60; // Keep last 60 points (5 minutes at 5s intervals)
  
  private constructor() {
    this.initializeServers();
  }

  static getInstance(): ServerlessStorage {
    if (!ServerlessStorage.instance) {
      ServerlessStorage.instance = new ServerlessStorage();
    }
    return ServerlessStorage.instance;
  }

  private initializeServers() {
    // Default Minecraft servers to track
    const defaultServers: Server[] = [
      {
        id: "server-1",
        name: "Hypixel",
        ip: "mc.hypixel.net",
        type: "PC",
        color: "#4CAF50"
      },
      {
        id: "server-2",
        name: "CubeCraft",
        ip: "play.cubecraft.net",
        type: "PC",
        color: "#2196F3"
      },
      {
        id: "server-3",
        name: "Mineplex",
        ip: "us.mineplex.com",
        type: "PC",
        color: "#FFC107"
      }
    ];

    this.servers = defaultServers;

    // Initialize empty statuses
    defaultServers.forEach(server => {
      this.serverStatuses.set(server.id, {
        serverId: server.id,
        server,
        currentPlayerCount: null,
        maxPlayers: null,
        version: null,
        favicon: null,
        ping: null,
        isOnline: false,
        error: { message: "Not yet pinged" },
        recordPlayerCount: null,
        recordTimestamp: null,
        graphData: [],
        lastUpdate: Date.now()
      });
    });
  }

  getAllServers(): Server[] {
    return this.servers;
  }

  getServer(id: string): Server | undefined {
    return this.servers.find(s => s.id === id);
  }

  updateServerStatus(serverId: string, ping: PingResponse): void {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) return;

    const currentStatus = this.serverStatuses.get(serverId);
    const isOnline = ping.playerCount !== null && !ping.error;

    const newStatus: ServerStatus = {
      serverId,
      server,
      currentPlayerCount: ping.playerCount,
      maxPlayers: ping.maxPlayers,
      version: ping.version,
      favicon: ping.favicon,
      ping: ping.ping,
      isOnline,
      error: ping.error,
      recordPlayerCount: currentStatus?.recordPlayerCount || null,
      recordTimestamp: currentStatus?.recordTimestamp || null,
      graphData: currentStatus?.graphData || [],
      lastUpdate: ping.timestamp
    };

    // Update record if current player count is higher
    if (isOnline && ping.playerCount !== null) {
      if (newStatus.recordPlayerCount === null || ping.playerCount > newStatus.recordPlayerCount) {
        newStatus.recordPlayerCount = ping.playerCount;
        newStatus.recordTimestamp = ping.timestamp;
      }
    }

    // Add to graph data
    const point: GraphDataPoint = {
      timestamp: ping.timestamp,
      playerCount: ping.playerCount
    };

    newStatus.graphData.push(point);

    // Keep only the last N data points
    if (newStatus.graphData.length > this.graphDataMaxLength) {
      newStatus.graphData = newStatus.graphData.slice(-this.graphDataMaxLength);
    }

    this.serverStatuses.set(serverId, newStatus);
  }

  getServerStatus(serverId: string): ServerStatus | undefined {
    return this.serverStatuses.get(serverId);
  }

  getAllServerStatuses(): ServerStatus[] {
    return Array.from(this.serverStatuses.values());
  }

  getLastPingTime(): number {
    return this.lastPingTime;
  }

  setLastPingTime(time: number): void {
    this.lastPingTime = time;
  }

  // Check if we need to refresh (data is stale)
  shouldRefresh(maxAge: number = 10000): boolean {
    return Date.now() - this.lastPingTime > maxAge;
  }
}

export const storage = ServerlessStorage.getInstance();
