# Minetrack Dashboard - Design Guidelines

## Design Approach

**Selected Approach**: Hybrid - Gaming-focused utility dashboard
- **Rationale**: While primarily a data monitoring tool, the Minecraft gaming context allows for creative theming while maintaining functional clarity
- **Core Principle**: "Data-first with personality" - prioritize readability and scanning efficiency while incorporating Minecraft-inspired visual elements

## Color Palette

### Dark Mode (Primary)
**Background Layers**:
- Base: 220 15% 8% (deep charcoal, reminiscent of Minecraft's night sky)
- Surface: 220 12% 12% (elevated panels)
- Surface Elevated: 220 10% 16% (cards, modals)

**Accent Colors**:
- Primary: 142 76% 36% (Minecraft grass green - for positive metrics, online status)
- Secondary: 217 91% 60% (lapis blue - for interactive elements)
- Warning: 38 92% 50% (gold/amber - for alerts, threshold warnings)
- Error: 0 84% 60% (redstone red - for offline status)
- Success: 142 76% 36% (matches primary)

**Text Colors**:
- Primary text: 0 0% 98%
- Secondary text: 0 0% 71%
- Muted text: 0 0% 45%

### Light Mode (Optional Secondary)
- Use inverted values with adjusted saturations for accessibility

## Typography

**Font Stack**:
- Primary: 'Inter', system-ui, -apple-system, sans-serif (clean, highly legible for data)
- Monospace: 'JetBrains Mono', 'Courier New', monospace (for server addresses, player counts)

**Scale**:
- Headings: 600 weight, tight tracking (-0.02em)
- Body: 400 weight, normal tracking
- Data/Numbers: 500-600 weight for emphasis
- Server names: 500 weight, slightly increased tracking (0.01em)

**Sizes**:
- h1: text-3xl (server list header)
- h2: text-xl (section headers)
- Body: text-base
- Small: text-sm (metadata, timestamps)
- Tiny: text-xs (labels, auxiliary info)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent 4-based spacing for predictable rhythm
- Cards: p-6 standard padding
- Sections: gap-8 between major elements
- Lists: gap-4 between items

**Grid Structure**:
- Main layout: Sidebar (280px fixed) + Main content (flex-1)
- Server cards: Single column on mobile, auto-fit grid on desktop (min-width: 320px)
- Graph section: Full-width container with max-w-7xl

## Component Library

### Navigation
**Sidebar** (if applicable):
- Fixed left position, 280px width
- Dark background (220 15% 10%)
- Logo/title at top with subtle glow effect
- Server filter/search controls
- Collapsible on mobile (hamburger menu)

**Top Bar**:
- Sticky header with backdrop blur
- Current timestamp/last update indicator
- Global controls (refresh, settings)
- Subtle border-bottom separator

### Server Cards
**Card Structure**:
- Rounded corners (rounded-lg)
- Background: Surface color with subtle border
- Hover state: Slight elevation increase, border color shift
- Status indicator: Colored dot (8px) with pulse animation for online servers

**Card Content**:
- Server icon (favicon) - 48x48px, rounded
- Server name: Bold, truncate with ellipsis
- Player count: Large number (text-2xl) in monospace font
- Max players: Muted text next to count
- Status badge: Pill-shaped, colored by server state
- Ping latency: Small text with icon
- Graph sparkline: Mini 24h trend (60px height)

### Data Display
**Player Count Graph**:
- Full-width chart area
- Grid lines: Subtle, low opacity (10%)
- Data lines: 2px stroke width, server-specific colors
- Hover tooltip: Rounded container with timestamp + values
- Legend: Horizontally aligned chips with server colors

**Stats Grid**:
- 2-4 column grid for key metrics
- Each stat: Large number, label, trend indicator (arrow + percentage)
- Background gradient on hover for interactivity

### Real-time Indicators
**Update Status**:
- Small badge in top-right
- Pulse animation during active polling
- "Updated X seconds ago" text
- Color codes: Green (fresh), Yellow (stale), Red (error)

**Loading States**:
- Skeleton screens for initial load (subtle shimmer animation)
- Inline spinners for refresh actions
- Progress bars for data-heavy operations

### Minecraft-Inspired Elements
**Visual Accents**:
- Subtle pixel art styling on icons (8x8 or 16x16 grid)
- Blocky UI elements (sharp corners on specific components)
- Optional: Textured backgrounds (very subtle, noise texture overlay at 3-5% opacity)

**Server Status Icons**:
- Use Minecraft-style iconography (sword for PvP, chest for survival, etc.)
- 24x24px size, consistent stroke width

## Animations

**Use Sparingly - Only Where Functional**:
- Page transitions: None (instant)
- Data updates: Subtle number count-up (200ms)
- Status changes: Color fade (300ms ease)
- Card hover: Transform scale (1.02) with 150ms ease
- Loading states: Gentle pulse (1.5s infinite)
- Graph updates: Smooth line drawing (400ms)

**Avoid**:
- Parallax effects
- Complex entrance animations
- Auto-playing background animations

## Responsive Behavior

**Breakpoints**:
- Mobile: < 640px (single column, stacked cards)
- Tablet: 640px - 1024px (2-column grid)
- Desktop: > 1024px (3-4 column grid + sidebar)

**Mobile Optimizations**:
- Collapsible sidebar to overlay
- Simplified graph (hide minor gridlines)
- Touch-friendly tap targets (min 44px)
- Bottom sheet for filters/settings

## Data Visualization

**Graph Styling**:
- Line graphs for historical data
- Color-coded by server (use server.color from config)
- Responsive: Reduce data points on mobile
- Interactive tooltips with exact values
- Time axis: Auto-format (12h ago, 1d ago, etc.)

**Number Formatting**:
- Player counts: Use commas for thousands (1,234)
- Percentages: One decimal place (98.5%)
- Latency: Integer milliseconds (42ms)

## Accessibility

**Dark Mode Standards**:
- Minimum 4.5:1 contrast for body text
- 7:1 for data/headings
- Focus indicators: 2px outline with accent color
- Keyboard navigation: Tab order follows visual hierarchy

**Screen Readers**:
- ARIA labels for all interactive elements
- Live regions for data updates
- Semantic HTML structure

## Images

**No large hero image needed** - This is a dashboard/monitoring tool where data takes priority

**Image Usage**:
- Server favicons: 48x48px, fetched from server APIs
- Minecraft block textures: Optional subtle background patterns (very low opacity)
- Status icons: SVG icons from Heroicons or custom Minecraft-style icons
- Logo: Minetrack branding in header (SVG format)

---

**Key Design Philosophy**: Prioritize information density and scan-ability over visual flair. Use Minecraft theming as subtle accents, not dominant elements. Every design decision should serve the primary goal: helping users quickly understand server status and player trends at a glance.