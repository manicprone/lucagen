// -----------------------------------------------------------------------------
// DotWorld Logic
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------
// Within a World, a Dot continuously:
// -----------------------------------------------------------------------------
//
// (1) Calculates the moves he perceives are available to him.
//
//     (based upon his current view of the world, others, and himself)
//
//
// (2) Chooses his next move.
//
//     (based upon his current motivation/emotional state and
//     the current state of the world as perceived by him)
//
//
// (3) Applies the move, interacting with other Dots nearby.
//     
//    
// (4) Evaluates the result of his move.
//
//     (based upon his interactions/exchanges with other Dots
//     and the current state of the world as reflected upon him)
//
//     evaluates:
//       - others, individually
//       - the world as a whole
//       - his "self"
//
// -----------------------------------------------------------------------------
// A Dot will stop moving if:
// -----------------------------------------------------------------------------
//
// + He perceives he has no moves available.
//
//     -or-
//
// + He does not have sufficient motivation to choose a move.
//
// -----------------------------------------------------------------------------
//
//  Dot.chooseNextMove
//   |   |
//   |   |__ chooseNextMove
//   |        |
//   |        |__ getNearbyDots
//   |        |__ calculateAvailableSteps
//   |        |__ chooseToInteractWithDots (for each nearby)
//   |
//   V
//  Dot.applyMove
//   |   |
//   |   |__ interactWithDot (for all active interactions)
//   |
//   V
//  Dot.evaluate
//
// -----------------------------------------------------------------------------
//
// + The World data is a copy per each Dot (their own perception)
//
// + The Dot data is shared by reference (to affect each other)
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
