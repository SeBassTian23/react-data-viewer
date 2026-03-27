export default function sanitizeToString(value, fallback = '') {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return fallback;
    }
  }
  return String(value);
}