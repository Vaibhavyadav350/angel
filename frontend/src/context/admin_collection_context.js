import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { admin_collections_url } from '../utils/constants';

const initialState = {
    collections: [],
    loading: false,
    error: false,
};

const CollectionContext = React.createContext();

const collectionReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: false };
        case 'SET_ERROR':
            return { ...state, loading: false, error: true };
        case 'GET_COLLECTIONS':
            return { ...state, loading: false, error: false, collections: action.payload };
        case 'CREATE_COLLECTION':
            return { ...state, loading: false, collections: [...state.collections, action.payload] };
        case 'UPDATE_COLLECTION':
            return {
                ...state,
                loading: false,
                collections: state.collections.map(c => c._id === action.payload._id ? action.payload : c),
            };
        case 'DELETE_COLLECTION':
            return { ...state, loading: false, collections: state.collections.filter(c => c._id !== action.payload) };
        default:
            return state;
    }
};

let lastCollectionsFetch = 0;
const CACHE_TTL = 60000;

export const CollectionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(collectionReducer, initialState);

    const getCollections = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && lastCollectionsFetch > 0 && (now - lastCollectionsFetch < CACHE_TTL)) {
            return;
        }
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.get(admin_collections_url, { withCredentials: true });
            lastCollectionsFetch = Date.now();
            dispatch({ type: 'GET_COLLECTIONS', payload: response.data.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
        }
    }, []);

    const createCollection = async (data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(admin_collections_url, data, { withCredentials: true });
            dispatch({ type: 'CREATE_COLLECTION', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to create collection' };
        }
    };

    const updateCollection = async (id, data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.put(`${admin_collections_url}/${id}`, data, { withCredentials: true });
            dispatch({ type: 'UPDATE_COLLECTION', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to update collection' };
        }
    };

    const deleteCollection = async (id) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            await axios.delete(`${admin_collections_url}/${id}`, { withCredentials: true });
            dispatch({ type: 'DELETE_COLLECTION', payload: id });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false, message: error.response?.data?.message || 'Failed to delete collection' };
        }
    };

    const toggleVisibility = async (id) => {
        const col = state.collections.find(c => c._id === id);
        if (col) {
            await updateCollection(id, { isVisible: !col.isVisible });
        }
    };

    // Removed global auto-fetch. Pages that need collections call getCollections() explicitly.
    // This prevents unauthenticated API calls on every page load including customer routes.

    return (
        <CollectionContext.Provider value={{ ...state, getCollections, createCollection, updateCollection, deleteCollection, toggleVisibility }}>
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollectionContext = () => useContext(CollectionContext);
