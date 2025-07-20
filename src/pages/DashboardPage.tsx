import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { createMealDraft } from "../features/meals/api/mealService";
import { useDraftStore } from "../store/draftStore";
import { MealDraftsList } from "../features/meals/components/MealDraftsList";
import { HistoricalMealsList } from "../features/meals/components/HistoricalMealList";
import { DailySummary } from "../features/metrics/components/DailySummary";

const DashboardPage = () => {
  const { user } = useAuth();
  const { addDraft } = useDraftStore((state) => state.actions);

  const [mealInput, setMealInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { draftId } = await createMealDraft(mealInput);
      addDraft(draftId, mealInput);
      console.log("Draft created with ID:", draftId);
      setMealInput("");
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1>{firstName ? `Welcome, ${firstName}!` : 'Welcome!'}</h1>

      <hr style={{ margin: "2rem 0" }} />
      
      {/* --- DAILY NUTRITION SUMMARY --- */}
      <section>
        <DailySummary />
      </section>

      <hr style={{ margin: "2rem 0" }} />
      
      <section>
        <h2 style={{marginTop: '2rem'}}>Recent Generations</h2>
        <MealDraftsList />
      </section>

      <section>
        <h2>Meal History</h2>
        <HistoricalMealsList />
      </section>
    </div>
  );
};

export default DashboardPage;
