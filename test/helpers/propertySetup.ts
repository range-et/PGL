import fc from 'fast-check';

// Keep CI and mutation runs reproducible; override locally to explore new inputs.
function integerEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isSafeInteger(value) || (name === 'FC_NUM_RUNS' && value < 1)) {
    throw new Error(`${name} must be a safe integer${name === 'FC_NUM_RUNS' ? ' greater than zero' : ''}`);
  }
  return value;
}
fc.configureGlobal({
  seed: integerEnv('FC_SEED', 20261109),
  numRuns: integerEnv('FC_NUM_RUNS', 150),
  ...(process.env.FC_PATH ? { path: process.env.FC_PATH } : {}),
});
