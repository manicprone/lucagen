// -----------------------------------------------------------------------------
// DotWorld Logic
// -----------------------------------------------------------------------------
//
// Within a World, a Dot continuously:
//
// + Calculates the events he perceives are available to him.
//
//     (based upon his current view of the world/others and himself)
//
// + Chooses his next "move" (event).
//
//     (based upon his current motivation / emotional state and
//     the current state of the world as perceived by him)
//
//     comprised of move parts:
//       - step move         => physical movement
//       - interaction move  => interactions/exchanges with other Dots
//
// + Evaluates the result of this chosen event.
//
//     (based upon his interactions/exchanges with other Dots
//     and the current state of the world as reflected upon him)
//
//     evaluates:
//       - others, individually
//       - the world as a whole
//       - his "self"
//
// + Stops moving, if he perceives he has no events available or
//   if he does not have sufficient motivation to choose an event.
//
// -----------------------------------------------------------------------------
//
//  Dot.chooseNextMove                    (currently: dot.getNextMove)
//   |   |
//   |   |__ calculateAvailableEvents     (currently: determineAvailableMoves)
//   |        |
//   |        |__ getNearbyDots
//   |        |    |__ chooseToInteract
//   |        |         |__ interactWithDot
//   |        |
//   |        |__ calculateAvailableSteps
//   |
//   V
//  Dot.applyMove
//   |
//   |
//   V
//  Dot.evaluate
//
// -----------------------------------------------------------------------------
//
//   A world is shared amongst a set of Dots...
//
//        World
//    ______|_______
//   |    |    |    |
//  Dot  Dot  Dot  Dot        Each with their own view of its state...
//   |
//   |
//   |
//    ========>  Dot  Dot  Dot        Each with their own view of the others
//                                            with whom they have interacted.  
//
// -----------------------------------------------------------------------------
