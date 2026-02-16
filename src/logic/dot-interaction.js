// dot-interaction.js — Logic for Dot interactions
//
// Handles step contract negotiation, collision avoidance,
// and interaction management between Dots.

import Logger from '../services/DotLogger.js';
import * as dotMovement from './dot-movement.js';

const debug = false;
const verbose = false;

// --- Main entry point ---

export function interactWithOthers(observer, world) {
  const interactions = { endState: {} };

  // Use spatial grid if available, fall back to legacy
  let nearbyDots;
  if (world.spatialGrid) {
    nearbyDots = dotMovement.getNearbyDotsSpatial(observer, world.spatialGrid);
  } else {
    nearbyDots = dotMovement.getNearbyDots(observer, world.dotRegistry, 2);
  }

  if (nearbyDots.length > 0) {
    if (debug) Logger.sub('interaction.interactWithOthers', `"${observer.id}" is nearby ${nearbyDots.length} dot(s)`);

    // Negotiate step contracts with all nearby dots
    for (const other of nearbyDots) {
      const contract = negotiateStepContract(observer, other, world);
      Object.assign(observer.stepContracts, contract);
    }
  }

  // Clean up stale step contracts
  if (observer.stepContracts.members) {
    const memberContracts = purgeMemberStepContracts(observer, nearbyDots);
    observer.stepContracts.members = memberContracts;
  }

  return interactions;
}

// --- Step contract negotiation ---
//
// stepContracts shape:
// {
//   leader: <dotID> | null,
//   personal: {
//     nextDirection, resumeDirection, resumeX, resumeY,
//     intent: 'lead' | 'follow' | 'meet' | 'avoid',
//     satisfied: true | false,
//   },
//   members: { <dotID>: { ...same shape... } },
// }

export function negotiateStepContract(observer, other, world) {
  const stepContracts = {};

  const myRecords = observer.stepContracts.members;
  const yourRecords = other.stepContracts.members;

  // Only negotiate if we don't have a contract on record yet
  if (!myRecords || !Object.hasOwn(myRecords, other.id)) {
    // Check if other has existing step contract for us
    const existingContract = yourRecords && Object.hasOwn(yourRecords, observer.id)
      ? { ...yourRecords[observer.id] }
      : null;

    if (existingContract) {
      // Adopt existing contract
      if (debug) Logger.sub('interaction.negotiateStepContract', `"${observer.id}" has an existing step contract with "${other.id}" to record`, existingContract);

      stepContracts.personal = existingContract;
      stepContracts.members = {};
      stepContracts.members[other.id] = other.stepContracts.personal;

    } else {
      // Create new contract
      if (debug) Logger.sub('interaction.negotiateStepContract', `"${observer.id}" is creating a step contract with "${other.id}"`);

      stepContracts.personal = {};
      stepContracts.members = {};
      stepContracts.members[other.id] = {};

      // Determine if a meetup is desired (Phase 3: gated by willingness)
      const meet = false;

      if (meet) {
        Object.assign(stepContracts.personal, { intent: 'meet', satisfied: false });
        Object.assign(stepContracts.members[other.id], { intent: 'meet', satisfied: false });
      } else {
        // Avoid interaction
        Object.assign(stepContracts.personal, { intent: 'avoid' });
        Object.assign(stepContracts.members[other.id], { intent: 'avoid' });

        // If collision appears imminent, determine step to take
        if (dotMovement.isDotApproachingHeadOn(observer, other)) {
          const steps = dotMovement.calculateAvailableSteps(observer, world);
          if (debug) {
            Logger.sub('interaction.negotiateStepContract', `"${observer.id}" is stepping to avoid "${other.id}"`);
            if (verbose) Logger.sub('interaction.negotiateStepContract', `"${observer.id}" has available steps`, steps);
          }

          // Determine possible lateral movements
          let avoidStep = observer.currentDirection;
          const avoidSteps = dotMovement.getOrthogonalDirections(observer.currentDirection);
          for (const lateralStep of avoidSteps) {
            if (steps.includes(lateralStep)) {
              avoidStep = lateralStep;
              break;
            }
          }

          if (debug) Logger.sub('interaction.negotiateStepContract', `"${observer.id}" is stepping ${avoidStep}`);

          const observerDirection = {
            nextDirection: avoidStep,
            resumeDirection: observer.currentDirection,
            resumeX: observer.x1,
            resumeY: observer.y1,
          };
          const otherDirection = { nextDirection: other.currentDirection };
          Object.assign(stepContracts.personal, observerDirection, { satisfied: false });
          Object.assign(stepContracts.members[other.id], otherDirection, { satisfied: true });
        }
      }
    }
  } else if (debug) {
    Logger.sub('interaction.negotiateStepContract', `"${observer.id}" has a step contract on record with "${other.id}"`);
  }

  return stepContracts;
}

// --- Contract cleanup ---
// Remove contracts for dots no longer in range

export function purgeMemberStepContracts(observer, others = []) {
  const memberContracts = {};

  const existingMemberContracts = observer.stepContracts.members || {};
  const memberContractIDs = Object.keys(existingMemberContracts);

  if (memberContractIDs.length > 0) {
    const otherIDs = new Set(others.map(o => o.id));

    for (const otherID of memberContractIDs) {
      if (otherIDs.has(otherID)) {
        memberContracts[otherID] = existingMemberContracts[otherID];
      } else if (debug && verbose) {
        Logger.sub('interaction.purgeMemberStepContracts', `"${observer.id}" is purging old step contract with "${otherID}"`);
      }
    }
  }

  return memberContracts;
}

// --- Interaction stubs (Phase 3) ---

export function isWillingToInteractWithDot(/* observer, other */) {
  return false;
}

export function performInteraction(/* initiator, recipient, world */) {
  return {
    initiatorEndState: {},
    recipientEndState: {},
  };
}
