import React, { useContext, useReducer } from 'react';


// Derives flat inventory rows from the products array
const deriveInventoryRows = (products) => {
    const rows = [];
    products.forEach(product => {
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                rows.push({
                    productId: product.id || product._id,
                    productName: product.name,
                    category: product.category,
                    image: product.image || product.images?.[0]?.url || '',
                    size: variant.size,
                    color: variant.color,
                    sku: variant.sku || `${(product.id || product._id)?.slice(-4)}-${variant.size}-${variant.color}`.toUpperCase(),
                    stock: variant.stock,
                    isLowStock: variant.stock <= 3,
                    isOutOfStock: variant.stock === 0,
                });
            });
        } else {
            // Flat product without variants
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

const initialState = {
    inventory: [],
    lowStockCount: 0,
    outOfStockCount: 0,
    loading: false,
    error: false,
};

const InventoryContext = React.createContext();

const inventoryReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'SET_INVENTORY': {
            const inventory = action.payload;
            return {
                ...state,
                loading: false,
                inventory,
                lowStockCount: inventory.filter(i => i.isLowStock && !i.isOutOfStock).length,
                outOfStockCount: inventory.filter(i => i.isOutOfStock).length,
            };
        }
        default:
            return state;
    }
};

export const InventoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(inventoryReducer, initialState);

    const computeInventory = (products) => {
        dispatch({ type: 'SET_LOADING' });
        const rows = deriveInventoryRows(products || []);
        dispatch({ type: 'SET_INVENTORY', payload: rows });
    };

    return (
        <InventoryContext.Provider value={{ ...state, computeInventory }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventoryContext = () => useContext(InventoryContext);
