// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';
import * as dotMovement from './dot-movement';

const debug = true;
const verbose = true;

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

    // Look for nearby dots...
    const nearbyDots = dotMovement.getNearbyDots(observer, others, 2);
    if (nearbyDots.length > 0) {
      if (debug) console.log(`[interaction] "${observer.id}" is nearby ${nearbyDots.length} dot(s)`);

      // Iterate through all nearby...
      nearbyDots.forEach((other) => {
        if (debug) console.log(`[interaction] "${observer.id}" is evaluating interaction with "${other.id}"`);

        // Check for existing recipient states...
        // const received = (other.recipientInteractions[observer.id])
        //     ? Object.assign({}, other.recipientInteractions[observer.id])
        //     : null;

        const isWillingToInteract = isWillingToInteractWithDot(observer, other);

        if (isWillingToInteract) {
          // if (debug) console.log(`[interaction] "${observer.id}" is interacting with ${other.id}`);
          // [performInteraction logic]
          // if principal interaction (we are initiator -or- recipient)
          //    perform interaction
          //    create step contract
          // else we have existing step contract
          //    perform interaction
          //    update contract
        }

        const contract = negotiateStepContract(observer, other, world, isWillingToInteract);

        // Record contract...
        Object.assign(observer.stepContract, contract);
      });
    } // end-if (nearbyDots.length > 0)
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

export function isWillingToInteractWithDot(/* observer = {}, other = {} */) {
  const interact = false;
  // if (observer.type === 'Dot' && other.type === 'Dot') {
  // }
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

// stepContract: {
//   leader: <dotID> | null,
//   members: {
//     <dotID>: {
//       nextDirection: 'e',
//       resumeDirection: 'n',
//       intent: 'lead' | 'follow' | 'meet' | 'avoid',
//       satisfied: true | false,
//     },
//   },
// }
export function negotiateStepContract(observer = {}, other = {}, world = {}, isWillingToInteract = false) {
  const stepContract = {
    leader: null,
    members: {},
  };

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const otherContracts = other.stepContract;

    // Check if observer has existing step contract with other...
    const contract = (objectUtils.has(otherContracts, `members[${observer.id}]`))
        ? Object.assign({}, otherContracts.members[observer.id])
        : null;

    // --------------------
    // Existing contract...
    // --------------------
    if (contract) {
      if (debug) console.log(`[interaction] "${observer.id}" has an existing step contract with "${other.id}" =>`, contract);
      stepContract.members[observer.id] = {};
      stepContract.members[other.id] = {};

      // Obtain contract from other, and mark as satisfied...
      Object.assign(stepContract.members[observer.id], contract, { satisfied: true });  // save our agreement
      Object.assign(stepContract.members[other.id], otherContracts.members[other.id], { satisfied: true }); // save copy of other's agreement

    // ---------------
    // New contract...
    // ---------------
    } else {
      if (debug) console.log(`[interaction] "${observer.id}" is creating a step contract with "${other.id}"`);
      stepContract.members[observer.id] = {};
      stepContract.members[other.id] = {};

      // Determine if a meetup is desired...
      const meet = isWillingToInteract;
      if (meet) {
        // Create a step contract to meetup...
        Object.assign(stepContract.members[observer.id], { intent: 'meet', satisfied: false });
        Object.assign(stepContract.members[other.id], { intent: 'meet', satisfied: false });
        // TODO: negotiate place to meet
      } else {
        // Create a step contract to ignore attempts for interaction...
        Object.assign(stepContract.members[observer.id], { intent: 'avoid', satisfied: false });
        Object.assign(stepContract.members[other.id], { intent: 'avoid', satisfied: false });

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
          const otherDirection = { nextDirection: other.currentDirection, resumeDirection: other.currentDirection };
          Object.assign(stepContract.members[observer.id], observerDirection);
          Object.assign(stepContract.members[other.id], otherDirection);
        } // end-if (dotMovement.isDotApproachingHeadOn)
      } // end-if-else (meet)
    } // end-if-else (contract)
  }

  return stepContract;
}
