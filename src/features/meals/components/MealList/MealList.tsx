import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiX, FiTrash2 } from "react-icons/fi";
import { FaBowlFood } from "react-icons/fa6";
import { RiDrinksFill } from "react-icons/ri";
import { useMealList } from "../../../../hooks/useMealList";
import type { MealDB, MealType } from "../../types";
import styles from "./MealList.module.css";

const Loader = () => (
  <div className={styles.loader}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className={styles.bar} />
    ))}
  </div>
);

const MealTypeIcon = ({ mealType }: { mealType: MealType }) => {
  const icons = {
    meal: <FaBowlFood color={"var(--color-primary-blue)"} />,
    snack: <FaBowlFood color={"var(--color-fats)"} />,
    beverage: <RiDrinksFill color={"var(--color-fats)"} />,
  };
  return icons[mealType] || icons.meal;
};

const MealItem = ({
  meal,
  onDelete,
  isDeleting,
}: {
  meal: MealDB;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => {
  const isPending = meal.status === "pending" || meal.status === "pending_edit";
  const itemClasses = `${styles.item} ${isPending ? styles.pendingItem : ""} ${
    meal.data ? styles[meal.data.type] : ""
  }`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(meal.id);
  };

  const renderStatus = () => {
    switch (meal.status) {
      case "pending":
      case "pending_edit":
        return <Loader />;
      case "complete":
        return meal.data ? <MealTypeIcon mealType={meal.data.type} /> : null;
      case "error":
        return (
          <div
            className={`${styles.icon} ${styles.errorIcon}`}
            title={meal.error}
          >
            <FiX />
          </div>
        );
      default:
        return null;
    }
  };

  const getMealDate = () => {
    if (typeof meal.createdAt === "string") {
      return new Date(meal.createdAt).toLocaleDateString();
    }
    if (typeof meal.createdAt === "number") {
      return new Date(meal.createdAt * 1000).toLocaleDateString();
    }
    if (meal.createdAt?._seconds) {
      return new Date(meal.createdAt._seconds * 1000).toLocaleDateString();
    }
    return "Just now";
  };

  const content = (
    <div className={itemClasses}>
      <div className={styles.icon}>{renderStatus()}</div>
      <div className={styles.mealInfo}>
        <span className={styles.mealName}>
          {meal.data?.name || meal.originalInput}
        </span>
      </div>
      <span className={styles.mealDate}>{getMealDate()}</span>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={isDeleting || isPending}
        title="Delete Meal"
      >
        {isDeleting ? <Loader /> : <FiTrash2 />}
      </button>
    </div>
  );

  return meal.status === "complete" ? (
    <Link to={`/meal/${meal.id}`} className={styles.itemLink}>
      {content}
    </Link>
  ) : (
    content
  );
};

export const MealList = ({
  visibleRows = 5,
  date,
}: {
  visibleRows?: number;
  date?: Date;
}) => {
  const {
    meals,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchNextPage,
    deleteMeal,
    isDeleting,
  } = useMealList(date);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    const isScrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    setIsAtBottom(isScrolledToBottom);

    if (
      scrollHeight - scrollTop - clientHeight < 200 &&
      hasMore &&
      !isFetchingMore
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const hasScrollbar = container.scrollHeight > container.clientHeight;
      setIsScrollable(hasScrollbar);
      if (!hasScrollbar) {
        setIsAtBottom(true);
      }
    }
  }, [meals]);

  const containerStyle = {
    maxHeight: `${visibleRows * 3.5}rem`,
  };

  const showFade = isScrollable && (!isAtBottom || hasMore);

  if (isLoading)
    return <p className={styles.statusMessage}>Loading meals...</p>;
  if (error) return <p className={styles.statusMessage}>{error}</p>;
  if (meals.length === 0)
    return (
      <p className={styles.statusMessage}>
        No meal logs yet. Add one to get started!
      </p>
    );

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={containerStyle}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {meals.map((meal) => (
          <MealItem
            key={meal.id}
            meal={meal}
            onDelete={deleteMeal}
            isDeleting={isDeleting}
          />
        ))}
        {isFetchingMore && (
          <p className={styles.statusMessage}>Loading more...</p>
        )}
      </div>
      {showFade && <div className={styles.fadeOverlay} />}
    </div>
  );
};
