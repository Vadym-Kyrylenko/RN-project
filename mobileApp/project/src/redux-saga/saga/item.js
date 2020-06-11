import {takeEvery, put, all, call} from 'redux-saga/effects';
import * as itemActions from '../actions/item';
import * as item from '../api/item';
import * as authActions from '../actions/auth';

export function* getAllItems() {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const items = yield call(item.getAllItems);
        yield put(itemActions.setItems(items));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* getOneItem({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.getOneItem, data);
        yield put(itemActions.changeField('product', responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));

    }
}

export function* createItem({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.createItem, data);
        yield put(itemActions.changeField('product', responseData.product));
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* updateItem({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.updateItem, data);
        yield put(itemActions.changeField(responseData));
        yield put(itemActions.changeField('updateProduct', responseData.product));
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));

    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* deleteItem({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.deleteItem, data);
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* getItemsWithParams(data) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const items = yield call(item.getItemsWithParams, data.params);
        yield put(itemActions.setItemsWithParams(items));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));

    }
}

export function* setRatingProduct(data) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.setRatingProduct, data);
        yield put(itemActions.changeField('product', responseData.product));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err))
    }
}

export function* getBasketProducts({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(item.getBasketProducts, data);
        yield put(itemActions.changeField('basketProducts', responseData));
        yield put(authActions.changeField('fetchInProcess', false));

    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* cancelFilterItems() {
    try {
        yield put(itemActions.setItemsWithParams([]));
    } catch (err) {
        console.log(err);
    }
}

export function* watchAllItems() {
    yield all([
        takeEvery(itemActions.getAllItem.toString(), getAllItems),
        takeEvery(itemActions.getOneItem.toString(), getOneItem),
        takeEvery(itemActions.createItem.toString(), createItem),
        takeEvery(itemActions.updateItem.toString(), updateItem),
        takeEvery(itemActions.deleteItem.toString(), deleteItem),
        takeEvery(itemActions.getItemsWithParams.toString(), getItemsWithParams),
        takeEvery(itemActions.setRatingProduct.toString(), setRatingProduct),
        takeEvery(itemActions.getBasketProducts.toString(), getBasketProducts),
        takeEvery(itemActions.cancelFilterItems.toString(), cancelFilterItems),
    ]);
}
