import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getMeal } from "../../features/meals/api/mealService";
import type { MealResponse } from "../../features/meals/types";
import MealLayout from "../../components/layout/MealLayout/MealLayout";
import layoutStyles from "../../components/layout/MealLayout/MealLayout.module.css";

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

  if (isLoading) {
    return <p className={layoutStyles.centered}>Loading meal...</p>;
  }

  if (error) {
    return (
      <p className={`${layoutStyles.centered} ${layoutStyles.error}`}>
        Error: {error}
      </p>
    );
  }

  if (!meal) {
    return <p className={layoutStyles.centered}>Meal not found.</p>;
  }

  // The "Edit" button is defined as an action to be passed to the layout.
  const mealActions = (
    <Link
      to={`/meal/${meal.id}/edit`}
      className={`${layoutStyles.button} ${layoutStyles.primary}`}
    >
      Edit Meal
    </Link>
  );

  // This call to MealLayout remains unchanged.
  // It will not show the impact section by default.
  return (
    <MealLayout
      title={meal.name}
      description={meal.description}
      actions={mealActions}
      components={meal.components}
      nutrientProfile={meal.nutrientProfile}
    />
  );
};

export default MealPage;