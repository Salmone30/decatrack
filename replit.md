# Minetrack - Minecraft Server Tracker (Vercel Compatible)

## Overview

Minetrack is a Minecraft server player count tracker designed specifically for **Vercel** and serverless platforms. Unlike the original WebSocket-based Minetrack, this version uses HTTP polling with on-demand server pinging.

## Key Features

- ✅ **Serverless Compatible**: Works on Vercel, Netlify, and other serverless platforms
- ✅ **On-Demand Pinging**: Servers are pinged when data is requested (lazy evaluation)
- ✅ **Smart Caching**: Results cached for 10 seconds to reduce ping overhead  
- ✅ **Java Edition**: Full support for Minecraft Java Edition servers
- ✅ **Historical Graphs**: Visual player count trends (last 5 minutes)
- ✅ **Dark Mode**: Beautiful Minecraft-inspired dark theme
- ✅ **Responsive Design**: Works on all devices

## Architecture: Serverless-First Design

### How It Works

1. **Frontend** polls `/api/servers/status` every 5 seconds using TanStack Query
2. **Backend** checks if cached data is older than 10 seconds
3. If stale, backend pings all Minecraft servers in parallel
4. Results are cached in-memory (per-instance) and returned
5. Frontend displays real-time player counts and graphs

### Why This Works on Vercel

- ✅ **No long-running processes**: No setInterval or background workers
- ✅ **On-demand execution**: Servers pinged only when API is called
- ✅ **Stateless**: Each request is independent (cache is per-instance)
- ✅ **Fast responses**: 10s cache reduces unnecessary pings

### Trade-offs vs Original Minetrack

| Feature | Original (WebSocket) | This Version (Serverless) |
|---------|---------------------|---------------------------|
| Real-time updates | Instant (pushed) | ~5-10 second delay (polled) |
| Server overhead | Constant background pinging | Ping only when accessed |
| Vercel compatible | ❌ No | ✅ Yes |
| Historical data | Persistent database | In-memory (last 5 min) |
| Hosting cost | Requires always-on server | Serverless (pay-per-use) |

## Project Structure

```
/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── ServerCard.tsx
│   │   │   ├── ServerGraph.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   └── App.tsx
│   └── index.html
│
├── server/                      # Backend Express (Vercel Serverless)
│   ├── routes.ts               # API endpoints with on-demand pinging
│   ├── serverless-storage.ts   # In-memory cache (per instance)
│   ├── minecraft-ping.ts       # Minecraft ping logic
│   └── index.ts
│
├── shared/
│   └── schema.ts               # TypeScript types
│
├── servers.json                # Server list configuration
└── vercel.json                 # Vercel deployment config
```

## API Endpoints

### GET /api/servers
Returns list of configured servers.

### GET /api/servers/status
**Main endpoint** - Returns current status of all servers.
- Automatically pings servers if cache is stale (>10s)
- Returns player counts, versions, favicons, graph data

### GET /api/servers/:id/status
Returns status of a specific server.

### GET /api/ping
Force immediate refresh of all server data.

## Configuration

Edit the server list by modifying the initialization in `server/serverless-storage.ts` or by creating a configuration system.

Default servers:
- Hypixel (mc.hypixel.net)
- CubeCraft (play.cubecraft.net)
- Mineplex (us.mineplex.com)

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy - zero configuration needed!

The `vercel.json` file routes:
- `/api/*` → serverless function (server/index.ts)
- `/*` → static files (dist/)

## Development

```bash
npm install
npm run dev
```

The app runs on http://localhost:5000

## Performance Characteristics

### Serverless Function Metrics

- **Cold start**: ~500-800ms (first request after idle)
- **Warm request**: ~50-200ms (cached response)
- **Ping refresh**: ~1-3s (pinging 3 servers in parallel)

### Caching Strategy

- Cache TTL: 10 seconds
- Graph data: Last 60 points (5 minutes at 5s poll rate)
- Memory per instance: ~1-2MB

## Limitations

### Compared to Always-On Server

1. **Historical Data**: Limited to in-memory cache (~5 minutes)
   - **Solution**: Add database (Vercel Postgres/KV) for long-term storage
   
2. **Cold Starts**: First request after idle may be slow
   - **Mitigation**: Frontend shows loading state; warm instances are fast

3. **No Background Pinging**: Servers pinged only when API is called
   - **Trade-off**: Reduces costs but means data may be slightly stale

## Future Enhancements

To make this production-ready for heavy use:

1. **Add Vercel KV** for persistent cache across instances
2. **Vercel Cron Jobs** for background pinging every minute
3. **Database Integration** for long-term historical data
4. **Bedrock Edition Support** (requires different ping library)
5. **User Configuration** allow users to add their own servers

## Technical Details

### Why No Background Scheduler?

Vercel serverless functions:
- Execute per-request (no persistent process)
- Max execution time: 10-60 seconds depending on plan
- No setInterval support

Therefore, background schedulers (like original Minetrack's `ping-scheduler.ts`) don't work. We use on-demand pinging instead.

### Memory Management

The in-memory cache is per-instance and resets when:
- Function is cold-started
- Vercel scales down instances
- Deployment happens

This is acceptable for a monitoring dashboard where slight data loss is OK.

## Recent Changes

- Oct 19, 2025: Redesigned for serverless architecture
- Removed setInterval-based ping scheduler
- Implemented on-demand pinging with smart caching
- Reduced graph data retention to 5 minutes (in-memory)
- Verified Vercel deployment compatibility
