import { combineReducers } from 'redux';
import UserReducer, { getUserRequestSaga } from './User'
import { all } from 'redux-saga/effects';

export function* rootSaga() : any {
    yield all([getUserRequestSaga()]);
}

const rootReducer = combineReducers({
    UserReducer
});

export default rootReducer;