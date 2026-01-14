/**
 * Check if OPFS is supported by the browser
 */
const isSupported = () => {
  return (
    typeof navigator !== "undefined" &&
    navigator.storage &&
    typeof navigator.storage.getDirectory === "function"
  );
}

export default isSupported