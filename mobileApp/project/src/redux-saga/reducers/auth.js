import { handleActions } from 'redux-actions-helpers';
import * as auth from '../actions/auth';

export const initialState = {
  fetchInProcess: false,
  data: {},
  token: null,
  usersList: [],
  user: {},
  userUpdate: {},
  error: {},
  success: {},
  message: ''
};

export default handleActions({

  [auth.changeField]: (state, action) => {
    return {
      ...state,
      [action.field]: action.value
    };
  },
  [auth.setError]: (state, action) => {
    return {
      ...state,
      error: action.error
    };
  },
  [auth.setSuccess]: (state, action) => {
    return {
      ...state,
      success: action.success
    };
  },
  [auth.logOut]: (state) => {
    return {
      ...state,
      ...initialState
    };
  },
}, { initialState });
