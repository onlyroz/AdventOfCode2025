---
name: pr-description
description: Write a pull request description for this repo with Overview, Files changed and Testing sections. Use when creating or updating a PR, or when asked to describe changes for review.
---

# Writing PR descriptions

Written for: the code reviewer, who has not seen the work and needs to check it.

## Title

Imperative mood, under about 70 characters, naming the main change. Good: "Add folder-per-day layout and npm run new". Avoid: "Updates" or "Changes to days".

## Structure

Use these headings, in this order:

### Overview

Two to four sentences. What the change does and why. Name the user-visible effect (for example, "`npm run day -- 10 2 -v alternate` now runs the alternate part 2"). Don't repeat the commit list.

### Files changed

Group by folder. For a folder with many files that changed the same way, give one bullet for the group. List files individually only when their logic changed. Say what changed, not how the code works. Mention deleted and renamed files explicitly.

### Testing

Numbered steps the reviewer can copy and run, each with the expected result. Include commands exactly as typed. Cover:

- The commands that prove the change works (for example, `npm run day -- 1 -t` should print the example answer).
- Any checks that compare before and after behaviour, and how to run them.
- Anything that can't be checked automatically, such as a real adventofcode.com download, and say so.

If nothing was tested, say that plainly and say why. Don't invent steps.

### Known issues (optional)

Include this section only when there are problems the reviewer should know about before they start, such as a failing test that was already broken before the change. One bullet per issue, with the command that shows it.

## Example

```markdown
## Overview

Moves each day into its own folder (`src/days/dayNN/`) with `solution.js`, `input.txt` and `test.txt`. Adds `npm run new` to scaffold a day and download its input, and `-v <name>` to run a `part<N>_<name>` variant, which replaces the separate `run_alternate.js`.

## Files changed

- `src/days/day01`–`day12`: moved from `src/days/dayNN.js` with `git mv`; imports changed to `../../utils/`.
- `src/days/day03/solution.js`, `day09/solution.js`: use the new `digits` and `pointKey` helpers.
- `src/runner.js`: resolves the new layout, adds `--variant`/`-v` with fallback to `part<N>`.
- `src/utils/input.js`: `readInput` reads from the day folder; adds `dayDir`.
- `src/utils/helpers.js`, `src/utils/index.js` (new): shared helpers; `index.js` re-exports everything.
- `scripts/new-day.js` (new): scaffolds a day and downloads its input.
- `run_alternate.js`: deleted; use `-v alternate` instead.
- `.gitignore`, `package.json`, `README.md`: updated for the new layout and commands.

## Testing

1. `npm run day -- 1 -t` prints the example answers for part 1 and part 2.
2. `npm run day -- 10 2 -v alternate` prints 16513 with real input, the same as the old `run_alternate.js`.
3. `npm run day -- 10 2 -v missing` prints the fallback notice and the default part 2 result.
4. `npm run new 13` creates `src/days/day13/`. Running it again exits without overwriting. Delete the folder afterwards.
5. Not checked: a real download from adventofcode.com. This needs a personal `AOC_SESSION`.

## Known issues

- Day 6 with test input throws "Cannot read properties of undefined". This was already broken before this change. Check with `npm run day -- 6 -t`.
```

## Rules

- Keep the whole description to about 300 words, not counting the Testing commands.
- Write plain sentences. No filler such as "This PR introduces".
- Don't include personal inputs, session tokens, or `.env` contents.
- Don't claim something was tested unless it was run.
- When you create the PR yourself, end the description with this line, after a blank line. Don't add it to descriptions you write for the user to post:

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
