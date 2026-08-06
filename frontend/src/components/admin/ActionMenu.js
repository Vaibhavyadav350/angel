import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BiChevronDown } from 'react-icons/bi';

const GAP = 6;   // space between the trigger and the menu
const EDGE = 8;  // minimum distance from the viewport edge

/**
 * Row-action dropdown for the admin tables.
 *
 * Rendered through a portal so it is never clipped by the table's `overflow`,
 * and positioned from the trigger's real geometry.
 *
 * The tables previously each carried their own copy of this logic, positioned
 * against hardcoded guesses (`MENU_HEIGHT = 260`, `left: rect.right - 144`) that
 * did not match the menu's actual size. The height guess made the menu flip
 * upwards far too eagerly and land well above its own row; the width guess
 * offset it sideways. Here the menu is measured after it mounts, so the numbers
 * are always right no matter how many items a row shows.
 *
 * Usage — `children` may be a function receiving `close`:
 *   <ActionMenu>{(close) => <Item onClick={() => { doThing(); close(); }} />}</ActionMenu>
 */
const ActionMenu = ({ label = 'Actions', width = 176, children, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null); // null until measured — avoids a flash at 0,0
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const t = trigger.getBoundingClientRect();
    const m = menu.getBoundingClientRect();

    // Below the trigger by default; flip above only if it genuinely will not fit.
    let top = t.bottom + GAP;
    if (top + m.height > window.innerHeight - EDGE) {
      const above = t.top - m.height - GAP;
      top = above >= EDGE ? above : Math.max(EDGE, window.innerHeight - m.height - EDGE);
    }

    // Right-aligned to the trigger, clamped inside the viewport.
    let left = t.right - m.width;
    left = Math.min(Math.max(EDGE, left), Math.max(EDGE, window.innerWidth - m.width - EDGE));

    setPos({ top, left });
  }, []);

  // Measure once the menu is in the DOM, before the browser paints.
  useLayoutEffect(() => {
    if (open) place();
    else setPos(null);
  }, [open, place]);

  // A fixed-position menu would otherwise drift away from its row on scroll.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, close]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze/60 hover:text-bronze hover:bg-bronze/5 rounded transition-colors disabled:opacity-40"
      >
        {label} <BiChevronDown />
      </button>

      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[60]" onClick={close} />
            <div
              ref={menuRef}
              role="menu"
              className="fixed bg-white border border-bronze/10 rounded-lg shadow-xl z-[70] py-2 overflow-hidden"
              style={{
                width,
                top: pos ? pos.top : -9999,
                left: pos ? pos.left : -9999,
                opacity: pos ? 1 : 0,
              }}
            >
              {typeof children === 'function' ? children(close) : children}
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

/** Standard row-action item. `tone` picks the colour treatment. */
export const ActionMenuItem = ({ onClick, children, icon, tone = 'default' }) => {
  const tones = {
    default: 'text-bronze/70 hover:bg-champagne/20',
    blue: 'text-blue-600 hover:bg-blue-50',
    indigo: 'text-indigo-600 hover:bg-indigo-50',
    emerald: 'text-emerald-600 hover:bg-emerald-50',
    danger: 'text-red-500 hover:bg-red-50',
  };
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer flex items-center justify-between gap-3 ${tones[tone] || tones.default}`}
    >
      <span>{children}</span>
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
    </div>
  );
};

export const ActionMenuDivider = () => <div className="h-px bg-bronze/10 my-1" />;

export default ActionMenu;
