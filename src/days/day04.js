import { parseGrid, getNeighbors } from '../utils/helpers.js';

const assessGrid = ({grid, rows, cols}) => {
    let result = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] !== '@') continue;
  
        const numPaper = getNeighbors(row, col, rows, cols, true)
            .filter(([nc, nr]) => grid[nc][nr] === '@')
            .length;
        
        if (numPaper < 4) {
          result++;
          grid[row][col] = '.';
        }
      }
    }
  
    return result;
}

export function part1(input) {
  return assessGrid(parseGrid(input));
}

export function part2(input) {
  const { grid, rows, cols } = parseGrid(input);
  let result = 0;
  let numAccessible = 0;

  do {
    numAccessible = assessGrid({ grid, rows, cols }, true);
    result += numAccessible;
  } while (numAccessible > 0);

  return result;
}
