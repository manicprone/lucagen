// defaults.js — Centralized tuning constants

// --- World ---
export const WORLD_DEFAULT_WIDTH = 450;
export const WORLD_DEFAULT_HEIGHT = 270;
export const WORLD_DEFAULT_POLARITY = 'U';
export const WORLD_DEFAULT_CHIRALITY = 'R';

// --- Dot ---
export const DOT_SIZE = 30;
export const DOT_SPEED = 200; // ms per step (used for tick rate reference)
export const DOT_VISION_DEPTH = 3;
export const DOT_MEMORY_DEPTH = 5;

// --- Simulation ---
export const TICK_RATE = 10; // simulation ticks per second
export const TICK_INTERVAL = 1000 / TICK_RATE; // ms per tick

// --- Spatial Grid ---
export const SPATIAL_CELL_SIZE = 100; // pixels per cell

// --- Emotional ---
export const EMOTION_UNSET = -1;
export const EMOTION_MIN = 0;
export const EMOTION_MAX = 3;

// Contagion: how strongly nearby dots pull each other's emotions toward their average
export const CONTAGION_STRENGTH = 0.05; // per-tick blend factor (0..1)

// Stimulation: moving keeps a dot stimulated, idleness decays it
export const STIMULATION_GAIN = 0.15; // per-tick gain when moving
export const STIMULATION_DECAY = 0.08; // per-tick decay when idle

// Intrigue: novelty of path — new directions boost intrigue, repeated ones decay it
export const INTRIGUE_NOVELTY_GAIN = 0.12; // gain when direction is fresh
export const INTRIGUE_REPEAT_DECAY = 0.06; // decay when continuing same direction

// Comfort: proximity to walls reduces comfort (fear), open space increases it (safety)
export const COMFORT_WALL_THRESHOLD = 2; // within N steps of wall = uncomfortable
export const COMFORT_WALL_PENALTY = 0.10; // per-tick fear increase near walls
export const COMFORT_OPEN_GAIN = 0.04; // per-tick safety increase in open space

// Connectedness: recent interactions increase inclusion, isolation decays it
export const CONNECTEDNESS_INTERACTION_GAIN = 0.20; // gain per interaction
export const CONNECTEDNESS_ISOLATION_DECAY = 0.03; // per-tick decay without interaction

// Pride: aggregate of all emotional dimensions
export const PRIDE_AGGREGATE_WEIGHT = 0.25; // how much corners influence cross

// Interaction willingness thresholds
export const INTERACTION_CONNECTEDNESS_THRESHOLD = 1.0; // min g value to be willing
export const INTERACTION_STIMULATION_THRESHOLD = 0.5; // min s value to be willing

// Emotion transfer during interaction
export const EMOTION_TRANSFER_RATIO = 0.3; // fraction of dominant emotion transferred
