function parseInput(input) {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  
  return lines.reduce((acc, line) => {
    if (line.includes('-')) {
      const [start, end] = line.split('-').map(Number);
      acc.ranges.push({ start, end });
    } else {
      acc.ingredients.push(Number(line));
    }
    return acc;
  }, { ranges: [], ingredients: [] });
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  return sorted.slice(1).reduce((acc, range) => {
    const last = acc[acc.length - 1];
    if (last.end + 1 >= range.start) {
      last.end = Math.max(last.end, range.end);
      return acc;
    } else {
      return [...acc, range];
    }
  }, [sorted[0]]);
}

export function part1(input) {
  const { ranges, ingredients } = parseInput(input);
  
  return ingredients.filter(ingredient => 
    ranges.some(range => ingredient >= range.start && ingredient <= range.end)
  ).length;
}

export function part2(input) {
  const { ranges } = parseInput(input);
  const merged = mergeRanges(ranges);
  
  return merged.reduce((sum, range) => 
    sum + (range.end - range.start + 1), 0
  );
}
