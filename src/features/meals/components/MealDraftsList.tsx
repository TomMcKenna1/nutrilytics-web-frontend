import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDraftStore } from '../../../store/draftStore';
import type { Draft } from '../types';

const MealDraftItem = ({ draft }: { draft: Draft }) => {
  // temp styles
  const styles: { [key: string]: React.CSSProperties } = {
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem',
      borderBottom: '1px solid #e2e8f0',
      gap: '1rem',
    },
    icon: { width: '24px', height: '24px' },
    text: { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    link: { textDecoration: 'none', color: 'inherit' },
  };

  const renderStatus = () => {
    switch (draft.status) {
      case 'pending':
        return <div style={styles.icon}>⏳</div>;
      case 'complete':
        return <div style={styles.icon}>✅</div>;
      case 'error':
        return <div style={styles.icon} title={draft.error}>❌</div>;
      default:
        return null;
    }
  };

  if (draft.status === 'complete' && draft.mealDraft) {
    return (
      <Link to={`/draft/${draft.id}`} style={styles.link}>
        <div style={styles.item}>
          {renderStatus()}
          <span style={styles.text}>{draft.originalInput}</span>
        </div>
      </Link>
    );
  }

  return (
    <div style={styles.item}>
      {renderStatus()}
      <span style={styles.text}>{draft.originalInput}</span>
    </div>
  );
};


export const MealDraftsList = () => {
  const drafts = useDraftStore((state) => state.drafts);
  const sortedDrafts = useMemo(() => {
    return Object.values(drafts).sort((a, b) => b.createdAt - a.createdAt);
  }, [drafts]);

  if (sortedDrafts.length === 0) {
    return <p>Submit a meal description to see its status here.</p>;
  }

  const styles: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginTop: '2rem',
  };

  return (
    <div style={styles}>
      {sortedDrafts.map((draft) => (
        <MealDraftItem key={draft.id} draft={draft} />
      ))}
    </div>
  );
};