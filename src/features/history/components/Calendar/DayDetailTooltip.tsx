import styles from "./Calendar.module.css";
import type { DailyHistoryLog, NutrientSummary } from "../../types";
import type { NutritionTarget } from "../../../account/types";

interface MacroGaugeProps {
  nutrientKey: keyof NutrientSummary;
  consumed: number;
  target: number;
}

const MacroGauge: React.FC<MacroGaugeProps> = ({
  nutrientKey,
  consumed,
  target,
}) => {
  const percent = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  const unit = nutrientKey === "energy" ? "kcal" : "g";
  const colorClass = styles[`progressFill_${nutrientKey}`] || "";
  const nutrientName =
    nutrientKey.charAt(0).toUpperCase() + nutrientKey.slice(1);

  return (
    <div className={styles.macro}>
      <div className={styles.macroInfo}>
        <span>{nutrientName}</span>
        <p>
          {Math.round(consumed)} / {target} {unit}
        </p>
      </div>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

interface DayDetailTooltipProps {
  day: Date;
  data: DailyHistoryLog;
  targets: NutritionTarget;
}

export const DayDetailTooltip: React.FC<DayDetailTooltipProps> = ({
  day,
  data,
  targets,
}) => {
  const nutrientsToShow: (keyof NutrientSummary)[] = [
    "energy",
    "protein",
    "carbohydrates",
    "fats",
  ];

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeader}>
        {day.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className={styles.tooltipSection}>
        <strong>Daily Summary</strong>
        {nutrientsToShow.map((key) => {
          const consumed = data.nutrition[key] || 0;
          const target = targets[key] || 0;
          return (
            <MacroGauge
              key={key}
              nutrientKey={key}
              consumed={consumed}
              target={target}
            />
          );
        })}
      </div>

      <div className={styles.tooltipSection}>
        <strong>Meal Log</strong>
        {data.logs.length > 0 ? (
          <ul className={styles.logList}>
            {data.logs.map((log: string, index: number) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        ) : (
          <p>No meals logged.</p>
        )}
      </div>
    </div>
  );
};
