import React from 'react';
import { Link } from 'react-router-dom';

// Temp
const styles: { [key: string]: React.CSSProperties } = {
  topBar: {
    backgroundColor: '#ffffff',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#2d3748',
  }
};

const TopBar = () => {
  return (
    <header style={styles.topBar}>
      <Link to="/" style={styles.logo}>
        Nutrilytics
      </Link>
    </header>
  );
};

export default TopBar;