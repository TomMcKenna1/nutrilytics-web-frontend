import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { signOut } from '../features/auth/api/authService';

// Temporary styling
const styles: { [key:string]: React.CSSProperties } = {
    container: { maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
    detail: { marginBottom: '10px' },
    signOutButton: { 
        padding: '10px 20px', 
        cursor: 'pointer', 
        backgroundColor: '#e53e3e', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        marginTop: '20px',
    },
};


const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/login');
    }
  };

  if (!user) {
    return <p>No user is signed in.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Your Account</h2>
      <div style={styles.detail}>
        <strong>Email:</strong> {user.email}
      </div>
      <div style={styles.detail}>
        <strong>User ID:</strong> {user.uid}
      </div>
      
      <button onClick={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </button>
    </div>
  );
};

export default AccountPage;