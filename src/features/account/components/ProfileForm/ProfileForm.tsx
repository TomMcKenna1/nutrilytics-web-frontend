import React from "react";
import {
  type UserProfileCreate,
  ActivityLevelOptions,
  GoalOptions,
  SexOptions,
} from "../../types";
import styles from "./ProfileForm.module.css";

interface AccountProfileFormProps {
  email?: string | null;
  currentWeightKg?: number | null;
  profileForm: Partial<UserProfileCreate>;
  originalProfile?: Partial<UserProfileCreate>;
  isDirty: boolean;
  isUpdating: boolean;
  isSuccess: boolean;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSignOut: () => void;
}

export const ProfileForm = ({
  email,
  currentWeightKg,
  profileForm,
  originalProfile,
  isDirty,
  isUpdating,
  isSuccess,
  onFormChange,
  onSubmit,
  onSignOut,
}: AccountProfileFormProps) => {
  const isFieldDirty = (fieldName: keyof UserProfileCreate) => {
    if (!originalProfile) return false;
    return profileForm[fieldName] !== originalProfile[fieldName];
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Profile</h2>
        <button
          type="submit"
          form="profile-form"
          className={styles.button}
          disabled={!isDirty || isUpdating}
        >
          {isUpdating ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {isSuccess && (
        <p className={`${styles.message} ${styles.successMessage}`}>
          Profile saved!
        </p>
      )}

      <form id="profile-form" onSubmit={onSubmit}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Email</span>
          <span className={styles.detailValue}>{email ?? "N/A"}</span>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Current Weight (kg)</span>
            <span className={styles.detailValue}>
              {currentWeightKg?.toFixed(1) ?? "N/A"}
            </span>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="heightCm" className={styles.label}>
              Height (cm)
            </label>
            <input
              type="number"
              id="heightCm"
              name="heightCm"
              className={`${styles.input} ${isFieldDirty("heightCm") ? styles.dirty : ""}`}
              value={profileForm.heightCm ?? ""}
              onChange={onFormChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="age" className={styles.label}>
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className={`${styles.input} ${isFieldDirty("age") ? styles.dirty : ""}`}
              value={profileForm.age ?? ""}
              onChange={onFormChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sex" className={styles.label}>
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              className={`${styles.select} ${isFieldDirty("sex") ? styles.dirty : ""}`}
              value={profileForm.sex ?? ""}
              onChange={onFormChange}
            >
              {Object.values(SexOptions).map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="goal" className={styles.label}>
              Goal
            </label>
            <select
              id="goal"
              name="goal"
              className={`${styles.select} ${isFieldDirty("goal") ? styles.dirty : ""}`}
              value={profileForm.goal ?? ""}
              onChange={onFormChange}
            >
              {Object.entries(GoalOptions).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="activityLevel" className={styles.label}>
              Activity Level
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              className={`${styles.select} ${isFieldDirty("activityLevel") ? styles.dirty : ""}`}
              value={profileForm.activityLevel ?? ""}
              onChange={onFormChange}
            >
              {Object.entries(ActivityLevelOptions).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <div className={styles.actionsContainer}>
        <button onClick={onSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    </div>
  );
};
