import { useState } from "react";
import styles from "./WeightLog.module.css";

const WeightLog = () => {
  const [weight, setWeight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogWeight = () => {
    if (!weight.trim()) return;
    setIsSubmitting(true);
    console.log(`Weight logged: ${weight} kg`);
    setTimeout(() => {
      setIsSubmitting(false);
      setWeight("");
    }, 1000); // Simulate network request
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogWeight();
    }
  };

  return (
    <div className={styles.weightLogContainer}>
      <h3 className={styles.sectionSubtitle}>Weight & Goals</h3>
      <div className={styles.inputWrapper}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter today's weight"
          className={styles.weightInput}
          disabled={isSubmitting}
        />
        <span className={styles.unitLabel}>kg</span>
        <button
          onClick={handleLogWeight}
          disabled={isSubmitting || !weight.trim()}
          className={styles.logButton}
        >
          {isSubmitting ? "Logging..." : "Log"}
        </button>
      </div>
    </div>
  );
};

export default WeightLog;
