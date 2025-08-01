import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logWeight,
  deleteWeightLog,
} from "../features/weightLogging/api/weightLoggingService";
import type { WeightLogCreate } from "../features/weightLogging/types";

export const useWeightLogs = () => {
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
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
    },
  });

  const { mutate: removeWeightLog } = useMutation({
    mutationFn: (logId: string) => deleteWeightLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
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
