import React from "react";
import GoogleIcon from "../../../../assets/icons/GoogleIcon";
import styles from "./GoogleSignInButton.module.css";

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.googleButton}
    >
      <div className={styles.iconWrapper}>
        <GoogleIcon />
      </div>
      <span>{children}</span>
    </button>
  );
};

export default GoogleSignInButton;
