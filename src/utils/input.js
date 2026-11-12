import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DAYS_DIR = join(__dirname, '../days');

/**
 * Pads a day number to two digits (1 -> "01")
 * @param {number} day
 * @returns {string}
 */
export function dayStr(day) {
  return String(day).padStart(2, '0');
}

/**
 * Absolute path to a day's folder (src/days/dayXX)
 * @param {number} day - The day number (1-25)
 * @returns {string}
 */
export function dayDir(day) {
  return join(DAYS_DIR, `day${dayStr(day)}`);
}

/**
 * Reads the input file for a given day
 * @param {number} day - The day number (1-25)
 * @param {boolean} useTest - Whether to use test input file (default: false)
 * @returns {string} The raw input file content
 */
export function readInput(day, useTest = false) {
  const filename = useTest ? 'test.txt' : 'input.txt';
  const inputPath = join(dayDir(day), filename);
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
