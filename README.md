# Bento Grid

A lightweight, framework-agnostic library for generating bento grid layouts. Transform an array of tile areas into optimized rectangular layouts using proven treemap algorithms.

## Features

- 🎯 **Simple API** - Just provide tile areas and canvas dimensions
- 🔄 **Two Algorithms** - Choose between squarified (optimized) or binary (deterministic) layouts
- 📦 **Framework Agnostic** - Pure TypeScript, works with any framework or vanilla JS
- 🎨 **Flexible** - Configurable padding, gutters, and layout strategies
- 📐 **Precise** - Returns exact pixel coordinates for each tile

## Installation

```bash
npm install bentogrid
```

## Quick Start

```typescript
import { computeBentoLayout, BentoGridConfig } from 'bentogrid';

// Define your configuration
const config: BentoGridConfig = {
  canvas: {
    width: 1024,
    height: 640,
    padding: 16, // Optional, defaults to 0
  },
  tiles: [3, 1, 2, 1, 2.5, 1.2, 7.5, 2.34, 1], // Array of tile areas/weights
  options: {
    strategy: 'squarified', // 'squarified' or 'binary'
    gutter: 8, // Optional, spacing between tiles
  },
};

// Compute the layout
const layout = computeBentoLayout(config);

// Use the layout
layout.tiles.forEach((tile) => {
  console.log(`Tile ${tile.id}:`, tile.rect);
  // { x: 16, y: 16, width: 320, height: 200 }
});
```

## Usage Examples

### Basic Usage

```typescript
import { computeBentoLayout } from 'bentogrid';

const layout = computeBentoLayout({
  canvas: { width: 800, height: 600 },
  tiles: [1, 2, 3, 4],
});

// Access the computed rectangles
layout.tiles.forEach((tile) => {
  const { x, y, width, height } = tile.rect;
  // Render your tile at these coordinates
});
```

### With React

```tsx
import { computeBentoLayout, BentoGridConfig } from 'bentogrid';
import { useMemo } from 'react';

function BentoGrid({ config }: { config: BentoGridConfig }) {
  const layout = useMemo(() => computeBentoLayout(config), [config]);

  return (
    <div style={{ position: 'relative', width: config.canvas.width, height: config.canvas.height }}>
      {layout.tiles.map((tile) => (
        <div
          key={tile.id}
          style={{
            position: 'absolute',
            left: tile.rect.x,
            top: tile.rect.y,
            width: tile.rect.width,
            height: tile.rect.height,
            border: '1px solid #ccc',
          }}
        >
          Tile {tile.id}
        </div>
      ))}
    </div>
  );
}
```

### With Canvas/SVG

```typescript
const layout = computeBentoLayout({
  canvas: { width: 1200, height: 800, padding: 20 },
  tiles: [3, 1, 2, 1, 2.5],
  options: { strategy: 'squarified', gutter: 10 },
});

// SVG example
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', '1200');
svg.setAttribute('height', '800');

layout.tiles.forEach((tile) => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', tile.rect.x.toString());
  rect.setAttribute('y', tile.rect.y.toString());
  rect.setAttribute('width', tile.rect.width.toString());
  rect.setAttribute('height', tile.rect.height.toString());
  svg.appendChild(rect);
});
```

## API Reference

### `computeBentoLayout(config: BentoGridConfig): BentoGridLayout`

Computes a bento grid layout from the provided configuration.

#### Configuration (`BentoGridConfig`)

```typescript
{
  canvas: {
    width: number;        // Canvas width in pixels
    height: number;       // Canvas height in pixels
    padding?: number;     // Optional padding around the grid (default: 0)
  };
  tiles: number[];        // Array of tile areas/weights (proportional)
  options?: {
    strategy?: 'squarified' | 'binary';  // Layout algorithm (default: 'squarified')
    gutter?: number;                     // Spacing between tiles (default: 0)
  };
}
```

#### Return Value (`BentoGridLayout`)

```typescript
{
  rect: {
    x: number;      // X position of the grid area
    y: number;      // Y position of the grid area
    width: number;  // Width of the grid area
    height: number; // Height of the grid area
  };
  tiles: Array<{
    id: string;     // Unique tile identifier (e.g., "tile-0", "tile-1")
    area: number;   // Original area value
    rect: {
      x: number;    // X position in pixels
      y: number;    // Y position in pixels
      width: number;// Width in pixels
      height: number;// Height in pixels
    };
  }>;
}
```

## Layout Strategies

### Squarified (Default)

Optimizes for square-like rectangles, minimizing aspect ratios. Best for visual appeal and readability.

```typescript
{ strategy: 'squarified' }
```

### Binary

Uses recursive binary splitting. More deterministic and predictable, but may produce less square-like tiles.

```typescript
{ strategy: 'binary' }
```

## How Tile Areas Work

The `tiles` array contains **proportional areas**. The library automatically normalizes them to fill the available canvas space:

- `[1, 1, 1]` → Three equal-sized tiles
- `[3, 1, 2]` → First tile is 3x larger than the second, 1.5x larger than the third
- `[1, 4, 7.5, 2.34]` → Any positive numbers work as proportions

## Development

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Build library
npm run build
```

## Architecture

- **Core engine** (`src/layout.ts`): Pure TypeScript layout computation
- **Algorithms** (`src/algorithms/`): Swappable layout strategies (squarified, binary)
- **Types** (`src/types.ts`): TypeScript definitions
- **Demo** (`src/demo/`): React visualization app

## License

MIT

