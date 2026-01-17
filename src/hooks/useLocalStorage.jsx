import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue='') {
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
    if(value === null)
      localStorage.removeItem(key)
    else if(typeof(value) === 'string')
      localStorage.setItem(key, value);
    else{
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
  }, [value]);

  return [value, setValue];
}
