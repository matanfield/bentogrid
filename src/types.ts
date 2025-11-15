/**
 * Rectangle with normalized coordinates (0-1) or absolute pixels
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Internal tile representation with identifier and area
 */
export interface Tile {
  id: string;
  area: number;
}

/**
 * Layout strategy for arranging tiles
 */
export type LayoutStrategy = 'squarified' | 'binary';

/**
 * Tile ordering strategy before computing layout
 */
export type TileOrder = 'input' | 'descending';

/**
 * Configuration for computing a single bento grid
 */
export interface BentoGridConfig {
  canvas: {
    width: number;
    height: number;
    padding?: number;
  };
  tiles: number[];
  options?: {
    strategy?: LayoutStrategy;
    gutter?: number;
    order?: TileOrder;
  };
}

/**
 * Layout tile with computed rectangle
 */
export interface LayoutTile {
  id: string;
  area: number;
  rect: Rectangle;
}

/**
 * Resulting layout for a single grid
 */
export interface BentoGridLayout {
  rect: Rectangle;
  tiles: LayoutTile[];
}
