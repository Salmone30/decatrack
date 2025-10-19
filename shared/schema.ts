import { z } from "zod";

// Server configuration schema
export const serverSchema = z.object({
  id: z.string(),
  name: z.string(),
  ip: z.string(),
  port: z.number().optional(),
  type: z.enum(["PC", "PE"]), // PC = Java Edition, PE = Bedrock Edition
  color: z.string().optional(),
});

export type Server = z.infer<typeof serverSchema>;

// Ping response schema
export const pingResponseSchema = z.object({
  serverId: z.string(),
  timestamp: z.number(),
  playerCount: z.number().nullable(),
  maxPlayers: z.number().nullable(),
  version: z.string().nullable(),
  favicon: z.string().nullable(),
  ping: z.number().nullable(), // latency in ms
  error: z.object({
    message: z.string(),
  }).nullable(),
});

export type PingResponse = z.infer<typeof pingResponseSchema>;

// Historical graph data point
export const graphDataPointSchema = z.object({
  timestamp: z.number(),
  playerCount: z.number().nullable(),
});

export type GraphDataPoint = z.infer<typeof graphDataPointSchema>;

// Server status with historical data
export const serverStatusSchema = z.object({
  serverId: z.string(),
  server: serverSchema,
  currentPlayerCount: z.number().nullable(),
  maxPlayers: z.number().nullable(),
  version: z.string().nullable(),
  favicon: z.string().nullable(),
  ping: z.number().nullable(),
  isOnline: z.boolean(),
  error: z.object({
    message: z.string(),
  }).nullable(),
  recordPlayerCount: z.number().nullable(),
  recordTimestamp: z.number().nullable(),
  graphData: z.array(graphDataPointSchema),
  lastUpdate: z.number(),
});

export type ServerStatus = z.infer<typeof serverStatusSchema>;

// API response schemas
export const serversListResponseSchema = z.object({
  servers: z.array(serverSchema),
  lastUpdate: z.number(),
});

export type ServersListResponse = z.infer<typeof serversListResponseSchema>;

export const serverStatusListResponseSchema = z.object({
  statuses: z.array(serverStatusSchema),
  lastUpdate: z.number(),
});

export type ServerStatusListResponse = z.infer<typeof serverStatusListResponseSchema>;
