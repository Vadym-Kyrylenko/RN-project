import {del, get, post, put} from '../../utils/api';

export const registerUser = data => post('registration', data);

export const loginUser = data => post('login', data);

export const getUser = (data) => get('user/', data);

export const updateUser = (data) => put('users', data);

export const addProductToBasket = (data) => put('user/basket', data);

export const delProductFromBasket = (data) => del('user/basket', data);

export const getUsers = () => get('users');

export const changePassword = data => put('user/password', data);

export const updateUserForAdmin = (data) => put('users/admin', data);

export const forgotPassword = data => post('user/forgot_password', data);
