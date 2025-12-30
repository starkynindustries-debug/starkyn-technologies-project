import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::", // Listen on all IPv4 & IPv6 addresses
    port: 8080, // Dev server port
  },
  plugins: [react()], // Only React plugin
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Shortcut for imports
    },
  },
});
