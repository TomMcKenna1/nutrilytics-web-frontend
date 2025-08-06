import { type NutrientSummary } from "../features/metrics/types";

export type ZoneBoundaries = {
  dangerMin: number;
  warningMin: number;
  warningMax: number;
  dangerMax: number;
  zoneType: "upperLimit" | "getEnough" | "balanced";
};

/**
 * Calculates the warning and danger zone boundaries for a given nutrient based on its target.
 * @param nutrientKey The key of the nutrient (e.g., 'protein', 'sugars').
 * @param target The target value for the nutrient.
 * @returns An object containing the min/max values for each zone.
 */
export const getNutrientZones = (
  nutrientKey: keyof NutrientSummary,
  target: number,
): ZoneBoundaries => {
  switch (nutrientKey) {
    case "sugars":
    case "saturatedFats":
    case "salt":
      return {
        dangerMin: 0,
        warningMin: 0,
        warningMax: target * 1.1,
        dangerMax: target * 1.25,
        zoneType: "upperLimit",
      };

    case "protein":
    case "fibre":
      return {
        dangerMin: target * 0.75,
        warningMin: target * 0.9,
        warningMax: target * 1.5,
        dangerMax: target * 2.0,
        zoneType: "getEnough",
      };

    default:
      return {
        dangerMin: target * (1 - 0.25),
        warningMin: target * (1 - 0.1),
        warningMax: target * (1 + 0.1),
        dangerMax: target * (1 + 0.25),
        zoneType: "balanced",
      };
  }
};
