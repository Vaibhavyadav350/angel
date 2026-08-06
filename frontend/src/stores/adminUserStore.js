import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin-user management (the "Admins" page).
 *
 * Split out from the old admin_context.js so it is independent of auth state.
 */
const useAdminUserStore = create((set, get) => ({
  admins: [],
  adminsLoading: false,
  adminsError: false,
  newAdmin: {
    name: '',
    email: '',
    password: '',
    privilege: 'low',
  },

  fetchAdmins: async () => {
    set({ adminsLoading: true, adminsError: false });
    try {
      const { data } = await adminApi.get('/admin/users/');
      set({ admins: data.data || [], adminsLoading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ adminsError: true, adminsLoading: false });
      return { success: false, message: extractError(error, 'Failed to fetch admins') };
    }
  },

  updateAdminPrivilege: async (id, privilege) => {
    try {
      const { data } = await adminApi.put(`/admin/users/${id}`, { privilege });
      set({
        admins: get().admins.map((a) => (a._id === id ? { ...a, privilege } : a)),
      });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: extractError(error, 'Update failed') };
    }
  },

  deleteAdmin: async (id) => {
    try {
      const { data } = await adminApi.delete(`/admin/users/${id}`);
      set({ admins: get().admins.filter((a) => a._id !== id) });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Delete failed') };
    }
  },

  updateNewAdminDetails: (e) => {
    const { name, value } = e.target;
    set({ newAdmin: { ...get().newAdmin, [name]: value } });
  },

  setNewAdminDetails: (updates) => {
    set({ newAdmin: { ...get().newAdmin, ...updates } });
  },

  resetNewAdmin: () =>
    set({
      newAdmin: {
        name: '',
        email: '',
        password: '',
        privilege: 'low',
      },
    }),

  createNewAdmin: async () => {
    const { newAdmin } = get();
    try {
      const { data } = await adminApi.post('/admin/register', newAdmin);
      set({ admins: [...get().admins, data.data] });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: extractError(error, 'Create failed') };
    }
  },
}));

export default useAdminUserStore;
