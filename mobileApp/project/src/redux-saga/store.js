import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import 'babel-polyfill';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers/index';
import {rootSaga} from './saga/rootSaga';

const logger = createLogger({
    duration: true,
    collapsed: true
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducers = combineReducers({...reducer});
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducers, composeEnhancers(applyMiddleware(sagaMiddleware, logger)));

sagaMiddleware.run(rootSaga);
