import {
    GET_SUBSCRIBERS_BEGIN,
    GET_SUBSCRIBERS_SUCCESS,
    GET_SUBSCRIBERS_ERROR,
} from '../../actions_admin';

const newsletter_reducer = (state, action) => {
    if (action.type === GET_SUBSCRIBERS_BEGIN) {
        return { ...state, subscribers_loading: true, subscribers_error: false };
    }
    if (action.type === GET_SUBSCRIBERS_SUCCESS) {
        return {
            ...state,
            subscribers_loading: false,
            subscribers: action.payload,
        };
    }
    if (action.type === GET_SUBSCRIBERS_ERROR) {
        return { ...state, subscribers_loading: false, subscribers_error: true };
    }

    throw new Error(`No Matching "${action.type}" - action type`);
};

export default newsletter_reducer;
