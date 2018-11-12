import { SET_GIT } from '../actions/gitActions';

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case SET_GIT:
            return action.payload
        default:
            return state
    }
}

