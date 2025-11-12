import { useMemo, useState } from 'react';
import { computeBentoLayout, BentoGridConfig } from '../index';
import './App.css';

const initialConfig: BentoGridConfig = {
  canvas: {
    width: 1200,
    height: 700,
    padding: 20,
  },
  tiles: [3, 1, 2, 1, 2.5, 1.2, 7.5, 2.34, 1],
  options: {
    strategy: 'squarified',
    gutter: 10,
  },
};

function App() {
  const [config, setConfig] = useState<BentoGridConfig>(initialConfig);

  const layout = useMemo(() => computeBentoLayout(config), [config]);

  const handleStrategyChange = (strategy: 'squarified' | 'binary') => {
    setConfig((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        strategy,
      },
    }));
  };

  const updateCanvas = (field: 'width' | 'height' | 'padding', value: number) => {
    setConfig((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        [field]: value,
      },
    }));
  };

  const updateGutter = (value: number) => {
    setConfig((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        gutter: value,
      },
    }));
  };

  const updateTile = (index: number, value: number) => {
    setConfig((prev) => {
      const newTiles = [...prev.tiles];
      newTiles[index] = value;
      return {
        ...prev,
        tiles: newTiles,
      };
    });
  };

  const addTile = () => {
    setConfig((prev) => ({
      ...prev,
      tiles: [...prev.tiles, 1],
    }));
  };

  const removeTile = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      tiles: prev.tiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="app">
      <div className="controls">
        <h1>Bento Grid Demo</h1>
        <div className="header-row">
          <div className="control-group">
            <label>
              Strategy:
              <select
                value={config.options?.strategy || 'squarified'}
                onChange={(event) =>
                  handleStrategyChange(event.target.value as 'squarified' | 'binary')
                }
              >
                <option value="squarified">Squarified</option>
                <option value="binary">Binary</option>
              </select>
            </label>
          </div>
          <div className="control-group">
            <label>
              Width:
              <input
                type="number"
                value={config.canvas.width}
                onChange={(e) => updateCanvas('width', Number(e.target.value))}
                min="100"
                max="2000"
                step="10"
              />
            </label>
          </div>
          <div className="control-group">
            <label>
              Height:
              <input
                type="number"
                value={config.canvas.height}
                onChange={(e) => updateCanvas('height', Number(e.target.value))}
                min="100"
                max="2000"
                step="10"
              />
            </label>
          </div>
          <div className="control-group">
            <label>
              Padding:
              <input
                type="number"
                value={config.canvas.padding || 0}
                onChange={(e) => updateCanvas('padding', Number(e.target.value))}
                min="0"
                max="100"
                step="1"
              />
            </label>
          </div>
          <div className="control-group">
            <label>
              Gutter:
              <input
                type="number"
                value={config.options?.gutter || 0}
                onChange={(e) => updateGutter(Number(e.target.value))}
                min="0"
                max="50"
                step="1"
              />
            </label>
          </div>
        </div>
        <div className="tile-array-section">
          <div className="tile-array-header">
            <label>Tiles:</label>
            <button onClick={addTile} className="add-tile-btn" type="button">
              +
            </button>
          </div>
          <div className="tile-array">
            {config.tiles.map((value, index) => (
              <div key={`tile-value-${index}`} className="tile-input-wrapper">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateTile(index, Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="tile-input"
                />
                {config.tiles.length > 1 && (
                  <button
                    onClick={() => removeTile(index)}
                    className="remove-tile-btn"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="canvas-container">
        <svg
          width={config.canvas.width}
          height={config.canvas.height}
          style={{ border: '1px solid #ccc', background: '#f9f9f9' }}
        >
          <rect
            x={layout.rect.x}
            y={layout.rect.y}
            width={layout.rect.width}
            height={layout.rect.height}
            fill="none"
            stroke="#999"
            strokeWidth={2}
            strokeDasharray="4 4"
          />

          {layout.tiles.map((tile, index) => (
            <g key={tile.id}>
              <rect
                x={tile.rect.x}
                y={tile.rect.y}
                width={tile.rect.width}
                height={tile.rect.height}
                fill={`hsl(${(index * 45) % 360}, 70%, 80%)`}
                stroke="#333"
                strokeWidth={1}
              />
              <text
                x={tile.rect.x + tile.rect.width / 2}
                y={tile.rect.y + tile.rect.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight="bold"
                fill="#333"
              >
                {tile.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default App;

