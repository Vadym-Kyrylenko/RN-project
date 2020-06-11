import { createAction } from 'redux-actions-helpers';

export const saveComment = createAction('@comments/SAVE_COMMENT', (data) => ({data})); //done
export const getComments = createAction('@comments/GET_COMMENTS', (data) => ({data})); //done
export const deleteComment = createAction('@comments/DELETE_COMMENT', (data) => ({data})); //done
export const setComments = createAction('@comments/SET_COMMENTS', (data) => ({data}));

export const updateComment = createAction('@comments/UPDATE_COMMENT', (data) => ({data}));
