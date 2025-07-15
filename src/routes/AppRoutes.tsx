import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Page Imports
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage'; 

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
    ],
  },
  {
    // Catch-all
    path: '*',
    element: <NotFoundPage />,
  },
]);