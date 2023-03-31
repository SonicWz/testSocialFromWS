import {AppStateType} from "./redux-store";

export const getProfile = (state: AppStateType) => {
	return state.profilePage.profile
}
export const getStatus= (state: AppStateType) => {
	return state.profilePage.status
}
export const getUserID= (state: AppStateType) => {
	return state.profilePage.userID
}
export const getAutorizedUserId= (state: AppStateType) => {
	return state.auth.id
}
export const getIsAuth= (state: AppStateType) => {
	return state.auth.isAuth
}
export const getIsOwner= (state: AppStateType) => {
	return state.profilePage.isOwner
}

