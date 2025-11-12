import { describe, it, expect } from 'vitest';
import { computeBentoLayout } from './layout';
import type { BentoGridConfig } from './types';

describe('computeBentoLayout', () => {
  it('should compute layout for basic configuration', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
      },
      tiles: [1, 1],
    };

    const layout = computeBentoLayout(config);

    expect(layout.tiles).toHaveLength(2);
    expect(layout.rect.width).toBe(100);
    expect(layout.rect.height).toBe(100);
  });

  it('should respect padding', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
        padding: 10,
      },
      tiles: [1],
    };

    const layout = computeBentoLayout(config);

    expect(layout.rect.x).toBe(10);
    expect(layout.rect.y).toBe(10);
    expect(layout.rect.width).toBe(80);
    expect(layout.rect.height).toBe(80);
  });

  it('should filter out zero or negative areas', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
      },
      tiles: [1, 0, -1, 2],
    };

    const layout = computeBentoLayout(config);

    expect(layout.tiles).toHaveLength(2);
  });

  it('should handle empty tiles array', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
      },
      tiles: [],
    };

    const layout = computeBentoLayout(config);

    expect(layout.tiles).toHaveLength(0);
  });

  it('should work with different strategies', () => {
    const baseConfig: BentoGridConfig = {
      canvas: {
        width: 200,
        height: 200,
      },
      tiles: [1, 2, 3],
    };

    const squarified = computeBentoLayout({
      ...baseConfig,
      options: { strategy: 'squarified' },
    });

    const binary = computeBentoLayout({
      ...baseConfig,
      options: { strategy: 'binary' },
    });

    expect(squarified.tiles).toHaveLength(3);
    expect(binary.tiles).toHaveLength(3);
  });

  it('should assign unique IDs to tiles', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
      },
      tiles: [1, 2, 3],
    };

    const layout = computeBentoLayout(config);

    const ids = layout.tiles.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should ensure tiles fit within canvas bounds', () => {
    const config: BentoGridConfig = {
      canvas: {
        width: 100,
        height: 100,
        padding: 10,
      },
      tiles: [1, 1, 1],
    };

    const layout = computeBentoLayout(config);

    layout.tiles.forEach((tile) => {
      expect(tile.rect.x).toBeGreaterThanOrEqual(layout.rect.x);
      expect(tile.rect.y).toBeGreaterThanOrEqual(layout.rect.y);
      expect(tile.rect.x + tile.rect.width).toBeLessThanOrEqual(
        layout.rect.x + layout.rect.width
      );
      expect(tile.rect.y + tile.rect.height).toBeLessThanOrEqual(
        layout.rect.y + layout.rect.height
      );
    });
  });
});

