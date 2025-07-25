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
      <div className={styles.totalWeightRow}>
        <span className={styles.summaryLabel}>Total Weight of Meal</span>
        <span className={styles.totalWeightValue}>
          {mealWeight.toFixed(0)}g
        </span>
      </div>

      <div className={styles.nutrientGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Energy</span>
          <span className={`${styles.summaryValue} ${styles.energy}`}>
            {totals.energy.toFixed(0)}kcal
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Protein</span>
          <span className={`${styles.summaryValue} ${styles.protein}`}>
            {totals.protein.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Carbohydrates</span>
          <span className={`${styles.summaryValue} ${styles.carbs}`}>
            {totals.carbohydrates.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Fats</span>
          <span className={`${styles.summaryValue} ${styles.fats}`}>
            {totals.fats.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Saturated Fats</span>
          <span className={`${styles.summaryValue} ${styles.saturatedFats}`}>
            {totals.saturatedFats.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Sugars</span>
          <span className={`${styles.summaryValue} ${styles.sugars}`}>
            {totals.sugars.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Fibre</span>
          <span className={`${styles.summaryValue} ${styles.fibre}`}>
            {totals.fibre.toFixed(1)}g
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Salt</span>
          <span className={styles.summaryValue}>{totals.salt.toFixed(2)}g</span>
        </div>
      </div>
    </div>
  );
};
