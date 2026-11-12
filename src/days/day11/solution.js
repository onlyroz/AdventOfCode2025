export function part1(input) {
  const { nodeMap, cache } = input.split('\n').reduce(
    (acc, line) => {
      const [node, rest] = line.split(': ');
      const neighbors = rest.split(' ');
      acc.nodeMap.set(node, neighbors);
      acc.cache.set(node, neighbors.includes('out') ? 1 : null);
      return acc;
    },
    { nodeMap: new Map(), cache: new Map() }
  );

  const countPaths = (node) => {
    const cached = cache.get(node);
    if (cached !== null) return cached;
    
    const neighbors = nodeMap.get(node) || [];
    const count = neighbors.reduce(
      (sum, neighbor) => sum + countPaths(neighbor), 0
    );
    cache.set(node, count);
    return count;
  };

  return countPaths('you');
}

export function part2(input) {
  const { nodeMap, cache } = input.split('\n').reduce(
    (acc, line) => {
      const [node, rest] = line.split(': ');
      const neighbors = rest.split(' ');
      acc.nodeMap.set(node, neighbors);
      return acc;
    },
    { nodeMap: new Map(), cache: new Map() }
  );

  // Initialize cache for 'out' node with all 4 state combinations
  cache.set('out,false,false', 0);
  cache.set('out,false,true', 0);
  cache.set('out,true,false', 0);
  cache.set('out,true,true', 1); // Only valid when both visited

  const countPaths = (node, visitedDac, visitedFft) => {
    const cacheKey = `${node},${visitedDac},${visitedFft}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;

    const neighbors = nodeMap.get(node) || [];
    const count = neighbors.reduce(
      (sum, neighbor) =>
        sum +
        countPaths(
          neighbor,
          visitedDac || node === 'dac',
          visitedFft || node === 'fft'
        ),
      0
    );

    cache.set(cacheKey, count);
    return count;
  };

  return countPaths('svr', false, false);
}

