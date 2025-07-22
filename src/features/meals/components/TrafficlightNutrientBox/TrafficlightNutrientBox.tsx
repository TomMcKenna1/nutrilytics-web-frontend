import React from "react";
import type { NutrientProfile } from "../../types";
import type { NutritionTarget } from "../../../../features/account/types"; // Assuming NutritionTarget structure
import styles from "./TrafficLightNutrientBox.module.css";

interface TrafficLightNutrientBoxProps {
  label: string;
  nutrientKey: keyof Pick<
    NutrientProfile,
    | "energy"
    | "fats"
    | "saturatedFats"
    | "carbohydrates"
    | "sugars"
    | "fibre"
    | "protein"
    | "salt"
  >; // Explicitly pick numeric keys
  valuePer100g: number;
  totalValue: number;
  unit: string;
  targets: NutritionTarget | undefined;
  targetsLoading: boolean;
  isEnergy?: boolean; // Special handling for Energy box (white, kJ/kcal)
  isCarbohydrates?: boolean; // Special handling for Carbohydrates box (white, N/A status)
}

// --- Constants for UK Traffic Light System (Thresholds per 100g) ---
const TRAFFIC_LIGHT_THRESHOLDS_PER_100G = {
  fats: {
    // Using 'fats' to match NutrientProfile key
    high: 17.5,
    medium: 3.0,
    low: 3.0,
  },
  saturatedFats: {
    high: 5.0,
    medium: 1.5,
    low: 1.5,
  },
  sugars: {
    high: 22.5,
    medium: 5.0,
    low: 5.0,
  },
  salt: {
    high: 1.5,
    medium: 0.3,
    low: 0.3,
  },
  protein: {
    high: 10.0, // Green if > 10g/100g
    medium: 5.0, // Amber if > 5g and <= 10g/100g
    low: 5.0, // Red if <= 5g/100g
  },
  fibre: {
    high: 6.0, // Green if > 6g/100g
    medium: 3.0, // Amber if > 3g and <= 6g/100g
    low: 3.0, // Red if <= 3g/100g
  },
};

type TrafficLightColor = "red" | "amber" | "green" | "white";

const getTrafficLightColor = (
  valuePer100g: number,
  nutrientKey: keyof typeof TRAFFIC_LIGHT_THRESHOLDS_PER_100G, // Use specific keys that have thresholds
): TrafficLightColor => {
  const thresholds = TRAFFIC_LIGHT_THRESHOLDS_PER_100G[nutrientKey];

  // Standard traffic light (Red=High, Green=Low)
  if (
    nutrientKey === "fats" ||
    nutrientKey === "saturatedFats" ||
    nutrientKey === "sugars" ||
    nutrientKey === "salt"
  ) {
    if (valuePer100g > thresholds.high) {
      return "red";
    } else if (valuePer100g > thresholds.medium) {
      return "amber";
    } else {
      return "green";
    }
  }
  // Inverted logic for protein and fibre (Green=High, Red=Low)
  else if (nutrientKey === "protein" || nutrientKey === "fibre") {
    if (valuePer100g > thresholds.high) {
      return "green";
    } else if (valuePer100g > thresholds.medium) {
      return "amber";
    } else {
      return "red";
    }
  }
  return "white"; // Fallback for types not explicitly covered by traffic lights
};

const mapColorToStatus = (
  color: TrafficLightColor,
  nutrientKey: keyof typeof TRAFFIC_LIGHT_THRESHOLDS_PER_100G,
): string => {
  if (
    nutrientKey === "fats" ||
    nutrientKey === "saturatedFats" ||
    nutrientKey === "sugars" ||
    nutrientKey === "salt"
  ) {
    switch (color) {
      case "red":
        return "HIGH";
      case "amber":
        return "MED";
      case "green":
        return "LOW";
      default:
        return "";
    }
  } else if (nutrientKey === "protein" || nutrientKey === "fibre") {
    switch (color) {
      case "red":
        return "LOW";
      case "amber":
        return "MED";
      case "green":
        return "HIGH";
      default:
        return "";
    }
  }
  return "";
};
// --- End Constants & Helpers ---

export const TrafficLightNutrientBox: React.FC<
  TrafficLightNutrientBoxProps
> = ({
  label,
  nutrientKey,
  valuePer100g,
  totalValue,
  unit,
  targets,
  targetsLoading,
  isEnergy = false,
  isCarbohydrates = false,
}) => {
  const getPercentageOfCustomTarget = (
    value: number,
    key: keyof Pick<
      NutrientProfile,
      | "energy"
      | "fats"
      | "saturatedFats"
      | "carbohydrates"
      | "sugars"
      | "fibre"
      | "protein"
      | "salt"
    >,
  ) => {
    // Assuming NutritionTarget now has the same keys as NutrientProfile's numeric fields
    const targetValue = targets?.[key] as number | undefined; // Cast to number as targets could theoretically have other types

    if (targetsLoading || targetValue === undefined || targetValue <= 0) {
      return "N/A";
    }
    return ((value / targetValue) * 100).toFixed(0);
  };

  const getTargetLabel = (percentage: string) => {
    return percentage === "N/A" ? "Target" : "Custom Target";
  };

  const trafficLightColor =
    isEnergy || isCarbohydrates
      ? "white"
      : getTrafficLightColor(
          valuePer100g,
          nutrientKey as keyof typeof TRAFFIC_LIGHT_THRESHOLDS_PER_100G,
        );
  const statusText =
    isEnergy || isCarbohydrates
      ? "N/A"
      : mapColorToStatus(
          trafficLightColor,
          nutrientKey as keyof typeof TRAFFIC_LIGHT_THRESHOLDS_PER_100G,
        );

  const percentage = getPercentageOfCustomTarget(valuePer100g, nutrientKey);
  const targetLabel = getTargetLabel(percentage);

  return (
    <div
      className={`${styles.nutrientBox} ${styles[trafficLightColor]} ${isEnergy ? styles.energyBox : ""}`}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {valuePer100g.toFixed(isEnergy ? 0 : unit === "g" ? 1 : 2)}
        {unit}
      </div>
      <div className={styles.totalValue}>
        Total: {totalValue.toFixed(isEnergy ? 0 : unit === "g" ? 1 : 2)}
        {unit}
      </div>
      {statusText !== "N/A" && (
        <div className={styles.status}>{statusText}</div>
      )}
      {statusText === "N/A" && ( // Show N/A status for carbs/energy
        <div className={styles.statusNA}>N/A</div>
      )}
      <div className={styles.riPercent}>
        {percentage}% <span className={styles.subLabel}>{targetLabel}</span>
      </div>
    </div>
  );
};
