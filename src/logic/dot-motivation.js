// -------------------------------------------------------------
// dot-motivation.js
//
// Logic for Dot motivations.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';
// import * as dotMovement from './dot-movement';

// const debug = true;
// const verbose = true;

// stepConviction: {
//   intent: 'avoid',
//   resumeX | resumeY: 9,
//   resumeDirection: 'n',
//   statisfied: true | false,
// }
// TODO: Set satisfied: true !!!
export function addStepConviction(observer = {}, stepConviction = {}) {
  Object.assign(observer.convictions, { step: stepConviction });
}
