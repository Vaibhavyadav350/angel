import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import {
    admin_analytics_sales_url,
    admin_analytics_categories_url,
    admin_analytics_kpis_url
} from '../utils/constants';

const GET_ANALYTICS_BEGIN = 'GET_ANALYTICS_BEGIN';
const GET_ANALYTICS_SUCCESS = 'GET_ANALYTICS_SUCCESS';
const GET_ANALYTICS_ERROR = 'GET_ANALYTICS_ERROR';

const initialState = {
    analytics_loading: false,
    analytics_error: false,
    sales_stats: [],
    category_stats: [],
    kpi_stats: {},
};

const reducer = (state, action) => {
    if (action.type === GET_ANALYTICS_BEGIN) {
        return { ...state, analytics_loading: true, analytics_error: false };
    }
    if (action.type === GET_ANALYTICS_SUCCESS) {
        const { sales, categories, kpis } = action.payload;
        return {
            ...state,
            analytics_loading: false,
            sales_stats: sales,
            category_stats: categories,
            kpi_stats: kpis,
        };
    }
    if (action.type === GET_ANALYTICS_ERROR) {
        return { ...state, analytics_loading: false, analytics_error: true };
    }
    throw new Error(`No Matching "${action.type}" - action type`);
};

const AnalyticsContext = React.createContext();

export const AnalyticsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchAnalytics = useCallback(async () => {
        dispatch({ type: GET_ANALYTICS_BEGIN });
        try {
            const [salesRes, catRes, kpiRes] = await Promise.all([
                axios.get(admin_analytics_sales_url),
                axios.get(admin_analytics_categories_url),
                axios.get(admin_analytics_kpis_url)
            ]);

            dispatch({
                type: GET_ANALYTICS_SUCCESS,
                payload: {
                    sales: salesRes.data.data,
                    categories: catRes.data.data,
                    kpis: kpiRes.data.data
                }
            });
        } catch (error) {
            dispatch({ type: GET_ANALYTICS_ERROR });
        }
    }, []);

    return (
        <AnalyticsContext.Provider value={{ ...state, fetchAnalytics }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalyticsContext = () => useContext(AnalyticsContext);
