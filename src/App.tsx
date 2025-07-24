import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { router } from "./routes/AppRoutes";
import { DraftsPollingManager } from "./features/meals/components/DraftsPollingManager";

function App() {
  return (
    <AuthProvider>
      <DraftsPollingManager />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
