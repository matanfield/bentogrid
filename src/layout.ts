import { BentoGridConfig, BentoGridLayout, LayoutStrategy, Tile, Rectangle } from './types';
import { applyLayoutStrategy } from './algorithms';

export function computeBentoLayout(config: BentoGridConfig): BentoGridLayout {
  const { canvas, tiles: tileAreas, options } = config;
  const padding = canvas.padding ?? 0;
  const strategy: LayoutStrategy = options?.strategy ?? 'squarified';
  const gutter = options?.gutter ?? 0;

  if (canvas.width <= 0 || canvas.height <= 0) {
    throw new Error('Canvas width and height must be greater than 0');
  }

  const rect: Rectangle = {
    x: padding,
    y: padding,
    width: Math.max(0, canvas.width - padding * 2),
    height: Math.max(0, canvas.height - padding * 2),
  };

  const tiles: Tile[] = tileAreas
    .map((area, index) => ({
      id: `tile-${index}`,
      area,
    }))
    .filter((tile) => tile.area > 0);

  const layoutTiles = tiles.length
    ? applyLayoutStrategy(strategy, tiles, rect, gutter)
    : [];

  return {
    rect,
    tiles: layoutTiles,
  };
}

