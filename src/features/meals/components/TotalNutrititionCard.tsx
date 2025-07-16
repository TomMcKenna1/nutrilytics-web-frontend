import React from "react";
import { type NutrientProfile } from "../types";

interface TotalNutritionCardProps {
  totals: NutrientProfile;
}

export const TotalNutritionCard = ({ totals }: TotalNutritionCardProps) => {
  // temp styles
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      padding: "1.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      backgroundColor: "#f7fafc",
    },
    title: {
      margin: "0 0 1rem 0",
      fontSize: "1.25rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.75rem",
    },
    nutrient: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.9rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e2e8f0",
    },
    label: { color: "#4a5568" },
    value: { fontWeight: "bold" },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Total Nutrition</h3>
      <div style={styles.grid}>
        <div>
          <div style={styles.nutrient}>
            <span style={styles.label}>Energy</span>
            <span style={styles.value}>{totals.energy.toFixed(0)} kcal</span>
          </div>
          <div style={styles.nutrient}>
            <span style={styles.label}>Protein</span>
            <span style={styles.value}>{totals.protein.toFixed(1)} g</span>
          </div>
        </div>
        <div>
          <div style={styles.nutrient}>
            <span style={styles.label}>Carbs</span>
            <span style={styles.value}>
              {totals.carbohydrates.toFixed(1)} g
            </span>
          </div>
          <div style={styles.nutrient}>
            <span style={styles.label}>Fats</span>
            <span style={styles.value}>{totals.fats.toFixed(1)} g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
