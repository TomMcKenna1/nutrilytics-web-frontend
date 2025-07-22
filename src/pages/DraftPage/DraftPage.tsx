import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMealDraft } from "../../hooks/useMealDraft";
import { MealComponentsList } from "../../features/meals/components/MealComponentsList/MealComponentsList";
import { TotalNutritionCard } from "../../features/meals/components/TotalNutritionCard/TotalNutritionCard";
import type { NutrientProfile } from "../../features/meals/types";
import styles from "./DraftPage.module.css";

export const DraftPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const { draft, isLoading, error, save, isSaving, discard, isDiscarding } =
    useMealDraft(draftId);

  useEffect(() => {
    if (error) {
      navigate("/404", { replace: true });
    }
  }, [error, navigate]);

  const handleSaveMeal = async () => {
    try {
      await save();
    } catch (e) {
      console.error("Failed to save meal:", e);
    }
  };

  const handleDiscardMeal = async () => {
    try {
      await discard();
    } catch (e) {
      console.error("Failed to discard meal:", e);
    }
  };

  const renderContent = () => {
    // Show loading state while fetching or polling
    if (isLoading || (draft?.status === "pending" && !draft.mealDraft)) {
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

    if (!draft) {
      return <p>Draft not found.</p>;
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
        const totalNutrients: NutrientProfile | null =
          draft.mealDraft.nutrientProfile;
        const totalWeight = draft.mealDraft.components.reduce(
          (t, c) => t + c.totalWeight,
          0,
        );

        return (
          <>
            <h2 className={styles.statusHeader}>{draft.mealDraft.name}</h2>
            <p className={styles.description}>{draft.mealDraft.description}</p>
            <div className={styles.contentGrid}>
              <div className={styles.componentsSection}>
                <h2 className={styles.sectionTitle}>
                  Components ({draft.mealDraft.components.length})
                </h2>
                <MealComponentsList components={draft.mealDraft.components} />
              </div>

              {totalNutrients && (
                <aside className={styles.nutritionSummary}>
                  <TotalNutritionCard
                    totals={totalNutrients}
                    mealWeight={totalWeight}
                  />
                </aside>
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
