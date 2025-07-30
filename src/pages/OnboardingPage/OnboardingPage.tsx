import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OnboardingPage.module.css";
import {
  type UserProfileCreate,
  type OnboardingPayload,
  SexOptions,
  GoalOptions,
  ActivityLevelOptions,
} from "../../features/account/types";
import { useAccount } from "../../hooks/useAccount";
import { calculateInitialTargets } from "../../utils/nutritionCalculator";
import ProgressBar from "../../components/common/ProgressBar/ProgressBar";

const onboardingSteps = [
  {
    id: "sex",
    title: "What is your biological sex?",
    subtitle: "This helps us calculate your baseline metabolic rate.",
    options: SexOptions,
  },
  {
    id: "age",
    title: "How old are you?",
    subtitle: "Your age is a key factor in determining calorie needs.",
    inputType: "number",
  },
  {
    id: "heightCm",
    title: "What is your height in centimeters?",
    subtitle: "We use this to help personalize your nutrition targets.",
    inputType: "number",
  },
  {
    id: "weightKg",
    title: "What is your current weight in kilograms?",
    subtitle: "This is used as a baseline for your goals.",
    inputType: "number",
  },
  {
    id: "goal",
    title: "What is your primary goal?",
    subtitle: "This will help us tailor your macronutrient recommendations.",
    options: GoalOptions,
  },
  {
    id: "activityLevel",
    title: "How would you describe your daily activity level?",
    subtitle: "This accounts for the calories you burn throughout the day.",
    options: [
      {
        value: ActivityLevelOptions.SEDENTARY,
        description: "Little to no exercise, desk job",
      },
      {
        value: ActivityLevelOptions.LIGHTLY_ACTIVE,
        description: "Light exercise or sports 1-3 days a week",
      },
      {
        value: ActivityLevelOptions.MODERATELY_ACTIVE,
        description: "Moderate exercise or sports 3-5 days a week",
      },
      {
        value: ActivityLevelOptions.VERY_ACTIVE,
        description: "Hard exercise or sports 6-7 days a week",
      },
      {
        value: ActivityLevelOptions.EXTRA_ACTIVE,
        description:
          "Very hard exercise, physical job, or training twice a day",
      },
    ],
  },
];

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfileCreate>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { onboard, isOnboarding } = useAccount();

  const step = onboardingSteps[currentStep];
  const totalSteps = onboardingSteps.length;

  const handleSubmit = async (profileData: UserProfileCreate) => {
    try {
      const nutritionTargets = calculateInitialTargets(profileData);

      const payload: OnboardingPayload = {
        profile: profileData,
        nutritionTargets,
      };

      await onboard(payload);

      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setError("We couldn't save your profile. Please try again.");
    }
  };

  const handleOptionClick = (value: string) => {
    setError(null);
    const newFormData = { ...formData, [step.id]: value };
    setFormData(newFormData);

    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(newFormData as UserProfileCreate);
      }
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "number"
        ? parseInt(e.target.value) || undefined
        : e.target.value;
    setFormData({ ...formData, [step.id]: value });
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleManualNext = () => {
    if (!formData[step.id as keyof UserProfileCreate]) {
      setError("Please enter a value to continue.");
      return;
    }
    setError(null);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(formData as UserProfileCreate);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <ProgressBar current={currentStep + 1} total={totalSteps} />
        <h2 className={styles.title}>{step.title}</h2>
        <p className={styles.subtitle}>{step.subtitle}</p>

        <div className={styles.optionsContainer}>
          {Array.isArray(step.options) ? (
            step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`${styles.optionCard} ${
                  formData[step.id as keyof UserProfileCreate] === option.value
                    ? styles.selected
                    : ""
                }`}
              >
                <span className={styles.optionTitle}>
                  {option.value.replace(/_/g, " ")}
                </span>
                <span className={styles.optionDescription}>
                  {option.description}
                </span>
              </button>
            ))
          ) : step.options ? (
            Object.values(step.options).map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`${styles.optionCard} ${
                  formData[step.id as keyof UserProfileCreate] === option
                    ? styles.selected
                    : ""
                }`}
              >
                {option.replace(/_/g, " ")}
              </button>
            ))
          ) : (
            <input
              type={step.inputType}
              value={formData[step.id as keyof UserProfileCreate] || ""}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.navigation}>
          {currentStep > 0 ? (
            <button onClick={handleBack} className={styles.backButton}>
              Back
            </button>
          ) : (
            <div />
          )}

          {step.inputType &&
            (currentStep < totalSteps - 1 ? (
              <button onClick={handleManualNext} className={styles.nextButton}>
                Next
              </button>
            ) : (
              <button
                onClick={handleManualNext}
                disabled={isOnboarding}
                className={styles.nextButton}
              >
                {isOnboarding ? "Saving..." : "Finish"}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
