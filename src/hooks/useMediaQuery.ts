import { useState, useEffect } from "react";

/**
 * A production-grade hook to track whether a CSS media query matches.
 * It uses the modern `matchMedia` API for performance and handles
 * server-side rendering (SSR) gracefully.
 * @param query The media query string to match (e.g., '(max-width: 768px)').
 * @returns `true` if the query matches, otherwise `false`.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this code only runs on the client, where `window` is available.
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    // Add the event listener in a way that's compatible with modern browsers.
    media.addEventListener("change", listener);

    // Cleanup function to remove the listener when the component unmounts.
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};
