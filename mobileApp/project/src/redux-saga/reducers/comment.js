import { handleActions } from 'redux-actions-helpers';
import * as comments from '../actions/comments';

export const initialState = {
    comments: []
};

export default handleActions({
    [comments.setComments]: (state, action) => {
        return {
            comments: action.data
        };
    },
}, { initialState });
