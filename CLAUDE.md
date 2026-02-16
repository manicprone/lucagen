# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lucagen — "The chaotic art of life" — simulates autonomous dot entities ("DotWorld") that move, interact, and exhibit emotional states within a shared world. Each dot is an independent agent with its own perception, emotions, motivations, and social dynamics.

**v2** is a canvas-rendered rebuild targeting 1000+ dots at 60fps. The original Vue 2 prototype is preserved in `_v0_prototype/`. Status: All 5 phases complete (engine, rendering, emotions, UI, polish).

## Commands

- **Dev server**: `npm run dev` (port 11235, requires Node 22 via `nvm use`)
- **Build**: `npm run build`
- **Tests**: `npm run test` (Vitest)
- **Tests (watch)**: `npm run test:watch`
- **Install**: `npm install`

## Tech Stack

Vanilla JS (no framework), PixiJS v8 (WebGL rendering), Vite 6 (build), Vitest (tests). Node 22 pinned via `.nvmrc`.

---

## Conceptual Design

### Philosophy

A World is shared among a set of Dots. Each Dot has its own view of the World's state, and its own view of the other Dots with whom it has interacted. The simulation explores subjective experience, emotional complexity, social negotiation, and autonomous motivation.

```
 A world is shared amongst a set of Dots...

      World
  ______|_______
 |    |    |    |
Dot  Dot  Dot  Dot        Each with their own view of its state...
 |
 |
 |
  ========>  Dot  Dot  Dot        Each with their own view of the others
                                          with whom they have interacted.
```

### The Motivation of a Dot

1. To keep stimulated and avoid listlessness
2. To seek a higher level of pride

### The Life of a Dot

Each step follows this cycle:

```
(1) Determine physical movement (step or stay still)
    (a) Look for interaction (if feeling social)
               -or-
        Avoid interaction (if feeling anti-social)
    (b) Avoid walls and collisions

(2) Interact (if interaction occurs)
    (a) Exchange with other(s)
    (b) Evaluate other(s) individually
    (c) Evaluate world as a whole
        (based on evaluation of all others up to this point)

(3) Evaluate self
    (a) Assess all emotional states
    (b) Qualify motivation in world
    (c) Calculate level of pride
```

### A Dot Will Stop Moving If

- It perceives it has no moves available.
- It does not have sufficient motivation to choose a move.

---

## Emotional Configuration System

Each Dot has a 9-quadrant emotional configuration grid:

```
x  s  y
L  d  R
o  n  g
```

### High-Level Structure (see `static/dot-emotional-config-HL.png`)

The grid is organized along two axes:

|           | world (left col) | self (center col) | others (right col) |
|-----------|------------------|-------------------|--------------------|
| **motivational stimulation** (top 2 rows) | x, L | s, d | y, R |
| **situational awareness** (bottom row) | o | n | g |

### The Four Social Quadrants (see `static/dot-emotional-config-quadrants.png`)

Each corner quadrant represents an emotional dimension on a bipolar scale:

| Quadrant | Grid Position | Name | Negative Pole (-) | Positive Pole (+) |
|----------|--------------|------|--------------------|--------------------|
| Top-Left | x | **Intrigue Drive** | agitation | anticipation |
| Top-Right | y | **Conformity Ratio** | independence | conformity |
| Bottom-Left | o | **Comfort Drive** | fear | safety |
| Bottom-Right | g | **Connectedness Ratio** | isolation | inclusion |

**Conformity Ratio** is calculated as: `C = m_self / m_others`

The **Pride Factor** (`P`) occupies the center cross shape between the four quadrant petals, ranging from **shame** (-) to **pride** (+).

### Visual Representation

- Quadrant values range from **-1** (unset) to **3** (max intensity).
- Color mapping: transparent (-1/0), light blue `#9cc8f4` (1), medium blue `#225fd9` (2), dark blue `#05398c` (3).
- Quadrants fill out over time, from central pixel outwards (radially), representing a **flower-like bloom**.
- Intensity is shown via a dual hue scale per pole; permanence over time via opacity.
- The pride factor fills the cross shape between the quadrant petals.

---

## Movement System

### Decision Hierarchy

A Dot's movement choice follows a strict priority:

1. **Contract step** — Honor agreements made with other Dots (step contracts from interaction negotiation).
2. **Conviction step** — Follow internal motivations (e.g., return to original course after avoidance).
3. **Freedom step** — Wander freely, preferring continuity and choosing the freshest (least recently taken) path.

### Available Steps

- Calculated from world boundaries (wall avoidance) in cardinal directions: `n`, `s`, `e`, `w`.
- Intended to be prioritized by world **polarity** (U/D) and **chirality** (L/R) — currently using a simplified version for testing.

### Memory

- `moveShiftHistory`: records each direction change.
- `memoryDepth` (default 5): limits how far back the Dot recalls, respecting memory capacity.
- Used during freedom steps to prefer the freshest (least recently visited) direction.

---

## Interaction System

### Vision

- `visionDepth` (default 3): how many dot-widths away a Dot can perceive.
- `getNearbyDots()`: finds all Dots within rectangular vision range.
- `isDotInRange()`: proximity check based on `visionDepth * dot.width`.

### Step Contracts

Step contracts are negotiated agreements between two Dots about physical movement, primarily for collision avoidance:

```
stepContracts: {
  leader: <dotID> | null,
  personal: {
    nextDirection: 'e',
    resumeDirection: 'n',
    resumeX: 136,
    resumeY: 9,
    intent: 'lead' | 'follow' | 'meet' | 'avoid',
    satisfied: true | false,
  },
  members: {
    <dotID>: { ...same structure... },
  },
}
```

**Negotiation flow:**
1. Check if the other Dot already has a contract for us — adopt it.
2. Otherwise, create a new contract.
3. Determine if a meetup is desired (intent: `meet` — currently hardcoded to false).
4. If avoiding, check for head-on collision — step orthogonally to avoid.
5. Record resume information so the Dot can return to its original course via a conviction.
6. Stale contracts are purged when Dots leave each other's range.

### Convictions

Convictions are internal motivational states that drive behavior across multiple steps:

```
conviction types:
- step (intents: meet, follow, rest, avoid, hide)
```

A step conviction stores `resumeDirection`, `resumeX`, `resumeY`, and `satisfied`. After satisfying a step contract (e.g., stepping sideways to avoid collision), the Dot creates a conviction to return to its original course. The conviction is satisfied once the Dot is back on its intended vector.

### Full Interactions (WIP)

The commented-out code in `dot-interaction.js` reveals the intended full interaction flow:
1. Find adjacent Dots (vision depth 1).
2. Check for existing `recipientInteractions` (i.e., the other Dot already initiated with us).
3. If recipient: accept the interaction state, increment `totalInteractions`.
4. If initiator: perform interaction, record `recipientEndState` for the other Dot, increment `totalInteractionsInitiated`.
5. `isWillingToInteractWithDot()` will gate social willingness (currently returns false).

---

## Architecture

### Model-Logic-Component Separation

- **Models** (`src/models/`): Plain JS classes holding entity state. Include static `hydrate()` methods for reconstituting from serialized Vuex data.
- **Logic** (`src/logic/`): Pure functions operating on models, no Vue dependencies. This is where simulation behavior lives.
- **Components** (`src/components/`): Vue SFCs that render models and dispatch Vuex actions.

### Simulation Lifecycle

```
Dot.getNextMove(world)
 |   |
 |   |__ interactWithOthers (create/manage step contracts)
 |   |
 |   |__ chooseNextStep (honor contracts > convictions > freedom)
 |
 V
Dot.applyMove(endState)
 |
 V
Dot.evaluate()  [WIP — not yet implemented]
```

Movement instructions are generated as Velocity.js animation objects (`dot-movement-ui.js`). Animation completion callbacks trigger `notify()` in the Dot component, which calls `applyMove()` and dispatches the state update to Vuex.

### State Flow

Components dispatch Vuex actions -> actions create/hydrate models -> logic modules operate on models -> mutations commit to store -> components re-render via getters. Getters hydrate raw state back into model instances.

Vuex modules: `app` (settings/version) and `dotWorld` (world state, dot registry, inspection list).

### Key Models

**Dot** (`src/models/Dot.js`): Identification, birthplace, size (9x9px), speed (200ms), visionDepth (3), memoryDepth (5), location vertices (x1/x2/y1/y2), transform tracking (fromX/fromY), sleep/wake state, step count, direction, moveShiftHistory, event count, interaction records, stepContracts, convictions, and the 9-quadrant emotionalConfig.

**World** (`src/models/World.js`): Dimensions (default 450x270), polarity (U/D), chirality (L/R), vertices, dot registry (ID -> Dot map), dots array (ordered IDs), and freedomMode.

### Routes

`/` -> HomePage, `/world` -> DotWorldPage (main simulation), `/config` -> ConfigPage (placeholder).

### Default World

DotWorldPage creates "Lonely World" on mount: a single Dot named "Lonely" at position (1, 262) — bottom-left area — with emotional config `{ s: 1 }`. The DotCreator defaults new Dots to `{ s: 3 }`.

---

## Current Implementation Status

### Working

- World creation with configurable dimensions, polarity, chirality
- Dot spawning with birth coordinates and emotional config
- Freedom movement with wall avoidance and shift memory
- Step contract negotiation for head-on collision avoidance
- Conviction-driven course resumption after avoidance maneuvers
- Velocity.js-based step animation with state sync on completion
- Wake/Sleep lifecycle and manual Step control
- Dot flyover inspection (hover for name, toggle diagnostics panel)
- DotDiag panel showing coordinates, direction, shift memory, step contracts
- Adding new Dots via DotCreator form

### WIP / Not Yet Implemented

- `Dot.evaluate()` — emotional self-assessment after each move
- `performInteraction()` — social exchange logic (returns empty shell)
- `isWillingToInteractWithDot()` — social gating (always returns false)
- `getApproachingDots()` / `isDotApproaching()` — directional proximity detection (stubs)
- Full polarity/chirality step prioritization (commented out, using simplified version)
- Emotional quadrant rendering in Dot component (HTML/CSS commented out)
- ConfigPage (empty placeholder)
- DotCreator speed input (commented out)

---

## Conventions

- Logic modules use `debug` and `verbose` boolean flags for console logging (prefixed with `[DEVING]`).
- Custom `DotLogger` service (`src/services/DotLogger.js`) provides `main()` and `sub()` log methods.
- Object utilities (`src/utils/object-utils.js`) wrap Lodash's `get`, `has`, `isEmpty`, `includes`.
- End-state pattern: logic functions return `{ endState: {} }` objects that get merged and applied via `Object.assign`.
- Hydration pattern: Vuex getters call `Model.hydrate(data)` to reconstitute class instances from plain store state.

## ESLint Configuration

Extends airbnb-base with notable rule overrides: `max-len` off, `no-console` off, `default-case` off, `arrow-body-style` off, `import/prefer-default-export` off, `no-plusplus` allowed in for-loop afterthoughts.
