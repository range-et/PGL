import { defineConfig, mergeConfig } from 'vitest/config';
import config from './vitest.config';

// Instrumentation changes execution speed. Keep wall-clock benchmarks in normal CI.
export default mergeConfig(config, defineConfig({
  test: { exclude: ['test/performance/**'] },
}));
