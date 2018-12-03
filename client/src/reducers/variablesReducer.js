import update from 'immutability-helper';
import { ADD_VAR, SET_VAR } from '../actions/variablesActions';

export default function variablesReducer(state = [], action) {
    switch (action.type) {
        case ADD_VAR:
            return [
                ...state,
                action.payload
            ]
        case SET_VAR:
            let index = state.findIndex((el, index, array) => {return el.name === action.payload.name});
            if (index === -1) {
                return state
            }
            return update(state, {
                [index]: {
                    $apply: (existing) => {
                        return Object.assign({}, existing, {
                            value: action.payload.value
                        })
                    }
                }
            })
        default:
            return state
    }
}

