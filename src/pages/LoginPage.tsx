import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../features/auth/api/authService';
import { useAuth } from '../providers/AuthProvider';

// Temporary styling
const styles: { [key:string]: React.CSSProperties } = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', fontSize: '1rem' },
    button: { padding: '10px', cursor: 'pointer', backgroundColor: '#5a67d8', color: 'white', border: 'none', borderRadius: '4px' },
    googleButton: { backgroundColor: '#db4437' },
    toggleLink: { cursor: 'pointer', color: '#5a67d8', textDecoration: 'underline', textAlign: 'center', marginTop: '10px' },
    error: { color: 'red', marginTop: '10px' },
};


const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const authAction = isLoginView ? signInWithEmail : signUpWithEmail;
    const { error: authError } = await authAction(email, password);

    if (authError) {
      setError(authError.message);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
        setError(authError.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
        navigate('/');
    }
  }, [])
  
  return (
    <div style={styles.container}>
      <h2>{isLoginView ? 'Login to Nutrilytics' : 'Create an Account'}</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          style={styles.input}
        />
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Loading...' : (isLoginView ? 'Login' : 'Sign Up')}
        </button>
      </form>
      
      <hr style={{ margin: '20px 0' }} />

      <button onClick={handleGoogleSignIn} disabled={isLoading} style={{...styles.button, ...styles.googleButton}}>
        {isLoading ? 'Loading...' : 'Continue with Google'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <div onClick={() => setIsLoginView(!isLoginView)} style={styles.toggleLink}>
        {isLoginView
          ? "Don't have an account? Sign Up"
          : 'Already have an account? Login'}
      </div>
    </div>
  );
};

export default LoginPage;