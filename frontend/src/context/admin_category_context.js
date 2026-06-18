import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { admin_categories_url } from '../utils/constants';

const initialState = {
    categories: [],
    loading: false,
    error: false,
};

const CategoryContext = React.createContext();

const categoryReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: false };
        case 'SET_ERROR':
            return { ...state, loading: false, error: true };
        case 'GET_CATEGORIES':
            return { ...state, loading: false, error: false, categories: action.payload };
        case 'CREATE_CATEGORY':
            return { ...state, loading: false, categories: [...state.categories, action.payload] };
        case 'UPDATE_CATEGORY':
            return {
                ...state,
                loading: false,
                categories: state.categories.map(c => c._id === action.payload._id ? action.payload : c),
            };
        case 'DELETE_CATEGORY':
            return { ...state, loading: false, categories: state.categories.filter(c => c._id !== action.payload) };
        default:
            return state;
    }
};

let lastCategoriesFetch = 0;
const CACHE_TTL = 60000;

export const CategoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);

    const getCategories = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && lastCategoriesFetch > 0 && (now - lastCategoriesFetch < CACHE_TTL)) {
            return;
        }
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.get(admin_categories_url, { withCredentials: true });
            lastCategoriesFetch = Date.now();
            dispatch({ type: 'GET_CATEGORIES', payload: response.data.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
        }
    }, []);

    const createCategory = async (data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const payload = { ...data, slug: data.name.toLowerCase().replace(/\s+/g, '-') };
            const response = await axios.post(admin_categories_url, payload, { withCredentials: true });
            dispatch({ type: 'CREATE_CATEGORY', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false };
        }
    };

    const updateCategory = async (id, data) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.put(`${admin_categories_url}/${id}`, data, { withCredentials: true });
            dispatch({ type: 'UPDATE_CATEGORY', payload: response.data.data });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false };
        }
    };

    const deleteCategory = async (id) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            await axios.delete(`${admin_categories_url}/${id}`, { withCredentials: true });
            dispatch({ type: 'DELETE_CATEGORY', payload: id });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR' });
            return { success: false };
        }
    };

    const addSubcategory = async (categoryId, name) => {
        const category = state.categories.find(c => c._id === categoryId);
        if (!category) return;
        const subcategory = { name, slug: name.toLowerCase().replace(/\s+/g, '-') };
        const updatedSubcategories = [...(category.subcategories || []), subcategory];
        await updateCategory(categoryId, { subcategories: updatedSubcategories });
    };

    const deleteSubcategory = async (categoryId, subcategoryId) => {
        const category = state.categories.find(c => c._id === categoryId);
        if (!category) return;
        const updatedSubcategories = (category.subcategories || []).filter(s => s._id !== subcategoryId);
        await updateCategory(categoryId, { subcategories: updatedSubcategories });
    };

    // Removed global auto-fetch. Pages that need categories call getCategories() explicitly.
    // This prevents unauthenticated 404 calls on every page load including customer routes.

    // Replaced entirely by above API calls

    return (
        <CategoryContext.Provider value={{ ...state, getCategories, createCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
