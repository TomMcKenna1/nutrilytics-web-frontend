import React from "react";
import { type NutritionTarget } from "../../types";
import styles from "./TargetsForm.module.css";

class NutritionTargetKeys {
  energy = 0;
  protein = 0;
  carbohydrates = 0;
  sugars = 0;
  fats = 0;
  saturatedFats = 0;
  fibre = 0;
  salt = 0;
}

interface NutritionTargetsFormProps {
  nutritionForm: Partial<NutritionTarget>;
  originalTargets?: Partial<NutritionTarget>;
  isDirty: boolean;
  isUpdating: boolean;
  isSuccess: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TargetsForm = ({
  nutritionForm,
  originalTargets,
  isDirty,
  isUpdating,
  isSuccess,
  onFormChange,
  onSubmit,
}: NutritionTargetsFormProps) => {
  const isFieldDirty = (fieldName: keyof NutritionTarget) => {
    if (!originalTargets) return false;
    return nutritionForm[fieldName] !== originalTargets[fieldName];
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Daily Nutrition Targets</h2>
        <button
          type="submit"
          form="targets-form"
          className={styles.button}
          disabled={!isDirty || isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Targets"}
        </button>
      </div>

      {isSuccess && (
        <p className={`${styles.message} ${styles.successMessage}`}>
          Targets updated!
        </p>
      )}

      <form id="targets-form" onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          {Object.keys(new NutritionTargetKeys()).map((key) => {
            const fieldName = key as keyof NutritionTarget;
            const label =
              key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1");
            const unit = key === "energy" ? "kcal" : "g";
            return (
              <div className={styles.formGroup} key={key}>
                <label htmlFor={key} className={styles.label}>
                  {label} ({unit})
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  className={`${styles.input} ${isFieldDirty(fieldName) ? styles.dirty : ""}`}
                  value={nutritionForm[fieldName] ?? ""}
                  onChange={onFormChange}
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};
