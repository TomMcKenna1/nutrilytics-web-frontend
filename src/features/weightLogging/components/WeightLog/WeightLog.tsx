import { useState, useEffect } from "react";
import { useWeightLogs } from "../../../../hooks/useWeightLogs";
import styles from "./WeightLog.module.css";

const WeightLog = () => {
  const [weight, setWeight] = useState("");
  const { submitWeightLog, isLogging, isSuccess, isError, error, reset } =
    useWeightLogs();

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

  const getWrapperClassName = () => {
    let classNames = [styles.inputWrapper];
    if (isSuccess) classNames.push(styles.success);
    if (isError) classNames.push(styles.error);
    return classNames.join(" ");
  };

  return (
    <div className={styles.weightLogContainer}>
      <h3 className={styles.sectionSubtitle}>Log Your Weight</h3>
      <div className={getWrapperClassName()}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter today's weight"
          className={styles.weightInput}
          disabled={isLogging}
        />
        <span className={styles.unitLabel}>kg</span>
        <button
          onClick={handleLogWeight}
          disabled={isLogging || !weight.trim()}
          className={styles.logButton}
        >
          {isLogging ? "Logging..." : "Log"}
        </button>
      </div>

      {isSuccess && (
        <p className={`${styles.feedbackMessage} ${styles.successMessage}`}>
          Weight logged successfully!
        </p>
      )}
      {isError && (
        <p className={`${styles.feedbackMessage} ${styles.errorMessage}`}>
          {error?.message || "An error occurred."}
        </p>
      )}
    </div>
  );
};

export default WeightLog;
