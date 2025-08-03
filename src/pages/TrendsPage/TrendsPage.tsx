import { useState } from "react";
import styles from "./TrendsPage.module.css";
import { NutritionTrends } from "./NutritionTrends";
import { WeightTrends } from "./WeightTrends";

type Tab = "nutrition" | "weight";

export const TrendsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("nutrition");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.segmentedControl}>
        <button
          className={`${styles.segment} ${
            activeTab === "nutrition" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("nutrition")}
        >
          Nutrition
        </button>
        <button
          className={`${styles.segment} ${
            activeTab === "weight" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("weight")}
        >
          Weight & TDEE
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "nutrition" && <NutritionTrends />}
        {activeTab === "weight" && <WeightTrends />}
      </div>
    </div>
  );
};
