// lucagen v2 — entry point
// Init PixiJS → create world → create simulation → create renderer → spawn dots → start loop

import PixiApp from './rendering/PixiApp.js';
import World from './models/World.js';
import Dot from './models/Dot.js';
import WorldSimulation from './engine/WorldSimulation.js';
import WorldRenderer from './rendering/WorldRenderer.js';
import SimulationLoop from './engine/SimulationLoop.js';
import { randomInt } from './utils/math-utils.js';

const INITIAL_DOT_COUNT = 100;

async function init() {
  // --- Init PixiJS ---
  const pixiApp = new PixiApp();
  await pixiApp.init();

  // --- Create world sized to viewport ---
  const world = new World({
    name: 'DotWorld v2',
    width: Math.floor(pixiApp.screen.width),
    height: Math.floor(pixiApp.screen.height),
  });

  // --- Create simulation ---
  const simulation = new WorldSimulation(world);

  // --- Create renderer ---
  const renderer = new WorldRenderer(pixiApp.stage);

  // --- Spawn initial dots ---
  spawnDots(simulation, world, INITIAL_DOT_COUNT);
  renderer.sync(world);

  // --- Start game loop ---
  const loop = new SimulationLoop({
    onTick: () => {
      simulation.tick();
      renderer.sync(world); // sync sprites after tick (in case dots added/removed)
    },
    onRender: (alpha) => {
      renderer.render(alpha);
    },
  });

  loop.start();

  console.log(`lucagen v2 — ${world.getDotCount()} dots spawned, simulation running`);

  // Expose for debugging in browser console
  window.__lucagen = { pixiApp, world, simulation, renderer, loop };
}

function spawnDots(simulation, world, count) {
  const dotSize = 30;
  const maxX = world.width - dotSize;
  const maxY = world.height - dotSize;

  for (let i = 0; i < count; i++) {
    const x = randomInt(1, Math.max(1, maxX));
    const y = randomInt(1, Math.max(1, maxY));

    // Give each dot a random starting emotional config
    const emotionalConfig = {};
    const keys = ['x', 's', 'y', 'L', 'd', 'R', 'o', 'n', 'g'];
    // Randomly activate 1-3 emotional dimensions
    const activeCount = randomInt(1, 3);
    for (let j = 0; j < activeCount; j++) {
      const key = keys[randomInt(0, keys.length - 1)];
      emotionalConfig[key] = randomInt(1, 3);
    }

    const dot = new Dot({
      name: `dot-${i + 1}`,
      birthX: x,
      birthY: y,
      emotionalConfig,
    });

    simulation.spawnDot(dot);
  }
}

init();
