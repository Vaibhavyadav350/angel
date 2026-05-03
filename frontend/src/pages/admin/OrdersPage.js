import React, { useState, useEffect, useCallback } from 'react';
import { SidebarWithHeader, OrdersTable } from '../../components/admin';
import { useOrderContext } from '../../context/admin_order_context';
import { MdRefresh, MdFilterList } from 'react-icons/md';
import { orderStatusList } from '../../utils/constants';
import { toast } from 'react-toastify';

function OrdersPage() {
  const {
    fetchFilteredOrders,
    exportOrdersToExcel,
  } = useOrderContext();

  const [pageOrders, setPageOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    const res = await exportOrdersToExcel();
    setExporting(false);
    if (!res.success) toast.error(res.message);
  };

  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    returnStatus: 'exclude_returns'
  });

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Memoized so the reference stays stable across re-renders.
  // This prevents the infinite loop where OrdersTable calling onRefresh → setState → new onRefresh ref → re-call
  const applyFilters = useCallback(async (overrideFilters) => {
    const activeFilters = overrideFilters || filters;
    setLoading(true);
    const res = await fetchFilteredOrders(activeFilters);
    if (res.success) {
      setPageOrders(res.data);
      setError(false);
    } else {
      setError(true);
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []); // Empty deps — intentional: we read from param, not from stale closure

  const handleRefresh = useCallback(() => {
    applyFilters({ status: '', minPrice: '', maxPrice: '', startDate: '', endDate: '', returnStatus: 'exclude_returns' });
  }, [applyFilters]);

  const clearFilters = () => {
    const defaultFilters = { status: '', minPrice: '', maxPrice: '', startDate: '', endDate: '', returnStatus: 'exclude_returns' };
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  // Initial fetch on mount only
  useEffect(() => {
    applyFilters({ returnStatus: 'exclude_returns' });
    // eslint-disable-next-line
  }, []);

  return (
    <SidebarWithHeader>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-bronze/10">
          <div>
            <h1 className="text-3xl font-editorial font-black text-bronze uppercase tracking-widest">Order Archive</h1>
            <p className="text-[10px] text-bronze/40 mt-2 font-bold uppercase tracking-[0.3em]">Manage Transactions & Fulfillment Operations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {exporting ? 'Exporting...' : 'Mass Export'}
            </button>
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Advanced Filtering</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-champagne/10 border border-bronze/10 p-2 rounded text-xs font-bold text-bronze outline-none"
              >
                <option value="">All Statuses</option>
                {orderStatusList.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0.00"
                className="w-full bg-champagne/10 border border-bronze/10 p-2 rounded text-xs font-bold text-bronze outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="9999"
                className="w-full bg-champagne/10 border border-bronze/10 p-2 rounded text-xs font-bold text-bronze outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-2">From Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full bg-champagne/10 border border-bronze/10 p-2 rounded text-xs font-bold text-bronze outline-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
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
          <p className="text-lg font-editorial text-red-500">There was an error loading orders</p>
        </div>
      ) : (
        <OrdersTable orders={pageOrders} onRefresh={handleRefresh} />
      )}
    </SidebarWithHeader>
  );
}

export default OrdersPage;
