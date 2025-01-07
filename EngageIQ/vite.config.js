import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.langflow.astra.datastax.com", // Replace with the base URL of your API
        changeOrigin: true, // Ensures the host header matches the target
        secure: true, // Use false if your target uses self-signed SSL certificates
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite the path to remove "/api" prefix
      },
    },
  },
});
