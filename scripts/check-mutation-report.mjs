import { readFileSync } from 'node:fs';

// Stryker can report a surviving mutant when Vitest's related-file filter ran
// no tests. Treat that as a broken audit, never as evidence of test quality.
const report = JSON.parse(readFileSync(process.argv[2] ?? 'reports/mutation/mutation.json', 'utf8'));
const mutants = Object.values(report.files).flatMap(file => file.mutants);
if (mutants.length === 0) throw new Error('Mutation audit produced no mutants');
const untestedSurvivors = mutants.filter(m => m.status === 'Survived' && !(m.testsCompleted > 0));
if (untestedSurvivors.length) {
  throw new Error(`${untestedSurvivors.length} surviving mutants ran no tests; check the runner configuration`);
}
console.log(`Mutation audit integrity passed (${mutants.length} mutants).`);
