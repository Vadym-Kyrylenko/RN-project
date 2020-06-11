import {handleActions} from 'redux-actions-helpers';
import * as item from '../actions/item';

export const initialState = {
    allItems: [],
    product: {},
    updateProduct: {},
    filterItems: [],
    basketProducts:[],
    message: ''
};

export default handleActions({
    [item.setItems]: (state, action) => {
        return {
            ...state,
            allItems: action.data
        };
    },
    [item.changeField]: (state, action) => {
        return {
            ...state,
            [action.field]: action.value
        };
    },
    [item.getOneItem]: (state, action) => {
        return {
            ...state,
            product: action.data
        };
    },

    [item.setItemsWithParams]: (state, action) => {
        return {
            ...state,
            filterItems: action.data
        };
    }
}, {initialState});
