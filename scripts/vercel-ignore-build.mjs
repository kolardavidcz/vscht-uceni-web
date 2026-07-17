/**
 * Vercel Ignored Build Step (node — reliable on Vercel Linux).
 *
 * Exit 0  = SKIP deployment (you should see the SKIPPED line in build logs)
 * Exit 1  = proceed with build
 *
 * Primary rule: branch name starts with "suggest/" (wiki editor PRs)
 * Backup: commit message contains [skip vercel]
 */

const ref = process.env.VERCEL_GIT_COMMIT_REF || "";
const msg = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";

console.log("=== Vercel Ignored Build Step ===");
console.log(`branch: ${ref || "(empty)"}`);
console.log(`commit message (first 120 chars): ${msg.slice(0, 120) || "(empty)"}`);

// 1) Wiki suggestion branches from in-app editor
if (ref.startsWith("suggest/")) {
  console.log("");
  console.log("SKIPPED because of [skip vercel] / suggest/* branch");
  console.log(`Reason: branch "${ref}" is a wiki suggestion branch.`);
  console.log("No preview deploy will be created. Merge to main to deploy.");
  process.exit(0);
}

// 2) Explicit marker in commit message
if (/\[skip vercel\]|\[vercel skip\]/i.test(msg)) {
  console.log("");
  console.log("SKIPPED because of [skip vercel] in commit message");
  console.log("Reason: commit message includes [skip vercel].");
  process.exit(0);
}

console.log("");
console.log("BUILD will proceed (not a suggestion branch).");
process.exit(1);
