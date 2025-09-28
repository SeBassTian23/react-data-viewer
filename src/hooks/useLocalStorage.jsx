import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue, writeDefaults = true) {
  // Initialize state from localStorage, or fallback to initialValue
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if(storedValue === null)
      return initialValue;
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      return storedValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    try {
      if(writeDefaults)
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}
