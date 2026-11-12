# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No dependencies; Node 18+ (ESM, `"type": "module"`).

```bash
npm run day -- 1               # Run day 1, both parts, real input
npm run day -- 1 2 -t          # Part 2 only, test input (src/days/day01/test.txt)
npm run day -- 10 2 -v alternate   # Use part2_alternate (falls back to part2 if missing)
node src/runner.js 1 2 --test  # Same as above without npm
npm run new [day]              # Scaffold a day (defaults to next unscaffolded day)
npm test                       # node --test; no test files exist yet
```

To run a single test once one exists: `node --test path/to/file.test.js`.

## Architecture

- **One folder per day:** `src/days/dayNN/` holds `solution.js` (exports `part1`, `part2`, and optional `part<N>_<variant>`), plus gitignored `input.txt` and `test.txt`.
- **Runner** (`src/runner.js`): parses args, imports the day's `solution.js` via `pathToFileURL`, reads input with `readInput(day, useTest)`, and calls each part with `performance.now()` timing. Variant lookup is `part<N>_<name>` first, then `part<N>`. Note that `-v` consumes the following argument, so it is not mistaken for a day or part.
- **Utils** (`src/utils/`): solutions should import from `src/utils/index.js`, which re-exports `input.js` (file access: `dayDir`, `readInput*`) and `helpers.js` (pure functions: parsing, grids, math, `pointKey`). Solutions import with `../../utils/index.js`.
- **Scaffold** (`scripts/new-day.js`): creates the day folder from a template, then downloads `input.txt` from adventofcode.com using a session cookie. The cookie comes from `AOC_SESSION` in the environment or a gitignored `.env` (see `.env.example`). It refuses to overwrite an existing day folder and skips the download if `input.txt` already exists.

## Conventions

- Keep helpers that more than one day uses in `src/utils/helpers.js`. Keep day-specific logic in its `solution.js`.
- Use the `-t` example input to check a solution before running real input.
- Inputs are personal and gitignored (`src/days/*/input.txt`, `src/days/*/test.txt`). Don't commit them.
