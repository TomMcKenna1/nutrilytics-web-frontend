import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  checkDraftStatus,
  saveDraftAsMeal,
  discardMealDraft,
} from "../../features/meals/api/mealService";
import { useDraftStore } from "../../store/draftStore";
import type { NutrientProfile } from "../../features/meals/types";
import { MealComponentsList } from "../../features/meals/components/MealComponentList";
import { TotalNutritionCard } from "../../features/meals/components/TotalNutritionCard/TotalNutritionCard";

import styles from "./DraftPage.module.css";

export const DraftPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const { updateDraft, removeDraft } = useDraftStore((state) => state.actions);
  const draft = useDraftStore((s) => (draftId ? s.drafts[draftId] : undefined));
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNutrients: NutrientProfile | null =
    draft?.status !== "complete" || !draft.mealDraft?.nutrientProfile
      ? null
      : draft.mealDraft.nutrientProfile;
  const totalWeight = (draft?.mealDraft?.components ?? []).reduce(
    (total, component) => total + component.totalWeight,
    0
  );

  useEffect(() => {
    if (!draftId) {
      navigate("/404", { replace: true });
      return;
    }
    if (isSaving || isDiscarding) {
      return;
    }
    if (!draft || draft.status === "pending") {
      setIsFetching(true);
      checkDraftStatus(draftId)
        .then((freshData) => {
          const { id, ...update } = freshData;
          updateDraft(id, update);
        })
        .catch((err: unknown) => {
          navigate("/404", { replace: true });
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [draftId, draft, updateDraft, navigate, isSaving, isDiscarding]);

  const handleSaveMeal = async () => {
    if (!draftId) return;
    setIsSaving(true);
    setError(null);
    try {
      const newMeal = await saveDraftAsMeal(draftId);
      removeDraft(draftId);
      navigate(`/meal/${newMeal.id}`);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      // Only reset state on error, allowing unmount on success
      setIsSaving(false);
    }
  };

  const handleDiscardMeal = async () => {
    if (!draftId) return;
    setIsDiscarding(true);
    setError(null);
    try {
      await discardMealDraft(draftId);
      removeDraft(draftId);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      // Only reset state on error, allowing unmount on success
      setIsDiscarding(false);
    }
  };

  const renderContent = () => {
    if (isFetching || (!draft && !error) || draft?.status === "pending") {
      return (
        <div className={styles.loadingContainer}>
          <h2 className={styles.statusHeader}>Loading Draft...</h2>
          <p className={styles.description}>
            Just a moment while we analyse your meal details. Feel free to leave
            this page.
          </p>
          <div className={styles.loader}></div>
        </div>
      );
    }
    if (error) {
      return <p className={styles.errorText}>Error: {error}</p>;
    }
    if (!draft) {
      return null;
    }

    switch (draft.status) {
      case "error":
        return (
          <div className={styles.errorContainer}>
            <h2 className={styles.statusHeader}>Generation Failed ❌</h2>
            <p className={styles.errorText}>
              Unfortunately, we couldn't analyze this meal draft.
              {draft.error && <strong> Reason: {draft.error}</strong>}
            </p>
            <div className={styles.actionsContainer}>
              <button
                onClick={handleDiscardMeal}
                disabled={isDiscarding}
                className={`${styles.button} ${styles.discardButton}`}
              >
                {isDiscarding ? "Discarding..." : "Discard Draft"}
              </button>
            </div>
          </div>
        );
      case "complete":
        if (!draft.mealDraft) return <p>Meal data is missing.</p>;
        return (
          <>
            <h2 className={styles.statusHeader}>{draft.mealDraft.name}</h2>
            <p className={styles.description}>{draft.mealDraft.description}</p>
            <div className={styles.contentGrid}>
              <MealComponentsList components={draft.mealDraft.components} />
              {totalNutrients && (
                <TotalNutritionCard
                  totals={totalNutrients}
                  mealWeight={totalWeight}
                />
              )}
            </div>
            <div className={styles.actionsContainer}>
              <button
                onClick={handleSaveMeal}
                disabled={isSaving || isDiscarding}
                className={`${styles.button} ${styles.saveButton}`}
              >
                {isSaving ? "Saving..." : "Save Meal"}
              </button>
              <button
                onClick={handleDiscardMeal}
                disabled={isSaving || isDiscarding}
                className={`${styles.button} ${styles.discardButton}`}
              >
                {isDiscarding ? "Discarding..." : "Discard Draft"}
              </button>
            </div>
          </>
        );
      default:
        return <p>Unknown draft status.</p>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.draftCard}>
        <h1 className={styles.title}>Draft Review</h1>
        {renderContent()}
        <Link to="/" className={styles.backLink}>
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default DraftPage;