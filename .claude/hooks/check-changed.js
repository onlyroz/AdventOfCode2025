// PostToolUse hook: runs Prettier and ESLint checks on the file Claude just edited.
// Reads the hook payload from stdin. Exits 2 on failure so the errors are fed back to Claude.
// If prettier or eslint is not installed locally, the check is skipped with a note.
import { existsSync, readFileSync } from "fs";
import { join, extname, relative, isAbsolute } from "path";
import { spawnSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PRETTIER_EXTS = new Set([".js", ".mjs", ".cjs", ".json", ".md"]);
const ESLINT_EXTS = new Set([".js", ".mjs", ".cjs"]);

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf-8"));
} catch {
  process.exit(0); // No payload, nothing to check
}

const filePath = payload?.tool_input?.file_path;
if (!filePath) process.exit(0);

const absPath = isAbsolute(filePath) ? filePath : join(ROOT, filePath);
const rel = relative(ROOT, absPath);

// Only check files inside this repo, and skip anything under node_modules or .git
if (
  rel.startsWith("..") ||
  rel.includes("node_modules") ||
  rel.startsWith(".git")
)
  process.exit(0);
if (!existsSync(absPath)) process.exit(0);

const ext = extname(absPath);
const failures = [];

function runLocal(name, args) {
  const bin = join(ROOT, "node_modules", ".bin", name);
  if (!existsSync(bin)) {
    console.error(
      `[hook] ${name} is not installed, skipping. Run: npm install -D ${name}`,
    );
    return;
  }
  const result = spawnSync(bin, args, { cwd: ROOT, encoding: "utf-8" });
  if (result.status !== 0) {
    failures.push(
      `${name} failed for ${rel}:\n${(result.stdout + result.stderr).trim()}`,
    );
  }
}

if (PRETTIER_EXTS.has(ext)) runLocal("prettier", ["--check", absPath]);
if (ESLINT_EXTS.has(ext)) runLocal("eslint", [absPath]);

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(2);
}
process.exit(0);
