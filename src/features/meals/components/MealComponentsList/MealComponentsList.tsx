import { useState } from "react";
import { type MealComponent } from "../../types";
import { NutritionTrafficlightView } from "../NutritionTrafficlightView/NutritionTrafficlightView";
import styles from "./MealComponentsList.module.css";
import { FiTrash2, FiPlus } from "react-icons/fi";

const PendingComponent = () => (
  <div className={`${styles.pendingComponentCard} ${styles.shimmerEffect}`}>
    <p className={styles.pendingText}>Analyzing new component...</p>
  </div>
);

const AddComponentForm = ({
  onAddComponent,
  isEditing,
}: {
  onAddComponent: (description: string) => void;
  isEditing?: boolean;
}) => {
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddComponent(description);
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <div className={styles.itemWrapper}>
      {!showForm ? (
        <div
          className={styles.addComponentRow}
          onClick={() => !isEditing && setShowForm(true)}
          role="button"
          aria-disabled={isEditing}
          tabIndex={isEditing ? -1 : 0}
        >
          <FiPlus />
          <span>Add Component</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.addComponentForm}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., a tablespoon of olive oil"
            className={styles.addComponentInput}
            autoFocus
          />
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={`${styles.button} ${styles.neutral}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.primary}`}
              disabled={!description.trim()}
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

interface MealComponentsListProps {
  components: MealComponent[];
  onDeleteComponent?: (componentId: string) => void;
  isEditing?: boolean;
  onAddComponent?: (description: string) => void;
}

export const MealComponentsList = ({
  components,
  onDeleteComponent,
  isEditing = false,
  onAddComponent,
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
    e.stopPropagation();
    if (!isEditing && components.length > 1) {
      onDeleteComponent?.(componentId);
    }
  };

  if (components.length === 0 && !onAddComponent) {
    return <p className={styles.emptyState}>This meal has no components.</p>;
  }

  return (
    <div className={styles.container}>
      {components.map((component) => (
        <div key={component.id} className={styles.itemWrapper}>
          <div
            className={styles.item}
            onClick={() => toggleDetails(component.id)}
          >
            <div className={styles.leftSection}>
              <div
                className={`${styles.dropdownArrow} ${
                  openComponents.has(component.id) ? styles.arrowOpen : ""
                }`}
              >
                &#9660;
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{component.name}</div>
                <div className={styles.quantity}>{component.quantity}</div>
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.weight}>
                {component.totalWeight.toFixed(0)}g
              </div>
              {onDeleteComponent && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDelete(e, component.id)}
                  aria-label={`Delete ${component.name}`}
                  title={
                    components.length <= 1
                      ? "A meal must have at least one component"
                      : "Delete component"
                  }
                  disabled={isEditing || components.length <= 1}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>
          <div
            className={`${styles.detailsPanel} ${
              openComponents.has(component.id) ? styles.detailsOpen : ""
            }`}
          >
            <NutritionTrafficlightView
              nutrientProfile={component.nutrientProfile}
              totalWeight={component.totalWeight}
            />
          </div>
        </div>
      ))}

      {isEditing && (
        <div className={styles.itemWrapper}>
          <PendingComponent />
        </div>
      )}

      {onAddComponent && (
        <AddComponentForm
          onAddComponent={onAddComponent}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};