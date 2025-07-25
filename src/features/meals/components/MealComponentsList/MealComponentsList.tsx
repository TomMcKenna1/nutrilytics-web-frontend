// src/features/meals/components/MealComponentsList/MealComponentsList.tsx

import { useState } from "react";
import { type MealComponent } from "../../types";
import { NutritionTrafficlightView } from "../NutritionTrafficlightView/NutritionTrafficlightView";
import styles from "./MealComponentsList.module.css";
import { FiTrash2 } from "react-icons/fi"; // Import the bin icon

interface MealComponentsListProps {
  components: MealComponent[];
  isDraft?: boolean; // Optional: To identify if the meal is a draft
  onDeleteComponent?: (componentId: string) => void; // Optional: Handler for deleting a component
}

export const MealComponentsList = ({
  components,
  isDraft = false,
  onDeleteComponent,
}: MealComponentsListProps) => {
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

  const handleDelete = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation(); // Prevent the details panel from toggling
    onDeleteComponent?.(componentId);
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
            {/* Left section containing arrow and info */}
            <div className={styles.leftSection}>
              <div
                className={`${styles.dropdownArrow} ${openComponents.has(component.id) ? styles.arrowOpen : ""}`}
              >
                &#9660;
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{component.name}</div>
                <div className={styles.quantity}>{component.quantity}</div>
              </div>
            </div>

            {/* Right section containing weight and delete button */}
            <div className={styles.rightSection}>
              <div className={styles.weight}>
                {component.totalWeight.toFixed(0)}g
              </div>
              {isDraft && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDelete(e, component.id)}
                  aria-label={`Delete ${component.name}`}
                  title="Delete component"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>

          <div
            className={`${styles.detailsPanel} ${openComponents.has(component.id) ? styles.detailsOpen : ""}`}
          >
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