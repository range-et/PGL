import { describe, it, expect } from "vitest";
import { build, type Rollup } from "vite";
import viteConfig from "../../vite.config";

async function bundle(mode: string) {
  const config = (viteConfig as unknown as (env: { mode: string }) => Record<string, any>)({ mode });
  const result = (await build({
    ...config,
    configFile: false,
    logLevel: "silent",
    plugins: [],
    build: { ...config.build, write: false, sourcemap: false },
  })) as Rollup.RollupOutput[];
  const esm = result.find((r) => r.output.some((c) => c.fileName.endsWith(".js") && c.type === "chunk"))!;
  return esm.output.find((c): c is Rollup.OutputChunk => c.type === "chunk" && c.isEntry)!;
}

describe("library build", () => {
  it("npm ESM build imports three and gl-matrix instead of bundling them", async () => {
    const entry = await bundle("production");
    expect(entry.fileName).toBe("pgl_module.js");
    expect(entry.imports).toEqual(expect.arrayContaining(["three", "gl-matrix"]));
    expect(entry.code).not.toContain("Multiple instances of Three.js");
  }, 30_000);

  it("standalone build bundles three for use without a bundler", async () => {
    const entry = await bundle("standalone");
    expect(entry.fileName).toBe("pgl_standalone.js");
    expect(entry.imports).not.toContain("three");
  }, 30_000);
});
