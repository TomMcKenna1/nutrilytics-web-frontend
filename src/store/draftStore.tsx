import { create } from 'zustand';
import type { Draft } from '../features/meals/types';

interface DraftStoreState {
  drafts: Record<string, Draft>;
  actions: {
    addDraft: (draftId: string, originalInput: string, uid: string) => void;
    updateDraft: (
      draftId: string,
      update: Partial<Omit<Draft, 'id' | 'originalInput' | 'uid'>>
    ) => void;
    removeDraft: (draftId: string) => void;
  };
}

export const useDraftStore = create<DraftStoreState>((set) => ({
  drafts: {},
  actions: {
    addDraft: (draftId, originalInput, uid) =>
      set((state) => ({
        drafts: {
          ...state.drafts,
          [draftId]: {
            id: draftId,
            uid: uid,
            originalInput,
            status: 'pending',
            mealDraft: null,
            createdAt: Date.now() / 1000,
          },
        },
      })),
    
    updateDraft: (draftId, update) =>
      set((state) => {
        if (!state.drafts[draftId]) return state;
        return {
          drafts: {
            ...state.drafts,
            [draftId]: { ...state.drafts[draftId], ...update },
          },
        };
      }),

    removeDraft: (draftId) =>
      set((state) => {
        const newDrafts = { ...state.drafts };
        delete newDrafts[draftId];
        return { drafts: newDrafts };
      }),
  },
}));

export const draftActions = useDraftStore.getState().actions;