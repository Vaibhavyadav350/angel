import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { domain } from '../utils/constants';

const GET_COUPONS_BEGIN = 'GET_COUPONS_BEGIN';
const GET_COUPONS_SUCCESS = 'GET_COUPONS_SUCCESS';
const GET_COUPONS_ERROR = 'GET_COUPONS_ERROR';

const initialState = {
    coupons_loading: false,
    coupons: [],
};

const reducer = (state, action) => {
    if (action.type === GET_COUPONS_BEGIN) return { ...state, coupons_loading: true };
    if (action.type === GET_COUPONS_SUCCESS) return { ...state, coupons_loading: false, coupons: action.payload };
    if (action.type === GET_COUPONS_ERROR) return { ...state, coupons_loading: false };
    return state;
};

const CouponContext = React.createContext();

export const CouponProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchCoupons = useCallback(async () => {
        dispatch({ type: GET_COUPONS_BEGIN });
        try {
            const res = await axios.get(`${domain}/api/coupon`);
            dispatch({ type: GET_COUPONS_SUCCESS, payload: res.data.data });
        } catch (error) {
            dispatch({ type: GET_COUPONS_ERROR });
        }
    }, []);

    const createCoupon = async (couponData) => {
        try {
            const res = await axios.post(`${domain}/api/coupon`, couponData);
            toast.success('Coupon created');
            fetchCoupons();
            return { success: true, data: res.data.data };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
            return { success: false };
        }
    };

    const deleteCoupon = async (id) => {
        try {
            await axios.delete(`${domain}/api/coupon/${id}`);
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const validateCoupon = async (code, cartTotal) => {
        try {
            const res = await axios.post(`${domain}/api/coupon/validate`, { code, cartTotal });
            return { success: true, data: res.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Invalid coupon' };
        }
    };

    return (
        <CouponContext.Provider value={{ ...state, fetchCoupons, createCoupon, deleteCoupon, validateCoupon }}>
            {children}
        </CouponContext.Provider>
    );
};

export const useCouponContext = () => useContext(CouponContext);

