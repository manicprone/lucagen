# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lucagen is a Vue 2 SPA simulating autonomous dot entities ("DotWorld") that move, interact, and exhibit emotional states within a shared world. Status: WIP, not demonstration-ready.

## Commands

- **Dev server**: `npm run dev` (port 11235)
- **Build**: `npm run build`
- **Lint**: `npm run lint` (ESLint with airbnb-base on .js and .vue files)
- **Unit tests**: `npm run unit` (Karma + Mocha + Chai, PhantomJS)
- **E2E tests**: `npm run e2e` (Nightwatch + Selenium)

## Tech Stack

Vue 2.2, Vue Router 2.3 (history mode), Vuex 2.2, Webpack 2.2, Velocity.js (animations), Lodash, Babel (env + stage-2).

## Architecture

### Model-Logic-Component Separation

The codebase follows a strict separation:

- **Models** (`src/models/`): Plain JS classes holding entity state. Include static `hydrate()` methods for reconstituting from serialized data.
- **Logic** (`src/logic/`): Pure functions operating on models, no Vue dependencies. This is where simulation behavior lives.
- **Components** (`src/components/`): Vue SFCs that render models and dispatch Vuex actions.

### Simulation Lifecycle

Each dot follows a three-stage lifecycle per step:
1. `getNextMove(world)` — Decision phase: interaction check (`dot-interaction.js`) then movement choice (`dot-movement.js`)
2. `applyMove(endState)` — State application phase
3. `evaluate()` — Emotional self-assessment (WIP)

Movement instructions are generated as Velocity.js animation objects (`dot-movement-ui.js`). Animation completion callbacks notify the Vuex store of state changes.

### State Flow

Components dispatch Vuex actions → actions create/hydrate models → logic modules operate on models → mutations commit to store → components re-render via getters. Vuex modules: `app` (settings) and `dotWorld` (simulation state). Router is synced to store via `vuex-router-sync`.

### Key Models

**Dot** (`src/models/Dot.js`): Core entity with identification, location (birth coords + vertices), movement tracking (direction, step history, sleep state), interaction records (step contracts, recipient interactions), motivational convictions, and a 9-quadrant emotional configuration grid:
```
x  s  y
L  d  R
o  n  g
```
Quadrant values range from -1 (unset) to 3 (max intensity).

**World** (`src/models/World.js`): Container with dimensions (default 450x270), `polarity` (U/D vertical tendency), `chirality` (L/R horizontal tendency), a dot registry (ID → Dot map), and `freedomMode` (simulation running state).

### Routes

`/` → HomePage, `/world` → DotWorldPage (main simulation), `/config` → ConfigPage.

## ESLint Configuration

Extends airbnb-base with notable rule overrides: `max-len` off, `no-console` off, `default-case` off, `arrow-body-style` off, `import/prefer-default-export` off, `no-plusplus` allowed in for-loop afterthoughts.

## Conventions

- Logic modules use `debug` and `verbose` boolean flags for console logging (prefixed with `[DEVING]`).
- Custom `DotLogger` service (`src/services/DotLogger.js`) provides `main()` and `sub()` log methods.
- Object utilities (`src/utils/object-utils.js`) wrap Lodash's `get`, `has`, `isEmpty`, `includes`.
