import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import DraftPage from "../pages/DraftPage/DraftPage";
import MealPage from "../pages/MealPage/MealPage";
import AccountPage from "../pages/AccountPage/AccountPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
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
      {
        // Catch-all
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
