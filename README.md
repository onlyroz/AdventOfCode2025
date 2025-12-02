# Advent of Code 2025

JavaScript solutions for Advent of Code 2025.

## Setup

```bash
npm install
```

## Usage

Run a specific day's solution:

```bash
npm run day 1
npm run day 1 1    # Run only part 1
npm run day 1 2    # Run only part 2
npm run day 1 -- --test    # Run with test data (note the --)
npm run day 1 -- 1 -t      # Run part 1 with test data
```

**Note:** When using npm scripts with flags, you need to use `--` to pass arguments to the script.

Or use node directly (no `--` needed):

```bash
node src/runner.js 1
node src/runner.js 1 1
node src/runner.js 1 2
node src/runner.js 1 --test
node src/runner.js 1 1 -t
```

## Project Structure

```
├── src/
│   ├── days/          # Day solutions (day01.js, day02.js, etc.)
│   ├── utils/         # Utility functions
│   └── runner.js      # Main runner script
├── inputs/            # Input files (day01.txt, day02.txt, etc.)
└── package.json
```

## Adding a New Day

1. Create `src/days/dayXX.js` following the template:
   ```javascript
   import { readInput } from '../utils/input.js';

   export function part1(input) {
     // Your solution here
   }

   export function part2(input) {
     // Your solution here
   }
   ```

2. Add your input files:
   - Real input: `inputs/dayXX.txt`
   - Test input: `inputs/dayXX-test.txt` (optional, for testing)
   
   **Note:** Input files are gitignored and won't be committed to the repository.

3. Run with `npm run day XX`
4. Test with `npm run day XX -- --test` (note the `--` before `--test`)

## Utilities

The `utils/input.js` module provides:
- `readInput(day)` - Reads input file for a given day
- `readInputLines(day)` - Reads input file as array of lines
- `readInputGrid(day)` - Reads input file as 2D grid

