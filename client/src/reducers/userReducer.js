import { SET_USER, UPDATE_USER_TOKEN } from '../actions/userActions';

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case SET_USER:
            return action.payload
        case UPDATE_USER_TOKEN:
            return Object.assign({}, state, {
                token: action.payload,
            })
        default:
            return state
    }
}

