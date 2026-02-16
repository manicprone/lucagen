// dot-emotion.js — Emotional evaluation and contagion
//
// The heart of the simulation. Each tick, after movement:
//   1. evaluate(dot, world) — self-assessment of all emotional dimensions
//   2. applyContagion(dot, nearbyDots) — emotions spread like weather
//
// Emotional grid reminder:
//   x = Intrigue Drive:      agitation (-) ↔ anticipation (+)
//   y = Conformity Ratio:    independence (-) ↔ conformity (+)
//   o = Comfort Drive:       fear (-) ↔ safety (+)
//   g = Connectedness Ratio: isolation (-) ↔ inclusion (+)
//   cross (s,L,d,R,n) = Pride Factor: shame (-) ↔ pride (+)

import {
  EMOTION_UNSET,
  EMOTION_MIN,
  EMOTION_MAX,
  CONTAGION_STRENGTH,
  STIMULATION_GAIN,
  STIMULATION_DECAY,
  INTRIGUE_NOVELTY_GAIN,
  INTRIGUE_REPEAT_DECAY,
  COMFORT_WALL_THRESHOLD,
  COMFORT_WALL_PENALTY,
  COMFORT_OPEN_GAIN,
  CONNECTEDNESS_INTERACTION_GAIN,
  CONNECTEDNESS_ISOLATION_DECAY,
  PRIDE_AGGREGATE_WEIGHT,
} from '../config/defaults.js';
import EmotionalConfig from '../models/EmotionalConfig.js';

// --- Helpers ---

function clampEmotion(value) {
  if (value <= EMOTION_UNSET) return EMOTION_UNSET;
  return Math.max(EMOTION_MIN, Math.min(EMOTION_MAX, value));
}

// Activate an unset value to 0 so it can start changing
function activate(current) {
  return current <= EMOTION_UNSET ? 0 : current;
}

// --- Main evaluation ---

/**
 * Evaluate a dot's emotional state based on its current situation.
 * Called once per tick, after movement has been applied.
 *
 * Assesses:
 *   s = stimulation (moving vs idle)
 *   x = intrigue (novelty of path)
 *   o = comfort (wall proximity)
 *   g = connectedness (interaction recency)
 *   y = conformity ratio
 *   cross = pride (aggregate)
 */
export function evaluate(dot, world) {
  const ec = dot.emotionalConfig;

  assessStimulation(dot, ec);
  assessIntrigue(dot, ec);
  assessComfort(dot, world, ec);
  assessConnectedness(dot, ec);
  assessConformityRatio(dot, ec);
  assessPride(ec);
}

/**
 * Stimulation (s): Moving keeps a dot stimulated, idleness decays it.
 * Maps to the center-top of the emotional grid.
 */
function assessStimulation(dot, ec) {
  let value = activate(ec.s);

  if (dot.currentDirection !== null) {
    // Moving — gain stimulation
    value += STIMULATION_GAIN;
  } else {
    // Idle — lose stimulation
    value -= STIMULATION_DECAY;
  }

  ec.s = clampEmotion(value);
}

/**
 * Intrigue Drive (x): Novelty of path boosts anticipation,
 * repeated directions breed agitation/boredom.
 */
function assessIntrigue(dot, ec) {
  let value = activate(ec.x);
  const history = dot.moveShiftHistory;
  const dir = dot.currentDirection;

  if (dir && history.length > 0) {
    const lastIndex = history.lastIndexOf(dir);
    if (lastIndex === -1 || lastIndex < history.length - 2) {
      // Fresh direction — anticipation rises
      value += INTRIGUE_NOVELTY_GAIN;
    } else {
      // Repeated direction — intrigue decays
      value -= INTRIGUE_REPEAT_DECAY;
    }
  }

  ec.x = clampEmotion(value);
}

/**
 * Comfort Drive (o): Proximity to walls induces fear,
 * open space provides safety.
 */
function assessComfort(dot, world, ec) {
  let value = activate(ec.o);

  const step = dot.width;
  const threshold = COMFORT_WALL_THRESHOLD * step;

  const nearNorth = dot.y1 - world.y1 <= threshold;
  const nearSouth = world.y2 - dot.y2 <= threshold;
  const nearEast = world.x2 - dot.x2 <= threshold;
  const nearWest = dot.x1 - world.x1 <= threshold;

  const wallCount = [nearNorth, nearSouth, nearEast, nearWest].filter(Boolean).length;

  if (wallCount > 0) {
    // Near walls — fear increases
    value -= COMFORT_WALL_PENALTY * wallCount;
  } else {
    // Open space — safety increases
    value += COMFORT_OPEN_GAIN;
  }

  ec.o = clampEmotion(value);
}

/**
 * Connectedness Ratio (g): Recent interactions boost inclusion,
 * long periods without interaction decay toward isolation.
 */
function assessConnectedness(dot, ec) {
  let value = activate(ec.g);

  // Check if any interactions happened recently
  const hasActiveContracts = dot.stepContracts.members &&
    Object.keys(dot.stepContracts.members).length > 0;

  if (hasActiveContracts) {
    value += CONNECTEDNESS_INTERACTION_GAIN;
  } else {
    value -= CONNECTEDNESS_ISOLATION_DECAY;
  }

  ec.g = clampEmotion(value);
}

/**
 * Conformity Ratio (y): C = m_self / m_others
 * High conformity when the dot's behavior aligns with neighbors.
 * For now, approximated by comparing direction with recent contract partners.
 */
function assessConformityRatio(dot, ec) {
  let value = activate(ec.y);

  const members = dot.stepContracts.members;
  if (members && Object.keys(members).length > 0) {
    // Has social context — conformity is possible
    // If following contracts (avoiding, meeting), conformity rises
    const personal = dot.stepContracts.personal;
    if (personal && personal.intent === 'avoid' && personal.satisfied) {
      // Successfully conformed to avoid collision
      value += 0.08;
    } else {
      value -= 0.04;
    }
  } else {
    // Alone — independence rises (conformity decays)
    value -= 0.02;
  }

  ec.y = clampEmotion(value);
}

/**
 * Pride Factor (cross: s, L, d, R, n): Aggregate of all corner emotions.
 * High corners → pride rises. Low/negative corners → shame.
 */
function assessPride(ec) {
  // Average of corner values (only active ones)
  const corners = EmotionalConfig.CORNER_KEYS;
  let sum = 0;
  let count = 0;

  for (const key of corners) {
    if (ec[key] > EMOTION_UNSET) {
      sum += ec[key];
      count++;
    }
  }

  if (count === 0) return;

  const avg = sum / count;
  const prideDirection = avg > (EMOTION_MAX / 2) ? 1 : -1;
  const prideDelta = PRIDE_AGGREGATE_WEIGHT * prideDirection * (Math.abs(avg) / EMOTION_MAX);

  // Apply to all cross keys
  for (const key of EmotionalConfig.CROSS_KEYS) {
    let value = activate(ec[key]);
    value += prideDelta;
    ec[key] = clampEmotion(value);
  }
}

// --- Contagion ---

/**
 * Nearby dots pull each other's emotional states toward their average.
 * This is the "emotions spread like weather" mechanic.
 *
 * @param {Dot} dot - The dot being influenced
 * @param {Dot[]} nearbyDots - Dots within contagion range
 */
export function applyContagion(dot, nearbyDots) {
  if (nearbyDots.length === 0) return;

  const ec = dot.emotionalConfig;

  // Calculate average emotional values of neighbors (only for active dimensions)
  for (const key of EmotionalConfig.ALL_KEYS) {
    // Gather neighbor values for this dimension (only active ones)
    let sum = 0;
    let count = 0;

    for (const other of nearbyDots) {
      const otherVal = other.emotionalConfig[key];
      if (otherVal > EMOTION_UNSET) {
        sum += otherVal;
        count++;
      }
    }

    if (count === 0) continue;

    const neighborAvg = sum / count;
    let myValue = ec[key];

    // If this dimension is unset on us but active on neighbors, activate it
    if (myValue <= EMOTION_UNSET && neighborAvg > EMOTION_MIN) {
      myValue = 0;
    }

    if (myValue > EMOTION_UNSET) {
      // Blend toward neighbor average
      myValue += (neighborAvg - myValue) * CONTAGION_STRENGTH;
      ec[key] = clampEmotion(myValue);
    }
  }
}

/**
 * Calculate the conformity ratio: C = m_self / m_others
 * Where m_self is the dot's own emotional intensity
 * and m_others is the average intensity of others it has interacted with.
 *
 * @param {Dot} dot
 * @param {Dot[]} nearbyDots
 * @returns {number} Conformity ratio (>1 = more independent, <1 = more conformist)
 */
export function calculateConformityRatio(dot, nearbyDots = []) {
  const selfIntensity = dot.emotionalConfig.getBloomLevel();

  if (nearbyDots.length === 0 || selfIntensity === 0) return 1;

  let othersTotal = 0;
  for (const other of nearbyDots) {
    othersTotal += other.emotionalConfig.getBloomLevel();
  }
  const othersAvg = othersTotal / nearbyDots.length;

  if (othersAvg === 0) return 1;

  return selfIntensity / othersAvg;
}
