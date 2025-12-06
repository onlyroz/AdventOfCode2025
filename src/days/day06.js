import { sum, product } from '../utils/helpers.js';

export function part1(input) {
  const lines = input
    .split('\n')
    .map(line => line.split(/\s+/)
    .filter(Boolean));

  return lines[0]
    .map((_, i) => ({
      nums: [0, 1, 2, 3].map(j => Number(lines[j][i])),
      operator: lines[4][i]
    }))
    .reduce((total, { nums, operator }) => {
      return total + (operator === '+' ? sum(nums) : product(nums));
    }, 0);
}

export function part2(input) {
  const lines = input.split('\n')

  let answer = 0;
  let currentSum = 0;
  let currentProduct = 1;

  for (let i = lines[0].length - 1; i >= 0; i--) {
    const num = Number([0, 1, 2, 3].map(j => lines[j][i]).join(''));
    const operator = lines[4][i];

    currentSum += num;
    currentProduct *= num || 1;

    if (operator === '+') {
      answer += currentSum;
      currentSum = 0;
      currentProduct = 1;
    } else if (operator === '*') {
      answer += currentProduct;
      currentSum = 0;
      currentProduct = 1;
    }
  }

  return answer;
}
