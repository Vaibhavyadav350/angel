import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin dashboard analytics.
 */
const useAdminAnalyticsStore = create((set) => ({
  analytics_loading: false,
  analytics_error: false,
  sales_stats: [],
  category_stats: [],
  kpi_stats: {},

  fetchAnalytics: async () => {
    set({ analytics_loading: true, analytics_error: false });
    try {
      const [salesRes, catRes, kpiRes] = await Promise.all([
        adminApi.get('/analytics/sales'),
        adminApi.get('/analytics/categories'),
        adminApi.get('/analytics/kpis'),
      ]);
      set({
        sales_stats: salesRes.data.data,
        category_stats: catRes.data.data,
        kpi_stats: kpiRes.data.data,
        analytics_loading: false,
      });
      return { success: true };
    } catch (error) {
      set({ analytics_error: true, analytics_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch analytics') };
    }
  },
}));

export default useAdminAnalyticsStore;
