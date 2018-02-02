# The Lucagen Project

> The chaotic art of life.

<br />

## WIP

Not demonstration-ready.

<br />

## DotWorld

### Premise

[TBC]

### The World of a Dot

[TBC]

### Overview

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

#### Attributes

| Attribute | Value     | Description |
| ----------|-----------|-------------|
| polarity  | 'U' or 'D' | The natural tendency for a Dot's vertical movement (up or down / N or S). |
| chirality | 'L' or 'R' | The natural tendency for a Dot's horizontal movement (left or right / W or E) |


### The Life of a Dot

[TBC]

```
// -----------------------------------------------------------------------------
// The motivation of a Dot
// -----------------------------------------------------------------------------
// (1) To keep stimulated and avoid listlessness
// (2) To seek a higher level of pride
//
// -----------------------------------------------------------------------------
// The life of a Dot
// -----------------------------------------------------------------------------
// Make a move: getNextMove((endState) => applyMove(endState))
//
// (1) Determine physical movement (step or stay still)
//     ------------------------------------------------
//     (a) Look for interaction (if feeling social)
//                -or-
//         Avoid interaction (if feeling anti-social)
//
//     (b) Avoid walls and collisions
//
// (2) Interact (if interaction occurs)
//     --------------------------------
//     (a) Exchange with other(s)
//
//     (b) Evaluate other(s) individually
//
//     (c) Evaluate world as a whole
//         (based on evaluation of all others up to this point)
//
// (3) Evaluate self
//     -------------
//     (a) Assess all emotional states
//
//     (b) Qualify motivation in world
//
//     (c) Calculate level of pride
// -----------------------------------------------------------------------------
```


### Dot Attributes

[TBC]

#### Identification and Intrinsic Nature

| Attribute | Value | Description |
| ----------|-------|-------------|
| id | | |
| name | | |
| width | | |
| height | | |
| speed | | |
| visionDepth | (positive integer) | The number of pixels in visual range. |
| memoryDepth | (positive integer) | The number of past steps that can be recalled. |


#### Location Management

| Attribute | Value | Description |
| ----------|-------|-------------|
| birthLeft  | | |
| birthTop  | | |
| x1  | | |
| x2  | | |
| y1  | | |
| y2  | | |
| fromX  | | Transformation from origin (x). |
| fromY  | | Transformation from origin (y). |


#### Movement Management

| Attribute | Value | Description |
| ----------|-------|-------------|
| isAsleep | boolean | |
| currentDirection | | |
| moveShiftHistory | | |
| steps | (positive integer) | The total steps taken since birth. |


#### Interaction Management

| Attribute | Value | Description |
| ----------|-------|-------------|
| events | | The total count of events lapsed since birth (i.e. perceived time). |
| totalInteractions | | |
| totalInteractionsInitiated | | |
| recipientInteractions | | |
| stepContracts | | |


#### Motivational Management

[TBD]

| Attribute | Value | Description |
| ----------|-------|-------------|
| convictions | | |


#### Emotional Configuration

[TBD]

| Attribute | Value | Description |
| ----------|-------|-------------|
| | | |


### Functional Flow

[TBC]

```
  Dot.getNextMove
   |   |
   |   |__ interactWithOthers (create step contracts)
   |   |
   |   |__ chooseNextStep (manage step contracts)
   |
   V
  Dot.applyMove
   |
   |
   V
  Dot.evaluate

```

### Visual Representation of Emotional State

[TBC]

#### Overview

| Structure | Description |
| ----------|-------------|
| ![Dot Emotional Config (High-Level)](/static/dot-emotional-config-HL.png) | [TBC - Description on the high-level structuring of a Dot's emotional config] |


#### Social Quadrants

| Structure | Description |
| ----------|-------------|
| ![Dot Social Quandrants](/static/dot-emotional-config-quadrants.png) |[TBC - Description on the social quadrants and how they are calculated] |


#### Representation of Value

The emotional quadrants fill out over time, from central pixel outwards (radially)... representing a flower-like bloom.

| Quadrant | Intensity | Permanence (over time) |
| ---------|-----------|------------|
| dual hue scale (per pole) | saturation | opacity |

<br />

The pride factor follows the same scheme, filling out the cross shape between the quadrant petals.


### Step Contracts

[TBC]

### Convictions

[TBC]
