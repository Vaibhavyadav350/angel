import React, { useState } from 'react';

/**
 * Chip-based input for a list of free-text values (e.g. colors, sizes).
 *
 * Replaces the old pattern of binding a comma-joined string to a text input and
 * re-parsing on every keystroke, which stripped internal whitespace and corrupted
 * multi-word values like "Emerald Green". Values are stored as a clean string[].
 *
 * Add a tag with Enter or comma; remove with the chip's × or Backspace on an
 * empty input.
 */
function TagInput({ value = [], onChange, placeholder = '', hint }) {
  const [draft, setDraft] = useState('');

  const addTag = (raw) => {
    const tag = raw.trim();
    setDraft('');
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  };

  const removeTag = (index) => onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div>
      <div className="w-full bg-champagne/50 border border-bronze/20 rounded px-2 py-2 flex flex-wrap gap-1.5 items-center focus-within:border-gold transition-colors min-h-[44px]">
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="flex items-center gap-1.5 bg-bronze/10 text-bronze text-xs font-bold px-2 py-1 rounded"
          >
            {tag.startsWith('#') && (
              <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: tag }} />
            )}
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-bronze/40 hover:text-red-500 transition-colors leading-none"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-bronze placeholder:text-bronze/30 px-1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      {hint && <p className="text-[9px] text-bronze/40 mt-1">{hint}</p>}
    </div>
  );
}

export default TagInput;
