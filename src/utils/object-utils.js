// object-utils.js — Native JS replacements for Lodash shim

/**
 * Get a nested property value using dot-notation path, with optional default.
 * Equivalent to lodash.get(obj, path, defaultValue).
 */
export function get(obj, path, defaultValue = undefined) {
  if (obj == null) return defaultValue;
  const keys = typeof path === 'string' ? path.split('.') : [path];
  let result = obj;
  for (const key of keys) {
    if (result == null || typeof result !== 'object') return defaultValue;
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
}

/**
 * Check if an object has a property at the given path.
 * Equivalent to lodash.has(obj, path).
 */
export function has(obj, path) {
  if (obj == null) return false;
  const keys = typeof path === 'string' ? path.split('.') : [path];
  let current = obj;
  for (const key of keys) {
    if (current == null || !Object.hasOwn(current, key)) return false;
    current = current[key];
  }
  return true;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object).
 * Equivalent to lodash.isEmpty(value).
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if a collection includes a value.
 * Equivalent to lodash.includes(collection, value).
 */
export function includes(collection, value) {
  if (Array.isArray(collection)) return collection.includes(value);
  if (typeof collection === 'string') return collection.includes(value);
  if (typeof collection === 'object' && collection !== null) {
    return Object.values(collection).includes(value);
  }
  return false;
}

export default { get, has, isEmpty, includes };
