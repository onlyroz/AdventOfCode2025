function parseCoordinates(input) {
  return input.split('\n').map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return { x, y, z };
  });
}

function generatePairs(coords) {
  const pairs = [];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const distance = Math.sqrt(
        (coords[i].x - coords[j].x) ** 2 + 
        (coords[i].y - coords[j].y) ** 2 + 
        (coords[i].z - coords[j].z) ** 2
      );
      const coordString = `${coords[i].x},${coords[i].y},${coords[i].z}`;
      const otherString = `${coords[j].x},${coords[j].y},${coords[j].z}`;
      pairs.push({ coord1: coordString, coord2: otherString, distance });
    }
  }
  return pairs;
}

function processCircuitConnection(circuits, pair, trackLast = false) {
  const existing1 = circuits.find(circuit => circuit.includes(pair.coord1));
  const existing2 = circuits.find(circuit => circuit.includes(pair.coord2));

  let shouldTrack = false;

  if (existing1 && existing2 && existing1 === existing2) {
    // Do nothing
  } else if (existing1 && existing2 && existing1 !== existing2) {
    // Merge circuits
    existing1.push(...existing2);
    circuits.splice(circuits.indexOf(existing2), 1);
    shouldTrack = true;
  } else if (existing1 && !existing2) {
    existing1.push(pair.coord2);
    shouldTrack = true;
  } else if (!existing1 && existing2) {
    existing2.push(pair.coord1);
    shouldTrack = true;
  } else {
    circuits.push([pair.coord1, pair.coord2]);
    shouldTrack = true;
  }

  return trackLast && shouldTrack ? pair : null;
}

export function part1(input) {
  const coords = parseCoordinates(input);
  const circuits = coords.map(coord => [`(${coord.x},${coord.y},${coord.z})`]);
  const pairs = generatePairs(coords);
  const sortedPairs = pairs.sort((a, b) => a.distance - b.distance).slice(0, 1000);

  for (const pair of sortedPairs) {
    processCircuitConnection(circuits, pair);
  }

  const map = circuits.map(circuit => new Set(circuit)).sort((a, b) => b.size - a.size);
  return map[0].size * map[1].size * map[2].size;
}

export function part2(input) {
  const coords = parseCoordinates(input);
  const circuits = coords.map(coord => [`${coord.x},${coord.y},${coord.z}`]);
  const pairs = generatePairs(coords, false);
  const sortedPairs = pairs.sort((a, b) => a.distance - b.distance);

  let last;
  for (const pair of sortedPairs) {
    if (circuits.length === 1) break;
    const result = processCircuitConnection(circuits, pair, true);
    if (result) last = result;
  }

  const [x1] = last.coord1.split(',');
  const [x2] = last.coord2.split(',');
  return Number(x1) * Number(x2);
}
