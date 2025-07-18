import { useEffect, useRef } from 'react';
import { useDraftStore } from '../store/draftStore';
import { checkDraftStatus } from '../features/meals/api/mealService';

const POLLING_INTERVAL = 1000;

export const useMealDraftsPolling = () => {
  const { updateDraft } = useDraftStore((state) => state.actions);
  const pendingDraftsCount = useDraftStore((state) =>
    Object.values(state.drafts).filter((d) => d.status === 'pending').length
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const pollDrafts = () => {
      const { drafts } = useDraftStore.getState();
      const draftsToPoll = Object.values(drafts).filter(
        (d) => d.status === 'pending'
      );

      draftsToPoll.forEach(async (draft) => {
        try {
          const result = await checkDraftStatus(draft.id);
          if (result.status !== 'pending') {
            console.log(`Draft ${draft.id} is now ${result.status}.`);
            updateDraft(draft.id, {
              status: result.status,
              mealDraft: result.mealDraft,
            });
          }
        } catch (error) {
          console.error(`Failed to poll draft ${draft.id}:`, error);
          updateDraft(draft.id, { status: 'error', error: (error as Error).message });
        }
      });
    };

    if (pendingDraftsCount > 0 && intervalRef.current === null) {
      intervalRef.current = window.setInterval(pollDrafts, POLLING_INTERVAL);
    } else if (pendingDraftsCount === 0 && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pendingDraftsCount, updateDraft]);
};