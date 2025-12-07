import { sum } from '../utils/helpers.js';

export function part1(input) {
  const grid = input
    .replace('S', '|')
    .split('\n')
    .map(line => line.split(''));

  let numSplits = 0;
  for (let row = 0; row < grid.length - 1; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '|') {
        if (grid[row + 1][col] !== '^')  grid[row + 1][col] = '|';
        else {
          grid[row + 1][col - 1] = '|';
          grid[row + 1][col + 1] = '|';
          numSplits++;
        }
      }
    }
  }

  return numSplits;
}

const checkCell = (grid, row, col, current) => {
  const cell = grid[row][col];
  if (cell === '.') {
     grid[row][col] = current;
     return true;
  }
  else if (cell !== '^') {
    grid[row][col] += current;
    return true;
  }
  return false;
}

export function part2(input) {
  const grid = input
    .replace('S', '1')
    .split('\n')
    .map(line => line.split(''));

  for (let row = 0; row < grid.length - 1; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const current = Number(grid[row][col]);
      if (Number.isNaN(current)) continue;

      if (!checkCell(grid, row+1, col, current)) {
        checkCell(grid, row+1, col-1, current);
        checkCell(grid, row+1, col+1, current);
      }
    }
  }

  return sum(
    grid[grid.length - 1].filter(cell => !Number.isNaN(Number(cell)))
  );
}
