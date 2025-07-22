import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMealDrafts } from "../../../hooks/useMealDrafts";
import type { Draft } from "../types";

const MealDraftItem = ({ draft }: { draft: Draft }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    item: {
      display: "flex",
      alignItems: "center",
      padding: "0.75rem",
      borderBottom: "1px solid #e2e8f0",
      gap: "1rem",
    },
    icon: { width: "24px", height: "24px" },
    text: {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    link: { textDecoration: "none", color: "inherit" },
  };

  const renderStatus = () => {
    switch (draft.status) {
      case "pending":
        return <div style={styles.icon}>⏳</div>;
      case "complete":
        return <div style={styles.icon}>✅</div>;
      case "error":
        return (
          <div style={styles.icon} title={draft.error}>
            ❌
          </div>
        );
      default:
        return null;
    }
  };

  const displayText = draft.mealDraft?.name || draft.originalInput;

  const content = (
    <div style={styles.item}>
      {renderStatus()}
      <span style={styles.text}>{displayText}</span>
    </div>
  );

  if (draft.mealDraft) {
    return (
      <Link to={`/draft/${draft.id}`} style={styles.link}>
        {content}
      </Link>
    );
  }

  return content;
};

export const MealDraftsList = () => {
  const { data: drafts, isLoading, error } = useMealDrafts();

  const sortedDrafts = useMemo(() => {
    if (!drafts) return [];
    return [...drafts].sort((a, b) => b.createdAt - a.createdAt);
  }, [drafts]);

  const styles: React.CSSProperties = {
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginTop: "2rem",
  };

  if (isLoading) return <p>Loading drafts...</p>;
  if (error) return <p>Error loading drafts.</p>;
  if (sortedDrafts.length === 0)
    return <p>Submit a meal description to see its status here.</p>;

  return (
    <div style={styles}>
      {sortedDrafts.map((draft) => (
        <MealDraftItem key={draft.id} draft={draft} />
      ))}
    </div>
  );
};