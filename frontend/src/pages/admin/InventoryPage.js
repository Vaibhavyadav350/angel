import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useInventoryContext } from '../../context/admin_inventory_context';
import { useProductContext } from '../../context/admin_product_context';
import { Link } from 'react-router-dom';

const InventoryPage = () => {
    const { inventory, lowStockCount, outOfStockCount, computeInventory } = useInventoryContext();
    const { products, fetchProducts } = useProductContext();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all | low | out

    // Load products from the admin catalog (same source as the Products page)
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (products && products.length > 0) {
            computeInventory(products);
        }
        // eslint-disable-next-line
    }, [products]);

    const filteredRows = inventory.filter(row => {
        const matchesSearch = row.productName.toLowerCase().includes(search.toLowerCase()) ||
            row.sku.toLowerCase().includes(search.toLowerCase());
        if (filterStatus === 'low') return matchesSearch && row.isLowStock && !row.isOutOfStock;
        if (filterStatus === 'out') return matchesSearch && row.isOutOfStock;
        return matchesSearch;
    });

    const exportCSV = () => {
        const headers = ['Product', 'Category', 'Size', 'Color', 'SKU', 'Stock', 'Status'];
        const rows = filteredRows.map(r => [
            r.productName, r.category, r.size, r.color, r.sku, r.stock,
            r.isOutOfStock ? 'Out of Stock' : r.isLowStock ? 'Low Stock' : 'In Stock'
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'angel_inventory.csv'; a.click();
    };

    const stockBadge = (row) => {
        if (row.isOutOfStock) return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />Out of Stock</span>;
        if (row.isLowStock) return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />Low Stock</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />In Stock</span>;
    };

    return (
        <SidebarWithHeader>
            <div className="bg-champagne min-h-screen p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2">Stock Management</p>
                        <h1 className="text-5xl font-editorial font-black text-bronze uppercase tracking-tighter">Inventory</h1>
                        <p className="text-sm text-bronze/50 mt-2">{inventory.length} variant rows tracked</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-3 px-6 py-3 bg-white border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-colors rounded"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-5 mb-8">
                    <button onClick={() => setFilterStatus('all')} className={`bg-white rounded-lg border p-5 text-left transition-all ${filterStatus === 'all' ? 'border-gold shadow-md' : 'border-bronze/10 hover:border-bronze/30'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/40 mb-2">Total SKUs</p>
                        <p className="text-4xl font-editorial font-black text-bronze">{inventory.length}</p>
                    </button>
                    <button onClick={() => setFilterStatus('low')} className={`bg-white rounded-lg border p-5 text-left transition-all ${filterStatus === 'low' ? 'border-amber-400 shadow-md' : 'border-bronze/10 hover:border-amber-200'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600 mb-2">Low Stock (≤3)</p>
                        <p className="text-4xl font-editorial font-black text-amber-600">{lowStockCount}</p>
                    </button>
                    <button onClick={() => setFilterStatus('out')} className={`bg-white rounded-lg border p-5 text-left transition-all ${filterStatus === 'out' ? 'border-red-400 shadow-md' : 'border-bronze/10 hover:border-red-200'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500 mb-2">Out of Stock</p>
                        <p className="text-4xl font-editorial font-black text-red-500">{outOfStockCount}</p>
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white border border-bronze/10 rounded-lg px-5 py-4 mb-6 flex items-center gap-4">
                    <span className="material-symbols-outlined text-bronze/30">search</span>
                    <input
                        className="flex-1 text-sm text-bronze bg-transparent focus:outline-none placeholder:text-bronze/30"
                        placeholder="Search by product name or SKU..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {filterStatus !== 'all' && (
                        <button onClick={() => setFilterStatus('all')} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-bronze/50 hover:text-bronze transition-colors">
                            <span className="material-symbols-outlined text-sm">filter_list_off</span>
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg border border-bronze/10 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 px-6 py-4 border-b border-bronze/10 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/40">
                        <div>Product</div>
                        <div>Size</div>
                        <div>Color</div>
                        <div>SKU</div>
                        <div className="text-center">Stock</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>

                    {filteredRows.length === 0 ? (
                        <div className="py-24 text-center">
                            {products.length === 0 ? (
                                <>
                                    <span className="material-symbols-outlined text-5xl text-bronze/20">inventory_2</span>
                                    <p className="text-bronze/40 font-editorial text-xl font-bold mt-4">No products loaded</p>
                                    <p className="text-bronze/30 text-sm mt-2">Add products first, then check inventory here.</p>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-5xl text-bronze/20">search_off</span>
                                    <p className="text-bronze/40 font-editorial text-xl font-bold mt-4">No matching inventory rows</p>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredRows.map((row, idx) => (
                            <div key={idx} className={`grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 px-6 py-4 border-b border-bronze/5 last:border-0 items-center hover:bg-champagne/30 transition-colors ${row.isOutOfStock ? 'bg-red-50/40' : row.isLowStock ? 'bg-amber-50/40' : ''}`}>
                                <div className="flex items-center gap-3">
                                    {row.image ? (
                                        <div className="w-10 h-10 rounded overflow-hidden bg-bronze/5 shrink-0">
                                            <img src={row.image} alt={row.productName} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-bronze/10 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-sm text-bronze/30">image</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-bold text-bronze line-clamp-1">{row.productName}</p>
                                        <p className="text-[10px] text-bronze/40">{row.category}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-bronze">{row.size}</div>
                                <div className="flex items-center gap-2">
                                    {row.color && row.color !== 'N/A' && <span className="w-4 h-4 rounded-full border border-bronze/20 inline-block" style={{ background: row.color }} />}
                                    <span className="text-sm text-bronze">{row.color}</span>
                                </div>
                                <div className="font-mono text-[11px] text-bronze/50 bg-bronze/5 px-2 py-0.5 rounded w-fit">{row.sku}</div>
                                <div className="text-center">
                                    <span className={`text-lg font-editorial font-black ${row.isOutOfStock ? 'text-red-500' : row.isLowStock ? 'text-amber-600' : 'text-bronze'}`}>
                                        {row.stock}
                                    </span>
                                </div>
                                <div>{stockBadge(row)}</div>
                                <div>
                                    <Link to={`/admin/products/${row.productId}`} className="p-2 hover:bg-gold/10 rounded transition-colors text-bronze/40 hover:text-gold inline-flex">
                                        <span className="material-symbols-outlined text-base">open_in_new</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <p className="text-[10px] text-bronze/30 font-bold uppercase tracking-widest text-center mt-6">
                    {filteredRows.length} rows shown · Last synced from product catalog
                </p>
            </div>
        </SidebarWithHeader>
    );
};

export default InventoryPage;
