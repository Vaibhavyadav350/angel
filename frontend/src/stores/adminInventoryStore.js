import { create } from 'zustand';

// Derives flat inventory rows from the products array
const deriveInventoryRows = (products) => {
  const rows = [];
  (products || []).forEach((product) => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        rows.push({
          productId: product.id || product._id,
          productName: product.name,
          category: product.category,
          image: product.image || product.images?.[0]?.url || '',
          size: variant.size,
          color: variant.color,
          sku:
            variant.sku ||
            `${(product.id || product._id)?.slice(-4)}-${variant.size}-${variant.color}`.toUpperCase(),
          stock: variant.stock,
          isLowStock: variant.stock <= 3,
          isOutOfStock: variant.stock === 0,
        });
      });
    } else {
      rows.push({
        productId: product.id || product._id,
        productName: product.name,
        category: product.category,
        image: product.images?.[0]?.url || '',
        size: 'N/A',
        color: 'N/A',
        sku: (product.id || product._id)?.slice(-8).toUpperCase() || 'N/A',
        stock: product.stock || 0,
        isLowStock: (product.stock || 0) <= 3,
        isOutOfStock: (product.stock || 0) === 0,
      });
    }
  });
  return rows;
};

/**
 * Admin inventory view derived from the product catalog.
 */
const useAdminInventoryStore = create((set) => ({
  inventory: [],
  lowStockCount: 0,
  outOfStockCount: 0,
  loading: false,
  error: false,

  computeInventory: (products) => {
    set({ loading: true, error: false });
    const inventory = deriveInventoryRows(products);
    set({
      inventory,
      lowStockCount: inventory.filter((i) => i.isLowStock && !i.isOutOfStock).length,
      outOfStockCount: inventory.filter((i) => i.isOutOfStock).length,
      loading: false,
    });
    return inventory;
  },
}));

export default useAdminInventoryStore;
