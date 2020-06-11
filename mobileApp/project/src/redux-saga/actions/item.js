import {createAction} from 'redux-actions-helpers';

export const getAllItem = createAction('@item/GET_ITEMS', () => ({}));

export const getOneItem = createAction('@item/GET_ITEM', (data) => ({data}));

export const createItem = createAction('@item/ADD_ITEM', (data) => ({data}));

export const updateItem = createAction('@item/UPDATE_ITEM', (data) => ({data}));

export const deleteItem = createAction('@item/DELETE_ITEM', (data) => ({data}));

export const getItemsWithParams = createAction('@item/GET_ITEMS_PARAMS', (params) => ({params}));

export const setItemsWithParams = createAction('@item/SET_ITEMS_PARAMS', (data) => ({data}));

export const setRatingProduct = createAction('@item/SET_RATING_PRODUCT', (data) => ({data}));

export const getBasketProducts = createAction('@item/GET_BASKET_ITEMS', (data) => ({data}));

export const changeField = createAction('@item/CHANGE_FIELD', (field, value) => ({field, value}));

export const setItems = createAction('@item/SET_ITEMS', (data) => ({data}));

export const cancelFilterItems = createAction('@item/CANCEL_FILTER_ITEMS', () => ({}));
