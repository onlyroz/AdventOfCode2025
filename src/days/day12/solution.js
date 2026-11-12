export function part1(input) {
  return input
    .split('\n')
    .filter(line => line.includes('x'))
    .reduce((count, line) => {
      const [dimensions, boxes] = line.split(': ');
      const [width, height] = dimensions.split('x').map(Number);
      const maxPresents = (width / 3) * (height / 3);
      const numPresents = boxes.split(' ').map(Number)
        .reduce((sum, quantity) => sum + quantity, 0);
      
      return count + (numPresents <= maxPresents ? 1 : 0);
    }, 0);
}

export function part2(input) {
  // No part 2
  return 0;
}

