import { useRef } from "react";

export default function useHoverMenu( setState, delay=250) {

  const timeoutRef = useRef(null);

  return {
    handleMouseEnter: () => {
      // Clear any existing timeout
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current);
      // Set a new timeout to show the element after set ms
      timeoutRef.current = setTimeout(() => {
        setState(true);
      }, 250);
    },
    handleMouseLeave: () =>{
      // Clear the timeout if the mouse leaves before the delay
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current);
      // Hide the element immediately
      setState(false);
    },
  };
}
