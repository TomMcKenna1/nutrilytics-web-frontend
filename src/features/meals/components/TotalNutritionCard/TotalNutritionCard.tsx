import { type NutrientProfile } from "../../types";
import styles from "./TotalNutritionCard.module.css";

interface TotalNutritionCardProps {
  totals: NutrientProfile;
  mealWeight: number;
}

const getTrafficLightInfo = (
  nutrient: keyof NutrientProfile,
  value: number,
  mealWeight: number,
): { className: string; label: string } => {
  const per100g = mealWeight > 0 ? (value / mealWeight) * 100 : 0;
  let classification: "low" | "medium" | "high" = "medium";
  let label = "MED";

  switch (nutrient) {
    case "fats":
      if (per100g <= 3.0) {
        classification = "low";
        label = "LOW";
      } else if (per100g > 17.5) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "saturatedFats":
      if (per100g <= 1.5) {
        classification = "low";
        label = "LOW";
      } else if (per100g > 5.0) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "sugars":
      if (per100g <= 5.0) {
        classification = "low";
        label = "LOW";
      } else if (per100g > 22.5) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "salt":
      if (per100g <= 0.3) {
        classification = "low";
        label = "LOW";
      } else if (per100g > 1.5) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "protein":
      if (value < 10) {
        classification = "low";
        label = "LOW";
      } else if (value > 30) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "fibre":
      if (value < 3) {
        classification = "low";
        label = "LOW";
      } else if (value > 6) {
        classification = "high";
        label = "HIGH";
      }
      break;
    case "carbohydrates":
      if (value < 30) {
        classification = "low";
        label = "LOW";
      } else if (value > 70) {
        classification = "high";
        label = "HIGH";
      }
      break;
    default:
      return { className: styles.neutral, label: "INFO" };
  }

  return { className: styles[classification], label };
};

export const TotalNutritionCard = ({
  totals,
  mealWeight,
}: TotalNutritionCardProps) => {
  const nutrients: {
    name: string;
    key: keyof NutrientProfile;
    unit: "kcal" | "g";
  }[] = [
    { name: "Energy", key: "energy", unit: "kcal" },
    { name: "Fats", key: "fats", unit: "g" },
    { name: "Saturates", key: "saturatedFats", unit: "g" },
    { name: "Carbs", key: "carbohydrates", unit: "g" },
    { name: "Sugars", key: "sugars", unit: "g" },
    { name: "Fibre", key: "fibre", unit: "g" },
    { name: "Protein", key: "protein", unit: "g" },
    { name: "Salt", key: "salt", unit: "g" },
  ];

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Nutritional Summary</h3>
      {mealWeight > 0 && (
        <p className={styles.mealWeightInfo}>
          Based on a total weight of <strong>{mealWeight.toFixed(0)}g</strong>
        </p>
      )}
      <div className={styles.nutrientsGrid}>
        {nutrients.map((nutrient) => {
          const totalValue = totals[nutrient.key] as number;
          const per100gValue =
            mealWeight > 0 ? (totalValue / mealWeight) * 100 : 0;
          const info =
            nutrient.key === "energy"
              ? { className: styles.neutral, label: "" }
              : getTrafficLightInfo(nutrient.key, totalValue, mealWeight);

          return (
            <div
              key={nutrient.key}
              className={`${styles.nutrientTile} ${info.className}`}
            >
              <span className={styles.nutrientName}>{nutrient.name}</span>
              <div className={styles.valuesContainer}>
                <span className={styles.nutrientValue}>
                  {totalValue.toFixed(nutrient.unit === "g" ? 1 : 0)}
                  <span className={styles.unit}>{nutrient.unit}</span>
                </span>
                <span className={styles.per100gValue}>
                  ({per100gValue.toFixed(1)} / 100g)
                </span>
              </div>
              <span className={styles.trafficLightLabel}>{info.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
