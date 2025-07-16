import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Page Imports
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage'; 
import DraftPage from '../pages/DraftPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Protected routes
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/draft/:draftId',
        element: <DraftPage />,
      },
    ],
  },
  {
    // Catch-all
    path: '*',
    element: <NotFoundPage />,
  },
]);