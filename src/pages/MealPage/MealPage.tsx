import { useParams, useNavigate } from "react-router-dom";
import { useMeal } from "../../hooks/useMeals";
import { useDailySummary } from "../../hooks/useDailySummary";
import { MealComponentsList } from "../../features/meals/components/MealComponentsList/MealComponentsList";
import { TotalNutritionCard } from "../../features/meals/components/TotalNutritionCard/TotalNutritionCard";
import { DailyTargetImpact } from "../../features/meals/components/DailyTargetImpact/DailyTargetImpact";
import { MealTypeSelector } from "../../features/meals/components/MealTypeSelector/MealTypeSelector";
import type { MealType } from "../../features/meals/types";
import { isDateToday, parseCreatedAt } from "../../utils/dateUtils";
import styles from "./MealPage.module.css";

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

  const handleAddComponent = (description: string) => addComponent(description);
  const handleDeleteComponent = (componentId: string) =>
    removeComponent(componentId);
  const handleMealTypeChange = (newType: MealType) => updateMealType(newType);

  if (isLoading || summaryIsLoading)
    return <p className={styles.centered}>Loading meal...</p>;
  if (error)
    return (
      <p className={`${styles.centered} ${styles.error}`}>Error: {error}</p>
    );
  if (!meal) return <p className={styles.centered}>Meal not found.</p>;
  if (meal.status === "pending" && !meal.data) return <Loader />;
  if (meal.status === "error") {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.statusHeader}>Generation Failed ❌</h2>
        <p className={styles.errorText}>
          Unfortunately, we couldn't analyze this meal.
          {meal.error && <strong> Reason: {meal.error}</strong>}
        </p>
        <div className={styles.pageActions}>
          <button
            onClick={() => navigate("/")}
            className={`${styles.button} ${styles.secondary}`}
          >
            Back to Meals
          </button>
          <button
            onClick={handleDeleteMeal}
            disabled={isDeleting}
            className={`${styles.button} ${styles.destructive}`}
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
    const showDailyImpact = isDateToday(createdAtDate);
    const mealWeight = meal.data.components.reduce(
      (sum, comp) => sum + comp.totalWeight,
      0
    );

    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageActions}>
          <button
            onClick={() => navigate("/")}
            className={`${styles.button} ${styles.secondary}`}
          >
            Back to Meals
          </button>
          <button
            onClick={handleDeleteMeal}
            disabled={isProcessing}
            className={`${styles.button} ${styles.destructive}`}
          >
            {isDeleting ? "Deleting..." : "Delete Meal"}
          </button>
        </div>

        <header className={styles.titleHeader}>
          <h1 className={styles.mealName}>{meal.data.name}</h1>
          <MealTypeSelector
            value={meal.data.type}
            onChange={handleMealTypeChange}
            disabled={isProcessing}
          />
          <p className={styles.mealDescription}>{meal.data.description}</p>
        </header>

        {showDailyImpact && dailySummary && (
          <section className={styles.impactSection}>
            <h2 className={styles.sectionTitle}>Impact on Daily Targets</h2>
            <div className={styles.impactCard}>
              <DailyTargetImpact
                summary={dailySummary}
                nutrientProfile={meal.data.nutrientProfile}
              />
            </div>
          </section>
        )}

        <main className={styles.mainContentGrid}>
          <section className={styles.mainColumn}>
            <h2 className={styles.sectionTitle}>Meal Components</h2>
            <MealComponentsList
              components={meal.data.components}
              onAddComponent={handleAddComponent}
              onDeleteComponent={handleDeleteComponent}
              isEditing={isProcessing}
            />
          </section>

          <aside className={styles.sidebarColumn}>
            <h2 className={styles.sectionTitle}>Total Nutrition</h2>
            <TotalNutritionCard
              totals={meal.data.nutrientProfile}
              mealWeight={mealWeight}
            />
          </aside>
        </main>
      </div>
    );
  }

  return <p className={styles.centered}>Could not display meal.</p>;
};

export default MealPage;
