// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';

const debug = true;
const verbose = true;

export function chooseToInteractWithDot(/* observer = {}, other = {} */) {
  const interactionChoice = {};

  // Nearby Dots are provided, allowing the observer to identify
  // which he would initiate interaction, if they cross paths
  // (i.e. on the next getNextMove) when interactWithOthers is called.

  return interactionChoice;
}

// TODO: We need to prevent multiple interactions with same Dot !!!
//       Idea => determine when a nearbyDot is "approaching"
//               (for interaction and avoidance)
//
// The issue:
// ---------------------------
//  - X      <-- "approaching"   Event 0
//  - -
//  - O      <-- "observer"
// ---------------------------
// ---------------------------
//  - -                          Event 1
//  - X        (interaction)
//  O -
// ---------------------------
// ---------------------------
//  - -                          Event 2
//  O -        (interaction)      !!!
//  - X
// ---------------------------

// interactions: {
//   endState: {},
// }
export function interactWithOthers(observer = {}, world = {}) {
  const interactions = {
    endState: {},
  };

  if (observer.type === 'Dot' && world.type === 'DotWorld') {
    const others = world.dotRegistry;

    // Look for adjacent dots...
    const adjacentDots = getNearbyDots(observer, others, 1);
    if (adjacentDots.length > 0) {
      if (debug) console.log(`[interaction] "${observer.id}" encountered ${adjacentDots.length} adjacent dot(s)`);

      // Iterate through all adjacent...
      adjacentDots.forEach((other) => {
        if (debug) console.log(`[interaction] "${observer.id}" is interacting with ${other.id}`);

        // Check for existing recipient states...
        const received = (other.recipientInteractions[observer.id])
            ? Object.assign({}, other.recipientInteractions[observer.id])
            : null;

        // If interaction already exists, we are the recipient...
        if (received) {
          if (debug && verbose) console.log(`[interaction] "${observer.id}" is recipient of interaction with ${other.id} =>`, received);
          delete other.recipientInteractions[observer.id]; // eslint-disable-line no-param-reassign

          // Update observer endState...
          Object.assign(interactions.endState, received);
          interactions.endState.totalInteractions = observer.totalInteractions + 1;

        // Otherwise, we are the initiator...
        } else {
          const interaction = performInteraction(observer, other, world);
          if (debug && verbose) console.log(`[interaction] "${observer.id}" is inititator of interaction with ${other.id} =>`, interaction);

          // Record interaction endState for recipient...
          observer.recipientInteractions[other.id] = interaction.recipientEndState; // eslint-disable-line no-param-reassign

          // Update observer endState...
          Object.assign(interactions.endState, interaction.initiatorEndState);
          interactions.endState.totalInteractionsInitiated = observer.totalInteractionsInitiated + 1;
          interactions.endState.totalInteractions = observer.totalInteractions + 1;
        }
      });
    } // end-if (adjacentDots.length > 0)
  }

  return interactions;
}

// interaction: {
//   initiatorEndState: {},
//   recipientEndState: {},
// }
/* initiator = {}, recipient = {}, world = {} */
export function performInteraction() {
  const interaction = {
    initiatorEndState: {},
    recipientEndState: {},
  };

  return interaction;
}

// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot
// -----------------------------------------------------------
//
// -----------------------------------------------------------
export function getNearbyDots(dot = {}, others = {}, visionDepth = 1) {
  const nearby = [];

  if (dot.type === 'Dot') {
    Object.keys(others).forEach((dotID) => {
      if (dotID !== dot.id) {
        const other = others[dotID];
        if (isDotInRange(dot, other, visionDepth)) nearby.push(other);
      }
    });
  }

  return nearby;
}

export function isDotInRange(observer = {}, other = {}, visionDepth = 1) {
  let result = false;

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const distance = visionDepth * observer.width;
    const myNorthSight = (observer.y1 - 1) - distance;
    const myEastSight = (observer.x1 + 1) + distance;
    const mySouthSight = (observer.y2 + 1) + distance;
    const myWestSight = (observer.x2 - 1) - distance;

    if (other.x2 > myWestSight && other.x1 < myEastSight &&
        other.y2 > myNorthSight && other.y1 < mySouthSight) {
      result = true;
    }
  }

  return result;
}
