import React, { useState, useRef, useLayoutEffect } from "react";
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
  const [sliderStyle, setSliderStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const selectedIndex = options.findIndex((opt) => opt === value);
    const selectedOption = optionRefs.current[selectedIndex];
    const container = containerRef.current;

    if (selectedOption && container) {
      const containerPadding = parseFloat(
        getComputedStyle(container).paddingLeft
      );
      const transformX = selectedOption.offsetLeft - containerPadding;

      setSliderStyle({
        width: `${selectedOption.offsetWidth}px`,
        transform: `translateX(${transformX}px)`,
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`${styles.selectorContainer} ${disabled ? styles.disabled : ""}`}
    >
      <div className={styles.slider} style={sliderStyle} />
      {options.map((option, index) => (
        <button
          key={option}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
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
