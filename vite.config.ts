import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
        // Optional: you can rewrite the path if needed
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
