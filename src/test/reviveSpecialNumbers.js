/**
 * Ensure correct representation of values from JSON
 * in JavaScript that was returned by Python.
 * @param {*} value 
 * @returns 
 */
export default function reviveSpecialNumbers(value) {
  if (value === "NaN") return NaN;
  if (value === "Infinity") return Infinity;
  if (value === "-Infinity") return -Infinity;

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = reviveSpecialNumbers(value[i]);
    }
    return value;
  }

  if (value !== null && typeof value === "object") {
    for (const key of Object.keys(value)) {
      value[key] = reviveSpecialNumbers(value[key]);
    }
    return value;
  }

  return value;
}