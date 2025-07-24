import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { signOut } from "../../features/auth/api/authService";
import { useNutritionTargets } from "../../hooks/useNutritionTargets";
import type { NutritionTarget } from "../../features/account/types";
import styles from "./AccountPage.module.css";

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    targets,
    isLoading,
    isError,
    error,
    updateTargets,
    isUpdating,
    updateError,
  } = useNutritionTargets();

  const [nutritionForm, setNutritionForm] = useState<NutritionTarget>({
    energy: 0,
    protein: 0,
    carbohydrates: 0,
    sugars: 0,
    fats: 0,
    saturatedFats: 0,
    fibre: 0,
    salt: 0,
  });

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (targets) {
      setNutritionForm({
        energy: targets.energy || 0,
        fats: targets.fats || 0,
        saturatedFats: targets.saturatedFats || 0,
        carbohydrates: targets.carbohydrates || 0,
        sugars: targets.sugars || 0,
        fibre: targets.fibre || 0,
        protein: targets.protein || 0,
        salt: targets.salt || 0,
      });
    }
  }, [targets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutritionForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    if (isUpdated) setIsUpdated(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      navigate("/login");
    }
  };

  const handleUpdateTargets = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUpdated) setIsUpdated(false);

    try {
      await updateTargets(nutritionForm);
      setIsUpdated(true);
      setTimeout(() => setIsUpdated(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!user) {
    return <p className={styles.message}>No user is signed in.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Account Settings</h1>
      </header>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>User Information</h2>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Email</span>
          <span className={styles.detailValue}>{user.email}</span>
        </div>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Daily Nutrition Targets</h2>
        {isLoading && <p className={styles.message}>Loading targets...</p>}
        {isError && (
          <p className={`${styles.message} ${styles.errorMessage}`}>
            Error: {error?.message}
          </p>
        )}

        <form onSubmit={handleUpdateTargets} className={styles.form}>
          <div className={styles.formGrid}>
            {Object.keys(nutritionForm).map((key) => {
              const label =
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1");
              const unit = key === "energy" ? "kcal" : "g";

              return (
                <div className={styles.formGroup} key={key}>
                  <label htmlFor={key} className={styles.label}>
                    {label} ({unit})
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    className={styles.input}
                    value={nutritionForm[key as keyof NutritionTarget]}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.button}
              disabled={isUpdating || isLoading}
            >
              {isUpdating ? "Updating..." : "Update Targets"}
            </button>
            {isUpdated && (
              <p className={`${styles.message} ${styles.successMessage}`}>
                Targets updated successfully!
              </p>
            )}
            {updateError && (
              <p className={`${styles.message} ${styles.errorMessage}`}>
                Error: {updateError.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
