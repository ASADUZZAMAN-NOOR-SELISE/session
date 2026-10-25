// Turns Playwright's results.json into a Markdown summary for the GitHub Actions run page.
// Usage: node scripts/test-summary.mjs "<suite name>" >> $GITHUB_STEP_SUMMARY
import { existsSync, readFileSync } from 'node:fs';

const suiteName = process.argv[2] || 'Playwright';

if (!existsSync('results.json')) {
  console.log(`## ⚠️ ${suiteName} Tests\n\nNo results found — the run stopped before tests finished. Check the step logs.`);
  process.exit(0);
}

const report = JSON.parse(readFileSync('results.json', 'utf8'));
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats;
const total = expected + unexpected + flaky + skipped;

const icons = { expected: '✅', unexpected: '❌', flaky: '⚠️', skipped: '⏭️' };
const rows = [];
const failures = [];

const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const last = test.results.at(-1);
      const secs = ((last?.duration ?? 0) / 1000).toFixed(1);
      rows.push(`| ${icons[test.status] ?? '❔'} | ${spec.title} | ${test.results.length - 1} | ${secs}s |`);
      if (test.status === 'unexpected') {
        const message = (last?.error?.message ?? 'No error message').replace(/\x1b\[[0-9;]*m/g, '');
        failures.push(`<details><summary>❌ ${spec.title}</summary>\n\n\`\`\`\n${message}\n\`\`\`\n</details>`);
      }
    }
  }
  (suite.suites ?? []).forEach(walk);
};
report.suites.forEach(walk);

const status = unexpected > 0 ? '❌ Failed' : '✅ Passed';
console.log(`## ${status} — ${suiteName} Tests

| Total | ✅ Passed | ❌ Failed | ⚠️ Flaky | ⏭️ Skipped | ⏱️ Duration |
|---|---|---|---|---|---|
| ${total} | ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${(duration / 1000).toFixed(1)}s |
`);

if (failures.length) console.log(`### Failed tests\n\n${failures.join('\n\n')}\n`);

console.log(`<details><summary>📋 All tests (${total})</summary>

| Status | Test | Retries | Time |
|---|---|---|---|
${rows.join('\n')}
</details>

📦 Full HTML report with screenshots and traces: download the **Artifacts** at the bottom of this page.`);
