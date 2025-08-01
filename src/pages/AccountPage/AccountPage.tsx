import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { signOut } from "../../features/auth/api/authService";
import { useAccount } from "../../hooks/useAccount";
import {
  type UserProfileCreate,
  type NutritionTarget,
} from "../../features/account/types";
import { ProfileForm } from "../../features/account/components/ProfileForm/ProfileForm";
import { TargetsForm } from "../../features/account/components//TargetsForm/TargetsForm";
import styles from "./AccountPage.module.css";
import { useQueryClient } from "@tanstack/react-query";

const AccountPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    account,
    isLoading: isLoadingAccount,
    isError,
    error,
    updateProfile,
    isUpdatingProfile,
    isProfileUpdateSuccess,
    updateTargets,
    isUpdatingTargets,
    isTargetsUpdateSuccess,
  } = useAccount();

  const [profileForm, setProfileForm] = useState<Partial<UserProfileCreate>>(
    {}
  );
  const [nutritionForm, setNutritionForm] = useState<Partial<NutritionTarget>>(
    {}
  );
  const [activeSection, setActiveSection] = useState<"profile" | "targets">(
    "profile"
  );

  useEffect(() => {
    if (account?.profile) {
      setProfileForm(account.profile);
    }
    if (account?.nutritionTargets) {
      setNutritionForm(account.nutritionTargets);
    }
  }, [account]);

  const isProfileFormDirty = useMemo(() => {
    if (!account?.profile) return false;
    return JSON.stringify(account.profile) !== JSON.stringify(profileForm);
  }, [account, profileForm]);

  const isTargetsFormDirty = useMemo(() => {
    if (!account?.nutritionTargets) return false;
    return (
      JSON.stringify(account.nutritionTargets) !== JSON.stringify(nutritionForm)
    );
  }, [account, nutritionForm]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericValue =
      e.target.type === "number" && value !== "" ? Number(value) : value;

    if (activeSection === "profile") {
      setProfileForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setNutritionForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === "profile") {
      const { weightKg, ...profileToUpdate } = profileForm;
      await updateProfile(profileToUpdate);
    } else {
      await updateTargets(nutritionForm);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate("/login");
  };

  if (isLoadingAccount || isAuthLoading) {
    return <p className={styles.message}>Loading your account...</p>;
  }

  if (isError) {
    return (
      <p className={`${styles.message} ${styles.errorMessage}`}>
        Error: {error?.message}
      </p>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Account Settings</h1>
      </header>
      <div className={styles.pageContainer}>
        <aside className={styles.sidebar}>
          <button
            className={`${styles.sidebarItem} ${activeSection === "profile" ? styles.active : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            className={`${styles.sidebarItem} ${activeSection === "targets" ? styles.active : ""}`}
            onClick={() => setActiveSection("targets")}
          >
            Targets
          </button>
        </aside>

        <main className={styles.contentArea}>
          {activeSection === "profile" && account?.profile && (
            <ProfileForm
              email={user?.email}
              currentWeightKg={account?.currentWeightKg}
              profileForm={profileForm}
              originalProfile={account?.profile}
              isDirty={isProfileFormDirty}
              isUpdating={isUpdatingProfile}
              isSuccess={isProfileUpdateSuccess}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onSignOut={handleSignOut}
            />
          )}

          {activeSection === "targets" && account?.nutritionTargets && (
            <TargetsForm
              nutritionForm={nutritionForm}
              originalTargets={account?.nutritionTargets}
              isDirty={isTargetsFormDirty}
              isUpdating={isUpdatingTargets}
              isSuccess={isTargetsUpdateSuccess}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
