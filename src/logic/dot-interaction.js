// -------------------------------------------------------------
// dot-interaction.js
//
// Logic for Dot interactions.
// -------------------------------------------------------------
// import objectUtils from '../utils/object-utils';
import * as dotMovement from './dot-movement';

const debug = true;
// const verbose = true;

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
        if (debug) console.log(`[interaction] "${observer.id}" is evaluating interaction with ${other.id}`);

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

        const contract = negotiateStepContract(observer, other, isWillingToInteract);

        // Record contract...
        observer.stepContracts[other.id] = contract; // eslint-disable-line no-param-reassign
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
//   observer: {
//     nextDirection: 'n',
//     intent: 'follow' | 'meet' | 'avoid',
//     satisfied: true | false
//   }
// }
export function negotiateStepContract(observer = {}, other = {}, isWillingToInteract = false) {
  const stepContract = {
    observer: {},
    recipient: {},
  };

  if (observer.type === 'Dot' && other.type === 'Dot') {
    // Check for existing step contract initiated by other...
    const contract = (other.stepContracts[observer.id])
        ? Object.assign({}, other.stepContracts[observer.id])
        : null;

    if (contract) {
      if (debug) console.log(`[interaction] "${observer.id}" has an existing step contract with ${other.id} =>`, contract);

      // Obtain contract from other, and mark as satisfied...
      Object.assign(stepContract.observer, contract.observer, { satisfied: true });
      Object.assign(stepContract.recipient, contract.recipient, { satisfied: true });
    } else {
      if (debug) console.log(`[interaction] "${observer.id}" is creating a step contract with ${other.id}`);

      // decide to: meet -or- avoid
      const meet = isWillingToInteract;
      if (meet) {
        Object.assign(stepContract.observer, { intent: 'meet', satisfied: false });
        Object.assign(stepContract.recipient, { intent: 'meet', satisfied: false });
        // negotiate place to meet
      } else {
        Object.assign(stepContract.observer, { intent: 'avoid', satisfied: false });
        Object.assign(stepContract.recipient, { intent: 'avoid', satisfied: false });
        if (dotMovement.isDotApproachingHeadOn(observer, other)) {
          // initiator chooses avoid step (if possible)
        }
      }
    } // end-if-else (contract)
  }

  return stepContract;
}
