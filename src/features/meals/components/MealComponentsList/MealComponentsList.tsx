import { useState } from "react";
import { type MealComponent } from "../../types";
import { NutritionTrafficlightView } from "../NutritionTrafficlightView/NutritionTrafficlightView";
import styles from "./MealComponentsList.module.css";

interface MealComponentsListProps {
  components: MealComponent[];
}

export const MealComponentsList = ({ components }: MealComponentsListProps) => {
  const [openComponents, setOpenComponents] = useState<Set<string>>(new Set());

  const toggleDetails = (id: string) => {
    setOpenComponents((prevOpenComponents) => {
      const newSet = new Set(prevOpenComponents);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (components.length === 0) {
    return <p className={styles.emptyState}>This meal has no components.</p>;
  }

  return (
    <div className={styles.container}>
      {components.map((component, index) => (
        <div key={component.id || index} className={styles.itemWrapper}>
          <div
            className={styles.item}
            onClick={() => toggleDetails(component.id)}
          >
            <div className={styles.info}>
              <div className={styles.name}>{component.name}</div>
              <div className={styles.quantity}>{component.quantity}</div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.weight}>
                {component.totalWeight.toFixed(0)}g
              </div>
              <div
                className={`${styles.dropdownArrow} ${openComponents.has(component.id) ? styles.arrowOpen : ""}`}
              >
                &#9660;
              </div>
            </div>
          </div>

          <div
            className={`${styles.detailsPanel} ${openComponents.has(component.id) ? styles.detailsOpen : ""}`}
          >
            {/* Replaced the old details table with the new Traffic Light View */}
            <NutritionTrafficlightView
              nutrientProfile={component.nutrientProfile}
              totalWeight={component.totalWeight}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
