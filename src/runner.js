import { readInput } from './utils/input.js';

const args = process.argv.slice(2);
const useTest = args.includes('--test') || args.includes('-t');

// Filter out flags and get positional arguments
const positionalArgs = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
const day = positionalArgs[0];
const part = positionalArgs[1];

if (!day) {
  console.error('Usage: node src/runner.js <day> [part] [--test|-t]');
  console.error('Example: node src/runner.js 1');
  console.error('Example: node src/runner.js 1 1');
  console.error('Example: node src/runner.js 1 --test');
  console.error('Example: node src/runner.js 1 1 -t');
  process.exit(1);
}

const dayNum = parseInt(day, 10);
if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error('Day must be a number between 1 and 25');
  process.exit(1);
}

const dayStr = String(dayNum).padStart(2, '0');
const dayModulePath = `./days/day${dayStr}.js`;

try {
  const dayModule = await import(dayModulePath);
  const input = readInput(dayNum, useTest);
  const inputType = useTest ? 'TEST' : 'REAL';

  const runPart = (partNum) => {
    const partFn = dayModule[`part${partNum}`];
    if (!partFn) {
      console.error(`Part ${partNum} not found for day ${dayNum}`);
      return;
    }

    const startTime = performance.now();
    const result = partFn(input);
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.log(`\n🎄 Day ${dayNum}, Part ${partNum} (${inputType}):`);
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
    // Run both parts
    runPart(1);
    runPart(2);
  }
} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.error(`Day ${dayNum} solution not found. Create src/days/day${dayStr}.js`);
  } else {
    console.error('Error:', error.message);
  }
  process.exit(1);
}

