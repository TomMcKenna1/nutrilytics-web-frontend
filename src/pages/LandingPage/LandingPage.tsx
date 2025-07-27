import { Link, Navigate } from "react-router-dom";
import { FiType, FiBarChart2, FiCpu, FiShield } from "react-icons/fi"; // Added FiShield for the new feature
import styles from "./LandingPage.module.css";
import { useAuth } from "../../providers/AuthProvider";

export const LandingPage = () => {
  const { user, isLoading } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Understand Your Food.
          <br />
          <span className={styles.headlineAccent}>Master Your Health.</span>
        </h1>
        <p className={styles.subheadline}>
          Nutrilytics uses custom AI to instantly analyze your meals, track
          nutrients, and predict food intolerances to help you feel your best.
          Stop guessing, start knowing.
        </p>
        <Link to="/login" className={styles.ctaButton}>
          Get Started for Free
        </Link>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <FiType className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Log Meals Instantly</h3>
          <p className={styles.featureText}>
            Just describe what you ate. Our AI breaks down ingredients and
            calculates nutritional information in seconds. No more tedious
            manual entry.
          </p>
        </div>
        <div className={styles.featureCard}>
          <FiShield className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Predict Intolerances</h3>
          <p className={styles.featureText}>
            Our unique AI models analyze your logs to identify patterns and
            predict potential food intolerances, helping you reduce bloating and
            discomfort.
          </p>
        </div>
        <div className={styles.featureCard}>
          <FiCpu className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Uncover Deep Insights</h3>
          <p className={styles.featureText}>
            Go beyond simple calorie counting. Discover patterns in your diet,
            understand your habits, and get personalized analytics to optimize
            your health.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>
          Ready to Take Control of Your Nutrition?
        </h2>
        <Link
          to="/login"
          className={`${styles.ctaButton} ${styles.ctaButtonLarge}`}
        >
          Sign Up and Start Analyzing
        </Link>
      </section>
    </div>
  );
};
