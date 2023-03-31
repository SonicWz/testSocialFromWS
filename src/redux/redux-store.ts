import {combineReducers, createStore, applyMiddleware, compose } from "redux";
import profileReducer from "./profile_reducer";
import dialogsReducer from "./dialogs_reducer";
import usersReducer from "./users_reducer";
import authReducer from "./auth_reducer";
import thunkMiddleware from 'redux-thunk';
import appReducer from "./app_reducer";



let rootReducer = combineReducers(
    {
        profilePage: profileReducer,
        dialogsPage: dialogsReducer,
        usersPage: usersReducer,
        auth: authReducer,
        app: appReducer,
    }
);

/*typing of state*/
type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>
/**/

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware) ));

//let store = createStore(reducers, applyMiddleware(thunkMiddleware));  //applyMiddleware for thunks from redux

// @ts-ignore
window.store = store;

export default store;