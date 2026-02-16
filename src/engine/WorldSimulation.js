// WorldSimulation.js — Tick orchestrator
//
// Each tick:
//   1. Rebuild spatial grid
//   2. Save previous positions (for interpolation)
//   3. Compute all moves (interact + choose step)
//   4. Apply all moves atomically
//   5. Evaluate (Phase 3: emotional contagion + self-assessment)

import SpatialGrid from './SpatialGrid.js';
import * as dotInteraction from '../logic/dot-interaction.js';
import * as dotMovement from '../logic/dot-movement.js';
import * as dotEmotion from '../logic/dot-emotion.js';

export default class WorldSimulation {
  constructor(world) {
    this.world = world;
    this.spatialGrid = new SpatialGrid(world.width, world.height);
    this.world.spatialGrid = this.spatialGrid;
    this.tickCount = 0;
  }

  tick() {
    const world = this.world;
    const dots = [];

    // Collect awake dots
    world.forEachDot(dot => {
      if (!dot.isAsleep) dots.push(dot);
    });

    if (dots.length === 0) return;

    // (1) Rebuild spatial grid
    this.spatialGrid.rebuild(dots);

    // (2) Save previous positions for interpolation
    for (const dot of dots) {
      dot.savePosition();
    }

    // (3) Compute all moves
    const moveResults = [];
    for (const dot of dots) {
      // Interact with others (manages step contracts)
      const interactions = dotInteraction.interactWithOthers(dot, world);

      // Choose next step
      const step = dotMovement.chooseNextStep(dot, world);

      // Merge end states
      const endState = { ...interactions.endState, ...step.endState };
      moveResults.push({ dot, endState });
    }

    // (4) Apply all moves atomically
    for (const { dot, endState } of moveResults) {
      dot.applyMove(endState);
    }

    // (5) Emotional contagion + self-assessment
    // Rebuild grid after moves so proximity is accurate
    this.spatialGrid.rebuild(dots);

    for (const dot of dots) {
      // Contagion: nearby dots pull emotions toward their average
      const nearbyDots = dotMovement.getNearbyDotsSpatial(dot, this.spatialGrid);
      dotEmotion.applyContagion(dot, nearbyDots);

      // Self-evaluation: assess all emotional dimensions
      dotEmotion.evaluate(dot, world);
    }

    this.tickCount++;
  }

  // Spawn a new dot into the world
  spawnDot(dot) {
    dot.wake();
    this.world.addDot(dot);
  }

  // Remove a dot from the world
  removeDot(dotID) {
    this.world.removeDot(dotID);
  }

  // Resize the spatial grid when world dimensions change
  resize(width, height) {
    this.world.width = width;
    this.world.height = height;
    this.world.x2 = width + 1;
    this.world.y2 = height + 1;
    this.spatialGrid = new SpatialGrid(width, height);
    this.world.spatialGrid = this.spatialGrid;
  }
}
