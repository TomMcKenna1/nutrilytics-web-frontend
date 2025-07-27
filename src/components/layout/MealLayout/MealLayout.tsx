import React from "react";
import { Link } from "react-router-dom";
import type {
  MealComponent,
  NutrientProfile,
  MealType,
} from "../../../features/meals/types";
import type { DailySummary } from "../../../features/metrics/types";
import { MealComponentsList } from "../../../features/meals/components/MealComponentsList/MealComponentsList";
import { TotalNutritionCard } from "../../../features/meals/components/TotalNutritionCard/TotalNutritionCard";
import { MealTypeSelector } from "../../../features/meals/components/MealTypeSelector/MealTypeSelector";
import { DailyTargetImpact } from "../../../features/meals/components/DailyTargetImpact/DailyTargetImpact";
import styles from "./MealLayout.module.css";

interface MealLayoutProps {
  title: string;
  description: string;
  actions: React.ReactNode;
  components: MealComponent[];
  nutrientProfile: NutrientProfile | null;
  dailySummary?: DailySummary;
  showDailyImpact?: boolean;
  onDeleteComponent?: (componentId: string) => void;
  isEditing?: boolean;
  onAddComponent?: (description: string) => void;
  mealType?: MealType;
  onMealTypeChange?: (newType: MealType) => void;
}

export const MealLayout: React.FC<MealLayoutProps> = ({
  title,
  description,
  actions,
  components,
  nutrientProfile,
  dailySummary,
  showDailyImpact = false,
  onDeleteComponent,
  isEditing,
  onAddComponent,
  mealType,
  onMealTypeChange,
}) => {
  const totalWeight = components.reduce(
    (total, component) => total + component.totalWeight,
    0
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          &larr; Back to Dashboard
        </Link>
        <div className={styles.headerMain}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
            {mealType && onMealTypeChange && (
              <div className={styles.mealTypeContainer}>
                <MealTypeSelector
                  value={mealType}
                  onChange={onMealTypeChange}
                  disabled={isEditing}
                />
              </div>
            )}
          </div>
          <div className={styles.actionsContainer}>{actions}</div>
        </div>
      </header>

      {showDailyImpact && dailySummary && nutrientProfile && (
        <div className={styles.impactSection}>
          <h2 className={styles.sectionTitle}>Daily Target Impact</h2>
          <DailyTargetImpact
            summary={dailySummary}
            nutrientProfile={nutrientProfile}
          />
        </div>
      )}

      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>
            Components ({isEditing ? components.length + 1 : components.length})
          </h2>
          <MealComponentsList
            components={components}
            onDeleteComponent={onDeleteComponent}
            isEditing={isEditing}
            onAddComponent={onAddComponent}
          />
        </div>

        {nutrientProfile && (
          <aside className={styles.rightColumn}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <TotalNutritionCard
              totals={nutrientProfile}
              mealWeight={totalWeight}
            />
          </aside>
        )}
      </main>
    </div>
  );
};

export default MealLayout;
