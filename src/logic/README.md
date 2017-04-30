# DotWorld Logic

---

## Within a World, a Dot continuously:

(1) Views the other Dots near him, choosing whether or not to interact.

(2) Chooses his next move.

(3) Applies the move.

(4) Evaluates the result of his move.

    evaluates:
    - others, individually
    - the world as a whole
    - his "self"


## A Dot will stop moving if:

---

* He perceives he has no moves available.

 -or-

* He does not have sufficient motivation to choose a move.


## Functional Flow

```
  Dot.getNextMove
   |   |
   |   |__ interactWithOthers (manage step contracts)
   |   |
   |   |__ chooseNextStep
   |
   V
  Dot.applyMove
   |
   |
   V
  Dot.evaluate

```

## DotWorld UI

```
 -----------------------------------------------------------------------------

   A world is shared amongst a set of Dots...

        World
    ______|_______
   |    |    |    |
  Dot  Dot  Dot  Dot        Each with their own view of its state...
   |
   |
   |
    ========>  Dot  Dot  Dot        Each with their own view of the others
                                            with whom they have interacted.  

 -----------------------------------------------------------------------------

```
