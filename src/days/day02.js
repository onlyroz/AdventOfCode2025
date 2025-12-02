import { readInputLines } from '../utils/input.js';

export function part1(input) {
  const lines = input.split(',').map(line => { 
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });

  let result = 0;
  for (const line of lines) {
    for (let i = line.start; i <= line.end; i++) {
      const str = i.toString();
      if (str.length % 2 !== 0) continue;

      const [firstHalf, secondHalf] = [
        str.slice(0, str.length / 2),
        str.slice(str.length / 2)
      ];

      if (firstHalf === secondHalf) result += i;
    }
  }

  return result;
}

export function part2(input) {
  const lines = input.split(',').map(line => { 
    const [start, end] = line.split('-').map(Number);
    return { start, end, diff: end - start };
  });

  const hasRepeatingPattern = /^(.+)\1+$/;
  let result = 0;
  for (const line of lines) {
    for (let i = line.start; i <= line.end; i++) {
      if (hasRepeatingPattern.test(i.toString())) {
        result += i;
      } 
    }
  }

  return result;
}
