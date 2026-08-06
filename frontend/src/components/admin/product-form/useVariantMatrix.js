import { useEffect } from 'react';

/**
 * Keeps the size × color variant matrix in sync with the selected colors/sizes.
 *
 * Whenever the set of colors or sizes changes (add / remove / rename), the matrix
 * is regenerated, preserving the stock and SKU of any combination that still
 * exists. Keyed on the serialized colors/sizes so a rename is picked up too — the
 * old implementation keyed only on `.length`, so renaming a value left stale rows.
 *
 * @param {string[]} colors
 * @param {string[]} sizes
 * @param {Array} variants  current variants array
 * @param {string} category product category
 * @param {(name: string, value: any) => void} onField  field setter
 * @returns {{ setVariantField: Function, totalStock: number }}
 */
import { isSizelessCategory, SIZELESS_VALUE } from '../../../utils/categoryData';

export function useVariantMatrix(colors, sizes, variants, category, onField) {
  const colorKey = colors.join('|');
  const sizeKey = sizes.join('|');
  const categoryKey = category || 'none';

  useEffect(() => {
    const isJewelry = isSizelessCategory(category);

    // Empty matrix: give Jewelry a default single-size row, clear everything else.
    if (colors.length === 0 && sizes.length === 0) {
      if (isJewelry) {
        const hasDefault = variants.length === 1 && variants[0].size === SIZELESS_VALUE && variants[0].color === 'Standard';
        if (!hasDefault) {
          onField('variants', [{ size: SIZELESS_VALUE, color: 'Standard', stock: 0, sku: '' }]);
        }
      } else if (variants.length > 0) {
        onField('variants', []);
      }
      return;
    }

    const sizeList = sizes.length > 0 ? sizes : [SIZELESS_VALUE];
    const colorList = colors.length > 0 ? colors : ['Standard'];

    const next = [];
    sizeList.forEach((size) => {
      colorList.forEach((color) => {
        const existing = variants.find((v) => v.size === size && v.color === color);
        next.push({
          size,
          color,
          stock: existing ? existing.stock : 0,
          sku: existing && existing.sku ? existing.sku : '',
        });
      });
    });

    // Only push an update when the matrix structure actually changed, otherwise
    // the effect would loop forever (setting variants → re-render → effect again).
    const structureChanged =
      next.length !== variants.length ||
      next.some((v, i) => !variants[i] || variants[i].size !== v.size || variants[i].color !== v.color);

    if (structureChanged) onField('variants', next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, sizeKey, categoryKey]);

  const setVariantField = (index, field, value) => {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onField('variants', updated);
  };

  const totalStock = variants.reduce((total, v) => total + (Number(v.stock) || 0), 0);

  return { setVariantField, totalStock };
}

export default useVariantMatrix;
