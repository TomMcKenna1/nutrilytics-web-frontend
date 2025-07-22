import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getMeal } from "../../features/meals/api/mealService";
import type { MealResponse } from "../../features/meals/types";

import { MealComponentsList } from "../../features/meals/components/MealComponentsList/MealComponentsList";
import { TotalNutritionCard } from "../../features/meals/components/TotalNutritionCard/TotalNutritionCard";
import styles from "./MealPage.module.css";

export const MealPage = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const { user } = useAuth();

  const [meal, setMeal] = useState<MealResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mealId || !user) {
      setError("Cannot load meal. Missing ID or user information.");
      setIsLoading(false);
      return;
    }

    getMeal(mealId)
      .then((mealData) => {
        if (mealData) {
          setMeal(mealData);
        } else {
          setError("Meal not found or you do not have permission to view it.");
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false));
  }, [mealId, user]);

  const totalNutrients = !meal?.components ? null : meal.nutrientProfile;
  const totalWeight = (meal?.components ?? []).reduce(
    (total, component) => total + component.totalWeight,
    0,
  );

  if (isLoading) return <p className={styles.centered}>Loading meal...</p>;
  if (error)
    return (
      <p className={`${styles.centered} ${styles.error}`}>Error: {error}</p>
    );
  if (!meal) return <p className={styles.centered}>Meal not found.</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{meal.name}</h1>
          <p className={styles.description}>{meal.description}</p>
        </div>
        <Link to={`/meal/${meal.id}/edit`} className={styles.editButton}>
          Edit Meal
        </Link>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.componentsSection}>
          <h2 className={styles.sectionTitle}>
            Components ({meal.components.length})
          </h2>
          <MealComponentsList components={meal.components} />
        </div>

        {totalNutrients && (
          <aside className={styles.nutritionSummary}>
            <TotalNutritionCard
              totals={totalNutrients}
              mealWeight={totalWeight}
            />
          </aside>
        )}
      </main>

      <Link to="/" className={styles.backLink}>
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MealPage;
