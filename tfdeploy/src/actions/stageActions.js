export const INCREMENT_STAGE = 'stages:incrementStage';
export const DECREMENT_STAGE = 'stages:decrementStage';

export function incrementStage() {
    return {
        type: INCREMENT_STAGE,
    }
}

export function decrementStage() {
    return {
        type: DECREMENT_STAGE,
    }
}