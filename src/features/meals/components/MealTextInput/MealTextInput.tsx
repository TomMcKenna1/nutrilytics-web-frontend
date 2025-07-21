import React, { useState } from 'react';
import { useCreateMealDraft } from '../../../../hooks/useCreateMealDraft';
import styles from './MealTextInput.module.css';

const MealTextInput = () => {
  const [mealInput, setMealInput] = useState('');
  const { mutate: createDraft, isPending: isSubmitting, error } = useCreateMealDraft();

  const handleMealSubmit = async () => {
    if (!mealInput.trim()) return;

    createDraft(mealInput, {
      onSuccess: () => {
        // Clear the input field after successful submission
        setMealInput('');
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMealSubmit();
    }
  };

  // Safely access error message
  const errorMessage = error instanceof Error ? error.message : null;

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
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MealTextInput;