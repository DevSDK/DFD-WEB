import { Map, fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'
import APIUtil from '../utils/API';
import configs from '../config.json';

const GET_USER = 'request/GET_USER';
const GET_USER_ERROR = 'request/GET_USER_ERROR'

const SET_USER_LOADED = 'user/SET_USER_LOADED'
const SET_USER = 'user/SET_USER';
const RESET_USER = 'user/RESET_USER';

const initialState = {
    User: Map(),
    isUserLoaded: false
}

export interface User {
    email: string,
    id: string,
    lol_name: string,
    created: string,
    profile_image: string,
    role: string,
    username: string,
    state: string,
    state_created: string
}

type ActionType = {type:string, payload? : User}

export const getUserRequest = () : ActionType => ({ type: GET_USER })

export const setUser = (user: User) : ActionType => ({ type: SET_USER, payload: user })

export const resetUser = () : ActionType => ({ type: RESET_USER })

export function* getUserRequestSaga() : any {
    try {
        const user = yield call(APIUtil.get, configs.v1ApiBase + "/user")
        yield put({
            type: SET_USER,
            payload: user["user"]
        })
    } catch (e) {
        yield put({
            type: GET_USER_ERROR,
            error: true,
            payload: e
        })
    }
    yield put({
        type: SET_USER_LOADED
    })
}



function UserReducer(state = initialState, action: ActionType) : any {
    switch (action.type) {
        case SET_USER:
            return { ...state, User: fromJS(action.payload) }
        case RESET_USER:
            return { ...state, User: Map() }
        case SET_USER_LOADED:
            return { ...state, isUserLoaded: true }
        default:
            return state
    }
}

export default UserReducer