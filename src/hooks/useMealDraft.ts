import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  checkDraftStatus,
  saveDraftAsMeal,
  discardMealDraft,
  removeComponentFromDraft,
  addComponentToDraft,
} from "../features/meals/api/mealService";
import type { Draft, MealResponse } from "../features/meals/types";

export const useMealDraft = (draftId: string | undefined) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = ["meal-draft", draftId];

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!draftId) throw new Error("Draft ID is required to save.");
      return saveDraftAsMeal(draftId);
    },
    onSuccess: (newMeal: MealResponse) => {
      queryClient.invalidateQueries({ queryKey: ["dailySummary"] });
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.removeQueries({ queryKey });
      navigate(`/meal/${newMeal.id}`);
    },
  });

  const discardMutation = useMutation({
    mutationFn: () => {
      if (!draftId) throw new Error("Draft ID is required to discard.");
      return discardMealDraft(draftId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
      queryClient.removeQueries({ queryKey });
      navigate("/");
    },
  });

  const removeComponentMutation = useMutation({
    mutationFn: (componentId: string) => {
      if (!draftId)
        throw new Error("Draft ID is required to remove a component.");
      return removeComponentFromDraft(draftId, componentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const addComponentMutation = useMutation({
    mutationFn: (description: string) => {
      if (!draftId) throw new Error("Draft ID is required to add a component.");
      return addComponentToDraft(draftId, { description });
    },
    onSuccess: (updatedDraft: Draft) => {
      queryClient.setQueryData(queryKey, updatedDraft);
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { isPending: isSaving } = saveMutation;
  const { isPending: isDiscarding } = discardMutation;
  const { isPending: isRemovingComponent } = removeComponentMutation;
  const { isPending: isAddingComponent } = addComponentMutation;

  const draftQuery = useQuery({
    queryKey,
    queryFn: () => {
      if (!draftId) throw new Error("Draft ID is required.");
      return checkDraftStatus(draftId);
    },
    enabled: !!draftId && !isSaving && !isDiscarding && !isAddingComponent,
    refetchInterval: (query) => {
      const data = query.state.data as Draft | undefined;
      if (data?.status === "pending" || data?.status === "pending_edit") {
        return 3000;
      }
      return false;
    },
  });

  useEffect(() => {
    const data = draftQuery.data;
    if (data && (data.status === "complete" || data.status === "error")) {
      queryClient.invalidateQueries({ queryKey: ["meal-drafts"] });
    }
  }, [draftQuery.data, queryClient]);

  return {
    draft: draftQuery.data,
    isLoading: draftQuery.isLoading,
    error: draftQuery.error,
    save: saveMutation.mutateAsync,
    isSaving,
    discard: discardMutation.mutateAsync,
    isDiscarding,
    removeComponent: removeComponentMutation.mutateAsync,
    isRemovingComponent,
    addComponent: addComponentMutation.mutateAsync,
    isAddingComponent,
  };
};
