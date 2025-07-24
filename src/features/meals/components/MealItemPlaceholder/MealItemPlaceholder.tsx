import styles from "./MealItemPlaceholder.module.css";

const MealItemPlaceholder = () => {
  return (
    <div className={styles.item}>
      <div className={`${styles.placeholder} ${styles.mealName}`} />
      <div className={`${styles.placeholder} ${styles.mealDate}`} />
    </div>
  );
};

export default MealItemPlaceholder;
