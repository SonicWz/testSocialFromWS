import {instance} from "./api";

export const securityAPI = {
    getCaptcha() {
        return instance.get(`security/`).then((response) => {

            return response.data;
        })
    },
    getNewCaptchaUrl() {
        return instance.get(`security/`).then((response) => {

            //let newCaptchaUrl = response.data.captchaUrls[ Math.floor(Math.random() * response.data.captchaUrls.length) ];

            //return random element from response.data.captchaUrls
            var keys = Object.keys(response.data.captchaUrls);
            let newCaptchaUrl = response.data.captchaUrls[ keys[ keys.length * Math.random() << 0] ];

            function getKeyByValue(object: any, value: any) {
                return Object.keys(object).find(key => object[key] === value);
            }

            let newCaptchaCode = getKeyByValue(response.data.captchaUrls, newCaptchaUrl);

            this.setCaptchaCode(newCaptchaCode);

            return newCaptchaUrl;
        })
    },
    setCaptchaCode(code: string | undefined){
        let response = instance.get(`security/`).then((response) => {

            let CounterCode = code;

            return instance.put(`security`, {
                "isTrustedUser": response.data.isTrustedUser,
                "captchaCode": CounterCode,
                "captchaCounter": response.data.captchaCounter,
                "captchaUrls": response.data.captchaUrls
            }).then((response) => {
                return response;
            })
        })
        return response

    },
    checkCaptcha(captcha: string) {

        return instance.get(`security/`).then((response) => {

            if (captcha.toLowerCase() === response.data.captchaCode.toLowerCase()) {

                return response.data;
            }
            return false;
        })
    },
    getCaptchaCounter() {
        return instance.get(`security/`).then((response) => {
            return response.data.captchaCounter;
        })
    },
    incrementCaptchaCounter() {
        return instance.get(`security/`).then((response) => {

            let newCounter = response.data.captchaCounter + 1;
            let newCaptchaUrls = {...response.data.captchaUrls};

            return instance.put(`security`, {
                "isTrustedUser": response.data.isTrustedUser,
                "captchaCode": response.data.captchaCode,
                "captchaCounter": newCounter,
                "captchaUrls": newCaptchaUrls
            }).then((response) => {

                return response;
            })
        })
    },
    resetCaptchaCounter() {
        return instance.get(`security/`).then((response) => {

            let newCounter = 0;
            let newCaptchaUrls = {...response.data.captchaUrls};

            return instance.put(`security`, {
                "isTrustedUser": response.data.isTrustedUser,
                "captchaCode": response.data.captchaCode,
                "captchaCounter": newCounter,
                "captchaUrls": newCaptchaUrls
            }).then((response) => {
                return response;
            })
        })
    }


}