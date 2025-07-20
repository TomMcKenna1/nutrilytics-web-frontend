import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { createMealDraft } from '../../../features/meals/api/mealService';
import { useDraftStore } from '../../../store/draftStore';
import styles from './TopBar.module.css';
import { FaCarrot } from 'react-icons/fa';

const TopBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addDraft } = useDraftStore((state) => state.actions);

  const [mealInput, setMealInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (email: string | null | undefined) => {
    // For a potential guest
    if (!email) return 'G';
    return email.substring(0, 1).toUpperCase();
  }

  const handleMealSubmit = async () => {
    if (!mealInput.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { draftId } = await createMealDraft(mealInput);
      addDraft(draftId, mealInput);
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
    <header className={styles.topBar}>
      <Link to="/" className={styles.logo}>
        <FaCarrot className={styles.logoIcon} />
        Nutrilytics
      </Link>

      {user && (
        <div className={styles.mealForm}>
          <input
            type="text"
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., A bowl of oatmeal with berries..."
            className={styles.mealInput}
            disabled={isSubmitting}
          />
          <button onClick={handleMealSubmit} disabled={isSubmitting} className={styles.mealButton}>
            {isSubmitting ? '...' : 'Log'}
          </button>
        </div>
      )}

      <div>
        {user ? (
          <Link to="/account" className={styles.accountCircle}>
            {getInitials(user.email)}
          </Link>
        ) : (
          <button onClick={() => navigate('/login')} className={styles.signInButton}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;