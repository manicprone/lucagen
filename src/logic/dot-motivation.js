// -------------------------------------------------------------
// dot-motivation.js
//
// Logic for Dot motivations.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';
// import * as dotMovement from './dot-movement';

// const debug = true;
// const verbose = true;

// step: {
//   intent: 'avoid',
//   resumeX: 136,
//   resumeY: 9,
//   resumeDirection: 'n',
//   statisfied: false,
// }
export function addStepConviction(observer = {}, stepConviction = {}) {
  const conviction = Object.assign({}, stepConviction, { satisfied: false });
  delete conviction.nextDirection;
  Object.assign(observer.convictions, { step: conviction });
}
