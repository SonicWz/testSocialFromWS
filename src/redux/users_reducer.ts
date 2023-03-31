import {updateObjectInArray} from "../utils/object-helpers.js";
import {getUsersOptionsType, getFoundedUsersOptionsType, UsersType, UserType} from "../types/types";
import {AppStateType} from "./redux-store";
import {Dispatch} from "redux";
import {ThunkAction} from "redux-thunk";
import {usersAPI} from "../api/usersAPI";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";


const FOLLOW = 'FOLLOW';
const FILTER_NAME = 'FILTER_NAME';
const FILTER_CITY = 'FILTER_CITY';
const FILTER_IS_FOLLOWED = 'FILTER_IS_FOLLOWED';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET_USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const ISFETCHING = 'ISFETCHING';
const SET_TOTAL_USERS_COUNT = 'SET_TOTAL_USERS_COUNT';
const TOGGLE_IN_FOLLOWING_PROGRESS = 'TOGGLE-IN-FOLLOWING-PROGRESS';
const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_PORTION_NUMBER = 'SET_PORTION_NUMBER';


let initialState = {
    users : [] as Array<UsersType>,
    pageSize: 5 as number,
    totalUsersCount: 0 as number,
    currentPage: 1 as number,
    portionNumber: 1 as number,
    isFetching: false as boolean,
    followingInProgress: [] as Array<number>,   //array of users ids
    filterName: null as string | null,
    filterCity: null as string | null,
    filterIsFollowed: null as boolean | null
};
export type InitialStateType = typeof initialState;

const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type){

        case FOLLOW: {
            let stateCopy = {
                ...state,
                users: updateObjectInArray(state.users, action.userId, 'id', {followed: true}) //magic refactoring
                    /*
                    state.users.map( (user) => {
                        if (user.id === action.userId){
                            return {...user, followed: true}
                        }
                        return {...user}
                    })
                */
            };
            return stateCopy;
        }
        case FILTER_NAME: {
            let stateCopy = {
                ...state,
                filterName: action.filterName 
            };
            return stateCopy;
        }
        case FILTER_CITY: {

            let stateCopy = {
                ...state,
                filterCity: action.filterCity
            };
            return stateCopy;
        }
        case FILTER_IS_FOLLOWED: {
            let stateCopy = {
                ...state,
                filterIsFollowed: action.filterIsFollowed 
            };
            return stateCopy;
        }
        case SET_PORTION_NUMBER: {
            let stateCopy = {
                ...state,
                portionNumber: action.portionNumber
            };
            return stateCopy;
        }
        case UNFOLLOW: {
            let stateCopy = {
                ...state,
                users: updateObjectInArray(state.users, action.userId, 'id', {followed: false})
            };
            return stateCopy;
        }
        case SET_USERS: {
            let stateCopy = {
                ...state,
                users: [...action.users],
            };
            return stateCopy;
        }
        case SET_TOTAL_USERS_COUNT: {
            let stateCopy = {
                ...state,
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
        case SET_PAGE_SIZE: {

             let stateCopy = {
                ...state,
                 pageSize: action.pageSize
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
export type ActionsTypes = FollowType |
    UnfollowType |
    SetUsersType | SetCurrentPageType |
    ToggleIsFetchingType |
    ToggleIsFollowingInProgressType |
    FilterNameACType |
    FilterIsFollowedACType |
    SetTotalUsersCountType |
    FilterCityACType |
    SetPageSizeType |
    SetPortionNumberType;


type FollowType = {
    type: typeof FOLLOW,
    userId: number,
}
export const follow = (user: UserType): FollowType => {
    return {
        type: FOLLOW,
        userId: user.id,
    }
};
type UnfollowType = {
    type: typeof UNFOLLOW,
    userId: number,
}
export const unfollow = (user: UserType): UnfollowType => {
    return {
        type: UNFOLLOW,
        userId: user.id,
    }
};
type SetUsersType = {
    type: typeof SET_USERS,
    users: Array<UserType>,
}
export const setUsers = (data: Array<UserType>): SetUsersType => {
    return {
        type: SET_USERS,
        users: data,
    }
};

type SetTotalUsersCountType = {
    type: typeof SET_TOTAL_USERS_COUNT,
    totalUsersCount: number,
}
export const setTotalUsersCount = (totalUsersCount: number): SetTotalUsersCountType => {
    return {
        type: SET_TOTAL_USERS_COUNT,
        totalUsersCount: totalUsersCount,
    }
};
type SetPortionNumberType = {
    type: typeof SET_PORTION_NUMBER,
    portionNumber: number,
}
export const SetPortionNumberToStore = (portionNumber: number): SetPortionNumberType => {
    return {
        type: SET_PORTION_NUMBER,
        portionNumber: portionNumber,
    }
};

type SetPageSizeType = {
    type: typeof SET_PAGE_SIZE,
    pageSize: number,
}
export const SetPageSize = (pageSize: number): SetPageSizeType => {

    return {
        type: SET_PAGE_SIZE,
        pageSize: pageSize,
    }
};

type SetCurrentPageType = {
    type: typeof SET_CURRENT_PAGE,
    currentPage: number,
}
export const setCurrentPage = (page: number): SetCurrentPageType => {
    return {
        type: SET_CURRENT_PAGE,
        currentPage: page,

    }
};
type ToggleIsFetchingType = {
    type: typeof ISFETCHING,
    isFetching: boolean,
}
export const toggleIsFetching = (isFetching: boolean): ToggleIsFetchingType => {
    return {
        type: ISFETCHING,
        isFetching: isFetching,
    }
};
type ToggleIsFollowingInProgressType = {
    type: typeof TOGGLE_IN_FOLLOWING_PROGRESS,
    isFollowingInProgress: boolean,
    userId: number
}
export const toggleIsFollowingInProgress = (isFollowingInProgress: boolean, userId: number): ToggleIsFollowingInProgressType => {
    return {
        type: TOGGLE_IN_FOLLOWING_PROGRESS,
        isFollowingInProgress: isFollowingInProgress,
        userId: userId
    }
};
type FilterType = {
    'name': string | null,
    'isFollowed': boolean | null    
}
type FilterNameACType = {
    type: typeof FILTER_NAME,
    filterName: string,
}

type FilterIsFollowedACType = {
    type: typeof FILTER_IS_FOLLOWED,
    filterIsFollowed: boolean,
}
export const filterName = (filter: string): FilterNameACType => {
    return {
        type: FILTER_NAME,
        filterName: filter,
    }
};
type FilterCityACType = {
    type: typeof FILTER_CITY,
    filterCity: string,
}
export const filterCity = (filter: string): FilterCityACType => {
    return {
        type: FILTER_CITY,
        filterCity: filter,
    }
};
export const filterIsFollowed = (filter: boolean): FilterIsFollowedACType => {
    return {
        type: FILTER_IS_FOLLOWED,
        filterIsFollowed: filter,
    }
};
//end of Action Creators

//Thunks
//with typing:
//1 way
//type GetStateType = () => AppStateType
//type CurrentDispatchType = Dispatch<ActionsTypes>;
// 2 way (reccomended)
//export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>
export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>



//export const getUsers = (currentPage: number, pageSize: number, totalUsersCount, followed?: boolean ): ThunkType => async (dispatch, getState) => {
export const getUsers = (options: getUsersOptionsType ): ThunkType => async (dispatch, getState) => {
        // get loading.gif
        dispatch(toggleIsFetching(true));
        // get users from DB
        let allUsersArrayLength = await usersAPI.getAllUsersArrayLength();
        let data = await usersAPI.getUsers(options.currentPage, options.pageSize, options.followed);

        dispatch(setUsers(data));
        dispatch(setTotalUsersCount(allUsersArrayLength));
        dispatch(setCurrentPage(options.currentPage));
        dispatch(toggleIsFetching(false));
}

export const getFoundedUsers = (options: getFoundedUsersOptionsType): ThunkType => async (dispatch, getState) => {
        // get loading.gif
        //name: string, currentPage: number, pageSize: number
        dispatch(toggleIsFetching(true));
        // get users from DB
        let data = await usersAPI.getFoundedUsers(options);

        dispatch(setUsers(data));
        let optionsForGetFoundedUsersArrayLength = {
            name: options.name,
            city: options.city
        }

        let foundedUsersArrayLength = await usersAPI.getFoundedUsersArrayLength(optionsForGetFoundedUsersArrayLength);

        dispatch(setTotalUsersCount(foundedUsersArrayLength));
        dispatch(setCurrentPage(options.currentPage));
        dispatch(toggleIsFetching(false));
}

export const onFollow = (user: UserType): ThunkType => async (dispatch, getState) => {
    dispatch(toggleIsFollowingInProgress(true, user.id));
    let newUser: UserType;

    usersAPI.getUserData(user.id).then( (response: UserType) => {
        newUser = {...response};
        newUser.followed = true;

        usersAPI.updateUserData(user.id, newUser).then( (response: any) => {
            if (response.status === 200){
                dispatch(follow(user));
            }
            dispatch(toggleIsFollowingInProgress(false, user.id));
        })
    })
}
export const onUnfollow = (user: UserType): ThunkType => async (dispatch, getState) => {
    dispatch(toggleIsFollowingInProgress(true, user.id));
    let newUser: UserType;

    usersAPI.getUserData(user.id).then( (response: UserType) => {
        newUser = {...response};
        newUser.followed = false;

        usersAPI.updateUserData(user.id, newUser).then( (response: any) => {
            if (response.status === 200){
                dispatch(unfollow(user));
            }
            dispatch(toggleIsFollowingInProgress(false, user.id));
        })
    })
}

//end of thunks

export default usersReducer;