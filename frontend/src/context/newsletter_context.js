import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import reducer from '../reducers/admin/newsletter_reducer';
import { admin_newsletter_url } from '../utils/constants';
import {
    GET_SUBSCRIBERS_BEGIN,
    GET_SUBSCRIBERS_SUCCESS,
    GET_SUBSCRIBERS_ERROR,
} from '../actions_admin';

// Configure axios to send cookies for admin requests
axios.defaults.withCredentials = true;

const initialState = {
    subscribers_loading: false,
    subscribers_error: false,
    subscribers: [],
};

const NewsletterContext = React.createContext();

export const NewsletterProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchSubscribers = React.useCallback(async () => {
        dispatch({ type: GET_SUBSCRIBERS_BEGIN });
        try {
            const response = await axios.get(admin_newsletter_url);
            if (response.data.success) {
                dispatch({ type: GET_SUBSCRIBERS_SUCCESS, payload: response.data.data });
            } else {
                dispatch({ type: GET_SUBSCRIBERS_ERROR });
            }
        } catch (error) {
            dispatch({ type: GET_SUBSCRIBERS_ERROR });
        }
    }, []);

    const deleteSubscriber = React.useCallback(async (id) => {
        try {
            const response = await axios.delete(`${admin_newsletter_url}/${id}`);
            if (response.data.success) {
                fetchSubscribers();
                return { success: true, message: response.data.message };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete subscriber';
            return { success: false, message };
        }
    }, [fetchSubscribers]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    return (
        <NewsletterContext.Provider
            value={{
                ...state,
                fetchSubscribers,
                deleteSubscriber,
            }}
        >
            {children}
        </NewsletterContext.Provider>
    );
};

export const useNewsletterContext = () => {
    return useContext(NewsletterContext);
};
