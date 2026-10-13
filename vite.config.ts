import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// Single absolute outDir so Vite and dts plugin never create Build/Build
const buildOutDir = resolve(__dirname, "Build");

/**
 * Runtime dependencies left as imports in the npm builds (pgl_module.js / pgl.js) so apps share
 * one copy of three.js. Only exact package ids: the OrbitControls addon (ESM-only) is bundled,
 * and its own `import "three"` stays external.
 */
const npmExternals = ["three", "gl-matrix"];

// Vitest options are merged at runtime; cast so TypeDoc/tsc don't require vitest types
const config = ({ mode }: { mode: string }) => {
  // `vite build --mode standalone` emits Build/pgl_standalone.js with three.js bundled,
  // for <script type="module"> use without a bundler (used by the Examples).
  const standalone = mode === "standalone";
  return {
    plugins: standalone
      ? []
      : [
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
        formats: standalone ? ["es"] : ["es", "cjs"],
        fileName: (format: string) =>
          standalone ? "pgl_standalone.js" : format === "es" ? "pgl_module.js" : "pgl.js",
      },
      outDir: buildOutDir,
      emptyOutDir: !standalone,
      sourcemap: true,
      rollupOptions: {
        external: standalone ? [] : npmExternals,
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
};

export default defineConfig(config as unknown as import("vite").UserConfigFnObject);
