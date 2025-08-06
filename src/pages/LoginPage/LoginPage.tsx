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
import { createUserRecord } from "../../features/account/api/accountService";

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

    if (isLoginView) {
      const { error: authError } = (await signInWithEmail(email, password)) as {
        error: AuthError | null;
      };
      handleAuthError(authError);
    } else {
      const { user: newUser, error: signUpError } = await signUpWithEmail(
        email,
        password,
      );

      if (signUpError) {
        handleAuthError(signUpError as AuthError);
      } else if (newUser) {
        try {
          await createUserRecord();
          navigate("/dashboard");
        } catch (apiError) {
          setError("Could not initialize your account. Please try again.");
          console.error("API Error creating user record:", apiError);
        }
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const {
      user: googleUser,
      error: authError,
      isNewUser,
    } = await signInWithGoogle();

    if (authError) {
      handleAuthError(authError as AuthError);
      setIsLoading(false);
      return;
    }

    if (googleUser) {
      if (isNewUser) {
        try {
          await createUserRecord();
          navigate("/dashboard");
        } catch (apiError) {
          setError("Could not initialize your account. Please try again.");
          console.error("API Error creating user record:", apiError);
        }
      } else {
        navigate("/dashboard");
      }
    }

    setIsLoading(false);
  };

  const handleAuthError = (authError: AuthError | null) => {
    if (!authError) return;

    console.error("Firebase Auth Error:", authError.code);
    switch (authError.code) {
      case "auth/popup-closed-by-user":
        setError("The sign-in window was closed. Please try again.");
        break;
      case "auth/email-already-in-use":
        setError("An account already exists with this email. Please log in.");
        break;
      case "auth/weak-password":
        setError(
          "Password is too weak. It should be at least 6 characters long.",
        );
        break;
      case "auth/invalid-credential":
        setError("Invalid credentials. Please check your email and password.");
        break;
      case "auth/invalid-email":
        setError("The email address is not valid. Please enter a valid email.");
        break;
      case "auth/too-many-requests":
        setError(
          "Access to this account has been temporarily disabled. Please reset your password or try again later.",
        );
        break;
      case "auth/network-request-failed":
        setError("Network error. Please check your internet connection.");
        break;
      default:
        setError("An unexpected error occurred. Please try again.");
        break;
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
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
