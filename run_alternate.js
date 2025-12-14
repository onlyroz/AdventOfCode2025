import { readInput } from './src/utils/input.js';
import { part2_alternate } from './src/days/day10.js';

const args = process.argv.slice(2);
const useTest = args.includes('--test') || args.includes('-t');

const input = readInput(10, useTest);
const inputType = useTest ? 'TEST' : 'REAL';

const startTime = performance.now();
const result = part2_alternate(input);
const endTime = performance.now();
const duration = (endTime - startTime).toFixed(2);

console.log(`\n🎄 Day 10, Part 2 Alternate (${inputType}):`);
console.log(`Result: ${result}`);
console.log(`Time: ${duration}ms\n`);

