import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useInfiniteMeals } from "../../../hooks/useInfiniteMeals";

export const HistoricalMealsList = () => {
  const {
    meals,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchInitialPage,
    fetchNextPage,
  } = useInfiniteMeals();

  // Fetch the first page of meals when the component mounts
  useEffect(() => {
    fetchInitialPage();
  }, [fetchInitialPage]);

  // Temp styles
  const styles: { [key: string]: React.CSSProperties } = {
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem",
      borderBottom: "1px solid #e2e8f0",
    },
    container: { border: "1px solid #e2e8f0", borderRadius: "8px" },
    loadMoreButton: {
      width: "100%",
      padding: "1rem",
      border: "none",
      background: "#f0f0f0",
      cursor: "pointer",
    },
  };

  if (isLoading) return <p>Loading recent meals...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {meals.map((meal) => (
        <Link
          to={`/meal/${meal.id}`}
          key={meal.id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div style={styles.item}>
            <span>{meal.name}</span>
            <span style={{ color: "#718096" }}>
              {new Date(meal.createdAt).toLocaleDateString()}
            </span>
          </div>
        </Link>
      ))}
      {hasMore && (
        <button
          onClick={fetchNextPage}
          disabled={isFetchingMore}
          style={styles.loadMoreButton}
        >
          {isFetchingMore ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};
