import React from "react";
import styles from "./GaugeBar.module.css";

interface GaugeBarProps {
  needlePercent: number;
  greenZone: { start: number; width: number };
  orangeZone: { start: number; width: number };
  status: "inRange" | "warning" | "danger" | undefined;
}

const GaugeBar: React.FC<GaugeBarProps> = ({
  needlePercent,
  greenZone,
  orangeZone,
  status,
}) => {
  const getNeedleColorClass = () => {
    switch (status) {
      case "warning":
        return styles.warning;
      case "danger":
        return styles.danger;
      case "inRange":
        return styles.inRange;
      default:
        return styles.default;
    }
  };

  const needleClasses = `${styles.needle} ${getNeedleColorClass()}`;

  return (
    <div className={styles.gaugeBar}>
      <div className={styles.gaugeBackground}></div>
      <div
        className={styles.segmentWarning}
        style={{
          left: `${orangeZone.start}%`,
          width: `${orangeZone.width}%`,
        }}
      />
      <div
        className={styles.segmentGood}
        style={{
          left: `${greenZone.start}%`,
          width: `${greenZone.width}%`,
        }}
      />

      <div className={needleClasses} style={{ left: `${needlePercent}%` }} />
    </div>
  );
};

export default GaugeBar;
