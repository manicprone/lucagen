// lucagen v2 — entry point
// Init PixiJS → create world → create simulation → create renderer → spawn dots → start loop

import PixiApp from './rendering/PixiApp.js';
import World from './models/World.js';
import Dot from './models/Dot.js';
import WorldSimulation from './engine/WorldSimulation.js';
import WorldRenderer from './rendering/WorldRenderer.js';
import SimulationLoop from './engine/SimulationLoop.js';
import ControlPanel from './ui/ControlPanel.js';
import InspectorPanel from './ui/InspectorPanel.js';
import { randomInt } from './utils/math-utils.js';

async function init() {
  // --- Init PixiJS ---
  const pixiApp = new PixiApp();
  await pixiApp.init();

  // --- Create world sized to viewport ---
  const world = new World({
    name: 'Lonely World',
    width: Math.floor(pixiApp.screen.width),
    height: Math.floor(pixiApp.screen.height),
  });

  // --- Create simulation ---
  const simulation = new WorldSimulation(world);

  // --- Create renderer ---
  const renderer = new WorldRenderer(pixiApp.stage);

  // --- Create inspector ---
  const inspector = new InspectorPanel();

  // --- Spawn Lonely (the first dot, always) ---
  const lonely = new Dot({
    id: 'lonely',
    name: 'Lonely',
    birthX: 1,
    birthY: Math.max(1, world.height - 38), // bottom-left area
    emotionalConfig: { s: 1 },
  });
  simulation.spawnDot(lonely);
  renderer.sync(world);

  // --- Set viewport for frustum culling ---
  renderer.setViewport(pixiApp.screen.width, pixiApp.screen.height);

  // --- Wire click detection on sprites ---
  setupClickDetection(renderer, world, inspector);

  // --- Create control panel (before loop so onRender can reference it) ---
  let controls;

  // --- Start game loop ---
  const loop = new SimulationLoop({
    onTick: () => {
      simulation.tick();
      renderer.sync(world);
    },
    onRender: (alpha) => {
      renderer.render(alpha);
      inspector.update();
      if (controls) {
        controls.updateDotCount(world.getDotCount());
        controls.updateTickCount(simulation.tickCount);
      }
    },
  });

  controls = new ControlPanel({
    onPlay: () => loop.start(),
    onPause: () => loop.stop(),
    onStep: () => loop.stepOnce(),
    onSpeedChange: (ticksPerSec) => loop.setTickRate(ticksPerSec),
    onSpawn: (count) => {
      spawnDots(simulation, world, count);
      renderer.sync(world);
      setupClickDetection(renderer, world, inspector);
    },
    onAddDot: ({ name, x, y }) => {
      const dot = new Dot({
        name,
        birthX: x,
        birthY: y,
        emotionalConfig: { s: 1 },
      });
      simulation.spawnDot(dot);
      renderer.sync(world);
      setupClickDetection(renderer, world, inspector);
    },
    onFullscreen: () => toggleFullscreen(),
    worldWidth: world.width,
    worldHeight: world.height,
  });

  loop.start();
  controls.updateDotCount(world.getDotCount());

  console.log(`lucagen v2 — ${world.getDotCount()} dots spawned, simulation running`);

  // Expose for debugging
  window.__lucagen = { pixiApp, world, simulation, renderer, loop, controls, inspector };
}

function spawnDots(simulation, world, count) {
  const dotSize = 30;
  const maxX = world.width - dotSize;
  const maxY = world.height - dotSize;

  for (let i = 0; i < count; i++) {
    const x = randomInt(1, Math.max(1, maxX));
    const y = randomInt(1, Math.max(1, maxY));

    // Random starting emotional config: 1-3 active dimensions
    const emotionalConfig = {};
    const keys = ['x', 's', 'y', 'L', 'd', 'R', 'o', 'n', 'g'];
    const activeCount = randomInt(1, 3);
    for (let j = 0; j < activeCount; j++) {
      const key = keys[randomInt(0, keys.length - 1)];
      emotionalConfig[key] = randomInt(1, 3);
    }

    const dot = new Dot({
      name: `dot-${world.getDotCount() + 1}`,
      birthX: x,
      birthY: y,
      emotionalConfig,
    });

    simulation.spawnDot(dot);
  }
}

function setupClickDetection(renderer, world, inspector) {
  for (const [dotId, sprite] of renderer.sprites) {
    // Skip if already wired
    if (sprite._clickWired) continue;

    sprite.container.on('pointertap', () => {
      const dot = world.getDot(dotId);
      if (dot) inspector.inspect(dot);
    });
    sprite._clickWired = true;
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

init();
