import {takeEvery, put, all, call} from 'redux-saga/effects';
import * as commentsActions from '../actions/comments';
import * as authActions from '../actions/auth';
import * as comments from '../api/comments';


export function* saveComment({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(comments.saveComment, data);
        yield put(authActions.setSuccess(responseData));
        console.log(responseData);
        if (responseData.status !== 5) {
            yield put(commentsActions.setComments([responseData.comment]))
        }
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        console.log('save comment Error', err);
    }
}

export function* getComments({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(comments.getCommets, data);
        yield put(commentsActions.setComments(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        console.log('get comment Error', err);
    }
}

export function* deleteComment({data}) {
    try {
        yield put(authActions.changeField('fetchInProcess', true));
        const responseData = yield call(comments.deleteComment, data);
        yield put(commentsActions.setComments(responseData));
        yield put(authActions.changeField('fetchInProcess', false));
    } catch (err) {
        yield put(authActions.changeField('fetchInProcess', false));
        console.log(err)
    }
}

export function* watchAllComments() {
    yield all([
        takeEvery(commentsActions.saveComment.toString(), saveComment),
        takeEvery(commentsActions.getComments.toString(), getComments),
        takeEvery(commentsActions.deleteComment.toString(), deleteComment),
    ]);
}
