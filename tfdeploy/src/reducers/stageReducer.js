import { INCREMENT_STAGE, DECREMENT_STAGE } from '../actions/stageActions';

export default function userReducer(state = '', action) {
    switch (action.type) {
        case INCREMENT_STAGE:
            if (state.stage === 2) {
                return state
            }
            return Object.assign({}, state, { stage: state.stage + 1 });
        case DECREMENT_STAGE:
            if (state.stage === -1) {
                return state
            }
            return Object.assign({}, state, { stage: state.stage - 1 });
        default:
            return state
    }
}

