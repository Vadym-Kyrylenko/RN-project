import {get, post, put, del} from '../../utils/api';


export const saveComment = data => post('comments', data);

export const getCommets = param => get('comments/', param);

export const deleteComment = data => del('comments', data);
