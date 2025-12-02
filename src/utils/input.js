import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Reads the input file for a given day
 * @param {number} day - The day number (1-25)
 * @param {boolean} useTest - Whether to use test input file (default: false)
 * @returns {string} The raw input file content
 */
export function readInput(day, useTest = false) {
  const dayStr = String(day).padStart(2, '0');
  const filename = useTest ? `day${dayStr}-test.txt` : `day${dayStr}.txt`;
  const inputPath = join(__dirname, '../../inputs', filename);
  try {
    return readFileSync(inputPath, 'utf-8').trim();
  } catch (error) {
    const fileType = useTest ? 'test input' : 'input';
    throw new Error(`Could not read ${fileType} file for day ${day}: ${error.message}`);
  }
}

/**
 * Reads the input file and splits it into lines
 * @param {number} day - The day number (1-25)
 * @param {boolean} useTest - Whether to use test input file (default: false)
 * @returns {string[]} Array of lines
 */
export function readInputLines(day, useTest = false) {
  return readInput(day, useTest).split('\n');
}

/**
 * Reads the input file as a 2D grid (array of arrays)
 * @param {number} day - The day number (1-25)
 * @param {boolean} useTest - Whether to use test input file (default: false)
 * @returns {string[][]} 2D array representing the grid
 */
export function readInputGrid(day, useTest = false) {
  return readInputLines(day, useTest).map(line => line.split(''));
}

/**
 * Reads the input file and splits it by double newlines (for multi-paragraph inputs)
 * @param {number} day - The day number (1-25)
 * @param {boolean} useTest - Whether to use test input file (default: false)
 * @returns {string[]} Array of paragraphs
 */
export function readInputParagraphs(day, useTest = false) {
  return readInput(day, useTest).split('\n\n');
}

