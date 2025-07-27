import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { router } from "./routes/AppRoutes";
import { SSEManager } from "./components/common/SSEManager/SSEManager";

function App() {
  return (
    <AuthProvider>
      <SSEManager />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
