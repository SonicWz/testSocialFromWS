import {UserType, ProfileType, getUsersOptionsType, getFoundedUsersOptionsType, getFoundedUsersArrayLengthOptionsType} from "../types/types";
import {instance, getAuthAPIResponseType, getItemsAPIResponseType} from "./api";
import {profileAPI} from "./profileAPI";
import {securityAPI} from "./securityAPI";


export type LogInType = {
    "login": string
    "password": string
}

export const usersAPI = {
    getAllUsersArrayLength(){
        return instance.get<Array<UserType>>('profile').then((response) => {
            return response.data.length;
        })
    },
    getUsers(currentPage = 1, pageSize = 10, followed?: boolean) {
        let path: string = `profile?_page=${currentPage}&_limit=${pageSize}&followed=${followed}`;
        if (followed == undefined) {
            path = `profile?_page=${currentPage}&_limit=${pageSize}`
         }

        return instance.get<Array<UserType>>(path).then((response) => {
            return response.data;
        })

    },
    getFoundedUsersArrayLength(options: getFoundedUsersArrayLengthOptionsType){
        let path: string = `profile?`;

        if (options.name != undefined) {
            path += `&fullName_like=${options.name}`
        }
        if (options.city != undefined) {
            path += `&location.city_like=${options.city}`;
        }

        return instance.get<Array<UserType>>(path).then((response) => {
            return response.data.length;
        })
    },
    getFoundedUsers(options: getFoundedUsersOptionsType) {
        let path: string = `profile?_page=${options.currentPage}&_limit=${options.pageSize}`;

        if (options.name != undefined) {
            path += `&fullName_like=${options.name}`
         }
        if (options.city != undefined) {
            path += `&location.city_like=${options.city}`;
         }

        return instance.get<Array<UserType>>(path).then((response) => {

            return response.data;
        })

    },

    getUserData(userId: number | null) {
        return instance.get<UserType>(`profile/${userId}`).then((response) => {
            return response.data;
        })
    },
    updateUserData(userId: number | null, newUser: UserType) {
        return instance.put(`profile/${userId}`, newUser).then((response) => {
            return response;
        })
    },
    getAuth() {
        return instance.get<getAuthAPIResponseType>(`auth`).then((response) => {
            return response.data;
        })
    },
    updateAuthLogin(login: string) {
        return this.getAuth().then((response) => {

            return instance.put(`auth`, {
                "id": response.id,
                "login": login,
                "email": response.email,
                "resultCode": response.resultCode,
                "isAuth": true
            }).then((response) => {
                return response;
            })

        })
    },
    /*
    updateAuthLogin(login: string) {
        return instance.put(`auth`, {
            "id": 1,
            "login": login,
            "email": "____@ya.ru",
            "resultCode": 1,
            "isAuth": true
        }).then((response) => {
            return response;
        })
    },
    */
    logIn(login: string, password: string, rememberMe: boolean = false, captcha: string, captchaRequired: boolean) {

        let error: any = {};

        if (captchaRequired) {
            return securityAPI.checkCaptcha(captcha).then((response) => {

                if (!response) { // check captcha is failed
                    //needCaptcha

                    return securityAPI.getNewCaptchaUrl().then((response)=>{
                        error.code = 100;
                        error.captchaUrl = response;

                        return error;
                    })

                }

                //check captcha is success
                return instance.get<LogInType>(`logIn`).then((response) => {
                    if ((response.data.login.toUpperCase() === login.toUpperCase()) &&
                        (response.data.password.toUpperCase() === password.toUpperCase())
                    ) {
                        //success
                        error.code = 0;
                        //return response.data;
                        return error;
                    } else {
                        //wrongNameOrPassword
                        error.code = 101;
                        return error;
                    }
                })


            })
        }

        return instance.get<LogInType>(`logIn`).then((response) => {

            if ((response.data.login.toUpperCase() === login.toUpperCase()) &&
                (response.data.password.toUpperCase() === password.toUpperCase())
            ) {
                error.code = 0;
                //return response.data;
                return error
            } else {
                error.code = 101;
                return error;
            }

        })
    },
    logOut() {

        return instance.get<getAuthAPIResponseType>(`auth`).then((response) => {

            return instance.put(`auth`, {
                "id": response.data.id,
                "login": response.data.login,
                "email": "____@ya.ru",
                "resultCode": 0,
                "isAuth": false
            }).then((response) => {
                return response;
            })

        })
    },
    getProfile(userId: number) {
        console.warn('Please use profileAPI object');
        return profileAPI.getProfile(userId);

    },
    getStatus(userId: number) {
        return instance.get(`profile/${userId}`).then((response) => {
            return response.data.status;
        })
    }
}