// dot-motivation.js — Logic for Dot motivations

// step conviction shape:
// {
//   intent: 'avoid',
//   resumeX: 136,
//   resumeY: 9,
//   resumeDirection: 'n',
//   satisfied: false,
// }
export function addStepConviction(observer, stepConviction) {
  const conviction = { ...stepConviction, satisfied: false };
  delete conviction.nextDirection;
  observer.convictions.step = conviction;
}
