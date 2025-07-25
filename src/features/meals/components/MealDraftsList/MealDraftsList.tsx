import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import { useMealDrafts } from "../../../../hooks/useMealDrafts";
import { useMealDraft } from "../../../../hooks/useMealDraft";
import type { Draft } from "../../types";
import styles from "./MealDraftsList.module.css";

const Loader = () => (
  <div className={styles.loader}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className={styles.bar} />
    ))}
  </div>
);

const MealDraftItem = ({ draft }: { draft: Draft }) => {
  const { discard, isDiscarding } = useMealDraft(draft.id);

  const renderStatus = () => {
    switch (draft.status) {
      case "pending_edit":
      case "pending":
        return (
          <div className={styles.icon}>
            <Loader />
          </div>
        );
      case "complete":
        return (
          <div className={`${styles.icon} ${styles.completeIcon}`}>
            <FiCheck />
          </div>
        );
      case "error":
        return (
          <div
            className={`${styles.icon} ${styles.errorIcon}`}
            title={draft.error}
          >
            <FiX />
          </div>
        );
      default:
        return null;
    }
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDiscarding) {
      discard();
    }
  };

  const displayText = draft.mealDraft?.name || draft.originalInput;
  const isPending =
    draft.status === "pending" || draft.status === "pending_edit";
  const itemClasses = `${styles.item} ${isPending ? styles.pendingItem : ""}`;

  const content = (
    <div className={itemClasses}>
      {renderStatus()}
      <span className={styles.text}>{displayText}</span>
      <button
        className={styles.discardButton}
        onClick={handleDiscard}
        disabled={isDiscarding || isPending}
        title="Discard Draft"
      >
        {isDiscarding ? <Loader /> : <FiTrash2 />}
      </button>
    </div>
  );

  const canNavigate =
    draft.mealDraft &&
    (draft.status === "complete" || draft.status === "pending_edit");

  if (canNavigate) {
    return (
      <Link to={`/draft/${draft.id}`} className={styles.itemLink}>
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

  if (isLoading)
    return <p className={styles.statusMessage}>Loading drafts...</p>;
  if (error)
    return <p className={styles.statusMessage}>Error loading drafts.</p>;
  if (sortedDrafts.length === 0)
    return (
      <p className={styles.statusMessage}>
        Submit a meal description to see its status here.
      </p>
    );

  return (
    <div className={styles.container}>
      {sortedDrafts.map((draft) => (
        <MealDraftItem key={draft.id} draft={draft} />
      ))}
    </div>
  );
};
