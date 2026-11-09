import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/{unit,property,regression,performance}/**/*.test.ts', 'Src/**/*.test.ts'],
    setupFiles: ['test/helpers/propertySetup.ts'],
    coverage: {
      provider: 'v8',
      include: ['Src/**/*.ts'],
      exclude: ['Src/Shaders/**', 'Src/SampleData/ZKC*.ts', 'Src/SampleData/dwt_1005.ts'],
      reporter: ['text', 'html', 'json-summary', 'json'],
      thresholds: {
        perFile: true,
        statements: 100, branches: 100, functions: 100, lines: 100,
      },
    },
  },
});
