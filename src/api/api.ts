import axios from "axios";
import {UserType} from "../types/types";


export const instance = axios.create({
    //baseURL: `http://localhost:3003/`,
    baseURL: `https://candle-whispering-submarine.glitch.me/`,
    withCredentials: true,
    headers: {},
});


export enum ResultCodesEnum {
    'wrongNameOrPassword' = 101,
    'needCaptcha' = 100,

}
export type getAuthAPIResponseType = {
    "id": number,
    "login": string,
    "email": string,
    "resultCode": ResultCodesEnum,
    "isAuth": boolean
}

export type getItemsAPIResponseType = {
    "users": Array<UserType>,

}
