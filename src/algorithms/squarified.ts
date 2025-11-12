import { Rectangle, Tile, LayoutTile } from '../types';

/**
 * Squarified treemap algorithm implementation
 * Based on the algorithm by Bruls, Huizing, and van Wijk
 */
export function squarifiedLayout(
  tiles: Tile[],
  rect: Rectangle,
  gutter: number = 0
): LayoutTile[] {
  if (tiles.length === 0) return [];
  if (tiles.length === 1) {
    const tile = tiles[0];
    return [
      {
        id: tile.id,
        area: tile.area,
        rect: {
          x: rect.x + gutter / 2,
          y: rect.y + gutter / 2,
          width: Math.max(0, rect.width - gutter),
          height: Math.max(0, rect.height - gutter),
        },
      },
    ];
  }

  const totalArea = tiles.reduce((sum, t) => sum + t.area, 0);
  const availableArea = rect.width * rect.height;
  const scale = totalArea === 0 ? 0 : availableArea / totalArea;

  const normalizedTiles = tiles.map((tile) => ({
    ...tile,
    normalizedArea: tile.area * scale,
  }));

  return squarify(normalizedTiles, rect, gutter);
}

function squarify(
  tiles: Array<Tile & { normalizedArea: number }>,
  rect: Rectangle,
  gutter: number
): LayoutTile[] {
  const result: LayoutTile[] = [];
  let startIndex = 0;
  let remainingRect: Rectangle = { ...rect };

  while (
    startIndex < tiles.length &&
    remainingRect.width > 0 &&
    remainingRect.height > 0
  ) {
    const horizontal = remainingRect.width >= remainingRect.height;
    const row = getNextRow(tiles, startIndex, remainingRect, horizontal);

    const rowArea = row.reduce((sum, tile) => sum + tile.normalizedArea, 0);
    const thickness = horizontal
      ? rowArea / remainingRect.width
      : rowArea / remainingRect.height;
    const primarySpan = horizontal ? remainingRect.width : remainingRect.height;

    let cursor = horizontal ? remainingRect.x : remainingRect.y;

    for (let index = 0; index < row.length; index++) {
      const tile = row[index];
      const tileSpan = primarySpan === 0 ? 0 : (tile.normalizedArea / rowArea) * primarySpan;

      const tileWidth = horizontal ? tileSpan : thickness;
      const tileHeight = horizontal ? thickness : tileSpan;

      const gutterPrimaryStart = index === 0 ? gutter / 2 : gutter;
      const gutterPrimaryEnd = index === row.length - 1 ? gutter / 2 : gutter;
      const gutterSecondaryStart = gutter / 2;
      const gutterSecondaryEnd = gutter / 2;

      const x = horizontal
        ? cursor + gutterPrimaryStart
        : remainingRect.x + gutterSecondaryStart;
      const y = horizontal
        ? remainingRect.y + gutterSecondaryStart
        : cursor + gutterPrimaryStart;

      const width = horizontal
        ? Math.max(0, tileWidth - gutterPrimaryStart - gutterPrimaryEnd)
        : Math.max(0, tileWidth - gutterSecondaryStart - gutterSecondaryEnd);
      const height = horizontal
        ? Math.max(0, tileHeight - gutterSecondaryStart - gutterSecondaryEnd)
        : Math.max(0, tileHeight - gutterPrimaryStart - gutterPrimaryEnd);

      result.push({
        id: tile.id,
        area: tile.area,
        rect: { x, y, width, height },
      });

      cursor += tileSpan;
    }

    if (horizontal) {
      remainingRect = {
        x: remainingRect.x,
        y: remainingRect.y + thickness,
        width: remainingRect.width,
        height: Math.max(0, remainingRect.height - thickness),
      };
    } else {
      remainingRect = {
        x: remainingRect.x + thickness,
        y: remainingRect.y,
        width: Math.max(0, remainingRect.width - thickness),
        height: remainingRect.height,
      };
    }

    startIndex += row.length;
  }

  return result;
}

function getNextRow(
  tiles: Array<Tile & { normalizedArea: number }>,
  startIndex: number,
  rect: Rectangle,
  horizontal: boolean
): Array<Tile & { normalizedArea: number }> {
  if (startIndex >= tiles.length) return [];

  const row: Array<Tile & { normalizedArea: number }> = [tiles[startIndex]];
  let worstAspect = getWorstAspect(row, rect, horizontal);

  for (let i = startIndex + 1; i < tiles.length; i++) {
    row.push(tiles[i]);
    const nextWorst = getWorstAspect(row, rect, horizontal);
    if (nextWorst > worstAspect) {
      row.pop();
      break;
    }
    worstAspect = nextWorst;
  }

  return row;
}

function getWorstAspect(
  row: Array<Tile & { normalizedArea: number }>,
  rect: Rectangle,
  horizontal: boolean
): number {
  const rowArea = row.reduce((sum, tile) => sum + tile.normalizedArea, 0);
  if (rowArea === 0) return 0;

  const primarySpan = horizontal ? rect.width : rect.height;
  const thickness = horizontal
    ? rowArea / Math.max(primarySpan, Number.EPSILON)
    : rowArea / Math.max(primarySpan, Number.EPSILON);

  let worst = 0;
  for (const tile of row) {
    const tileSpan = primarySpan === 0 ? 0 : (tile.normalizedArea / rowArea) * primarySpan;
    const width = horizontal ? tileSpan : thickness;
    const height = horizontal ? thickness : tileSpan;

    const aspect = width === 0 || height === 0
      ? 0
      : Math.max(width / height, height / width);

    if (aspect > worst) {
      worst = aspect;
    }
  }

  return worst;
}
