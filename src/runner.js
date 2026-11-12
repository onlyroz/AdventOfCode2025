import { readInput, dayDir, dayStr } from './utils/input.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const USAGE = `Usage: npm run day -- <day> [part] [--test|-t] [--variant|-v <name>]
Examples:
  npm run day -- 1               Run both parts of day 1
  npm run day -- 1 1             Run only part 1
  npm run day -- 1 -t            Run both parts with test input
  npm run day -- 10 2 -v alternate   Run day 10 part 2 using part2_alternate`;

// Parse arguments: flags are removed, and the value after --variant/-v is consumed
const args = process.argv.slice(2);
const useTest = args.includes('--test') || args.includes('-t');

let variant = null;
const positionalArgs = [];
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--variant' || arg === '-v') {
    variant = args[++i];
    if (!variant) {
      console.error('--variant needs a name, e.g. -v alternate');
      process.exit(1);
    }
  } else if (!arg.startsWith('-')) {
    positionalArgs.push(arg);
  }
}

const [day, part] = positionalArgs;
if (!day) {
  console.error(USAGE);
  process.exit(1);
}

const dayNum = parseInt(day, 10);
if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error('Day must be a number between 1 and 25');
  process.exit(1);
}

const solutionPath = join(dayDir(dayNum), 'solution.js');
if (!existsSync(solutionPath)) {
  console.error(`Day ${dayNum} solution not found. Create src/days/day${dayStr(dayNum)}/solution.js (or run: npm run new ${dayNum})`);
  process.exit(1);
}

try {
  const dayModule = await import(pathToFileURL(solutionPath).href);
  const input = readInput(dayNum, useTest);
  const inputType = useTest ? 'TEST' : 'REAL';
  const variantLabel = variant ? `, variant: ${variant}` : '';

  const runPart = (partNum) => {
    // Use part<N>_<variant> when the day exports it, otherwise the default part<N>
    const variantFn = variant && dayModule[`part${partNum}_${variant}`];
    const partFn = variantFn || dayModule[`part${partNum}`];
    if (!partFn) {
      console.error(`Part ${partNum} not found for day ${dayNum}`);
      return;
    }
    if (variant && !variantFn) {
      console.log(`(No part${partNum}_${variant} for day ${dayNum}; using default part${partNum})`);
    }

    const startTime = performance.now();
    const result = partFn(input);
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.log(`\n🎄 Day ${dayNum}, Part ${partNum} (${inputType}${variantLabel}):`);
    console.log(`Result: ${result}`);
    console.log(`Time: ${duration}ms\n`);
  };

  if (part) {
    const partNum = parseInt(part, 10);
    if (partNum !== 1 && partNum !== 2) {
      console.error('Part must be 1 or 2');
      process.exit(1);
    }
    runPart(partNum);
  } else {
    runPart(1);
    runPart(2);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
