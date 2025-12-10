import { manhattanArea } from '../utils/helpers.js';

export function part1(input) {
  const coords = input.split('\n').map(line => line.split(',').map(Number));
  const pairs = [];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const area = manhattanArea(...coords[i], ...coords[j]);
      pairs.push({ coord1: coords[i], coord2: coords[j], area });
    }
  }
  pairs.sort((a, b) => b.area - a.area);

  return pairs[0].area;
}

export function part2(input) {
  let coords = input.split('\n').map(line => line.split(',').map(Number));
  coords.push(coords[0]);

  const boundary = [];
  for (let i = 0; i < coords.length-1; i++) {
    boundary.push({ coord1: coords[i], coord2: coords[i+1] });
  }

  const rectangles = [];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      if (coords[i][0] === coords[j][0] || coords[i][1] === coords[j][1]) continue;
      
      const area = manhattanArea(...coords[i], ...coords[j]);
      rectangles.push({
        coords: [coords[i], [coords[i][0], coords[j][1]], coords[j], [coords[j][0], coords[i][1]]],
        area 
      });
    }
  }

  rectangles.sort((a, b) => a.area - b.area);

  // Helper: check if point is a red tile
  const originalCoords = coords.slice(0, -1); // Remove the duplicate last element
  const redTiles = new Set(originalCoords.map(c => `${c[0]},${c[1]}`));
  
  // Pre-compute polygon bounds
  const polyMinX = Math.min(...originalCoords.map(c => c[0]));
  const polyMaxX = Math.max(...originalCoords.map(c => c[0]));
  const polyMinY = Math.min(...originalCoords.map(c => c[1]));
  const polyMaxY = Math.max(...originalCoords.map(c => c[1]));
  
  function isRedTile(x, y) {
    return redTiles.has(`${x},${y}`);
  }

  // Cache boundary tiles in a Set for fast lookup
  const boundaryTiles = new Set();
  for (const edge of boundary) {
    const [x1, y1] = edge.coord1;
    const [x2, y2] = edge.coord2;
    
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let step = 0; step <= steps; step++) {
      const lineX = x1 + Math.round((dx * step) / steps);
      const lineY = y1 + Math.round((dy * step) / steps);
      boundaryTiles.add(`${lineX},${lineY}`);
    }
  }

  // Helper: check if point is on a boundary line
  function isOnBoundary(x, y) {
    return boundaryTiles.has(`${x},${y}`);
  }

  // Helper: check if point is inside polygon (point-in-polygon)
  function isInside(x, y) {
    let intersections = 0;
    for (const edge of boundary) {
      const [x1, y1] = edge.coord1;
      const [x2, y2] = edge.coord2;
      
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);
      
      if (y < yMin || y > yMax) continue;
      if (y === yMin && y === yMax) continue;
      
      if (x1 === x2) {
        if (x <= x1) intersections++;
      } else {
        const slope = (y2 - y1) / (x2 - x1);
        const intersectX = x1 + (y - y1) / slope;
        if (intersectX >= x) {
          if (y !== yMax || (y === yMax && x < intersectX)) {
            intersections++;
          }
        }
      }
    }
    return intersections % 2 === 1;
  }

  // Cache for valid tiles (tiles that are inside the polygon)
  const validTilesCache = new Set();
  const invalidTilesCache = new Set();

  // Helper: check if tile is valid (red or green)
  function isValidTile(x, y) {
    const key = `${x},${y}`;
    
    // Fast checks first
    if (isRedTile(x, y)) return true;
    if (isOnBoundary(x, y)) return true;
    
    // Check cache
    if (validTilesCache.has(key)) return true;
    if (invalidTilesCache.has(key)) return false;
    
    // Not cached, check if inside
    const inside = isInside(x, y);
    if (inside) {
      validTilesCache.add(key);
      return true;
    } else {
      invalidTilesCache.add(key);
      return false;
    }
  }

  while (rectangles.length > 0) {
    const rectangle = rectangles.pop();
    
    // Get the 4 corners
    const corners = rectangle.coords;
    
    // Get rectangle bounds
    const [x1, y1] = corners[0]; // First red tile
    const [x2, y2] = corners[2]; // Second red tile
    
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    
    // Early filter: skip rectangles that are completely outside polygon bounds
    if (maxX < polyMinX || minX > polyMaxX || maxY < polyMinY || minY > polyMaxY) {
      continue;
    }
    
    // Check only the 2 non-red corners (corners[1] and corners[3])
    // corners[0] and corners[2] are red tiles, so they're always valid
    const corner1Valid = isValidTile(corners[1][0], corners[1][1]);
    const corner3Valid = isValidTile(corners[3][0], corners[3][1]);
    
    if (!corner1Valid || !corner3Valid) {
      continue;
    }
    
    // Check edges, sampling at intervals for large rectangles
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const maxEdgeLength = Math.max(width, height);
    
    // For large rectangles, limit to max 50 samples per edge
    // This ensures we never check more than 50 tiles per edge regardless of size
    const maxSamples = 100;
    const step = maxEdgeLength > maxSamples ? Math.max(1, Math.floor(maxEdgeLength / maxSamples)) : 1;
    
    let allEdgesValid = true;
    
    // Top edge (left to right)
    for (let x = minX; x <= maxX && allEdgesValid; x += step) {
      if (!isValidTile(x, minY)) allEdgesValid = false;
    }
    // Make sure we check the last tile
    if (allEdgesValid && (maxX - minX) % step !== 0) {
      if (!isValidTile(maxX, minY)) allEdgesValid = false;
    }
    
    // Right edge (top to bottom)
    for (let y = minY; y <= maxY && allEdgesValid; y += step) {
      if (!isValidTile(maxX, y)) allEdgesValid = false;
    }
    // Make sure we check the last tile
    if (allEdgesValid && (maxY - minY) % step !== 0) {
      if (!isValidTile(maxX, maxY)) allEdgesValid = false;
    }
    
    // Bottom edge (right to left)
    for (let x = maxX; x >= minX && allEdgesValid; x -= step) {
      if (!isValidTile(x, maxY)) allEdgesValid = false;
    }
    // Make sure we check the last tile
    if (allEdgesValid && (maxX - minX) % step !== 0) {
      if (!isValidTile(minX, maxY)) allEdgesValid = false;
    }
    
    // Left edge (bottom to top)
    for (let y = maxY; y >= minY && allEdgesValid; y -= step) {
      if (!isValidTile(minX, y)) allEdgesValid = false;
    }
    // Make sure we check the last tile
    if (allEdgesValid && (maxY - minY) % step !== 0) {
      if (!isValidTile(minX, minY)) allEdgesValid = false;
    }
    
    if (allEdgesValid) {
      console.log('Found rectangle', rectangle);
      return rectangle.area;
    }
  }

  console.log('No rectangle found');
  return 0;
}
