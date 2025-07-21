import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getMeal } from "../features/meals/api/mealService";
import type { MealResponse } from "../features/meals/types";

import { MealComponentsList } from "../features/meals/components/MealComponentList";
import { TotalNutritionCard } from "../features/meals/components/TotalNutritionCard/TotalNutritionCard";

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

  if (isLoading) return <p>Loading meal...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!meal) return <p>Meal not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{meal.name}</h1>
        <Link to={`/meal/${meal.id}/edit`}>Edit Meal</Link>
      </div>

      <p style={{ color: "#4a5568" }}>{meal.description}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <MealComponentsList components={meal.components} />
        {totalNutrients && (
          <TotalNutritionCard
            totals={totalNutrients}
            mealWeight={totalWeight}
          />
        )}
      </div>

      <Link to="/" style={{ display: "inline-block", marginTop: "2rem" }}>
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MealPage;
