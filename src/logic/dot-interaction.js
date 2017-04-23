// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';

const debug = true;
const verbose = false;

export function chooseToInteractWithDots(/* observer = {}, others = {} */) {
  const interactionChoices = {};

  // Nearby Dots are provided, allowing the observer to identify
  // which he would initiate interaction, if they cross paths
  // (i.e. on the next getNextMove) when interactWithOthers is called.

  return interactionChoices;
}

// interactions: {
//   endState: {},
// }
export function interactWithOthers(observer = {}, others = {}, world = {}) {
  const interactions = {
    endState: {},
  };

  if (observer.type === 'Dot' && world.type === 'DotWorld') {
    // Check for recipient states...
    const received = (world.recipientInteractions[observer.id])
        ? Object.assign({}, world.recipientInteractions[observer.id])
        : {};

    console.log(`recipientInteractions for ${observer.id} =>`, received);

    // Object.keys(others).forEach((otherID) => {
    //   const other = others[otherID];
    //   if (debug) console.log(`[interaction] ${observer.id} is interacting with ${other.id}`);
    // });

    // Iterate through all nearbyDots
    //   If received[otherID] => we are the recipient
    //   Otherwise => we are the initiator (if we choose to interact)
    /*
    if (received) {
      // Iterate through all recipient interactions, aggregating to the endState...
      delete world.recipientInteractions[observer.id];
      interactions.endState.totalInteractions = observer.totalInteractions + 1;
    } else {
      // Add recipient interaction...
      // const recipientID = other.id;
      // world.recipientInteractions[recipientID] = recipientInteraction;

      interactions.endState.totalInteractionsInitiated = observer.totalInteractionsInitiated + 1;
      interactions.endState.totalInteractions = observer.totalInteractions + 1;
    }
    */
  }

  return interactions;
}
/*
export function performInteraction(initiator = {}, recipient = {}, world = {}) {
  const interaction = {
    endState: {},
  };

  return interaction;
}
*/
// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot
// -----------------------------------------------------------
//
// -----------------------------------------------------------
// TODO: Return an object registry instead (a copy) !!!
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
// export function getNearbyDots(dot = {}, world = {}) {
//   const nearby = [];
//
//   if (dot.type === 'Dot' && world.type === 'DotWorld') {
//     const registry = world.dotRegistry;
//
//     Object.keys(registry).forEach((dotID) => {
//       if (dotID !== dot.id) {
//         const other = registry[dotID];
//         if (isDotInRange(dot, other)) nearby.push(other);
//       }
//     });
//   }
//
//   return nearby;
// }

export function isDotInRange(observer = {}, other = {}, visionDepth = 1) {
  let result = false;

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const distance = visionDepth * observer.width;
    const myNorthSight = (observer.y1 - 1) - distance;
    const myEastSight = (observer.x1 + 1) + distance;
    const mySouthSight = (observer.y2 + 1) + distance;
    const myWestSight = (observer.x2 - 1) - distance;

    if (debug && verbose) {
      console.log(`[interaction] ${observer.id} isDotInRange (${visionDepth}) -------------------------------`);
      console.log(`myNorthSight: ${myNorthSight}`);
      console.log(`myEastSight: ${myEastSight}`);
      console.log(`mySouthSight: ${mySouthSight}`);
      console.log(`myWestSight: ${myWestSight}`);
      console.log(`other.x2: ${other.x2}`);
      console.log(`other.x1: ${other.x1}`);
      console.log(`other.y2: ${other.y2}`);
      console.log(`other.y1: ${other.y1}`);
      console.log('-------------------------------------------------------');
    }

    if (other.x2 > myWestSight && other.x1 < myEastSight &&
        other.y2 > myNorthSight && other.y1 < mySouthSight) {
      result = true;
    }
  }

  return result;
}
