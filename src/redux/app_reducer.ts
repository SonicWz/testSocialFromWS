import {setCurrentPage, setUsers, toggleIsFetching} from "./users_reducer";
import {getAuth} from "./auth_reducer";
import {usersAPI} from "../api/usersAPI";

const INITIALIZED_SUCCESS = 'INITIALIZED_SUCCESS';

let initialState = {
    initialized: false as boolean,
};
export type initialStateType = typeof initialState;

const appReducer = (state = initialState, action: any): initialStateType => {
    switch(action.type){
        case INITIALIZED_SUCCESS: {
            let stateCopy = {
                ...state,
                initialized: true,
            };
            return stateCopy;
        }
        default: {
            return state;
        }
    }
}
type initializedSuccessType = {
    type: typeof INITIALIZED_SUCCESS
}
export const initializedSuccess = () => {
    return {
        type: INITIALIZED_SUCCESS,
    }
};

//Thunks
export const initializeApp = () => {

    return (dispatch: any) => {
        let promise = dispatch(getAuth());
        Promise.all([promise]).then( () => {   // Promise.all([promise1, promise2]).then ожидаем когда все промисы зарезолвятся и диспатчим
            dispatch(initializedSuccess());
        });



    }
}

export default appReducer;