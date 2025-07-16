import React from "react";
import { type MealComponent } from "../types";

interface MealComponentsListProps {
  components: MealComponent[];
}

export const MealComponentsList = ({ components }: MealComponentsListProps) => {
  // temp styles
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      maxHeight: "500px",
      overflowY: "auto",
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem",
      borderBottom: "1px solid #e2e8f0",
    },
    name: { fontWeight: "bold" },
    details: { color: "#718096", fontSize: "0.9rem" },
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Components ({components.length})</h3>
      <div style={styles.container}>
        {components.map((component, index) => (
          <div key={index} style={styles.item}>
            <div>
              <div style={styles.name}>{component.name}</div>
              <div style={styles.details}>{component.quantity}</div>
            </div>
            <div style={styles.details}>
              {component.totalWeight.toFixed(0)}g
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
