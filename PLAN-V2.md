# DotWorld v2: Next-Level Implementation Plan

## Context

Lucagen's DotWorld prototype proves out the core simulation concepts (autonomous dot entities with emotional states, step contracts, convictions) but is architecturally limited by Vue 2 DOM rendering and Velocity.js animations. Each dot is a DOM element — this caps scalability at ~50 entities and prevents the rich visual effects the emotional system demands. The goal is to rebuild DotWorld as a high-performance canvas-rendered simulation capable of 1000+ dots on a large-screen TV, with each dot displaying a dynamic "blooming flower" emotional visualization.

Inspiration: Conway's Game of Life, but showcasing how emotions spread like weather throughout humans, each affecting the other.

## Tech Stack

| Layer | Old | New |
|-------|-----|-----|
| Framework | Vue 2 + Vuex | None (vanilla JS) |
| Rendering | DOM elements + Velocity.js | **PixiJS v8** (WebGL) |
| Build | Webpack 2 + Babel 6 | **Vite 6** |
| Tests | Karma + Mocha + PhantomJS | **Vitest** |
| State | Vuex store w/ hydration | Direct model references |

**Why PixiJS:** Purpose-built for high-performance 2D sprite rendering. WebGL batching handles 1000+ sprites at 60fps. 5.8KB gzipped. PixiJS v8 adds WebGPU progressive enhancement. Dramatically outperforms DOM rendering, Three.js (overkill for 2D), p5.js (can't scale), and raw Canvas 2D (CPU-bound).

**Why drop Vue:** Eliminates DOM node explosion (1 canvas vs 1000+ divs), Vue reactivity tax, and the hydration bottleneck where every Vuex getter re-instantiates all dot models on every frame.

## Project Structure

The existing Vue 2 prototype moves into `_v0_prototype/` at the repo root for reference. The new implementation lives at the repo root.

```
_v0_prototype/                   Original Vue 2 app (preserved as-is)
  src/
  package.json
  ...

index.html                         Fullscreen dark canvas shell
vite.config.js                     Dev server on port 11235
package.json                       Deps: pixi.js v8, vite, vitest
src/
  main.js                          Entry: init PixiJS, create world, start loop
  engine/
    SimulationLoop.js              Fixed-timestep loop with render interpolation
    SpatialGrid.js                 Grid-based spatial hash for O(1) proximity
    WorldSimulation.js             Tick orchestrator (replaces Vuex actions)
  models/
    Dot.js                         Ported from existing, adapted
    World.js                       Ported from existing, adapted
    EmotionalConfig.js             Extracted from Dot — standalone emotional grid
  logic/
    dot-movement.js                Ported from existing (~400 lines, 95% as-is)
    dot-interaction.js             Ported from existing (~260 lines, stubs filled)
    dot-motivation.js              Ported from existing (~24 lines)
    dot-emotion.js                 NEW: evaluate(), contagion, emotional math
  rendering/
    PixiApp.js                     PixiJS Application wrapper, resize handling
    DotSprite.js                   30px dot with 3x3 quadrant flower rendering
    WorldRenderer.js               Sprite lifecycle + batched per-frame updates
  ui/
    ControlPanel.js                Play/pause/step/speed/spawn (DOM overlay)
    InspectorPanel.js              Click-to-inspect emotional state detail
  utils/
    object-utils.js                Native JS replacements for Lodash shim
    math-utils.js                  lerp, clamp, distance, randomInt
    color-utils.js                 Emotional value → color mapping
  config/
    defaults.js                    World/dot defaults, tuning constants
    emotional-palette.js           Bipolar color scales per quadrant dimension
  services/
    DotLogger.js                   Ported from existing
tests/
  engine/                          SimulationLoop, SpatialGrid, WorldSimulation
  models/                          Dot, World, EmotionalConfig
  logic/                           Movement, interaction, emotion
```

## What Gets Ported vs Rewritten

**Ported from `_v0_prototype/` (70% of original codebase):**
- `dot-movement.js` — Replace Lodash imports with native JS, add spatial-grid-aware `getNearbyDots`, restore commented-out polarity/chirality prioritization, set debug=false
- `dot-interaction.js` — Same import changes, update `interactWithOthers()` to use spatial grid
- `dot-motivation.js` — Minimal import changes
- `Dot.js` — Remove `getNextMove()` (orchestration moves to WorldSimulation), remove `hydrate()`, extract EmotionalConfig, change default size 9→30px, add `prevX1/prevY1` for interpolation
- `World.js` — Remove `hydrate()`, add `spatialGrid` ref, dynamic sizing to viewport
- `DotLogger.js` — Convert to ES module
- `object-utils.js` — Replace Lodash with native `??`, `Object.hasOwn()`, `Array.includes()`

**Rewritten / New:**
- `dot-movement-ui.js` → Deleted (replaced by PixiJS sprite positioning)
- All Vue components → Replaced by PixiJS rendering layer
- Vuex store → Replaced by WorldSimulation orchestrator
- Animation system → Fixed-timestep SimulationLoop with interpolation

## Architecture

```
┌──────────────────────────────────────────────┐
│  SimulationLoop (fixed timestep + rAF)       │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │ onTick()       │  │ onRender(alpha)    │  │
│  │ 10x/sec        │  │ 60fps             │  │
│  └───────┬────────┘  └───────┬────────────┘  │
└──────────┼───────────────────┼───────────────┘
           ▼                   ▼
  WorldSimulation         WorldRenderer
  ┌─────────────┐        ┌──────────────┐
  │ 1. Rebuild   │        │ For each dot:│
  │    spatial    │        │  interpolate │
  │    grid       │        │  position    │
  │ 2. Save prev  │        │  update      │
  │    positions  │        │  emotional   │
  │ 3. Compute    │        │  quadrant    │
  │    all moves  │        │  colors      │
  │ 4. Apply      │        └──────────────┘
  │    atomically │              ▼
  │ 5. Emotional  │         DotSprite
  │    contagion  │        ┌──────────┐
  │ 6. Evaluate   │        │ 3x3 grid │
  │    self       │        │ per dot  │
  └─────────────┘        │ bloom fx │
                          └──────────┘
```

**Key architectural change:** The existing prototype drives simulation from Vue's `updated()` lifecycle + Velocity.js animation callbacks (each dot ticks independently at its own animation rate). The new system uses a proper game loop — simulation ticks at a fixed rate (default 10/sec), rendering interpolates smoothly at display refresh rate (60fps). All dots compute simultaneously, then all moves apply atomically.

## Phases

### Phase 0: Project Setup
- Move all existing files (src/, static/, build/, config/, test/, package.json, .nvmrc, .eslintrc.js, .babelrc, etc.) into `_v0_prototype/`
- Initialize new project at root with Vite + PixiJS v8
- `index.html`: fullscreen dark canvas, no framework
- `npm run dev` serves blank PixiJS canvas on port 11235
- Preserve CLAUDE.md, PLAN-V2.md, README.md, and .git at root
- **No dependencies on later phases**

### Phase 1: Core Engine
Port models and logic. Build simulation infrastructure.

1. **Utilities** — `object-utils.js` (native JS shim), `math-utils.js`, `DotLogger.js`
2. **EmotionalConfig** — Extract from Dot as standalone class with grid positions, dimension definitions, corner/cross accessors, bloom level calculation
3. **Dot model** — Port from existing. Key changes: default 30px, no hydrate, no getNextMove (moved to orchestrator), add prevX1/prevY1 for interpolation
4. **World model** — Port from existing. Dynamic viewport sizing, spatial grid reference
5. **SpatialGrid** — Grid-based spatial hash (100px cells). `rebuild(dots)`, `queryNearby(observer, visionRange)`. Replaces O(n) `getNearbyDots` iteration with O(1) cell lookups
6. **dot-movement.js** — Port. Add `getNearbyDotsSpatial()`, restore polarity/chirality prioritization
7. **dot-interaction.js** — Port. Wire to spatial grid
8. **SimulationLoop** — Fixed-timestep with interpolation. `start()`, `stop()`, `stepOnce()`, `setTickRate()`
9. **WorldSimulation** — Tick orchestrator: rebuild grid → save positions → compute moves → apply atomically → evaluate

**Deliverable:** Headless simulation testable via Vitest. No rendering.

### Phase 2: Rendering Layer
PixiJS visualization with emotional flower rendering.

1. **PixiApp** — Application wrapper, `resizeTo: window`, WebGL with antialias, handle resize
2. **emotional-palette.js** — Bipolar color scales per quadrant:
   - Intrigue Drive (x): red-orange ↔ gold
   - Conformity Ratio (y): purple ↔ green
   - Comfort Drive (o): dark red ↔ warm blue
   - Connectedness Ratio (g): cold gray ↔ warm pink
   - Pride Factor (cross): muted brown ↔ white-gold
3. **DotSprite** — PixiJS Container with 3x3 grid of Graphics objects (10px each within 30px dot). Bloom effect: quadrants fill radially from center, size scales with emotional intensity (40%→100% of cell). Color from palette, alpha from intensity.
4. **WorldRenderer** — Maps simulation dots to DotSprite instances. `sync(world)` adds/removes sprites. `render(alpha)` interpolates positions and updates emotional colors.
5. **main.js** — Wire everything: init PixiJS → create world → create simulation → create renderer → spawn dots → start loop

**Deliverable:** Dots render as colored 30px squares with emotional quadrant visualization. Smooth interpolated movement. Canvas fills viewport. Target: 1000 dots at 60fps.

### Phase 3: Emotional System
Implement the WIP features that make the simulation come alive.

1. **dot-emotion.js** (NEW) — The heart of the concept:
   - `evaluate(dot, world)` — Assess stimulation (moving vs idle), situational awareness, intrigue (new vs repeated paths), comfort (wall proximity), connectedness (interaction recency), pride (aggregate)
   - `applyContagion(dot, nearbyDots)` — Nearby dots pull each other's emotional states toward their average. This is the "emotions spread like weather" mechanic.
   - `calculateConformityRatio(dot)` — C = m_self / m_others
2. **Fill interaction stubs:**
   - `isWillingToInteractWithDot()` — Gate on connectedness, stimulation, intrigue levels
   - `performInteraction()` — Initiator's dominant emotion transfers partially to recipient
3. **Restore polarity/chirality** — Uncomment the full step prioritization in `calculateAvailableSteps()`
4. **Wire into WorldSimulation tick** — After moves apply: rebuild grid → contagion pass → evaluate pass

**Deliverable:** Emergent behavior — emotional "weather" visibly spreads through dot clusters. Dots bloom, shift colors, and influence neighbors.

### Phase 4: UI Shell
Minimal controls as a DOM overlay on the canvas.

1. **ControlPanel** — Play/pause, step, speed slider (1-60 ticks/sec), spawn count + button, dot count display
2. **InspectorPanel** — Click a dot to see: name, position, direction, shift memory, step contracts, emotional config grid (visual + numeric), convictions
3. **Fullscreen toggle** — Fullscreen API for TV display
4. **Click detection** — PixiJS event system on DotSprite containers

### Phase 5: Polish
Visual effects and performance optimization.

1. **Interaction lines** — Thin lines between dots with active step contracts
2. **Glow effect** — Outer glow on high-intensity dots (PixiJS filters)
3. **Breathing animation** — Subtle scale oscillation based on stimulation
4. **Performance:** Object pooling for DotSprite, reduce emotional display updates to every 5th frame, frustum culling for oversized worlds
5. **Stress testing:** Profile at 1000/2000/5000 dots, tune spatial grid cell size, verify 4K rendering

## Emotional Configuration — Visual Design

Each dot is a 30px square divided into a 3x3 grid (10px per cell):

```
┌────┬────┬────┐
│ x  │ s  │ y  │  Row 0: Motivational stimulation
├────┼────┼────┤
│ L  │ d  │ R  │  Row 1: Center row
├────┼────┼────┤
│ o  │ n  │ g  │  Row 2: Situational awareness
└────┴────┴────┘
  ↑    ↑    ↑
world self others
```

- **Four corner petals** (x, y, o, g): Each represents a bipolar emotional dimension. Positive values fill with warm/active colors, negative values with cool/subdued colors. The fill blooms radially from the cell center outward — low intensity fills a small centered region, max intensity fills the entire 10px cell.
- **Center cross** (s, L, d, R, n): Represents the Pride Factor. Fills the cross shape between the petals.
- **Overall effect**: A dot with all quadrants active looks like a colorful blooming flower. A dot with no emotional state is a dark neutral square. Over time, as dots interact and emotions spread, the world fills with shifting color patterns — visible emotional weather.

## Porting Reference

| Original File (now in `_v0_prototype/`) | Action | Key Changes |
|---|---|---|
| `src/models/Dot.js` | Port to `src/models/Dot.js` | Remove getNextMove/hydrate, extract EmotionalConfig, 9→30px, add prevX1/prevY1 |
| `src/models/World.js` | Port to `src/models/World.js` | Remove hydrate, add spatialGrid, dynamic viewport sizing |
| `src/logic/dot-movement.js` | Port to `src/logic/dot-movement.js` | Replace Lodash, add spatial getNearbyDots, restore polarity/chirality |
| `src/logic/dot-interaction.js` | Port to `src/logic/dot-interaction.js` | Replace Lodash, wire to spatial grid, fill stubs in Phase 3 |
| `src/logic/dot-motivation.js` | Port to `src/logic/dot-motivation.js` | Replace imports |
| `src/logic/dot-movement-ui.js` | Drop | Replaced by PixiJS sprite positioning |
| `src/utils/object-utils.js` | Port to `src/utils/object-utils.js` | Replace Lodash with native JS |
| `src/services/DotLogger.js` | Port to `src/services/DotLogger.js` | Convert to ES module |
| `src/components/*.vue` | Drop | Replaced by rendering/ layer |
| `src/store/**` | Drop | Replaced by WorldSimulation |
| `src/pages/*.vue` | Drop | Replaced by main.js + ui/ |

## Verification

- **Phase 0:** `npm run dev` serves blank dark PixiJS canvas
- **Phase 1:** `npm run test` passes — dots move correctly in headless simulation, spatial grid returns correct neighbors, step contracts negotiate properly
- **Phase 2:** Visual: 100 dots moving with colored quadrants at 60fps, then 1000 dots performance check
- **Phase 3:** Emotional colors visibly change over time, clusters shift toward similar colors (contagion working)
- **Phase 4:** Controls work — play/pause/step/spawn/inspect/fullscreen
- **Phase 5:** Smooth at 1000+ dots on 4K display

## Risks

1. **Step contract mutation during batched compute** — Existing code mutates stepContracts directly on dots during compute phase. Keep sequential-within-tick for now; double-buffer pattern is a Phase 5 optimization if needed.
2. **Emotional tuning** — The numerical deltas for emotional changes need extensive tuning. Centralize all constants in `config/defaults.js` for easy adjustment.
3. **PixiJS v8 API** — v8 has breaking changes from v7 (Graphics uses builder pattern: `gfx.rect().fill()` not `gfx.beginFill().drawRect()`). All rendering code must target v8 specifically.
4. **Scale vs viewport** — At 1000+ dots with 30px size on a 4K TV, the world is ~3840x2160. May need camera/pan controls or world wrapping for smaller screens.
