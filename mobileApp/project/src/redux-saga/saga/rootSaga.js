import {all} from 'redux-saga/effects';
import {watchAllItems} from './item';
import {watchAllAuth} from './auth';
import {watchAllComments} from './comment';

export function* rootSaga() {
    yield all([
        watchAllItems(),
        watchAllAuth(),
        watchAllComments()
    ]);
}
