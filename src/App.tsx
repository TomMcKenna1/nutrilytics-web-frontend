import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { router } from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;