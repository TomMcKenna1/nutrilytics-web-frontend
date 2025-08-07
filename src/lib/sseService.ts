import { QueryClient } from "@tanstack/react-query";
import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
import type { MealDB } from "../features/meals/types";
import {
  getMonday,
  isDateToday,
  parseCreatedAt,
  toLocalDateString,
} from "../utils/dateUtils";

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

    fetchEventSource("/api/v1/meals/stream", {
      signal: this.ctrl.signal,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      openWhenHidden: true,

      onopen: async (response) => {
        if (!this.queryClient) return;

        if (response.ok) {
          this.queryClient.invalidateQueries({ queryKey: ["mealsList"] });
          return;
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          this.disconnect();
          throw new Error(`SSE failed with status ${response.status}`);
        }
      },
      onmessage: (event) => {
        if (event.event === "meal_update") {
          this.handleMealUpdate(event);
        }
      },
      onclose: () => {},
      onerror: () => {
        return 3000;
      },
    });
  }

  public disconnect(): void {
    if (this.ctrl) {
      this.ctrl.abort();
      this.ctrl = null;
      authToken = null;
    }
  }

  /**
   * Handles incoming meal updates by updating the specific meal cache
   * and invalidating relevant list and summary queries.
   */
  private handleMealUpdate = (event: EventSourceMessage): void => {
    if (!this.queryClient) return;

    try {
      const updatedMeal: MealDB = JSON.parse(event.data);
      this.queryClient.setQueryData(["meal", updatedMeal.id], updatedMeal);
      this.queryClient.invalidateQueries({ queryKey: ["mealsList"] });

      const createdAtDate = parseCreatedAt(updatedMeal.createdAt);

      if (isDateToday(createdAtDate)) {
        this.queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
      }
      if (createdAtDate) {
        const mealWeekMonday = toLocalDateString(getMonday(createdAtDate));
        this.queryClient.invalidateQueries({
          queryKey: ["weeklySummary", mealWeekMonday],
        });
      }
    } catch (error) {
      throw error;
    }
  };
}

export const sseService = new SSEService();
