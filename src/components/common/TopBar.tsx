import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { createMealDraft } from '../../features/meals/api/mealService';
import { useDraftStore } from '../../store/draftStore';

// Temp
const styles: { [key: string]: React.CSSProperties } = {
  topBar: {
    backgroundColor: '#ffffff',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#2d3748',
  },
  mealForm: {
    display: 'flex',
    flexGrow: 1,
    maxWidth: '600px',
  },
  mealInput: {
    width: '100%',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  mealButton: {
    padding: '0.5rem 1.5rem',
    cursor: 'pointer',
    backgroundColor: '#5a67d8',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    fontSize: '1rem',
  },
  accountCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#cbd5e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#4a5568',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
  },
  signInButton: {
    padding: '8px 16px',
    backgroundColor: '#5a67d8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer',
  }
};

const TopBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addDraft } = useDraftStore((state) => state.actions);

  const [mealInput, setMealInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G'; // Guest
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
    <header style={styles.topBar}>
      <Link to="/" style={styles.logo}>
        Nutrilytics
      </Link>

      {user && (
        <div style={styles.mealForm}>
          <input
            type="text"
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., A bowl of oatmeal with berries..."
            style={styles.mealInput}
            disabled={isSubmitting}
          />
          <button onClick={handleMealSubmit} disabled={isSubmitting} style={styles.mealButton}>
            {isSubmitting ? '...' : 'Log'}
          </button>
        </div>
      )}

      <div>
        {user ? (
          <Link to="/account" style={styles.accountCircle}>
            {getInitials(user.email)}
          </Link>
        ) : (
          <button onClick={() => navigate('/login')} style={styles.signInButton}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;