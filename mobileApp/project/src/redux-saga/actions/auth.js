import { createAction } from 'redux-actions-helpers';

export const registerUser = createAction('@auth/REGISTER_USER', (data) => ({ data }));
export const loginUser = createAction('@auth/LOGIN_USER', (data) => ({ data }));


export const logOutAction = createAction('@auth/LOG_OUT_ACTION', () => ({ }));
export const logOut = createAction('@auth/LOG_OUT', () => ({ }));

export const getUser = createAction('@auth/GET_USER', (params) => ({params}));
export const updateUser = createAction('@auth/UPDATE_USER', (data) => ({data}));
export const getUsers = createAction('@auth/GET_USERS', (data) => ({data}));

export const addProductToBasket = createAction('@auth/ADD_PRODUCT_TO_BASKET', (data) => ({data}));
export const delProductFromBasket = createAction('@auth/DEL_PRODUCT_FROM_BASKET', (data) => ({data}));

export const setSuccess = createAction('@auth/SET_SUCCESS', (success) => ({ success }));

export const changePassword = createAction('@auth/CHANGE_PASSWORD', data => ({data}));

export const updateUserForAdmin = createAction('@auth/UPDATE_USER_FOR_ADMIN', (data) => ({data}));

export const forgotPassword = createAction('@auth/FORGOT_PASSWORD', data => ({data}));

export const setError = createAction('@auth/SET_ERROR', (error) => ({ error }));
export const changeField = createAction('@auth/CHANGE_FIELD', (field, value) => ({ field, value }));
export const authSocial = createAction('@auth/AUTH_SOCIAL', (data) => ({data}));
