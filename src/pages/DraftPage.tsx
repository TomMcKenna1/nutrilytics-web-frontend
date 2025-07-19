import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  checkDraftStatus,
  saveDraftAsMeal,
  discardMealDraft,
} from "../features/meals/api/mealService";
import { useDraftStore } from "../store/draftStore";
import type {
  MealDraftResponse
} from "../features/meals/types";
import { MealComponentsList } from "../features/meals/components/MealComponentList";
import { TotalNutritionCard } from "../features/meals/components/TotalNutritionCard";

export const DraftPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const { updateDraft, removeDraft } = useDraftStore((state) => state.actions);
  const navigate = useNavigate();

  // Get meal from local cache first
  const cachedDraft = useDraftStore((s) =>
    draftId ? s.drafts[draftId] : undefined
  );

  const [liveDraft, setLiveDraft] = useState<MealDraftResponse | null>(() => {
    if (!cachedDraft) return null;
    return {
      id: cachedDraft.id,
      status: cachedDraft.status,
      mealDraft: cachedDraft.mealDraft,
      uid: "",
    };
  });

  const [isLoading, setIsLoading] = useState(!cachedDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNutrients =
    liveDraft?.status !== "complete" || !liveDraft.mealDraft?.nutrientProfile
      ? null
      : liveDraft.mealDraft.nutrientProfile;

  useEffect(() => {
    if (!draftId) {
      setError("No draft ID provided.");
      setIsLoading(false);
      return;
    }

    checkDraftStatus(draftId)
      .then((freshData) => {
        setLiveDraft(freshData);
        if (freshData.status !== "pending") {
          updateDraft(draftId, {
            status: freshData.status,
            mealDraft: freshData.mealDraft,
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

  const handleSaveMeal = async () => {
    if (!draftId) return;

    setIsSaving(true);
    setError(null);

    try {
      const newMeal = await saveDraftAsMeal(draftId);
      removeDraft(draftId);
      navigate(`/meal/${newMeal.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
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
      setError((err as Error).message);
    } finally {
      setIsDiscarding(false);
    }
  };

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
            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={handleDiscardMeal}
                disabled={isDiscarding}
                style={{
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {isDiscarding ? "Discarding..." : "Discard Draft"}
              </button>
            </div>
          </div>
        );
      case "complete":
        if (!liveDraft.mealDraft) return <p>Meal data is missing.</p>;
        return (
          <div>
            <h2>{liveDraft.mealDraft.name}</h2>
            <p style={{ color: "#4a5568" }}>
              {liveDraft.mealDraft.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "2rem",
                marginTop: "2rem",
              }}
            >
              <MealComponentsList components={liveDraft.mealDraft.components} />
              {totalNutrients && <TotalNutritionCard totals={totalNutrients} />}
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={handleSaveMeal}
                disabled={isSaving || isDiscarding}
                style={{
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {isSaving ? "Saving..." : "Save Meal"}
              </button>
              <button
                onClick={handleDiscardMeal}
                disabled={isSaving || isDiscarding}
                style={{
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {isDiscarding ? "Discarding..." : "Discard Draft"}
              </button>
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
