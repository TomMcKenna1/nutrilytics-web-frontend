import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { useAccount } from "../../../hooks/useAccount";
import styles from "./TopBar.module.css";
import { FaCarrot } from "react-icons/fa";
import { TbFlame, TbFlameFilled } from "react-icons/tb";
import MealTextInput from "../../../features/meals/components/MealTextInput/MealTextInput";

const TopBar = () => {
  const { user } = useAuth();
  const { account } = useAccount();
  const navigate = useNavigate();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "G";
    return email.substring(0, 1).toUpperCase();
  };

  const streak = account?.logStreak ?? 0;

  return (
    <header className={styles.topBar}>
      <Link to="/" className={styles.logo}>
        <FaCarrot className={styles.logoIcon} />
        Nutrilytics
      </Link>

      <MealTextInput />

      <div className={styles.accountSection}>
        {user && account && (
          <div className={styles.streakDisplay}>
            {streak > 0 ? (
              <TbFlameFilled className={styles.streakIconFilled} />
            ) : (
              <TbFlame className={styles.streakIconOutline} />
            )}
            <span className={styles.streakCount}>{streak}</span>
          </div>
        )}

        {user ? (
          <Link to="/account" className={styles.accountCircle}>
            {getInitials(user.email)}
          </Link>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={styles.signInButton}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;