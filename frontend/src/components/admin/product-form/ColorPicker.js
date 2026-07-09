import React from 'react';
import { colorOptions } from '../../../utils/categoryData';

/**
 * Fashion-oriented colour palette for the admin product form.
 *
 * Shows a grid of preset swatches that can be toggled on/off. The palette is
 * sourced from taxonomy.json so the storefront filters and admin form stay in
 * sync. Custom colours are no longer allowed — this prevents inconsistent
 * labelling (e.g. "Red", "red", "Maroon") that breaks filter aggregation.
 *
 * Interface: value (string[]), onChange (callback) — same contract as TagInput.
 */

// Gradient used for the "Multicolour" swatch
const multiGradient = 'linear-gradient(135deg, #E91E63 0%, #FF9800 25%, #FFEB3B 50%, #4CAF50 75%, #2196F3 100%)';

function ColorPicker({ value = [], onChange }) {
  const toggle = (name) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const isSelected = (name) => value.includes(name);

  // Find legacy/custom colours (ones not in the current taxonomy palette)
  const paletteNames = colorOptions.map((c) => c.name);
  const customColors = value.filter((v) => !paletteNames.includes(v));

  return (
    <div className="space-y-3">
      {/* Preset palette grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
        {colorOptions.map(({ name, hex }) => {
          const selected = isSelected(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-150
                ${selected
                  ? 'border-bronze shadow-md scale-110'
                  : 'border-transparent hover:border-bronze/40 hover:scale-105'
                }`}
              title={name}
            >
              <span
                className={`w-6 h-6 rounded-full border relative flex items-center justify-center
                  ${hex === '#FFFFFF' || hex === '#FAF0E6' || hex === '#FFFDD0'
                    ? 'border-bronze/30'
                    : 'border-black/10'
                  }`}
                style={{
                  background: hex ? hex : multiGradient,
                }}
              >
                {selected && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 10l3 3 5-6"
                      stroke={
                        hex && (hex === '#FFFFFF' || hex === '#FAF0E6' || hex === '#FFFDD0' || hex === '#FFAB91' || hex === '#D4C5A9' || hex === '#C0C0C0' || hex === '#CE93D8' || hex === '#D2B48C' || hex === '#4FC3F7' || hex === '#F9A825')
                          ? '#5D4037'
                          : '#FFFFFF'
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom colors already added */}
      {customColors.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customColors.map((tag, index) => (
            <span
              key={`custom-${tag}-${index}`}
              className="flex items-center gap-1.5 bg-bronze/10 text-bronze text-xs font-bold px-2 py-1 rounded"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== tag))}
                className="text-bronze/40 hover:text-red-500 transition-colors leading-none"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {customColors.length > 0 && (
        <p className="text-[9px] text-bronze/40">
          Legacy custom colours are shown above. Remove them to keep the catalog aligned with the standard palette.
        </p>
      )}
    </div>
  );
}

export default ColorPicker;
