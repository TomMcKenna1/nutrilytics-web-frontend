import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "../../features/auth/api/authService";
import { useAuth } from "../../providers/AuthProvider";
import GoogleSignInButton from "../../features/auth/components/GoogleSignInButton/GoogleSignInButton";
import styles from "./LoginPage.module.css";

interface AuthError extends Error {
  code?: string;
}

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const authAction = isLoginView ? signInWithEmail : signUpWithEmail;
    const { error: authError } = (await authAction(email, password)) as {
      error: AuthError | null;
    };

    if (authError) {
      console.error("Firebase Auth Error:", authError.code);
      switch (authError.code) {
        // --- SIGN UP ERRORS ---
        case "auth/email-already-in-use":
          setError("An account already exists with this email. Please log in.");
          break;
        case "auth/weak-password":
          setError(
            "Password is too weak. It should be at least 6 characters long."
          );
          break;

        // --- LOGIN ERRORS ---
        case "auth/invalid-credential":
          setError(
            "Invalid credentials. Please check your email and password."
          );
          break;

        // --- COMMON ERRORS ---
        case "auth/invalid-email":
          setError(
            "The email address is not valid. Please enter a valid email."
          );
          break;
        case "auth/too-many-requests":
          setError(
            "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
          );
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;

        // --- DEFAULT ---
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const { error: authError } = (await signInWithGoogle()) as {
      error: AuthError | null;
    };
    if (authError) {
      switch (authError.code) {
        case "auth/popup-closed-by-user":
          setError("The sign-in window was closed. Please try again.");
          break;
        default:
          setError("Could not sign in with Google. Please try again.");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {isLoginView ? "Login to Nutrilytics" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className={styles.input}
          />
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Loading..." : isLoginView ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoading}>
          Continue with Google
        </GoogleSignInButton>

        {error && <p className={styles.error}>{error}</p>}

        <div
          onClick={() => {
            setIsLoginView(!isLoginView);
            setError(null);
          }}
          className={styles.toggleLink}
        >
          {isLoginView
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
