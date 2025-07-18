import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getMeal } from "../features/meals/api/mealService";
import type { MealResponse, NutrientProfile } from "../features/meals/types";

import { MealComponentsList } from "../features/meals/components/MealComponentList";
import { TotalNutritionCard } from "../features/meals/components/TotalNutritionCard";

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

  // 2. Reuse the exact same calculation logic for total nutrition
  const totalNutrients = useMemo((): NutrientProfile | null => {
    if (!meal?.components) return null;

    const initialTotals: NutrientProfile = {
      energy: 0,
      fats: 0,
      saturatedFats: 0,
      carbohydrates: 0,
      sugars: 0,
      fibre: 0,
      protein: 0,
      salt: 0,
      containsDairy: false,
      containsHighDairy: false,
      containsGluten: false,
      containsHighGluten: false,
      containsHistamines: false,
      containsHighHistamines: false,
      containsSulphites: false,
      containsHighSulphites: false,
      containsSalicylates: false,
      containsHighSalicylates: false,
      containsCapsaicin: false,
      containsHighCapsaicin: false,
      isProcessed: false,
      isUltraProcessed: false,
    };

    return meal.components.reduce((totals, component) => {
      totals.energy += component.nutrientProfile.energy;
      totals.fats += component.nutrientProfile.fats;
      totals.protein += component.nutrientProfile.protein;
      totals.carbohydrates += component.nutrientProfile.carbohydrates;
      return totals;
    }, initialTotals);
  }, [meal?.components]);

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
        {/* This link sets up our next step: editing a saved meal */}
        <Link to={`/meal/${meal.id}/edit`}>Edit Meal</Link>
      </div>

      <p style={{ color: "#4a5568" }}>{meal.description}</p>

      {/* 3. Reuse our components to build a consistent UI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <MealComponentsList components={meal.components} />
        {totalNutrients && <TotalNutritionCard totals={totalNutrients} />}
      </div>

      <Link to="/" style={{ display: "inline-block", marginTop: "2rem" }}>
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MealPage;
