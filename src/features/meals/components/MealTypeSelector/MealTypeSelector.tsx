import React from "react"; // Removed unused hooks
import styles from "./MealTypeSelector.module.css";

type MealType = "meal" | "snack" | "beverage";
const options: MealType[] = ["meal", "snack", "beverage"];

interface MealTypeSelectorProps {
  value: MealType;
  onChange: (newType: MealType) => void;
  disabled?: boolean;
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  value,
  onChange,
  disabled,
}) => {
  return (
    <div
      className={`${styles.selectorContainer} ${disabled ? styles.disabled : ""}`}
    >
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.optionButton} ${
            value === option ? styles.active : ""
          }`}
          onClick={() => !disabled && onChange(option)}
          disabled={disabled}
          aria-pressed={value === option}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
};
