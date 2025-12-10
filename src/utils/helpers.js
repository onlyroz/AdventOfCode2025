/**
 * Common utility functions for Advent of Code solutions
 */

/**
 * Sums an array of numbers
 * @param {number[]} arr
 * @returns {number}
 */
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Multiplies an array of numbers
 * @param {number[]} arr
 * @returns {number}
 */
export function product(arr) {
  return arr.reduce((a, b) => a * b, 1);
}

/**
 * Gets the greatest common divisor of two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Gets the least common multiple of two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

/**
 * Gets the least common multiple of an array of numbers
 * @param {number[]} arr
 * @returns {number}
 */
export function lcmArray(arr) {
  return arr.reduce((a, b) => lcm(a, b), 1);
}

/**
 * Parses a string of numbers separated by spaces or commas
 * @param {string} str
 * @returns {number[]}
 */
export function parseNumbers(str) {
  return str.match(/-?\d+/g)?.map(Number) || [];
}

/**
 * Creates a 2D array filled with a value
 * @param {number} rows
 * @param {number} cols
 * @param {*} fillValue
 * @returns {*[][]}
 */
export function createGrid(rows, cols, fillValue = 0) {
  return Array(rows).fill(null).map(() => Array(cols).fill(fillValue));
}

/**
 * Converts input text into a grid object with grid, rows, and cols properties
 * @param {string} input - The input text with lines separated by newlines
 * @returns {{grid: string[][], rows: number, cols: number}} - Object containing grid and dimensions
 */
export function parseGrid(input) {
  const grid = input.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(''));
  
  return {
    grid,
    rows: grid.length,
    cols: grid[0]?.length || 0
  };
}

/**
 * Gets neighbors in a 2D grid (4-directional)
 * @param {number} row
 * @param {number} col
 * @param {number} maxRow
 * @param {number} maxCol
 * @param {boolean} includeDiagonals
 * @returns {[number, number][]}
 */
export function getNeighbors(row, col, maxRow, maxCol, includeDiagonals = false) {
  const neighbors = [];
  const directions = includeDiagonals
    ? [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    : [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < maxRow && newCol >= 0 && newCol < maxCol) {
      neighbors.push([newRow, newCol]);
    }
  }

  return neighbors;
}

/**
 * Manhatten distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Manhatten distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function manhattanArea(x1, y1, x2, y2) {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

/**
 * Checks if a number is within a range (inclusive)
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function inRange(num, min, max) {
  return num >= min && num <= max;
}

