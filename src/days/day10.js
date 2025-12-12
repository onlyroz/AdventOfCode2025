export function part1(input) {
  const machines = input.split('\n').map(line => {
    const [lights, ...rest] = line
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('{', '').replaceAll('}', '')
      .replaceAll('[', '').replaceAll(']', '')
      .split(' ');
    const buttons = rest.slice(0, -1);
    const joltage = rest.slice(-1)[0];
    
    // Convert lights pattern to bitmask
    const lightsArray = lights.split('');
    let targetMask = 0;
    for (let i = 0; i < lightsArray.length; i++) {
      if (lightsArray[i] === '#') {
        targetMask |= (1 << i);
      }
    }
    
    // Convert buttons to bitmasks
    const buttonMasks = buttons.map(button => {
      const indices = button.split(',').map(Number);
      let mask = 0;
      for (const lightIndex of indices) {
        mask |= (1 << lightIndex);
      }
      return mask;
    });
    
    return {
      targetMask,
      buttonMasks,
      numLights: lightsArray.length,
      numButtons: buttonMasks.length
    };
  });

  // Fast bit counting function
  const countBits = (n) => {
    let count = 0;
    while (n) {
      count++;
      n &= n - 1; // Clear the least significant bit
    }
    return count;
  }

  let totalPresses = 0;


  for (const machine of machines) {
    const { targetMask, buttonMasks, numButtons } = machine;

    // Find minimum presses using brute force with optimizations
    let minPresses = Infinity;
    let currentState = 0; // All lights off initially
    let previousCombination = 0;

    // Try all 2^n combinations
    for (let combination = 0; combination < (1 << numButtons); combination++) {
      // Count bits (number of buttons pressed)
      const bitCount = countBits(combination);
      
      // Early termination: skip if this can't improve
      if (bitCount >= minPresses) continue;

      // Incremental update: only toggle buttons that changed
      const changed = combination ^ previousCombination;
      for (let i = 0; i < numButtons; i++) {
        if (changed & (1 << i))  currentState ^= buttonMasks[i];
      }

      // If current state matches target, update minimum
      if (currentState === targetMask)  minPresses = bitCount;

      previousCombination = combination;
    }

    totalPresses += minPresses;
  }

  return totalPresses;
}

export function part2(input) {
  const machines = input.split('\n').map(line => {
    const [lights, ...rest] = line
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('{', '').replaceAll('}', '')
      .replaceAll('[', '').replaceAll(']', '')
      .split(' ');
    const buttons = rest.slice(0, -1);
    const joltage = rest.slice(-1)[0];
    
    // Parse joltage targets
    const targetJoltage = joltage.split(',').map(Number);
    
    // Convert buttons to effects (which counters they affect)
    const buttonEffects = buttons.map(button => {
      return button.split(',').map(Number);
    });
    
    return {
      targetJoltage,
      buttonEffects,
      numCounters: targetJoltage.length,
      numButtons: buttonEffects.length
    };
  });

  let totalPresses = 0;
  let machineIndex = 0;

  // Local validator for part2
  const validateSolution = (sol, buttonEffects, targetJoltage) => {
    const numCounters = targetJoltage.length;
    for (let counter = 0; counter < numCounters; counter++) {
      let sum = 0;
      for (let button = 0; button < buttonEffects.length; button++) {
        if (buttonEffects[button].includes(counter)) sum += sol[button];
      }
      if (sum !== targetJoltage[counter]) return false;
    }
    return true;
  }

    // Helper gcd for integer-preserving elimination
    const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  for (const machine of machines) {
    machineIndex++;
    const { targetJoltage, buttonEffects, numCounters, numButtons } = machine;
    console.log(`Machine ${machineIndex}/${machines.length}: ${numButtons} buttons, ${numCounters} counters`);

    // Build augmented matrix: rows=counters, cols=buttons, last col=target
    // matrix[i][j] is 1 if button j increments counter i, else 0.
    const matrix = [];
    for (let i = 0; i < numCounters; i++) {
      const row = [];
      for (let j = 0; j < numButtons; j++) {
        row.push(buttonEffects[j].includes(i) ? 1 : 0);
      }
      row.push(targetJoltage[i]); // Augmented column (target)
      matrix.push(row);
    }

    // Gaussian elimination over integers (no fractions; keeps entries integral)
    let pivotRow = 0;
    const pivotCols = []; // Track which columns have pivots
    const freeVars = []; // Track free variables

    for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
      // Find a row with non-zero entry in this column (pivot selection)
      let found = false;
      for (let row = pivotRow; row < numCounters; row++) {
        if (matrix[row][col] !== 0) {
          // Swap rows
          [matrix[pivotRow], matrix[row]] = [matrix[row], matrix[pivotRow]];
          found = true;
          break;
        }
      }

      if (!found) {
        freeVars.push(col);
        continue;
      }

      pivotCols.push(col);
      const pivot = matrix[pivotRow][col]; // Can be any non-zero integer after elimination
      
      // Don't normalize here; back-substitution handles non-1 pivots

      // Eliminate below using gcd-based integer row ops to avoid skipping steps
      for (let row = pivotRow + 1; row < numCounters; row++) {
        if (matrix[row][col] !== 0) {
          const entry = matrix[row][col];
          const pivotVal = matrix[pivotRow][col];
          
          const absEntry = Math.abs(entry);
          const absPivot = Math.abs(pivotVal);
          const g = gcd(absEntry, absPivot);
          
          // Factors to eliminate the current column while preserving integrality:
          // newRow = row * (pivotVal / g) - pivotRow * (entry / g)
          const factorRow = pivotVal / g;
          const factorPivot = entry / g;
          
          for (let c = col; c <= numButtons; c++) {
            matrix[row][c] = matrix[row][c] * factorRow - matrix[pivotRow][c] * factorPivot;
          }
        }
      }

      pivotRow++;
    }

    // Mark remaining columns as free (no pivot in that column)
    const pivotSet = new Set(pivotCols);
    for (let col = 0; col < numButtons; col++) {
      if (!pivotSet.has(col)) {
        freeVars.push(col);
      }
    }


    // Check for impossible rows: 0 = non-zero means no solution
    let inconsistent = false;
    for (let row = pivotRow; row < numCounters; row++) {
      let allZero = true;
      for (let col = 0; col < numButtons; col++) {
        if (matrix[row][col] !== 0) {
          allZero = false;
          break;
        }
      }
      if (allZero && matrix[row][numButtons] !== 0) {
        // Inconsistent: 0 = non-zero
        inconsistent = true;
        break;
      }
    }

    if (inconsistent) {
      console.log(`  No solution found (inconsistent system)`);
      totalPresses += 0; // No solution
      continue;
    }

    // Per-button bounds: smallest target among counters the button affects; if none, 0.
    const buttonBounds = new Array(numButtons).fill(0);
    for (let btn = 0; btn < numButtons; btn++) {
      let bound = null;
      for (const cnt of buttonEffects[btn]) {
        const t = targetJoltage[cnt];
        if (bound === null || t < bound) bound = t;
      }
      buttonBounds[btn] = bound === null ? 0 : bound;
    }

    // Build reduced matrix: normalize rows and drop all-zero/zero-target rows
    const reducedMat = [];
    for (const row of matrix) {
      let allZero = true;
      for (let c = 0; c < numButtons; c++) {
        if (row[c] !== 0) {
          allZero = false;
          break;
        }
      }
      if (allZero && row[numButtons] === 0) continue;

      const copy = row.slice();
      let rowGcd = 0;
      for (const v of copy) {
        rowGcd = gcd(rowGcd, v);
      }
      if (rowGcd !== 0) {
        if (copy[numButtons] < 0) rowGcd *= -1;
        for (let i = 0; i <= numButtons; i++) {
          copy[i] = copy[i] / rowGcd;
        }
      }
      reducedMat.push(copy);
    }

    let bestSolution = null;
    let minSum = Infinity;

    function substitute(known) {
      // Propagate: if a row has 1 unknown, solve it; if none, verify consistency
      const newKnown = known.slice();
      for (const row of reducedMat) {
        let unknownCount = 0;
        let unknownIdx = -1;
        let sumKnown = 0;
        const target = row[numButtons];

        for (let i = 0; i < numButtons; i++) {
          const coeff = row[i];
          if (coeff === 0) continue;
          if (newKnown[i] === null) {
            unknownCount++;
            unknownIdx = i;
          } else {
            sumKnown += newKnown[i] * coeff;
          }
        }

        if (unknownCount === 0) {
          if (sumKnown !== target) return null;
        } else if (unknownCount === 1) {
          const rhs = target - sumKnown;
          const coeff = row[unknownIdx];
          if (rhs % coeff !== 0) return null;
          const val = rhs / coeff;
          if (val < 0) return null;
          newKnown[unknownIdx] = val;
        }
      }
      return newKnown;
    }

    function chooseVar(known) {
      // Pick the next variable from the most constrained row (fewest unknowns)
      let bestIdx = -1;
      let bestUnknowns = Number.MAX_SAFE_INTEGER;
      for (const row of reducedMat) {
        let countUnknown = 0;
        let candidateIdx = -1;
        for (let i = 0; i < numButtons; i++) {
          if (row[i] !== 0 && known[i] === null) {
            countUnknown++;
            candidateIdx = i;
          }
        }
        if (countUnknown > 0 && countUnknown < bestUnknowns) {
          bestUnknowns = countUnknown;
          bestIdx = candidateIdx;
          if (bestUnknowns === 1) break;
        }
      }
      return bestIdx;
    }

    function search(known) {
      // Depth-first search with propagation and simple pruning by current sum
      const propagated = substitute(known);
      if (propagated === null) return;

      let currentSum = 0;
      let allKnown = true;
      for (const v of propagated) {
        if (v === null) {
          allKnown = false;
        } else {
          currentSum += v;
        }
      }

      if (bestSolution !== null && currentSum > minSum) return;

      if (allKnown) {
        if (currentSum < minSum && validateSolution(propagated, buttonEffects, targetJoltage)) {
          minSum = currentSum;
          bestSolution = propagated.slice();
        }
        return;
      }

      const varIdx = chooseVar(propagated);
      if (varIdx === -1) return; // No variable chosen (should not happen)

      const maxVal = buttonBounds[varIdx];
      for (let val = 0; val <= maxVal; val++) {
        const next = propagated.slice();
        next[varIdx] = val;
        search(next);
      }
    }

    const initialKnown = new Array(numButtons).fill(null);
    search(initialKnown);

    if (minSum === Infinity) {
      // No solution found - this shouldn't happen for valid inputs
      // But let's continue with 0 to avoid breaking
      console.log(`  No solution found`);
      totalPresses += 0;
    } else {
      // Validate the best solution against original equations
      let label = '';
      if (bestSolution && validateSolution(bestSolution, buttonEffects, targetJoltage)) {
        label = ' (validated via original equations)';
      } else if (bestSolution) {
        label = ' (validation FAILED)';
      }

      console.log(`  Final minimum: ${minSum}${label}`);
      totalPresses += minSum;
    }
  }

  return totalPresses;
}

