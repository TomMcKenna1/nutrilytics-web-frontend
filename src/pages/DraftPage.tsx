import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { checkDraftStatus } from "../features/meals/api/mealService";
import { useDraftStore } from "../store/draftStore";
import type {
  MealDraftResponse,
  NutrientProfile,
} from "../features/meals/types";
import { MealComponentsList } from "../features/meals/components/MealComponentList";
import { TotalNutritionCard } from "../features/meals/components/TotalNutrititionCard";

export const DraftPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const { updateDraft } = useDraftStore((state) => state.actions);

  // Get meal from local cache first
  const cachedDraft = useDraftStore((s) =>
    draftId ? s.drafts[draftId] : undefined
  );

  const [liveDraft, setLiveDraft] = useState<MealDraftResponse | null>(() => {
    if (!cachedDraft) return null;
    return {
      status: cachedDraft.status,
      meal: cachedDraft.mealData,
      uid: "",
    };
  });

  const [isLoading, setIsLoading] = useState(!cachedDraft);
  const [error, setError] = useState<string | null>(null);

  const totalNutrients = useMemo((): NutrientProfile | null => {
    if (liveDraft?.status !== "complete" || !liveDraft.meal?.components) {
      return null;
    }
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

    return liveDraft.meal.components.reduce((totals, component) => {
      totals.energy += component.nutrientProfile.energy;
      totals.fats += component.nutrientProfile.fats;
      totals.protein += component.nutrientProfile.protein;
      totals.carbohydrates += component.nutrientProfile.carbohydrates;
      //  Add more later
      return totals;
    }, initialTotals);
  }, [liveDraft]);

  useEffect(() => {
    if (!draftId) {
      setError("No draft ID provided.");
      setIsLoading(false);
      return;
    }

    // Fetch the latest data from backend in the background.
    checkDraftStatus(draftId)
      .then((freshData) => {
        setLiveDraft(freshData);
        if (freshData.status !== "pending") {
          updateDraft(draftId, {
            status: freshData.status,
            mealData: freshData.meal,
          });
        }
      })
      .catch((err) => {
        setError((err as Error).message);
      })
      .finally(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      });
  }, [draftId, updateDraft, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading draft...</p>;
    }

    if (error) {
      return <p style={{ color: "red" }}>Error: {error}</p>;
    }

    if (!liveDraft) {
      return <p>Could not find draft information.</p>;
    }

    switch (liveDraft.status) {
      case "pending":
        return (
          <div>
            <h2>Analyzing Your Meal... ⏳</h2>
            <p>
              This draft is still being processed. Our global poller is checking
              on it. Try refreshing in a moment.
            </p>
          </div>
        );
      case "error":
        return (
          <div>
            <h2>Generation Failed ❌</h2>
            <p>Unfortunately, we couldn't analyze this meal draft.</p>
          </div>
        );
      case "complete":
        if (!liveDraft.meal) return <p>Meal data is missing.</p>;
        return (
          <div>
            <h2>{liveDraft.meal.name}</h2>
            <p style={{ color: "#4a5568" }}>{liveDraft.meal.description}</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "2rem",
                marginTop: "2rem",
              }}
            >
              <MealComponentsList components={liveDraft.meal.components} />
              {totalNutrients && <TotalNutritionCard totals={totalNutrients} />}
            </div>
          </div>
        );
      default:
        return <p>Unknown draft status.</p>;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Draft Review</h1>
      {renderContent()}
      <Link to="/" style={{ display: "inline-block", marginTop: "2rem" }}>
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default DraftPage;
