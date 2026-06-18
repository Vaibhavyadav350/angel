import React, { useContext, useEffect, useState, useReducer, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  admin_auth_url,
  admin_login_url,
  admin_logout_url,
  admin_users_url,
  admin_register_url
} from '../utils/constants';
import reducer from '../reducers/admin/admin_reducer';
import {
  GET_ADMINS_BEGIN,
  GET_ADMINS_ERROR,
  GET_ADMINS_SUCCESS,
  CREATE_NEW_ADMIN,
} from '../actions_admin';

axios.defaults.withCredentials = true;

const adminUserInitialState = {
  admins_loading: false,
  admins_error: false,
  admins: [],
  new_admin: {
    name: '',
    email: '',
    password: '',
    privilege: 'low',
  },
};

const AdminContext = React.createContext();

export const AdminProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState(true);
  const [adminUserState, dispatch] = useReducer(reducer, adminUserInitialState);

  // Ref guard: prevents fetchAdmins from re-firing on every currentAdmin object reference change
  const adminsFetchedRef = useRef(false);

  const checkAdminAuth = useCallback(async () => {
    try {
      setAdminAuthLoading(true);
      const response = await axios.post(admin_auth_url);
      const { data } = response.data;
      setCurrentAdmin(data);
      setAdminAuthLoading(false);
    } catch (error) {
      // Error handled silently
      setAdminAuthLoading(false);
      setCurrentAdmin(null);
    }
  }, []);

  const loginAdmin = useCallback(async (email, password) => {
    try {
      const response = await axios.post(admin_login_url, { email, password });
      const { success, data } = response.data;
      if (success) {
        adminsFetchedRef.current = false; // Reset so admins are fetched for new login
        setCurrentAdmin(data);
      }
      return { success, data };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Login failed' };
    }
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      const response = await axios.get(admin_logout_url);
      const { success, message } = response.data;
      adminsFetchedRef.current = false; // Reset for next login
      setCurrentAdmin(null);
      return { success, message };
    } catch (error) {
      const { message } = error.response?.data || {};
      adminsFetchedRef.current = false;
      setCurrentAdmin(null);
      return { success: false, message: message || 'Logout failed' };
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    dispatch({ type: GET_ADMINS_BEGIN });
    try {
      const response = await axios.get(admin_users_url);
      const { data } = response.data;
      dispatch({ type: GET_ADMINS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_ADMINS_ERROR });
    }
  }, []);

  const updateAdminPrivilege = useCallback(async (id, privilege) => {
    try {
      const response = await axios.put(`${admin_users_url}${id}`, { privilege });
      const { success, data } = response.data;
      return { success, data };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Update failed' };
    }
  }, []);

  const deleteAdmin = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${admin_users_url}${id}`);
      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Delete failed' };
    }
  }, []);

  const updateNewAdminDetails = useCallback((e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({ type: CREATE_NEW_ADMIN, payload: { name, value } });
  }, []);

  const createNewAdmin = useCallback(async () => {
    const { new_admin } = adminUserState;
    try {
      const response = await axios.post(admin_register_url, new_admin);
      const { success, data } = response.data;
      return { success, data };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Create failed' };
    }
  }, [adminUserState]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Only fetch admins ONCE when currentAdmin transitions from null to truthy
  useEffect(() => {
    if (currentAdmin && !adminsFetchedRef.current) {
      adminsFetchedRef.current = true;
      fetchAdmins();
    }
  }, [currentAdmin, fetchAdmins]);

  return (
    <AdminContext.Provider
      value={{
        // Authentication
        currentAdmin,
        adminAuthLoading,
        loginAdmin,
        logoutAdmin,
        checkAdminAuth,
        // Admin user management
        ...adminUserState,
        fetchAdmins,
        updateAdminPrivilege,
        deleteAdmin,
        updateNewAdminDetails,
        createNewAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
