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
export const CONTAGION_STRENGTH = 0.05; // per-tick pull toward neighbor average
