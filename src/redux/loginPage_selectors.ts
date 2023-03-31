import {AppStateType} from "./redux-store";

export const getIsTrustedUser = (state: AppStateType) => {
	return state.auth.isTrustedUser
}
export const getIsAuth = (state: AppStateType) => {
	return state.auth.isAuth
}
export const getIsCaptchaRequired = (state: AppStateType) => {
	return state.auth.isCaptchaRequired
}
export const getCaptchaUrl = (state: AppStateType) => {
	return state.auth.captchaUrl
}
export const getCaptchaWrongAttention = (state: AppStateType) => {
	return state.auth.captchaWrongAttention
}
export const getWrongNameOrPassword = (state: AppStateType) => {
	return state.auth.isWrongNameOrPassword
}