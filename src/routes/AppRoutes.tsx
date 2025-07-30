import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import MealPage from "../pages/MealPage/MealPage";
import AccountPage from "../pages/AccountPage/AccountPage";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import OnboardingPage from "../pages/OnboardingPage/OnboardingPage";
import DashboardSummaryPage from "../pages/DashboardSummaryPage/DashboardSummaryPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/onboarding",
            element: <OnboardingPage />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
            children: [
              {
                index: true,
                element: <DashboardSummaryPage />,
              },
              {
                path: "calendar",
                element: <CalendarPage />,
              },
            ],
          },
          {
            path: "/meal/:mealId",
            element: <MealPage />,
          },
          {
            path: "/account",
            element: <AccountPage />,
          },
        ],
      },
      {
        // Catch-all
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
