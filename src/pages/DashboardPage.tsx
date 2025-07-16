import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { createMealDraft } from "../features/meals/api/mealService";
import { useDraftStore } from "../store/draftStore";

const DashboardPage = () => {
  const { user } = useAuth();
  const { addDraft } = useDraftStore((state) => state.actions);

  const [mealInput, setMealInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <h1>Welcome, {user?.email}!</h1>
      <p>
        This is your dashboard. You can view your meal history or log a new meal
        below.
      </p>

      <hr style={{ margin: "2rem 0" }} />

      {/* --- MEAL SUBMISSION FORM --- */}
      <section>
        <h2>Log a New Meal</h2>
        <p>Describe what you ate, and we'll analyse it for you.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <textarea
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="e.g., Two slices of sourdough toast with a poached egg and half an avocado..."
            rows={4}
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Generating..." : "Generate Meal"}
          </button>
          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>Error: {error}</p>
          )}
        </form>
      </section>
    </div>
  );
};

export default DashboardPage;
