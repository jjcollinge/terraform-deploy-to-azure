import { SET_GIT, SET_GIT_COMMIT } from '../actions/gitActions';
import { object } from 'prop-types';

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case SET_GIT:
            return action.payload
        case SET_GIT_COMMIT:
            return Object.assign({}, state, {
                commit: action.payload
            });
        default:
            return state
    }
}

