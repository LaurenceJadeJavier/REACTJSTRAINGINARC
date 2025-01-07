import { defineConfig } from "vite";
// import dns from "dns";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
// Set To DNS Address to Locahost
// dns.setDefaultResultOrder("verbatim"); -> removed, already fix on the CORS in BE

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 5000, // Set warning threshold to 1 MB
  },
  // server: {
  //   port: 3000, // Set the port to 3000
  // },
  //define: { global: {} },
});
