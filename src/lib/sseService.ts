import { QueryClient } from "@tanstack/react-query";
import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
import type { MealDB } from "../features/meals/types";

let authToken: string | null = null;

class SSEService {
  private ctrl: AbortController | null = null;
  private queryClient: QueryClient | null = null;

  public initialize(client: QueryClient): void {
    this.queryClient = client;
  }

  public connect(token: string): void {
    if (this.ctrl) {
      return;
    }

    authToken = token;
    this.ctrl = new AbortController();

    console.log("SSE: Connecting to meal stream...");

    fetchEventSource("/api/v1/meals/stream", {
      signal: this.ctrl.signal,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      onopen: async (response) => {
        if (response.ok) {
          console.log("SSE: Connection opened.");
          return;
        }
        throw new Error(`SSE failed to open with status ${response.status}`);
      },
      onmessage: (event) => {
        if (event.event === "meal_update") {
          this.handleMealUpdate(event);
        }
      },
      onclose: () => {
        console.log("SSE: Connection closed by server.");
      },
      onerror: (err) => {
        console.error("SSE: Connection error:", err);
        throw err;
      },
    });
  }

  public disconnect(): void {
    if (this.ctrl) {
      console.log("SSE: Disconnecting from meal stream...");
      this.ctrl.abort();
      this.ctrl = null;
      authToken = null;
    }
  }

  private handleMealUpdate = (event: EventSourceMessage): void => {
    if (!this.queryClient) return;

    try {
      const updatedMeal: MealDB = JSON.parse(event.data);
      console.log("SSE: Received meal_update", updatedMeal);

      this.queryClient.setQueryData(["meal", updatedMeal.id], updatedMeal);

      this.queryClient.invalidateQueries({ queryKey: ["mealsList"] });
      this.queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
    } catch (error) {
      console.error("SSE: Error parsing meal_update data", error);
    }
  };
}

export const sseService = new SSEService();
