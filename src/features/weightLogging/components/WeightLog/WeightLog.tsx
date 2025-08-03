import { useState, useEffect } from "react";
import { useWeightLogMutations } from "../../../../hooks/useWeightLogMutations";
import styles from "./WeightLog.module.css";

const WeightLog = () => {
  const [weight, setWeight] = useState("");
  const { submitWeightLog, isLogging, isSuccess, isError, error, reset } =
    useWeightLogMutations();

  const handleLogWeight = () => {
    const weightNum = Number(weight);
    if (!weight.trim() || isNaN(weightNum) || weightNum <= 0) return;
    submitWeightLog({ weight: weightNum, unit: "kg" });
  };

  useEffect(() => {
    if (isSuccess) {
      setWeight("");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, reset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogWeight();
    }
  };

  return (
    <div className={styles.metricCard}>
      <h3 className={styles.cardTitle}>Log Your Weight</h3>
      <div className={styles.cardContent}>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0.0"
            className={styles.weightInput}
            disabled={isLogging}
          />
          <span className={styles.unitLabel}>kg</span>
        </div>
        <button
          onClick={handleLogWeight}
          disabled={isLogging || !weight.trim()}
          className={styles.logButton}
        >
          {isLogging ? "..." : "Log"}
        </button>
      </div>
      <div className={styles.cardFooter}>
        {isSuccess && <p className={styles.feedbackMessage}>Success!</p>}
        {isError && (
          <p className={`${styles.feedbackMessage} ${styles.errorMessage}`}>
            {error?.message || "Error"}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeightLog;
