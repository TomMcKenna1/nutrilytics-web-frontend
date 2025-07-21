import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createMealDraft } from '../features/meals/api/mealService';

/**
 * Provides a mutation for creating a new meal draft.
 * Handles cache invalidation and navigation on success.
 */
export const useCreateMealDraft = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (mealInput: string) => createMealDraft(mealInput),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['meal-drafts'] });
            navigate(`/draft/${data.draftId}`);
        },
        onError: (err) => {
            console.error("Failed to create meal draft:", err);
        }
    });
};