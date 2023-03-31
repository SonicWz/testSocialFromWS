import deepCopyArrayFrom from "../index";
import {usersAPI} from "../api/usersAPI";


const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET_USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const ISFETCHING = 'ISFETCHING';
const TOGGLE_IN_FOLLOWING_PROGRESS = 'TOGGLE-IN-FOLLOWING-PROGRESS';


let initialState = {
    users : [],
    pageSize: 5,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: []
};

const usersReducer = (state = initialState, action) => {
    switch(action.type){
        case FOLLOW: {
            let stateCopy = {
                ...state,
                users: state.users.map( (user) => {
                    if (user.id === action.userId){
                        return {...user, followed: true}
                    }
                    return {...user}
                })
            };
            return stateCopy;
        }
        case UNFOLLOW: {
            let stateCopy = {
                ...state,
                users: state.users.map( (user) => {
                    if (user.id === action.userId){
                        return {...user, followed: false}
                    }
                    return {...user}
                })
            };
            return stateCopy;
        }
        case SET_USERS: {
            let stateCopy = {
                ...state,
                users: [...action.users],
                totalUsersCount: action.totalUsersCount,
                
            };
            return stateCopy;
        }
        case SET_CURRENT_PAGE: {
             let stateCopy = {
                ...state,
                currentPage: action.currentPage
            };
            return stateCopy;
        }
        case ISFETCHING: {
            let stateCopy = {
                ...state,
                isFetching: action.isFetching
            }
            return stateCopy
        }
        case TOGGLE_IN_FOLLOWING_PROGRESS: {
            let stateCopy = {
                ...state,
                followingInProgress: action.isFollowingInProgress ? [...state.followingInProgress, action.userId] : state.followingInProgress.filter( id => id != action.userId)
            }
            return stateCopy
        }

        default: {
            return state;
        }

    }
}
//Action Creators
export const follow = (user) => {
    return {
        type: FOLLOW,
        userId: user.id,
    }
};
export const unfollow = (user) => {
    return {
        type: UNFOLLOW,
        userId: user.id,
    }
};
export const setUsers = (data) => {
    return {
        type: SET_USERS,
        //users: data.items,
        //totalUsersCount: data.totalCount,
        users: data,
        totalUsersCount: 100,
    }
};
export const setCurrentPage = (page) => {
    return {
        type: SET_CURRENT_PAGE,
        currentPage: page,

    }
};
export const toggleIsFetching = (isFetching) => {
    return {
        type: ISFETCHING,
        isFetching: isFetching,
    }
};
export const toggleIsFollowingInProgress = (isFollowingInProgress, userId) => {
    return {
        type: TOGGLE_IN_FOLLOWING_PROGRESS,
        isFollowingInProgress: isFollowingInProgress,
        userId: userId
    }
};

//end of Action Creators

//Thunks
export const getUsers = (currentPage, pageSize) => async (dispatch) => {
        // get loading.gif
        dispatch(toggleIsFetching(true)); 

        // get users from DB
        let data = await usersAPI.getUsers(currentPage, pageSize);

        dispatch(setUsers(data));
        dispatch(setCurrentPage(currentPage));
        dispatch(toggleIsFetching(false));
        
    }


//end of thinks

export default usersReducer;