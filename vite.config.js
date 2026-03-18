import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: "automatic",
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: "src/index.js",
      name: "FlexiDataTable",
      fileName: "flexi-datatable",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.js",
  },
});
