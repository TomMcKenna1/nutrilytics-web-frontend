import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logWeight,
  deleteWeightLog,
} from "../features/weightLogging/api/weightLoggingService";
import type { WeightLogCreate } from "../features/weightLogging/types";

/**
 * Provides mutations for creating and deleting weight logs.
 */
export const useWeightLogMutations = () => {
  const queryClient = useQueryClient();

  const {
    mutate: submitWeightLog,
    isPending: isLogging,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: (payload: WeightLogCreate) => logWeight(payload),
    onSuccess: () => {
      // When a new log is added, refetch the data to update charts and displays.
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
      queryClient.invalidateQueries({ queryKey: ["weightForecast"] });
    },
  });

  const { mutate: removeWeightLog } = useMutation({
    mutationFn: (logId: string) => deleteWeightLog(logId),
    onSuccess: () => {
      // Also refetch when a log is removed.
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
      queryClient.invalidateQueries({ queryKey: ["weightForecast"] });
    },
  });

  return {
    submitWeightLog,
    isLogging,
    isSuccess,
    isError,
    error,
    reset,
    removeWeightLog,
  };
};
