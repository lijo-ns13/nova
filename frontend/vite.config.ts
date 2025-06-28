// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      target: "esnext", // ✅ optional: supports newer syntax during build
      emptyOutDir: true, // ✅ cleans old dist files before build
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // ✅ safer for global defines
    },
    server: {
      port: 5173,
      strictPort: true, // ✅ helps avoid random port switching during dev
    },
  };
});
