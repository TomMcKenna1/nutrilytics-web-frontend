import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../providers/AuthProvider';
import { createMealDraft } from '../../../../features/meals/api/mealService';
import { useDraftStore } from '../../../../store/draftStore';
import styles from './MealTextInput.module.css';

const MealTextInput = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addDraft } = useDraftStore((state) => state.actions);

  const [mealInput, setMealInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMealSubmit = async () => {
    if (!mealInput.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { draftId } = await createMealDraft(mealInput);
      addDraft(draftId, mealInput, user.uid);
      setMealInput('');
      navigate(`/draft/${draftId}`);
    } catch (err) {
      setError((err as Error).message);
      console.error("Failed to create meal draft:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMealSubmit();
    }
  };

  return (
    <div className={styles.mealForm}>
      <input
        type="text"
        value={mealInput}
        onChange={(e) => setMealInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. A bowl of oatmeal with berries..."
        className={styles.mealInput}
        disabled={isSubmitting}
      />
      <button onClick={handleMealSubmit} disabled={isSubmitting} className={styles.mealButton}>
        {isSubmitting ? '...' : 'Log'}
      </button>
       {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default MealTextInput;