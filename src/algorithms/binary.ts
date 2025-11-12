import { Rectangle, Tile, LayoutTile } from '../types';

/**
 * Binary split algorithm - recursively splits along the longer dimension
 */
export function binaryLayout(
  tiles: Tile[],
  rect: Rectangle,
  gutter: number = 0
): LayoutTile[] {
  if (tiles.length === 0) return [];
  if (tiles.length === 1) {
    return [{
      id: tiles[0].id,
      area: tiles[0].area,
      rect: {
        x: rect.x + gutter / 2,
        y: rect.y + gutter / 2,
        width: Math.max(0, rect.width - gutter),
        height: Math.max(0, rect.height - gutter)
      }
    }];
  }

  // Normalize areas
  const totalArea = tiles.reduce((sum, t) => sum + t.area, 0);
  const availableArea = rect.width * rect.height;
  const scale = availableArea / totalArea;

  const normalizedTiles = tiles.map(t => ({
    ...t,
    normalizedArea: t.area * scale
  }));

  return splitRecursive(normalizedTiles, rect, gutter);
}

function splitRecursive(
  tiles: Array<Tile & { normalizedArea: number }>,
  rect: Rectangle,
  gutter: number
): LayoutTile[] {
  if (tiles.length === 0) return [];
  if (tiles.length === 1) {
    return [{
      id: tiles[0].id,
      area: tiles[0].area,
      rect: {
        x: rect.x + gutter / 2,
        y: rect.y + gutter / 2,
        width: Math.max(0, rect.width - gutter),
        height: Math.max(0, rect.height - gutter)
      }
    }];
  }

  // Split tiles into two groups
  const mid = Math.floor(tiles.length / 2);
  const left = tiles.slice(0, mid);
  const right = tiles.slice(mid);

  const leftArea = left.reduce((sum, t) => sum + t.normalizedArea, 0);
  const rightArea = right.reduce((sum, t) => sum + t.normalizedArea, 0);
  const totalArea = leftArea + rightArea;

  // Determine split direction based on aspect ratio
  const splitHorizontally = rect.width > rect.height;

  let leftRect: Rectangle;
  let rightRect: Rectangle;

  if (splitHorizontally) {
    const leftWidth = (leftArea / totalArea) * rect.width;
    leftRect = {
      x: rect.x,
      y: rect.y,
      width: leftWidth,
      height: rect.height
    };
    rightRect = {
      x: rect.x + leftWidth,
      y: rect.y,
      width: rect.width - leftWidth,
      height: rect.height
    };
  } else {
    const leftHeight = (leftArea / totalArea) * rect.height;
    leftRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: leftHeight
    };
    rightRect = {
      x: rect.x,
      y: rect.y + leftHeight,
      width: rect.width,
      height: rect.height - leftHeight
    };
  }

  return [
    ...splitRecursive(left, leftRect, gutter),
    ...splitRecursive(right, rightRect, gutter)
  ];
}

