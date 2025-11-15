import {
  BentoGridConfig,
  BentoGridLayout,
  LayoutStrategy,
  Tile,
  Rectangle,
  TileOrder,
  LayoutTile,
} from './types';
import { applyLayoutStrategy } from './algorithms';

export function computeBentoLayout(config: BentoGridConfig): BentoGridLayout {
  const { canvas, tiles: tileAreas, options } = config;
  const padding = canvas.padding ?? 0;
  const strategy: LayoutStrategy = options?.strategy ?? 'squarified';
  const gutter = options?.gutter ?? 0;
  const order: TileOrder = options?.order ?? 'descending';

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

  const orderedTiles: Tile[] =
    order === 'descending'
      ? [...tiles].sort((a, b) => b.area - a.area)
      : tiles;

  const rawLayoutTiles = orderedTiles.length
    ? applyLayoutStrategy(strategy, orderedTiles, rect, gutter)
    : [];

  const layoutTiles = order === 'descending'
    ? reorderToOriginalOrder(rawLayoutTiles, tiles)
    : rawLayoutTiles;

  return {
    rect,
    tiles: layoutTiles,
  };
}

function reorderToOriginalOrder(layoutTiles: LayoutTile[], originalOrder: Tile[]): LayoutTile[] {
  const tileMap = new Map(layoutTiles.map((tile) => [tile.id, tile]));
  return originalOrder.map((tile) => {
    const layoutTile = tileMap.get(tile.id);
    if (!layoutTile) {
      throw new Error(`Missing layout tile for id ${tile.id}`);
    }
    return layoutTile;
  });
}
