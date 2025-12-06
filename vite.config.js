import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://eldercareapi.onrender.com/",
        changeOrigin: true,
      },
      "/health": { target: "http://localhost:5174", changeOrigin: true },
    },
  },
});
