import { useEffect, useState } from "react";
import { getDailySummary } from "../api/summaryService";
import { type DailySummary as IDailySummary } from "../types";

export const DailySummary = () => {
  const [summary, setSummary] = useState<IDailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDailySummary();
        setSummary(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return <p>Loading summary...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div>
      <h3>Today's Nutrition at a Glance</h3>
      {summary ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><strong>Meals Logged:</strong> {summary.mealsLogged}</li>
          <li><strong>Energy:</strong> {summary.energy.toFixed(0)} kcal</li>
          <li><strong>Fat:</strong> {summary.fats.toFixed(1)} g</li>
          <li><strong>Saturated Fat:</strong> {summary.saturatedFats.toFixed(1)} g</li>
          <li><strong>Carbohydrates:</strong> {summary.carbohydrates.toFixed(1)} g</li>
          <li><strong>Sugars:</strong> {summary.sugars.toFixed(1)} g</li>
          <li><strong>Fibre:</strong> {summary.fibre.toFixed(1)} g</li>
          <li><strong>Protein:</strong> {summary.protein.toFixed(1)} g</li>
          <li><strong>Salt:</strong> {summary.salt.toFixed(1)} g</li>
        </ul>
      ) : (
        <p>No summary data available.</p>
      )}
    </div>
  );
};