export const ADD_VAR = 'vars:addVariable';
export const SET_VAR = 'vars:setVariable';

export const TEXT_FIELD = "text"

export function addVariable(variable) {
    return {
        type: ADD_VAR,
        payload: variable
    }
}

export function setVariable(name, value) {
    return {
        type: SET_VAR,
        payload: {
            name: name,
            value: value
        }
    }
}