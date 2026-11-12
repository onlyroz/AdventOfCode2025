// Scaffolds a new day: solution template, empty test input, and real puzzle input.
// Usage: npm run new [day]   (day defaults to the next unscaffolded day)
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAYS_DIR = join(ROOT, 'src/days');
const YEAR = 2025;

const template = `export function part1(input) {
  // Your solution here
}

export function part2(input) {
  // Your solution here
}
`;

/** Reads AOC_SESSION from the environment, falling back to a .env file in the repo root */
function getSessionToken() {
  if (process.env.AOC_SESSION) return process.env.AOC_SESSION.trim();
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return null;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*AOC_SESSION\s*=\s*(.*?)\s*$/);
    if (match && match[1]) return match[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

/** Highest day number that already has a folder, or 0 if none */
function highestScaffoldedDay() {
  const nums = readdirSync(DAYS_DIR)
    .map(name => name.match(/^day(\d{2})$/))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10));
  return nums.length ? Math.max(...nums) : 0;
}

/** Downloads puzzle input. Returns the text, or throws with a readable message. */
async function downloadInput(day, token) {
  const url = `https://adventofcode.com/${YEAR}/day/${day}/input`;
  const res = await fetch(url, {
    headers: {
      Cookie: `session=${token}`,
      // Generic client identity; no personal details sent
      'User-Agent': 'aoc-scaffold (node script)',
    },
  });
  if (res.status === 404) throw new Error(`Day ${day} is not unlocked yet (404 from adventofcode.com)`);
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    throw new Error(`Session token was rejected (HTTP ${res.status}). Check AOC_SESSION.`);
  }
  if (!res.ok) throw new Error(`Unexpected HTTP ${res.status} from adventofcode.com`);
  return (await res.text()).trim();
}

async function main() {
  const arg = process.argv[2];
  const day = arg ? parseInt(arg, 10) : highestScaffoldedDay() + 1;
  if (isNaN(day) || day < 1 || day > 25) {
    console.error('Day must be a number between 1 and 25');
    process.exit(1);
  }

  const dir = join(DAYS_DIR, `day${String(day).padStart(2, '0')}`);
  if (existsSync(dir)) {
    console.error(`${dir} already exists; not overwriting.`);
    process.exit(1);
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'solution.js'), template);
  writeFileSync(join(dir, 'test.txt'), '');
  console.log(`Created ${dir}/solution.js and test.txt`);

  const token = getSessionToken();
  if (!token) {
    console.log('No AOC_SESSION found (set it in the environment or .env), so input.txt was not downloaded.');
  } else {
    try {
      const text = await downloadInput(day, token);
      writeFileSync(join(dir, 'input.txt'), text + '\n');
      console.log(`Downloaded puzzle input to ${dir}/input.txt`);
    } catch (error) {
      console.log(`Could not download input: ${error.message}`);
      console.log(`You can paste it into ${dir}/input.txt manually.`);
    }
  }

  console.log(`\nPaste the example into ${dir}/test.txt, then run:`);
  console.log(`  npm run day -- ${day} -t`);
  console.log(`  npm run day -- ${day}`);
}

main();
