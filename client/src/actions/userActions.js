export const SET_USER = "user:setUser";
export const UPDATE_USER_TOKEN = "user:updateUserToken";

export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function updateUserToken(token) {
    return {
        type: UPDATE_USER_TOKEN,
        payload: token
    }
}
