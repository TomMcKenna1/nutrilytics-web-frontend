import React from "react";
import type { NutrientProfile } from "../../types";
import { useNutritionTargets } from "../../../../hooks/useNutritionTargets";
import { TrafficLightNutrientBox } from "../TrafficlightNutrientBox/TrafficlightNutrientBox"; // Import the new component
import styles from "./NutritionTrafficlightView.module.css"; // Keep main container styles here

// Define a union type for the nutrient keys that represent numeric values
type NumericNutrientKeys =
  | "energy"
  | "fats"
  | "saturatedFats"
  | "carbohydrates"
  | "sugars"
  | "fibre"
  | "protein"
  | "salt";

interface NutritionTrafficlightViewProps {
  nutrientProfile: NutrientProfile;
  totalWeight: number; // Weight of the component, needed for per 100g calculations
}

export const NutritionTrafficlightView: React.FC<
  NutritionTrafficlightViewProps
> = ({ nutrientProfile, totalWeight }) => {
  const { targets, isLoading: targetsLoading } = useNutritionTargets();

  if (totalWeight === 0) {
    return (
      <p className={styles.noWeight}>
        Cannot calculate traffic light values for 0g component.
      </p>
    );
  }

  // Calculate nutrient values per 100g for passing to individual boxes
  const nutrientsPer100g: Record<NumericNutrientKeys, number> = {
    energy: (nutrientProfile.energy / totalWeight) * 100,
    fats: (nutrientProfile.fats / totalWeight) * 100,
    saturatedFats: (nutrientProfile.saturatedFats / totalWeight) * 100,
    carbohydrates: (nutrientProfile.carbohydrates / totalWeight) * 100,
    sugars: (nutrientProfile.sugars / totalWeight) * 100,
    fibre: (nutrientProfile.fibre / totalWeight) * 100,
    protein: (nutrientProfile.protein / totalWeight) * 100,
    salt: (nutrientProfile.salt / totalWeight) * 100,
  };

  interface NutrientConfig {
    label: string;
    nutrientKey: NumericNutrientKeys;
    unit: string;
    isEnergy?: boolean;
    isCarbohydrates?: boolean;
  }

  const nutrientConfigs: NutrientConfig[] = [
    { label: "Energy", nutrientKey: "energy", unit: "kcal", isEnergy: true },
    {
      label: "Carbs",
      nutrientKey: "carbohydrates",
      unit: "g",
      isCarbohydrates: true,
    },
    { label: "Fat", nutrientKey: "fats", unit: "g" },
    { label: "Saturates", nutrientKey: "saturatedFats", unit: "g" },
    { label: "Sugars", nutrientKey: "sugars", unit: "g" },
    { label: "Fibre", nutrientKey: "fibre", unit: "g" },
    { label: "Protein", nutrientKey: "protein", unit: "g" },
    { label: "Salt", nutrientKey: "salt", unit: "g" },
  ];
  const topRowConfigs = nutrientConfigs.slice(0, 2);
  const middleRowConfigs = nutrientConfigs.slice(2, 5);
  const bottomRowConfigs = nutrientConfigs.slice(5, 8);

  return (
    <>
      <div className={styles.standardLayoutContainer}>
        <div className={styles.nutrientRow}>
          {topRowConfigs.map((config) => (
            <TrafficLightNutrientBox
              key={config.nutrientKey}
              {...config}
              valuePer100g={nutrientsPer100g[config.nutrientKey]}
              totalValue={nutrientProfile[config.nutrientKey]}
              targets={targets}
              targetsLoading={targetsLoading}
            />
          ))}
        </div>
        <div className={styles.nutrientRow}>
          {middleRowConfigs.map((config) => (
            <TrafficLightNutrientBox
              key={config.nutrientKey}
              {...config}
              valuePer100g={nutrientsPer100g[config.nutrientKey]}
              totalValue={nutrientProfile[config.nutrientKey]}
              targets={targets}
              targetsLoading={targetsLoading}
            />
          ))}
        </div>
        <div className={styles.nutrientRow}>
          {bottomRowConfigs.map((config) => (
            <TrafficLightNutrientBox
              key={config.nutrientKey}
              {...config}
              valuePer100g={nutrientsPer100g[config.nutrientKey]}
              totalValue={nutrientProfile[config.nutrientKey]}
              targets={targets}
              targetsLoading={targetsLoading}
            />
          ))}
        </div>
      </div>
      <div className={styles.disclaimer}>
        Traffic light values are per 100g of the component.
      </div>
    </>
  );
};
