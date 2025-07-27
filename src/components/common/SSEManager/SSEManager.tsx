import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../../lib/firebase";
import { sseService } from "../../../lib/sseService";

/**
 * A headless component that manages the lifecycle of the Server-Sent Events
 * connection by listening directly to Firebase's authentication state.
 */
export const SSEManager = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          sseService.initialize(queryClient);
          sseService.connect(token);
        } catch (error) {
          console.error("Error getting auth token for SSE:", error);
          sseService.disconnect();
        }
      } else {
        sseService.disconnect();
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

  return null;
};