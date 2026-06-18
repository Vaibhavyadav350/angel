import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { admin_banners_url } from '../utils/constants';

const initialState = {
    banners: [],
    loading: false,
    error: false,
};

const BannerContext = React.createContext();

const bannerReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: false };
        case 'SET_ERROR':
            return { ...state, loading: false, error: true };
        case 'GET_BANNERS':
            return { ...state, loading: false, error: false, banners: action.payload };
        case 'CREATE_BANNER':
            return { ...state, loading: false, banners: [...state.banners, action.payload] };
        case 'UPDATE_BANNER':
            return {
                ...state,
                loading: false,
                banners: state.banners.map(b => b._id === action.payload._id ? action.payload : b),
            };
        case 'DELETE_BANNER':
            return { ...state, loading: false, banners: state.banners.filter(b => b._id !== action.payload) };
        default:
            return state;
    }
};

let lastBannersFetch = 0;
const CACHE_TTL = 60000;

export const BannerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bannerReducer, initialState);

    const getBanners = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && lastBannersFetch > 0 && (now - lastBannersFetch < CACHE_TTL)) {
            return;
        }
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.get(admin_banners_url, { withCredentials: true });
            lastBannersFetch = Date.now();
            dispatch({ type: 'GET_BANNERS', payload: response.data.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
        }
    }, []);

    const createBanner = async (data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(admin_banners_url, data, { withCredentials: true });
            dispatch({ type: 'CREATE_BANNER', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to create banner' };
        }
    };

    const updateBanner = async (id, data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.put(`${admin_banners_url}/${id}`, data, { withCredentials: true });
            dispatch({ type: 'UPDATE_BANNER', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to update banner' };
        }
    };

    const deleteBanner = async (id) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            await axios.delete(`${admin_banners_url}/${id}`, { withCredentials: true });
            dispatch({ type: 'DELETE_BANNER', payload: id });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to delete banner' };
        }
    };

    const toggleBannerStatus = async (id) => {
        const banner = state.banners.find(b => b._id === id);
        if (banner) {
            await updateBanner(id, { isActive: !banner.isActive });
        }
    };

    // Removed global auto-fetch. Pages that need banners call getBanners() explicitly.
    // This prevents unauthenticated API calls on every page load including customer routes.

    return (
        <BannerContext.Provider value={{ ...state, getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus }}>
            {children}
        </BannerContext.Provider>
    );
};

export const useBannerContext = () => useContext(BannerContext);
