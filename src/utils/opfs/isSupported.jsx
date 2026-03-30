/**
 * Check if OPFS is supported by the browser
 * @returns boolean
 */
const isSupported = () => {
  return (
    typeof navigator !== "undefined" &&
    navigator.storage &&
    typeof navigator.storage.getDirectory === "function"
  );
}

export default isSupported