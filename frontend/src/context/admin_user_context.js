import React, { useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { admin_all_profiles_url } from '../utils/constants';

const AdminUserContext = React.createContext();

export const AdminUserProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(admin_all_profiles_url, { withCredentials: true });
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AdminUserContext.Provider value={{ customers, loading, error, fetchCustomers }}>
            {children}
        </AdminUserContext.Provider>
    );
};

export const useAdminUserContext = () => useContext(AdminUserContext);
