import React from 'react';
import { SidebarWithHeader, DashboardCards, OrdersTable } from '../../components/admin';
import {
  useAdminOrderStore,
  useAdminAnalyticsStore,
  useAdminCustomerStore,
} from '../../stores';
import SalesAreaChart from '../../components/admin/charts/SalesAreaChart';
import CategoryPieChart from '../../components/admin/charts/CategoryPieChart';
import { formatPrice } from '../../utils/helpers';

export default function Dashboard() {
  const { recent_orders, fetchOrders } = useAdminOrderStore();
  const { sales_stats, category_stats, kpi_stats, fetchAnalytics, analytics_loading } = useAdminAnalyticsStore();
  const { fetchCustomers } = useAdminCustomerStore();

  React.useEffect(() => {
    fetchAnalytics();
    fetchCustomers();
    fetchOrders();
  }, [fetchAnalytics, fetchCustomers, fetchOrders]);

  if (analytics_loading) {
    return (
      <SidebarWithHeader>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-bronze/10 border-t-gold rounded-full animate-spin" />
        </div>
      </SidebarWithHeader>
    );
  }

  return (
    <SidebarWithHeader>
      <div className="mb-10">
        <h1 className="text-2xl font-editorial font-black text-bronze uppercase tracking-widest">Business Intelligence</h1>
        <p className="text-xs text-bronze/40 mt-2 font-bold uppercase tracking-[0.2em]">Live Store Performance Overview</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SalesAreaChart data={sales_stats} />
        <CategoryPieChart data={category_stats} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-7 border border-bronze/10 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-gold/10 transition-colors" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-bronze/50 mb-3">Total Gross Revenue</p>
          <p className="text-4xl font-editorial font-black text-bronze tracking-tight">{formatPrice(kpi_stats.totalRevenue || 0)}</p>
        </div>
        <div className="bg-white p-7 border border-bronze/10 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-bronze/10 transition-colors" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-bronze/50 mb-3">Average Order Value</p>
          <p className="text-4xl font-editorial font-black text-bronze tracking-tight">{formatPrice(kpi_stats.avgOrderValue || 0)}</p>
        </div>
        <div className="bg-white p-7 border border-bronze/10 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-champagne/40 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-champagne/60 transition-colors" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-bronze/50 mb-3">Total Order Velocity</p>
          <p className="text-4xl font-editorial font-black text-bronze tracking-tight">{kpi_stats.totalOrders || 0} <span className="text-[12px] font-bold opacity-30 tracking-widest uppercase">Sales</span></p>
        </div>
      </div>

      <div className="mb-6 border-b border-bronze/10 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-bronze">Recent Archival Activity</h3>
      </div>
      <OrdersTable orders={recent_orders} />
    </SidebarWithHeader>
  );
}
