import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {ActionsTypes, logIn} from "../../redux/auth_reducer";
import { useMarkFormFieldWithErrors, unmarkFormFieldWithErrors } from '../../common/FormHelpers';
import {Navigate} from 'react-router-dom';
import {
	getCaptchaUrl,
	getCaptchaWrongAttention,
	getIsAuth,
	getIsCaptchaRequired,
	getIsTrustedUser, getWrongNameOrPassword
} from "../../redux/loginPage_selectors";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
//@ts-ignore
import styles from './loginPage.module.css';
//@ts-ignore
import formStyles from '../../common/forms.module.css';
import '../../common/formsErrors.css';
import {Button} from 'antd';
import {useState } from 'react'
import {debug} from "util";


type LoginFormPropsType = {
	isTrustedUser: boolean,
	onSubmit(data: FormDataType): void;
}
type FormDataType = {
	login: string,
	password: string,
}

const LoginForm: React.FC<LoginFormPropsType> = (props) => {
	let isCaptchaRequired = useSelector(getIsCaptchaRequired);
	let captchaWrongAttention = useSelector(getCaptchaWrongAttention);
	let isWrongNameOrPassword = useSelector(getWrongNameOrPassword);
	let captchaSrc = useSelector(getCaptchaUrl);

	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
		control,
		setValue
	} = useForm({
		mode: 'onSubmit'
	});
	const onSubmit = (data: any) => {
		props.onSubmit(data);
		setValue('captcha', '');
	}

	const onFieldInput = useMarkFormFieldWithErrors(errors, 'withError');

	return (
		<>
			<div className={styles.authFormWrap}>
				<form onSubmit={ handleSubmit(onSubmit) }
					  className={styles.authForm}
				>
					<div className={formStyles.formFieldTitle + " " + styles.authFormTitle}>Имя пользователя:</div>
					<div className={formStyles.formFieldWrap}>
						<input
							className={ formStyles.formField }
							type="text"
							placeholder="Логин"
							{...register('login', {
								required: true,
								maxLength: 20
							})
							}
							onInput={onFieldInput}
						/>
						{errors.login && errors.login.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
						{errors.login && errors.login.type === "maxLength" && <span className={formStyles.attention_maxLength}>Максимальная длина поля 20 символов</span> }
					</div>
					<div className={formStyles.formFieldTitle + " " + styles.authFormTitle}>Пароль:</div>
					<div className={formStyles.formFieldWrap}>
						<input
							className={formStyles.formField}
							type="password"
							placeholder="Пароль"
							{...register('password', {
									required: true,
									maxLength: 20
								})
							}
							onInput={onFieldInput}
						/>
						{errors.password && errors.password.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
						{errors.password && errors.password.type === "maxLength" && <span className={formStyles.attention_maxLength}>Максимальная длина поля 20 символов</span> }
					</div>
					{isWrongNameOrPassword && <div className={formStyles.attention_wrong}>Неправильное имя пользователя или пароль</div>}
					{isCaptchaRequired &&
						<>
							<div className={formStyles.captchaImgWrap}>
								<img className={formStyles.captchaImg} src={captchaSrc} />
							</div>
							<div className={formStyles.formFieldWrap}>
								<input type={"text"}
									   className={formStyles.formField}
									   placeholder="Введите капчу"
									   {...register('captcha', {
										   required: true
									   })
									   }
									   onInput={onFieldInput}
								/>
								{errors.captcha && errors.captcha.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
							</div>
						</>
					}
					{captchaWrongAttention &&
						<>
							<div className={formStyles.wrongAttention}>Неправильно введен код</div>
						</>
					}
					<Button className={formStyles.submitButton} type="primary" htmlType="submit">Войти</Button>
				</form>
			</div>
		</>
	)
}

type LoginPropsType = {

}
type LoginOnSummitType = {
	login: string,
	password: string,
	rememberMe: boolean,
	captcha: string,
	isCaptchaRequired: boolean,
}
type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

const Login: React.FC<LoginPropsType> = (props) => {

	let isTrustedUser = useSelector(getIsTrustedUser);
	let isAuth = useSelector(getIsAuth);


	let isCaptchaRequired = useSelector(getIsCaptchaRequired);
	/*
	let captchaWrongAttention = useSelector(getCaptchaWrongAttention);
	let isWrongNameOrPassword = useSelector(getWrongNameOrPassword);
	*/

	const dispatch: AppDispatch = useDispatch();

	const onSubmit =(formData: LoginOnSummitType) => {

		dispatch(logIn(formData.login, formData.password, formData.rememberMe, formData.captcha, isCaptchaRequired));
	}

	if (isAuth){
		return <Navigate to="/profile" /> 
	}
	return	(
		<>
			<LoginForm
					onSubmit={onSubmit}
					isTrustedUser={isTrustedUser}

			/>
		</>
	)

}

export default Login