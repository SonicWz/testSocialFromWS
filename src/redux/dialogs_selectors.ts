import {AppStateType} from "./redux-store";

export const getDialogPage = (state: AppStateType) => {
	return state.dialogsPage
}
export const getIsAuth = (state: AppStateType) => {
	return state.auth.isAuth
}
export const getIsMessagesLoadingDone = (state: AppStateType) => {
	return state.dialogsPage.isMessagesLoadingDone
}
export const getActiveDialog = (state: AppStateType) => {
	return state.dialogsPage.activeDialog
}
export const getActiveMessage = (state: AppStateType) => {
	return state.dialogsPage.activeMessage
}
export const getActiveUserAvatar = (state: AppStateType) => {
	return state.dialogsPage.activeUserAvatar
}
export const getIsMessageEditing = (state: AppStateType) => {
	return state.dialogsPage.isMessageEditing
}
export const getIsNewUserAddedToDialogs = (state: AppStateType) => {
	return state.dialogsPage.isNewUserAddedToDialogs
}