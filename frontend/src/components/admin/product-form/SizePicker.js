import React from 'react';
import { sizeOptions } from '../../../utils/categoryData';

/**
 * Standardised size selector for the admin product form.
 *
 * Sizes are sourced from taxonomy.json to prevent inconsistencies like
 * "S", "s", "Small", "sm" that break storefront filters and the variant matrix.
 * Existing legacy sizes can still be removed, but new selections are limited to
 * the standard taxonomy list.
 *
 * Interface: value (string[]), onChange (callback) — same contract as TagInput.
 */

function SizePicker({ value = [], onChange }) {
  const toggle = (size) => {
    if (value.includes(size)) {
      onChange(value.filter((v) => v !== size));
    } else {
      onChange([...value, size]);
    }
  };

  const legacySizes = value.filter((v) => !sizeOptions.includes(v));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => {
          const selected = value.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggle(size)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border rounded transition-all ${
                selected
                  ? 'bg-bronze text-white border-bronze'
                  : 'bg-champagne/50 text-bronze/70 border-bronze/20 hover:border-bronze/50'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {legacySizes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {legacySizes.map((tag, index) => (
            <span
              key={`legacy-${tag}-${index}`}
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

      {legacySizes.length > 0 && (
        <p className="text-[9px] text-bronze/40">
          Legacy sizes are shown above. Remove them to keep the catalog aligned with the standard size taxonomy.
        </p>
      )}
    </div>
  );
}

export default SizePicker;
