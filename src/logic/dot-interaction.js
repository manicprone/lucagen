// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';
import * as dotMovement from './dot-movement';

const debug = true;
const verbose = true;

// interactions: {
//   endState: {},
// }
export function interactWithOthers(observer = {}, world = {}) {
  const interactions = {
    endState: {},
  };

  const others = world.dotRegistry;

  // Look for nearby dots...
  const nearbyDots = dotMovement.getNearbyDots(observer, others, 2);
  if (nearbyDots.length > 0) {
    if (debug) console.log(`[interaction] "${observer.id}" is nearby ${nearbyDots.length} dot(s)`);

    // Iterate through all nearby, and try to negotiate a step contract...
    nearbyDots.forEach((other) => {
      const contract = negotiateStepContract(observer, other, world);

      // Record contract...
      Object.assign(observer.stepContracts, contract);
    });
  } // end-if (nearbyDots.length > 0)

  // Clean-up any unnecessary step contracts...
  if (objectUtils.has(observer.stepContracts, 'members')) {
    // Object.assign(observer.stepContracts, purgeOldStepContracts(observer, nearbyDots));
  }

  return interactions;
}
// export function interactWithOthers(observer = {}, world = {}) {
//   const interactions = {
//     endState: {},
//   };
//
//   if (observer.type === 'Dot' && world.type === 'DotWorld') {
//     const others = world.dotRegistry;
//
//     // Look for adjacent dots...
//     const adjacentDots = getNearbyDots(observer, others, 1);
//     if (adjacentDots.length > 0) {
//       if (debug) console.log(`[interaction] "${observer.id}" encountered ${adjacentDots.length} adjacent dot(s)`);
//
//       // Iterate through all adjacent...
//       adjacentDots.forEach((other) => {
//         if (debug) console.log(`[interaction] "${observer.id}" is interacting with ${other.id}`);
//
//         // Check for existing recipient states...
//         const received = (other.recipientInteractions[observer.id])
//             ? Object.assign({}, other.recipientInteractions[observer.id])
//             : null;
//
//         // If interaction already exists, we are the recipient...
//         if (received) {
//           if (debug && verbose) console.log(`[interaction] "${observer.id}" is recipient of interaction with ${other.id} =>`, received);
//           delete other.recipientInteractions[observer.id]; // eslint-disable-line no-param-reassign
//
//           // Update observer endState...
//           Object.assign(interactions.endState, received);
//           interactions.endState.totalInteractions = observer.totalInteractions + 1;
//
//         // Otherwise, we are the initiator...
//         } else {
//           const interaction = performInteraction(observer, other, world);
//           if (debug && verbose) console.log(`[interaction] "${observer.id}" is inititator of interaction with ${other.id} =>`, interaction);
//
//           // Record interaction endState for recipient...
//           observer.recipientInteractions[other.id] = interaction.recipientEndState; // eslint-disable-line no-param-reassign
//
//           // Update observer endState...
//           Object.assign(interactions.endState, interaction.initiatorEndState);
//           interactions.endState.totalInteractionsInitiated = observer.totalInteractionsInitiated + 1;
//           interactions.endState.totalInteractions = observer.totalInteractions + 1;
//         }
//       });
//     } // end-if (adjacentDots.length > 0)
//   }
//
//   return interactions;
// }

// stepContracts: {
//   leader: <dotID> | null,
//   personal: {
//     nextDirection: 'e',
//     resumeDirection: 'n',
//     resumeX | resumeY: 9,
//     intent: 'lead' | 'follow' | 'meet' | 'avoid',
//     satisfied: true | false,
//   },
//   members: {
//     <dotID>: {
//       nextDirection: 'e',
//       resumeDirection: 'n',
//       resumeX | resumeY: 9,
//       intent: 'lead' | 'follow' | 'meet' | 'avoid',
//       satisfied: true | false,
//     },
//   },
// }
export function negotiateStepContract(observer = {}, other = {}, world = {}) {
  const stepContracts = {};

  // Access existing step contracts...
  const myRecords = observer.stepContracts.members;
  const yourRecords = other.stepContracts.members;

  // Determine negotiation, if we don't have a contract on record yet...
  if (!objectUtils.has(myRecords, other.id)) {
    // Check if other has existing step contract for us...
    const existingContract = (objectUtils.has(yourRecords, observer.id))
        ? Object.assign({}, yourRecords[observer.id])
        : null;

    // --------------------
    // Existing contract...
    // --------------------
    if (existingContract) {
      if (debug) console.log(`[interaction] "${observer.id}" has an existing step contract with "${other.id}" to record =>`, existingContract);

      // Save contract into our records...
      stepContracts.personal = existingContract;
      stepContracts.members = {};
      stepContracts.members[other.id] = other.stepContracts.personal;

    // ---------------
    // New contract...
    // ---------------
    } else {
      if (debug) console.log(`[interaction] "${observer.id}" is creating a step contract with "${other.id}"`);
      stepContracts.personal = {};
      stepContracts.members = {};
      stepContracts.members[other.id] = {};

      // Determine if a meetup is desired...
      const meet = false;
      if (meet) {
        // Create a step contract to meetup...
        Object.assign(stepContracts.personal, { intent: 'meet', satisfied: false });
        Object.assign(stepContracts.members[other.id], { intent: 'meet', satisfied: false });
        // TODO: negotiate place to meet
      } else {
        // Create a step contract to ignore attempts for interaction...
        Object.assign(stepContracts.personal, { intent: 'avoid' });
        Object.assign(stepContracts.members[other.id], { intent: 'avoid' });

        // If a collision appears imminent, determine step to take...
        if (dotMovement.isDotApproachingHeadOn(observer, other)) {
          const steps = dotMovement.calculateAvailableSteps(observer, world);
          if (debug) {
            console.log(`[interaction] "${observer.id}" is stepping to avoid "${other.id}"`);
            if (verbose) console.log(`[interaction] "${observer.id}" has available steps =>`, steps);
          }

          // Determine possible lateral movements...
          let avoidStep = observer.currentDirection;
          const avoidSteps = dotMovement.getOrthogonalDirections(observer.currentDirection);
          for (let i = 0; i < avoidSteps.length; i++) {
            if (objectUtils.includes(steps, avoidSteps[i])) {
              avoidStep = avoidSteps[i];
              break;
            }
          }

          // TODO: If observer cannot step, see if other can step instead !!!
          if (debug) console.log(`[interaction] "${observer.id}" is stepping ${avoidStep}`);

          // Record directions...
          const observerDirection = { nextDirection: avoidStep, resumeDirection: observer.currentDirection };
          if (avoidStep === 'n' || avoidStep === 's') observerDirection.resumeX = observer.x1;
          if (avoidStep === 'e' || avoidStep === 'w') observerDirection.resumeY = observer.y1;
          const otherDirection = { nextDirection: other.currentDirection };
          Object.assign(stepContracts.personal, observerDirection, { satisfied: false });
          Object.assign(stepContracts.members[other.id], otherDirection, { satisfied: true });
        } // end-if (dotMovement.isDotApproachingHeadOn)
      } // end-if-else (meet)
    } // end-if-else (existingContract)
  } else if (debug) {
    console.log(`[interaction] "${observer.id}" has a step contract on record with "${other.id}"`);
  } // end-if-elseif (!objectUtils.has(myRecords, other.id))

  return stepContracts;
}

// ----------------------------------------------------------------------
// Purges step contracts that are no longer necessary...
// ----------------------------------------------------------------------
// Iterates through all existing step contracts of the observer,
// and removes:
//
// - any contracts that are not related to the provided "others".
// ----------------------------------------------------------------------
export function purgeOldStepContracts(observer = {}, others = []) {
  const stepContracts = {
    members: {},
  };

  const memberContracts = observer.stepContracts.members;
  const personalContract = memberContracts[observer.id]; // TODO: Move out of members !!!
  const memberContractIDs = Object.keys(memberContracts);

  // console.log(`!!!!! [interaction] "${observer.id}" is looking to purge old step contracts (personal) =>`, personalContract);

  // Purge personal step contract if already satisfied...
  // if (personalContract && personalContract.satisfied === true) {
  //   console.log(`!!!!! [interaction] "${observer.id}" purging satisfied personal contract`);
  //   observer.stepContracts.members[observer.id] = null; // eslint-disable-line no-param-reassign
  // }

  stepContracts.members[observer.id] = personalContract;

  // Check if observer has existing contracts with others...
  if (memberContractIDs.length > 0) {
    // Build array of other IDs...
    const otherIDs = [];
    others.forEach((other) => {
      otherIDs.push(other.id);
    });

    // Iterate through member contracts, keeping only relevant ones...
    memberContractIDs.forEach((otherID) => {
      if (otherID !== observer.id && !objectUtils.includes(otherIDs, otherID)) {
        stepContracts.members[otherID] = observer.stepContracts.members[otherID];

        if (otherID !== observer.id) console.log(`!!!!! [interaction] "${observer.id}" purging old contract with "${otherID}"`);
      }
    });
  } // end-if (memberContractIDs.length > 0)

  return stepContracts;
}
// export function purgeOldStepContracts(observer = {}, others = []) {
//   const memberContracts = objectUtils.get(observer.stepContracts, 'members', {});
//   const personalContract = memberContracts[observer.id];
//   const memberContractIDs = Object.keys(memberContracts);
//
//   console.log(`!!!!! [interaction] "${observer.id}" is looking to purge old step contracts (personal) =>`, personalContract);
//
//   // Purge personal step contract if already satisfied...
//   if (personalContract && personalContract.satisfied === true) {
//     console.log(`!!!!! [interaction] "${observer.id}" purging satisfied personal contract`);
//     observer.stepContracts.members[observer.id] = null; // eslint-disable-line no-param-reassign
//   }
//
//   // Check if observer has existing contracts with others...
//   if (memberContractIDs.length > 1) {
//     // Build array of other IDs...
//     const otherIDs = [];
//     others.forEach((other) => {
//       otherIDs.push(other.id);
//     });
//
//     // Iterate through member contracts, removing if not related to others...
//     memberContractIDs.forEach((memberID) => {
//       if (memberID !== observer.id && !objectUtils.includes(otherIDs, memberID)) {
//         delete observer.stepContracts.members[memberID]; // eslint-disable-line no-param-reassign
//
//         console.log(`!!!!! [interaction] "${observer.id}" purging old contract with "${memberID}"`);
//       }
//     });
//   } // end-if (memberContractIDs.length > 1)
// }

export function isWillingToInteractWithDot(/* observer = {}, other = {} */) {
  const interact = false;
  return interact;
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
