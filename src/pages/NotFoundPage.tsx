import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-text)',
    },
    heading: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: 'var(--spacing-2)',
    },
    message: {
      fontSize: '1.25rem',
      marginBottom: 'var(--spacing-4)',
    },
    link: {
      padding: 'var(--spacing-2) var(--spacing-3)',
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      transition: 'transform 0.2s ease',
    },
    svg: {
      width: '150px',
      height: '150px',
      marginBottom: 'var(--spacing-4)',
      color: 'var(--color-border)',
    },
  };

  return (
    <div style={styles.container}>
      <svg
        style={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 14.25l6-6m-6 0l6 6"
        />
      </svg>

      <h1 style={styles.heading}>404 - Plate Not Found</h1>
      <p style={styles.message}>
        Oops! It looks like the recipe for this page doesn't exist.
      </p>
      <Link to="/" style={styles.link}>
        Go Back to My Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;