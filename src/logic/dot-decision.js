// -------------------------------------------------------------
// dot-decision.js
//
// Logic for Dot decisions.
// -------------------------------------------------------------
import * as dotInteraction from './dot-interaction';
import * as dotStep from './dot-step';

const debug = false;
// const verbose = false;

// -----------------------------------------------------------
// Returns an array of available events (moves)
// -----------------------------------------------------------
// TODO: return move package:
// {
//   movements: [],
//   interactions: [],
// }
// -----------------------------------------------------------
export function calculateAvailableEvents(dot = {}, world = {}) {
  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    // Check for nearby dots...
    const nearbyDots = dotInteraction.getNearbyDots(dot, world);
    if (nearbyDots.length > 0) {
      if (debug) console.log(`[movement] [${dot.id}] ${nearbyDots.length} nearby dot(s)`);
    }

    // Calculate steps available at this moment...
    const steps = dotStep.calculateAvailableSteps(dot, world);

    return steps;
  }

  return [];
}
