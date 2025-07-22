import React from "react";
import type { NutrientProfile } from "../../types";
import styles from "./TotalNutritionCard.module.css";

interface TotalNutritionCardProps {
  totals: NutrientProfile;
  mealWeight: number;
}

export const TotalNutritionCard: React.FC<TotalNutritionCardProps> = ({
  totals,
  mealWeight,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Total Meal Nutrition</h3>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Weight</span>
          <span className={styles.summaryValue}>{mealWeight.toFixed(0)}g</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Energy</span>
          <span className={styles.summaryValue}>
            {totals.energy.toFixed(0)}kcal
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Protein</span>
          <span className={styles.summaryValue}>
            {totals.protein.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Carbohydrates</span>
          <span className={styles.summaryValue}>
            {totals.carbohydrates.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Fats</span>
          <span className={styles.summaryValue}>{totals.fats.toFixed(1)}g</span>
        </div>
      </div>
      <div className={styles.nutrientDetails}>
        <h4 className={styles.detailsTitle}>Detailed Nutrients</h4>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span>Saturated Fats:</span>{" "}
            <span>{totals.saturatedFats.toFixed(1)}g</span>
          </div>
          <div className={styles.detailItem}>
            <span>Sugars:</span> <span>{totals.sugars.toFixed(1)}g</span>
          </div>
          <div className={styles.detailItem}>
            <span>Fibre:</span> <span>{totals.fibre.toFixed(1)}g</span>
          </div>
          <div className={styles.detailItem}>
            <span>Salt:</span> <span>{totals.salt.toFixed(2)}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
