import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../common/TopBar/TopBar";
import styles from "./MainLayout.module.css";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { breakpoints } from "../../../styles/breakpoints";
import { BottomNavBar } from "../../common/BottomNavBar/BottomNavBar";
import { useAuth } from "../../../providers/AuthProvider";
import MealTextInput from "../../../features/meals/components/MealTextInput/MealTextInput";

const MainLayout = () => {
  const isMobile = useMediaQuery(breakpoints.mobile);
  const { user } = useAuth();
  const [isMobileInputVisible, setMobileInputVisible] = useState(false);

  // We hold and update the viewport height to ensure we can position elements]
  // on mobile (e.g. position above the mobile keyboard)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileInput = () => {
    setMobileInputVisible((prev) => !prev);
  };

  const closeMobileInput = () => {
    setMobileInputVisible(false);
  };

  const appLayoutStyle = isMobile ? { height: `${viewportHeight}px` } : {};

  return (
    <div className={styles.appLayout} style={appLayoutStyle}>
      <TopBar />
      <main className={styles.appMainContent}>
        <Outlet />
      </main>

      {/* Mobile only elements */}
      {isMobileInputVisible && (
        <div
          className={styles.overlay}
          onClick={closeMobileInput}
          aria-hidden="true"
        />
      )}
      {isMobile && user && !isMobileInputVisible && (
        <BottomNavBar
          onCenterButtonClick={toggleMobileInput}
          isInputActive={false}
        />
      )}

      {isMobile && user && (
        <div
          className={`${styles.mobileInputWrapper} ${
            isMobileInputVisible ? styles.visible : ""
          }`}
        >
          {isMobileInputVisible && (
            <MealTextInput variant="mobile" onClose={closeMobileInput} />
          )}
        </div>
      )}
    </div>
  );
};

export default MainLayout;
