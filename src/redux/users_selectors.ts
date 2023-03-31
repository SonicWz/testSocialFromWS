import {createSelector} from 'reselect';
import {AppStateType} from "./redux-store";

export const getUsersToProps = (state: AppStateType) => {
	return state.usersPage.users
}

export const getUsersToPropsSimple = (state: AppStateType) => {
	return state.usersPage.users
}
export const getUsersToPropsSuper = createSelector( getUsersToPropsSimple, (users) => {
	//reselect устанавливает зависимость от getUsersToPropsSimple и запускает логику только
	// если users поменялись. 
	return users;   //логика
} );


export const getPageSize = (state: AppStateType) => {
	return state.usersPage.pageSize
}
export const getTotalUsersCount = (state: AppStateType) => {
	return state.usersPage.totalUsersCount
}
export const getCurrentPage = (state: AppStateType) => {
	return state.usersPage.currentPage
}
export const getIsFetching = (state: AppStateType) => {
	return state.usersPage.isFetching
}
export const getFollowingInProgress = (state: AppStateType) => {
	return state.usersPage.followingInProgress
}
export const getFilterName = (state: AppStateType) => {
	return state.usersPage.filterName
}
export const getFilterCity = (state: AppStateType) => {
	return state.usersPage.filterCity
}
export const getFilterIsFollowed = (state: AppStateType) => {
	return state.usersPage.filterIsFollowed
}
export const getPortionNumberFromStore = (state: AppStateType) => {
	return state.usersPage.portionNumber
}
