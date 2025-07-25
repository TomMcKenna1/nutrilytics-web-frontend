import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMealDraft } from "../../hooks/useMealDraft";
import { useQuery } from "@tanstack/react-query";
import { getDailySummary } from "../../features/metrics/api/summaryService";
import MealLayout from "../../components/layout/MealLayout/MealLayout";
import layoutStyles from "../../components/layout/MealLayout/MealLayout.module.css";
import styles from "./DraftPage.module.css";

export const DraftPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();

  const {
    draft,
    isLoading,
    error,
    save,
    isSaving,
    discard,
    isDiscarding,
    removeComponent,
    isRemovingComponent,
  } = useMealDraft(draftId);

  const {
    data: summary,
    isLoading: summaryIsLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["dailySummary"],
    queryFn: getDailySummary,
  });

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

  const handleDeleteComponent = async (componentId: string) => {
    try {
      await removeComponent(componentId);
    } catch (err) {
      console.error("Failed to delete component:", err);
    }
  };

  if (
    isLoading ||
    summaryIsLoading ||
    (draft?.status === "pending" && !draft.mealDraft)
  ) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <h2 className={styles.statusHeader}>Analyzing your meal...</h2>
          <p className={styles.description}>
            This can take a moment. Feel free to leave this page and come back.
          </p>
          <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  if (draft?.status === "error") {
    return (
      <div className={styles.pageContainer}>
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
              className={`${layoutStyles.button} ${layoutStyles.secondary}`}
            >
              {isDiscarding ? "Discarding..." : "Discard Draft"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h2 className={styles.statusHeader}>Error</h2>
          <p className={styles.errorText}>
            Could not load daily summary. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (draft?.status === "complete" && draft.mealDraft && summary) {
    const { mealDraft } = draft;
    const isProcessing = isSaving || isDiscarding || isRemovingComponent;

    const draftActions = (
      <>
        <button
          onClick={handleSaveMeal}
          disabled={isProcessing}
          className={`${layoutStyles.button} ${layoutStyles.primary}`}
        >
          {isSaving ? "Saving..." : "Save Meal"}
        </button>
        <button
          onClick={handleDiscardMeal}
          disabled={isProcessing}
          className={`${layoutStyles.button} ${layoutStyles.secondary}`}
        >
          {isDiscarding ? "Discarding..." : "Discard Draft"}
        </button>
      </>
    );

    return (
      <MealLayout
        title={mealDraft.name}
        description={mealDraft.description}
        actions={draftActions}
        components={mealDraft.components}
        nutrientProfile={mealDraft.nutrientProfile}
        dailySummary={summary}
        showDailyImpact={true}
        isDraft={true}
        onDeleteComponent={handleDeleteComponent}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <p>Draft not found.</p>
      <Link to="/" className={layoutStyles.backLink}>
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default DraftPage;
