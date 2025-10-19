import { MinecraftServer } from "mcping-js";
import type { Server, PingResponse } from "@shared/schema";

const PING_TIMEOUT = 2500; // 2.5 seconds timeout

interface JavaPingResponse {
  version?: { name: string; protocol: number };
  players?: { online: number; max: number };
  description?: string | { text: string };
  favicon?: string;
}

export async function pingMinecraftServer(server: Server): Promise<PingResponse> {
  const timestamp = Date.now();
  const serverId = server.id;

  try {
    if (server.type === "PC") {
      // Java Edition ping
      return await pingJavaServer(server, serverId, timestamp);
    } else {
      // Bedrock Edition - not yet implemented
      return {
        serverId,
        timestamp,
        playerCount: null,
        maxPlayers: null,
        version: null,
        favicon: null,
        ping: null,
        error: {
          message: "Bedrock Edition support coming soon"
        }
      };
    }
  } catch (error) {
    // Return error response
    return {
      serverId,
      timestamp,
      playerCount: null,
      maxPlayers: null,
      version: null,
      favicon: null,
      ping: null,
      error: {
        message: error instanceof Error ? error.message : "Connection failed"
      }
    };
  }
}

async function pingJavaServer(
  server: Server,
  serverId: string,
  timestamp: number
): Promise<PingResponse> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeoutId = setTimeout(() => {
      resolve({
        serverId,
        timestamp,
        playerCount: null,
        maxPlayers: null,
        version: null,
        favicon: null,
        ping: null,
        error: { message: "Connection timeout" }
      });
    }, PING_TIMEOUT);

    try {
      const minecraftServer = new MinecraftServer(server.ip, server.port || 25565);

      minecraftServer.ping(PING_TIMEOUT, 47, (err: Error | null, res: JavaPingResponse) => {
        clearTimeout(timeoutId);

        if (err || !res) {
          resolve({
            serverId,
            timestamp,
            playerCount: null,
            maxPlayers: null,
            version: null,
            favicon: null,
            ping: null,
            error: { message: err?.message || "Ping failed" }
          });
          return;
        }

        const pingTime = Date.now() - startTime;

        resolve({
          serverId,
          timestamp,
          playerCount: res.players?.online ?? null,
          maxPlayers: res.players?.max ?? null,
          version: res.version?.name ?? null,
          favicon: res.favicon ?? null,
          ping: pingTime,
          error: null
        });
      });
    } catch (error) {
      clearTimeout(timeoutId);
      resolve({
        serverId,
        timestamp,
        playerCount: null,
        maxPlayers: null,
        version: null,
        favicon: null,
        ping: null,
        error: { 
          message: error instanceof Error ? error.message : "Connection failed" 
        }
      });
    }
  });
}
