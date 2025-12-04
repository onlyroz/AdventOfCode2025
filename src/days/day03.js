import { sum } from '../utils/helpers.js';

export function part1(input) {
  const lines = input.split('\n')
    .map(line => {
      const digits = line.split('').map(Number);
      let maxNumber = 0;
      let maxRight = digits[digits.length - 1];
      
      // Process from right to left
      for (let i = digits.length - 2; i >= 0; i--) {
        const twoDigitValue = digits[i] * 10 + maxRight;
        maxNumber = Math.max(maxNumber, twoDigitValue);
        maxRight = Math.max(maxRight, digits[i]);
      }
      
      return maxNumber;
    });

  return sum(lines);
}

export function part2(input) {
  const lines = input.split('\n')
    .map(line => {
      const digits = line.split('').map(Number);
      
      const { stack, removalsRemaining } = digits.reduce(
        ({ stack, removalsRemaining }, currentDigit) => {
          let newStack = [...stack];
          let newRemovals = removalsRemaining;
          
          while (newRemovals > 0 && newStack.length > 0 && 
              currentDigit > newStack[newStack.length - 1]) {
            newStack.pop();
            newRemovals--;
          }
          
          newStack.push(currentDigit);
          return { stack: newStack, removalsRemaining: newRemovals };
        },
        { stack: [], removalsRemaining: digits.length - 12 }
      );
      return Number(stack.slice(0, stack.length - removalsRemaining).join(''));
    });

  return sum(lines);
}
