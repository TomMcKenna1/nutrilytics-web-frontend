import { useState, useEffect } from "react";

// This threshold determines how much the viewport must shrink to be considered "keyboard open".
// This prevents minor UI changes (like browser toolbars appearing) from being counted.
const KEYBOARD_THRESHOLD_RATIO = 0.8;

/**
 * A hook that detects whether the on-screen keyboard is visible by monitoring
 * the browser's visual viewport.
 * @returns `true` if the keyboard is likely visible, otherwise `false`.
 */
export const useKeyboardVisibility = (): boolean => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // This logic should only run on the client side.
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      if (!window.visualViewport) return;
      // If the visual viewport height is significantly smaller than the overall window
      // height, we can assume the on-screen keyboard is visible.
      const isKeyboardOpen =
        window.visualViewport.height <
        window.innerHeight * KEYBOARD_THRESHOLD_RATIO;
      setKeyboardVisible(isKeyboardOpen);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    handleResize(); // Run on mount to get initial state

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return isKeyboardVisible;
};
