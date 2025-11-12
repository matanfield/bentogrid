import { Rectangle, Tile, LayoutTile, LayoutStrategy } from '../types';
import { squarifiedLayout } from './squarified';
import { binaryLayout } from './binary';

/**
 * Strategy registry - makes it easy to add new algorithms
 */
const strategies: Record<LayoutStrategy, (tiles: Tile[], rect: Rectangle, gutter: number) => LayoutTile[]> = {
  squarified: squarifiedLayout,
  binary: binaryLayout,
};

/**
 * Apply a layout strategy to tiles within a rectangle
 */
export function applyLayoutStrategy(
  strategy: LayoutStrategy,
  tiles: Tile[],
  rect: Rectangle,
  gutter: number = 0
): LayoutTile[] {
  const layoutFn = strategies[strategy];
  if (!layoutFn) {
    throw new Error(`Unknown layout strategy: ${strategy}`);
  }
  return layoutFn(tiles, rect, gutter);
}

