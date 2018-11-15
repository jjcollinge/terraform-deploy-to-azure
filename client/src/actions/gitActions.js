export const SET_GIT = "git:setGit";
export const SET_GIT_COMMIT = "git:setGitCommit";

export function setGit(git) {
    return {
        type: SET_GIT,
        payload: git
    }
}

export function setGitCommit(commit) {
    return {
        type: SET_GIT_COMMIT,
        payload: commit
    }
}

