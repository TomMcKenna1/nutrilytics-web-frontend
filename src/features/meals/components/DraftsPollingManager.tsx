import { useMemo, useEffect } from "react";
import { Query, useQueries, useQueryClient } from "@tanstack/react-query";
import { useMealDrafts } from "../../../hooks/useMealDrafts";
import { checkDraftStatus } from "../api/mealService";
import type { Draft } from "../types";

const POLLING_INTERVAL_MS = 1000;

export const DraftsPollingManager = () => {
  const queryClient = useQueryClient();
  const { data: drafts } = useMealDrafts();

  const pendingDrafts = useMemo(() => {
    return drafts?.filter((d) => d.status === "pending") ?? [];
  }, [drafts]);

  const pollResults = useQueries({
    queries: pendingDrafts.map((draft) => ({
      queryKey: ["meal-draft", draft.id],
      queryFn: () => checkDraftStatus(draft.id),
      refetchInterval: (query: Query<Draft>) =>
        query.state.data?.status === "pending" ? POLLING_INTERVAL_MS : false,
    })),
  });

  const completedDraftsIdentifier = useMemo(
    () =>
      pollResults
        .filter((r) => r.isSuccess && r.data?.status !== "pending")
        .map((r) => r.data!.id)
        .join(","),
    [pollResults],
  );

  useEffect(() => {
    if (completedDraftsIdentifier) {
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
    }
  }, [completedDraftsIdentifier, queryClient]);

  return null;
};
