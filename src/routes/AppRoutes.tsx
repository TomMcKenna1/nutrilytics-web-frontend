import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import DraftPage from "../pages/DraftPage";
import MealPage from "../pages/MealPage";
import AccountPage from "../pages/AccountPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/draft/:draftId",
            element: <DraftPage />,
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
    ],
  },
  {
    // Catch-all
    path: "*",
    element: <NotFoundPage />,
  },
]);
