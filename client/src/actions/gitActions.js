export const SET_GIT = "git:setGit";

export function setGit(git) {
    return {
        type: SET_GIT,
        payload: git
    }
}
