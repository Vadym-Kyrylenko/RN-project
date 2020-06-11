import {takeEvery, put, all, call} from 'redux-saga/effects';
import * as authActions from '../actions/auth';
import * as auth from '../api/auth';
import AsyncStorage from '@react-native-community/async-storage';


export function* registerUser({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const credentials = yield call(auth.registerUser, data);
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        console.log('register Error', err);
        yield put(authActions.setError(err));
    }
}

export function* loginUser({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const credentials = yield call(auth.loginUser, data);
        yield put(authActions.setSuccess(credentials));
        yield AsyncStorage.setItem('token', credentials.token);
        yield put(authActions.changeField('token', credentials.token));
        yield put(authActions.changeField('user', credentials.user));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        console.log('login Error', err);
        yield put(authActions.setError(err));
    }
}

export function* logOut() {
    try {
        yield AsyncStorage.setItem('token', '');
        yield AsyncStorage.setItem('token', '');
        yield put(authActions.logOut());
    } catch (err) {
        yield put(authActions.setError(err));
    }
}

export function* getUser(data) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.getUser, data.params);
        yield put(authActions.changeField('user', responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err))
    }
}

export function* updateUser({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.updateUser, data);
        yield put(authActions.changeField('user', responseData.user));
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err));
    }
}

export function* addProductToBasket({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.addProductToBasket, data);
        yield put(authActions.setSuccess(responseData));
        if (responseData.status !== 5) {
            yield put(authActions.changeField('user', responseData.user));
            yield put(authActions.setSuccess({success: {message: 'Your profile has been update(basket)'}}));
        }
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* delProductFromBasket({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.delProductFromBasket, data);
        yield put(authActions.changeField('user', responseData.user));
        yield put(authActions.setSuccess({success: {message: 'Your profile has been update(basket)'}}));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
    }
}

export function* getUsers() {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.getUsers);
        yield put(authActions.changeField('usersList', responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err))
    }
}

export function* changePassword({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.changePassword, data);
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err));
    }
}

export function* updateUserForAdmin({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.updateUserForAdmin, data);
        yield put(authActions.changeField('userUpdate', responseData.user));
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        console.log(err);
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err));
    }
}

export function* forgotPassword({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(auth.forgotPassword, data);
        yield put(authActions.setSuccess(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        yield put(authActions.setError(err));
    }
}

export function* watchAllAuth() {
    yield all([
        takeEvery(authActions.registerUser.toString(), registerUser),
        takeEvery(authActions.loginUser.toString(), loginUser),
        takeEvery(authActions.logOutAction.toString(), logOut),
        takeEvery(authActions.getUser.toString(), getUser),
        takeEvery(authActions.updateUser.toString(), updateUser),
        takeEvery(authActions.addProductToBasket.toString(), addProductToBasket),
        takeEvery(authActions.delProductFromBasket.toString(), delProductFromBasket),
        takeEvery(authActions.getUsers.toString(), getUsers),
        takeEvery(authActions.changePassword.toString(), changePassword),
        takeEvery(authActions.updateUserForAdmin.toString(), updateUserForAdmin),
        takeEvery(authActions.forgotPassword.toString(), forgotPassword),
    ]);
}
