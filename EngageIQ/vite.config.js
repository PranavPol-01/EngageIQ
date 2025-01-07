import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://api.langflow.astra.datastax.com", // Replace with your actual Langflow API URL
      changeOrigin: true,
      secure: false,
    },
  },
});
