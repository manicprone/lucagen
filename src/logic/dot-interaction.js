// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';

const debug = false;
const verbose = false;

// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot
// -----------------------------------------------------------
//
// -----------------------------------------------------------
export function getNearbyDots(dot = {}, world = {}) {
  const nearby = [];

  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    const registry = world.dotRegistry;

    Object.keys(registry).forEach((dotID) => {
      if (dotID !== dot.id) {
        const other = registry[dotID];
        if (isDotInRange(dot, other)) nearby.push(other);
      }
    });
  }

  return nearby;
}

export function isDotInRange(observer = {}, other = {}) {
  let result = false;

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const distance = observer.visionDepth * observer.width;
    const myNorthSight = (observer.y1 - 1) - distance;
    const myEastSight = (observer.x1 + 1) + distance;
    const mySouthSight = (observer.y2 + 1) + distance;
    const myWestSight = (observer.x2 - 1) - distance;

    if (debug && verbose) {
      console.log(`[interaction] [${observer.id}] isDotInRange -------------------------------`);
      console.log(`my visionDepth: ${observer.visionDepth}`);
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
