import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { router } from './routes/AppRoutes';
import { useMealDraftsPolling } from './hooks/useMealDraftService';

function App() {
  useMealDraftsPolling();
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;