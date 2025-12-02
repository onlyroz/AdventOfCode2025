import { readInputLines } from '../utils/input.js';

const rotate = (dial, distance, direction) => {
  const multiples = Math.floor(distance / 100);
  const remainder = distance % 100;
  const change = direction === 'L' ? -remainder : remainder;
  const newDial = (dial + change + 100) % 100;
  
  const wrapsAround = (direction === 'L' && dial < remainder) || 
                      (direction === 'R' && dial + remainder > 99);
  const crosses0 = wrapsAround && newDial !== 0 && dial !== 0;
  
  return { 
    newDial, 
    numCrosses0: multiples + Number(crosses0) + Number(newDial === 0),
  };
}

export function part1(input) {
  const moves = input.split('\n').map(line => ({
    direction: line[0],
    distance: parseInt(line.slice(1)),
  }));

  return moves.reduce(
    ({ dial, password }, move) => {
      const { newDial } = rotate(dial, move.distance, move.direction);
      return {
        dial: newDial,
        password: password + (newDial === 0 ? 1 : 0)
      };
    },
    { dial: 50, password: 0 }
  ).password;
}

export function part2(input) {
  const moves = input.split('\n').map(line => ({
    direction: line[0],
    distance: parseInt(line.slice(1)),
  }));

  return moves.reduce(
    ({ dial, password }, move) => {
      const { newDial, numCrosses0 } = rotate(dial, move.distance, move.direction);
      return {
        dial: newDial,
        password: password + numCrosses0
      };
    },
    { dial: 50, password: 0 }
  ).password;
}

