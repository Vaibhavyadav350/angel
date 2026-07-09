import React, { useState, useEffect, useCallback } from 'react';
import { SidebarWithHeader, OrdersTable } from '../../components/admin';
import { useAdminOrderStore } from '../../stores';
import { MdRefresh, MdFilterList } from 'react-icons/md';

function ReturnsPage() {
    const {
        fetchFilteredOrders,
    } = useAdminOrderStore();

    const [returnOrders, setReturnOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filters, setFilters] = useState({
        returnStatus: 'all_returns',
    });

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Memoized to prevent new reference on every render → infinite loop with OrdersTable onRefresh
    const applyFilters = useCallback(async (overrideFilters) => {
        const activeFilters = overrideFilters || { returnStatus: 'all_returns' };
        setLoading(true);
        const res = await fetchFilteredOrders(activeFilters);
        if (res.success) {
            setReturnOrders(res.data);
            setError(false);
        } else {
            setError(true);
        }
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const handleRefresh = useCallback(() => {
        applyFilters({ returnStatus: 'all_returns' });
    }, [applyFilters]);

    const clearFilters = () => {
        const defaultFilters = { returnStatus: 'all_returns' };
        setFilters(defaultFilters);
        applyFilters(defaultFilters);
    };

    // Initial fetch
    useEffect(() => {
        applyFilters({ returnStatus: 'all_returns' });
        // eslint-disable-next-line
    }, []);



    return (
        <SidebarWithHeader>
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-bronze/10">
                    <div>
                        <h1 className="text-3xl font-editorial font-black text-bronze uppercase tracking-widest">Return Archive</h1>
                        <p className="text-[10px] text-bronze/40 mt-2 font-bold uppercase tracking-[0.3em]">Oversee Archival Reversals & Stock Restoration</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-3 px-6 py-3 bg-white border border-bronze/20 text-bronze text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-bronze/5 transition-all active:scale-95"
                        >
                            <MdRefresh className="text-lg" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border border-bronze/10 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MdFilterList className="text-bronze/40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Return Phase Filtering</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-2">Phase</label>
                            <select
                                name="returnStatus"
                                value={filters.returnStatus}
                                onChange={handleFilterChange}
                                className="w-full bg-champagne/10 border border-bronze/10 p-2 rounded text-xs font-bold text-bronze outline-none"
                            >
                                <option value="all_returns">All Phases</option>
                                <option value="requested">Requested</option>
                                <option value="approved">Approved</option>
                                <option value="processing">Processing</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2 lg:col-span-1">
                            <button
                                onClick={() => applyFilters(filters)}
                                className="flex-1 bg-bronze text-white py-2.5 rounded text-[9px] font-black uppercase tracking-widest hover:bg-gold transition-all"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="flex-1 border border-bronze/20 text-bronze/40 py-2.5 rounded text-[9px] font-black uppercase tracking-widest hover:bg-champagne/10 transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-lg font-editorial text-red-500">There was an error loading return requests</p>
                </div>
            ) : (
                <OrdersTable orders={returnOrders} onRefresh={handleRefresh} />
            )}
        </SidebarWithHeader>
    );
}

export default ReturnsPage;
