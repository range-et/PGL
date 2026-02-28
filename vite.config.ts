import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// Single absolute outDir so Vite and dts plugin never create Build/Build
const buildOutDir = resolve(__dirname, "Build");

// Vitest options are merged at runtime; cast so TypeDoc/tsc don't require vitest types
const config = {
  plugins: [
    dts({
      entryRoot: "Src",
      include: ["Src/**/*.ts"],
      exclude: ["Src/**/*.test.ts", "**/node_modules"],
      outDir: buildOutDir,
    }),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "Src/index.ts"),
      name: "PGL",
      formats: ["es", "cjs"],
      fileName: (format: string) => (format === "es" ? "pgl_module.js" : "pgl.js"),
    },
    outDir: buildOutDir,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo: { name?: string }) => {
          if (assetInfo.name?.endsWith(".css")) return "pgl.css";
          return assetInfo.name ?? "asset";
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/unit/**/*.test.ts", "Src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "Src"),
    },
  },
};

export default defineConfig(config as import("vite").UserConfigExport);
