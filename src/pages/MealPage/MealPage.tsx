import { useParams, useNavigate } from "react-router-dom";
import { useMeal } from "../../hooks/useMeals";
import { useDailySummary } from "../../hooks/useDailySummary";
import MealLayout from "../../components/layout/MealLayout/MealLayout";
import type { MealDB, MealType } from "../../features/meals/types";
import styles from "./MealPage.module.css";
import layoutStyles from "../../components/layout/MealLayout/MealLayout.module.css";

/**
 * Parses the flexible 'createdAt' field into a standard Date object.
 */
const parseCreatedAt = (createdAt: MealDB["createdAt"]): Date | null => {
  if (!createdAt) return null;
  if (typeof createdAt === "string") {
    // Handles ISO date strings like "2025-07-27T12:53:44.864000Z"
    return new Date(createdAt);
  }
  if (typeof createdAt === "number") {
    // Handles Unix timestamps (assuming they are in seconds)
    return new Date(createdAt * 1000);
  }
  if (createdAt?._seconds) {
    // Handles Firestore timestamp objects
    return new Date(createdAt._seconds * 1000);
  }
  return null;
};

/**
 * Checks if a given Date object represents today's date.
 */
const isDateToday = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  return date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
};

const Loader = () => (
  <div className={styles.loadingContainer}>
    <h2 className={styles.statusHeader}>Analyzing your meal...</h2>
    <p className={styles.description}>
      This can take a moment. The page will update automatically when it's
      ready.
    </p>
    <div className={styles.loader}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export const MealPage = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();

  const {
    meal,
    isLoading,
    error,
    deleteMeal,
    isDeleting,
    addComponent,
    isAddingComponent,
    removeComponent,
    isRemovingComponent,
    updateMealType,
    isUpdatingMealType,
  } = useMeal(mealId);

  const { data: dailySummary, isLoading: summaryIsLoading } = useDailySummary();

  const handleDeleteMeal = async () => {
    if (!mealId) return;
    await deleteMeal(mealId);
    navigate("/");
  };

  const handleAddComponent = async (description: string) => {
    await addComponent(description);
  };

  const handleDeleteComponent = async (componentId: string) => {
    await removeComponent(componentId);
  };

  const handleMealTypeChange = async (newType: MealType) => {
    if (!mealId) return;
    await updateMealType(newType);
  };

  if (isLoading || summaryIsLoading) {
    return <p className={styles.centered}>Loading meal...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.centered} ${styles.error}`}>Error: {error}</p>
    );
  }

  if (!meal) {
    return <p className={styles.centered}>Meal not found.</p>;
  }

  if (meal.status === "pending" && !meal.data) {
    return <Loader />;
  }

  if (meal.status === "error") {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.statusHeader}>Generation Failed ❌</h2>
        <p className={styles.errorText}>
          Unfortunately, we couldn't analyze this meal.
          {meal.error && <strong> Reason: {meal.error}</strong>}
        </p>
        <div className={styles.actionsContainer}>
          <button
            onClick={handleDeleteMeal}
            disabled={isDeleting}
            className={`${layoutStyles.button} ${layoutStyles.secondary}`}
          >
            {isDeleting ? "Deleting..." : "Delete Meal"}
          </button>
        </div>
      </div>
    );
  }

  if (meal.data) {
    const isProcessing =
      isDeleting ||
      isAddingComponent ||
      isRemovingComponent ||
      isUpdatingMealType ||
      meal.status === "pending_edit";

    const createdAtDate = parseCreatedAt(meal.createdAt);

    const mealActions = (
      <>
        <button
          onClick={handleDeleteMeal}
          disabled={isProcessing}
          className={`${layoutStyles.button} ${layoutStyles.secondary}`}
        >
          {isDeleting ? "Deleting..." : "Delete Meal"}
        </button>
      </>
    );

    return (
      <MealLayout
        title={meal.data.name}
        description={meal.data.description}
        actions={mealActions}
        components={meal.data.components}
        nutrientProfile={meal.data.nutrientProfile}
        dailySummary={dailySummary}
        showDailyImpact={isDateToday(createdAtDate)}
        onDeleteComponent={handleDeleteComponent}
        isEditing={isProcessing}
        onAddComponent={handleAddComponent}
        mealType={meal.data.type}
        onMealTypeChange={handleMealTypeChange}
      />
    );
  }

  return <p className={styles.centered}>Could not display meal.</p>;
};

export default MealPage;
