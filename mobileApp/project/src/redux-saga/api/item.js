import {get, post, put, del} from '../../utils/api';

export const getAllItems = () => get('products');

export const getOneItem = data => get('product/', data);

export const createItem = data => post('products', data);

export const updateItem = data => put('products', data);

export const deleteItem = data => del('products', data);

export const getItemsWithParams = (data) => get('products', data );

export const setRatingProduct = data => put('product', data);

export const getBasketProducts = data => get('products/basket/', data);
