import { sum, digits } from '../../utils/helpers.js';

export function part1(input) {
  const lines = input.split('\n')
    .map(line => {
      const nums = digits(line);
      let maxNumber = 0;
      let maxRight = nums[nums.length - 1];
      
      // Process from right to left
      for (let i = nums.length - 2; i >= 0; i--) {
        const twoDigitValue = nums[i] * 10 + maxRight;
        maxNumber = Math.max(maxNumber, twoDigitValue);
        maxRight = Math.max(maxRight, nums[i]);
      }
      
      return maxNumber;
    });

  return sum(lines);
}

export function part2(input) {
  const lines = input.split('\n')
    .map(line => {
      const nums = digits(line);
      
      const { stack, removalsRemaining } = nums.reduce(
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
        { stack: [], removalsRemaining: nums.length - 12 }
      );
      return Number(stack.slice(0, stack.length - removalsRemaining).join(''));
    });

  return sum(lines);
}
