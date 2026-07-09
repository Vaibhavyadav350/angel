import React, { useState } from 'react';

/**
 * Fashion-oriented colour palette for the admin product form.
 *
 * Shows a grid of preset swatches that can be toggled on/off, plus a free-text
 * input for custom colours not in the palette. Replaces the old TagInput for
 * the "colors" field.
 *
 * Interface: value (string[]), onChange (callback) — same contract as TagInput.
 */

const FASHION_COLORS = [
  { name: 'Red', hex: '#C62828' },
  { name: 'Maroon', hex: '#6A1B29' },
  { name: 'Magenta', hex: '#AD1457' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Peach', hex: '#FFAB91' },
  { name: 'Orange', hex: '#E65100' },
  { name: 'Gold', hex: '#C6993E' },
  { name: 'Yellow', hex: '#F9A825' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Beige', hex: '#D4C5A9' },
  { name: 'Off-White', hex: '#FAF0E6' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Olive', hex: '#6B8E23' },
  { name: 'Green', hex: '#2E7D32' },
  { name: 'Emerald Green', hex: '#046307' },
  { name: 'Teal', hex: '#00695C' },
  { name: 'Turquoise', hex: '#00BCD4' },
  { name: 'Sky Blue', hex: '#4FC3F7' },
  { name: 'Blue', hex: '#1565C0' },
  { name: 'Navy Blue', hex: '#1A237E' },
  { name: 'Purple', hex: '#6A1B9A' },
  { name: 'Lavender', hex: '#CE93D8' },
  { name: 'Mauve', hex: '#7B4F7B' },
  { name: 'Brown', hex: '#5D4037' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Rust', hex: '#BF360C' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Grey', hex: '#757575' },
  { name: 'Black', hex: '#212121' },
  { name: 'Multicolour', hex: null },
];

// Gradient used for the "Multicolour" swatch
const multiGradient = 'linear-gradient(135deg, #E91E63 0%, #FF9800 25%, #FFEB3B 50%, #4CAF50 75%, #2196F3 100%)';

function ColorPicker({ value = [], onChange }) {
  const [customDraft, setCustomDraft] = useState('');

  const toggle = (name) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const addCustom = (raw) => {
    const tag = raw.trim();
    setCustomDraft('');
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCustom(customDraft);
    }
  };

  const isSelected = (name) => value.includes(name);

  // Find custom colours (ones not in the palette)
  const paletteNames = FASHION_COLORS.map((c) => c.name);
  const customColors = value.filter((v) => !paletteNames.includes(v));

  return (
    <div className="space-y-3">
      {/* Preset palette grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
        {FASHION_COLORS.map(({ name, hex }) => {
          const selected = isSelected(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex flex-col items-center gap-1 px-1 py-2 rounded-lg border-2 transition-all duration-150
                ${selected
                  ? 'border-bronze bg-bronze/10 shadow-sm'
                  : 'border-transparent hover:border-bronze/20 hover:bg-champagne/30'
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
              <span className={`text-[8px] font-bold uppercase tracking-wider leading-tight text-center
                ${selected ? 'text-bronze' : 'text-bronze/50'}`}
              >
                {name}
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

      {/* Custom color input */}
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 bg-champagne/50 border border-bronze/20 rounded px-3 py-2 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors"
          value={customDraft}
          onChange={(e) => setCustomDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addCustom(customDraft)}
          placeholder="Custom colour name..."
        />
        <button
          type="button"
          onClick={() => addCustom(customDraft)}
          className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze/60 border border-bronze/20 rounded hover:bg-bronze/5 transition-colors"
        >
          Add
        </button>
      </div>
      <p className="text-[9px] text-bronze/40">Click swatches above to toggle, or type a custom colour name below.</p>
    </div>
  );
}

export default ColorPicker;
