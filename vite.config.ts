import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('🔍 Loaded environment variables:');
  console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set ✅' : 'Missing ❌');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': {},
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  };
});