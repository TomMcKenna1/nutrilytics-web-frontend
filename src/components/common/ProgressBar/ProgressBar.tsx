import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarFill} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export default ProgressBar;