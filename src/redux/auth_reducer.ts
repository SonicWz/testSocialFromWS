import {ResultCodesEnum} from "../api/api";
import {usersAPI} from "../api/usersAPI";
import {securityAPI} from "../api/securityAPI";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./redux-store";
import {devNull} from "os";

const SETUSERDATA = 'SET_USER_DATA';
const SET_WRONG_NAME_OR_PASSWORD = 'SET_WRONG_NAME_OR_PASSWORD';
const CHECK_CAPTCHA_REQUIRED = 'CHECK_CAPTCHA_REQUIRED';
const SET_CAPTCHA_WRONG_ATTENTION = 'SET_CAPTCHA_WRONG_ATTENTION';
const SET_CAPTCHA_IS_REQUIRED = 'SET_CAPTCHA_IS_REQUIRED';
const SET_CAPTCHA_URL = 'SET_CAPTCHA_URL';


export type InitialStateType = {
    id: number | null,
    email: string | null,
    login: string | null,
    isAuth: boolean,
    isCaptchaRequired: boolean,
    isTrustedUser: boolean,
    captchaWrongAttention: boolean,
    isWrongNameOrPassword: boolean,
    captchaUrl: string
}

let initialState: InitialStateType = {
    id: null,
    email: null,
    login: null,
    isAuth: false,
    isCaptchaRequired: false,
    isTrustedUser: true,
    captchaWrongAttention: false,
    isWrongNameOrPassword: false,
    captchaUrl: ''
};

const authReducer = (state = initialState, action: any): InitialStateType => {

    switch(action.type){
        case SETUSERDATA: {
            let stateCopy = {
                ...state,
                ...action.data,
                isAuth: action.data.isAuth,
                isTrustedUser: true
            };
            return stateCopy;
        }
        case SET_WRONG_NAME_OR_PASSWORD: {
            let stateCopy = {
                ...state,
                isWrongNameOrPassword: action.isWrongNameOrPassword
            };

            return stateCopy;
        }
        case SET_CAPTCHA_URL: {
            let stateCopy = {
                ...state,
                captchaUrl: action.captchaUrl
            };

            return stateCopy;
        }
        case CHECK_CAPTCHA_REQUIRED: {
                let stateCopy;
                if (action.captchaCounter >= 3){
                    //debugger
                    stateCopy = {
                        ...state,
                        isCaptchaRequired: true,
                        isTrustedUser: false,
                    }
                } else {
                    //debugger
                    stateCopy = {
                        ...state,
                        isCaptchaRequired: false,
                        isTrustedUser: true,
                    }
                }
                return stateCopy;
        }
        case SET_CAPTCHA_IS_REQUIRED: {
            let stateCopy;
            if (action.isCaptchaRequired){
                stateCopy = {
                    ...state,
                    isCaptchaRequired: true,
                    isTrustedUser: false,
                }
            }else {
                stateCopy = {
                    ...state,
                    isCaptchaRequired: false,
                    isTrustedUser: true,
                }
            }


            return stateCopy;
        }
        case SET_CAPTCHA_WRONG_ATTENTION: {
            
            let stateCopy = {
                ...state,
                captchaWrongAttention: action.captchaWrongAttention
            };
            
            return stateCopy;;
        } 
        default: {
            return state;
        }
    }
}

export type ActionsTypes = SetAuthUserDataType |
    CheckCaptchaRequiredType |
    SetCaptchaWrongAttentionType |
    SetWrongNameOrPasswordType |
    SetCaptchaIsRequiredType |
    SetCaptchaUrlType;

type SetAuthUserDataType = {
    type: typeof SETUSERDATA,
    data: SetAuthUserDataDataType,
}
type SetAuthUserDataDataType = {
    id: number | null,
    login: string | null,
    email: string | null,
    isAuth: boolean
}
export const setAuthUserData = (id: number | null, login: string | null, email: string | null, isAuth: boolean): SetAuthUserDataType => {
    return {
        type: SETUSERDATA,
        data: {
            id: id,
            login: login,
            email: email,
            isAuth: isAuth
        }
    }
};

type CheckCaptchaRequiredType = {
        type: typeof CHECK_CAPTCHA_REQUIRED,
        captchaCounter: number
}
export const checkCaptchaRequired = (captchaCounter: number): CheckCaptchaRequiredType => {
    return {
        type: CHECK_CAPTCHA_REQUIRED,
        captchaCounter: captchaCounter,
    }
};

type SetCaptchaWrongAttentionType = {
    type: typeof SET_CAPTCHA_WRONG_ATTENTION,
    captchaWrongAttention: boolean
}
export const setCaptchaWrongAttention = (captchaWrongAttention: boolean): SetCaptchaWrongAttentionType => {
    return {
        type: SET_CAPTCHA_WRONG_ATTENTION,
        captchaWrongAttention: captchaWrongAttention
    }
};

type SetCaptchaIsRequiredType = {
    type: typeof SET_CAPTCHA_IS_REQUIRED,
    isCaptchaRequired: boolean,
}
export const setCaptchaIsRequired = (isCaptchaRequired: boolean): SetCaptchaIsRequiredType => {
    return {
        type: SET_CAPTCHA_IS_REQUIRED,
        isCaptchaRequired: isCaptchaRequired
    }
};

type SetWrongNameOrPasswordType = {
    type: typeof SET_WRONG_NAME_OR_PASSWORD,
    isWrongNameOrPassword: boolean
}
export const SetWrongNameOrPassword = (isWrongNameOrPassword: boolean): SetWrongNameOrPasswordType => {
    return {
        type: SET_WRONG_NAME_OR_PASSWORD,
        isWrongNameOrPassword: isWrongNameOrPassword
    }
};
type SetCaptchaUrlType = {
    type: typeof SET_CAPTCHA_URL,
    captchaUrl: string
}
export const SetCaptchaUrl = (captchaUrl: string): SetCaptchaUrlType => {
    return {
        type: SET_CAPTCHA_URL,
        captchaUrl: captchaUrl
    }
};



//Thunks
export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAuth = (): ThunkType => async (dispatch, getState) => {

       let response = await usersAPI.getAuth();
       
        if ( !response.isAuth ){ return }
        if (response.resultCode != ResultCodesEnum.wrongNameOrPassword){
            let {id, login, email} = response;
            let isAuth = true;
            dispatch(setAuthUserData(id, login, email, isAuth));
        }
    }


export const logIn = (login: string, password: string, rememberMe: boolean = false, captcha: string, captchaRequired: boolean = false): ThunkType => async (dispatch) => {

    try{
        let response = await usersAPI.logIn(login, password, rememberMe, captcha, captchaRequired);

        //if (response.code === undefined){ //success logIn
        if (response.code === 0){ //success logIn

            dispatch(resetCaptchaCounter());
            dispatch(updateAuthLogin(login));
            dispatch(setCaptchaWrongAttention(false));
            dispatch( setCaptchaIsRequired(false) );
            dispatch(SetWrongNameOrPassword(false));

        } else if (response.code === ResultCodesEnum.wrongNameOrPassword){ // wrong name or password
            dispatch(getCaptchaCounterValue()).then((counterValue) => {

                // @ts-ignore
                if (counterValue > 3){
                    dispatch(resetCaptchaCounter()).then((resp)=>{
                        dispatch(getCaptchaCounter());

                        return
                    })
                }


                dispatch(getCaptchaCounter());

                dispatch(incrementCaptchaCounter());

                dispatch( setCaptchaIsRequired(false) );
                dispatch(setCaptchaWrongAttention(false));
                dispatch(SetWrongNameOrPassword(true));

            });
        } else if (response.code === ResultCodesEnum.needCaptcha){ //need captcha

            dispatch(getCaptchaCounter());
            dispatch(setCaptchaWrongAttention(true));

            dispatch(SetCaptchaUrl(response.captchaUrl));

        }
    } catch(error){
        console.log('some error');
    }
}


export const logOut = (): ThunkType => async (dispatch) => {
        let response = await usersAPI.logOut();

        let isAuth = false;
        dispatch(setAuthUserData(null, null, null, isAuth));
    }



export const updateAuthLogin = (login: string): ThunkType => async (dispatch) => {
        let response = await usersAPI.updateAuthLogin(login);

        dispatch(getAuth());
    }

export const getCaptcha = (userCaptcha: number): ThunkType => async (dispatch) => {
        let response = await securityAPI.getCaptcha();
        if (response.captchaCode === userCaptcha){
            
        }
        
    }
export const getCaptchaCounterValue = (): ThunkType => async (dispatch: any) => {
    let response = await securityAPI.getCaptchaCounter();
    return response
}
export const getCaptchaCounter = (): ThunkType => async (dispatch) => {
        let response = await securityAPI.getCaptchaCounter();

        if (response >= 3){
            dispatch( setCaptchaIsRequired(true) );
            //запрашиваем новый captchaUrl
            let newCaptchaUrl = await securityAPI.getNewCaptchaUrl();
            dispatch( SetCaptchaUrl(newCaptchaUrl) );

        } else{

        }

        //если > 3 то диспатчим новый url и iscaptchaRequired

    } 

export const incrementCaptchaCounter = (): ThunkType => async (dispatch) => {
        let response = await securityAPI.incrementCaptchaCounter();
    } 

export const resetCaptchaCounter = (): ThunkType => async (dispatch) => {
        let response = await securityAPI.resetCaptchaCounter();
    }

export default authReducer;