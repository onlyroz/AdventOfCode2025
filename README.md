# Advent of Code 2025

JavaScript solutions for Advent of Code 2025. No dependencies; needs Node 18+.

## Usage

Run a day (both parts by default):

```bash
npm run day -- 1            # Both parts, real input
npm run day -- 1 1          # Part 1 only
npm run day -- 1 -t         # Both parts, test input
npm run day -- 1 2 -t       # Part 2, test input
npm run day -- 10 2 -v alternate   # Use the part2_alternate variant
```

The `--` is needed so npm passes the flags through. You can also call the runner directly:

```bash
node src/runner.js 1 2 --test
```

### Variants

A day can export extra versions of a part, named `part<N>_<name>`. Pick one with `-v <name>` (or `--variant <name>`). If the variant doesn't exist for that part, the runner says so and uses the default `part<N>`.

Day 10 has `part2_alternate`, a different algorithm for part 2:

```bash
npm run day -- 10 2 -v alternate
```

## Adding a New Day

```bash
npm run new          # Next day after the highest one that exists
npm run new 13       # Or a specific day
```

This creates `src/days/day13/` containing:

- `solution.js` with `part1` and `part2` stubs
- `test.txt`, empty, for the example input
- `input.txt`, downloaded from adventofcode.com if a session token is available

To download inputs, copy `.env.example` to `.env` and set `AOC_SESSION` to your adventofcode.com `session` cookie. You can also set it as an environment variable. If the download fails or the puzzle isn't unlocked yet, the scaffold says so and you can paste the input in by hand. The scaffold never overwrites an existing day folder.

Then paste the example into `test.txt` and run `npm run day -- 13 -t`.

## Project Structure

```
├── scripts/
│   └── new-day.js          # Scaffolds a new day (npm run new)
├── src/
│   ├── days/
│   │   └── day01/          # One folder per day
│   │       ├── solution.js # part1, part2, and any variants
│   │       ├── input.txt   # Real puzzle input (gitignored)
│   │       └── test.txt    # Example input (gitignored)
│   ├── utils/
│   │   ├── index.js        # Import everything from here
│   │   ├── input.js        # readInput and friends
│   │   └── helpers.js      # Shared helpers
│   └── runner.js           # Runs a day
├── .env.example            # Template for AOC_SESSION
└── package.json
```

## Utilities

Import from `src/utils/index.js` (for example `import { readInputLines, sum } from '../../utils/index.js';`).

Input readers (`input.js`):
- `readInput(day, useTest)` - raw file contents
- `readInputLines(day, useTest)` - array of lines
- `readInputGrid(day, useTest)` - 2D array of characters
- `readInputParagraphs(day, useTest)` - split on blank lines

Helpers (`helpers.js`):
- `sum`, `product`, `gcd`, `lcm`, `lcmArray`
- `parseNumbers(str)` - all integers in a string, including negatives
- `parseGrid(input)` - `{ grid, rows, cols }`
- `createGrid(rows, cols, fill)`
- `getNeighbors(row, col, maxRow, maxCol, includeDiagonals)`
- `DIRECTIONS_4`, `DIRECTIONS_8` - movement offsets
- `manhattanDistance`, `manhattanArea`, `inRange`
- `lines(input)`, `digits(str)`, `pointKey(x, y)`
