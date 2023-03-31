import React, {useState} from 'react';
import Preloader from "../../common/Preloader";
// @ts-ignore
import defaultUserPic from '../../assets/images/user.jpeg';
import ProfileStatusWithHooks from './profileStatusWithHooks';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from "react-redux";
import {getIsOwner, getProfile, getStatus, getUserID} from "../../redux/profile_selectors";
import {ProfileType} from "../../types/types";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {ActionsTypes, FormDataType, sendMainPhoto, sendProfile} from "../../redux/profile_reducer";
import { Button, Space } from 'antd';
// @ts-ignore
import styles from '../profile/profile.module.css';
// @ts-ignore
import formStyles from "../../common/forms.module.css";
import {useMarkFormFieldWithErrors} from "../../common/FormHelpers";

type ProfileInfoPropsType = {

}

const ProfileInfo: React.FC<ProfileInfoPropsType> = (props) => {
    let isOwner = useSelector(getIsOwner);
    let profile = useSelector(getProfile);
    let status = useSelector(getStatus);
    let userID = useSelector(getUserID);

    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();

    let [editMode, setEditMode] = useState(false);

    if (!profile){
        return <Preloader />
    }

    const onMainPhotoSelected = (event: any) => {
        if (event.target.files[0].length){
            dispatch( sendMainPhoto(event.target.files[0]) );
        }
    }

    const activateEditMode = () => {
        setEditMode(true);
    }
    const deactivateEditMode = () => {
        setEditMode(false);
    }
    const onSubmit = (formData: FormDataType) => {

        let userId = userID;
        if (!userId) {
             userId = 1;
        }

        dispatch( sendProfile(userId, formData) );

        deactivateEditMode();
    }
    const onCancel = () => {
        deactivateEditMode();
    }

    return (
        <>
                <div className={styles.profileAvatarWrap}>
                    <img width={180} height={180} className ={styles.profileAvatar} src={ profile.photos.small || defaultUserPic } alt="" />
                </div>
                <ProfileStatusWithHooks
                    status={status}
                />
                {
                    !editMode ? <ProfileData profile={profile}/> :  <ProfileDataFormEdit
                        initialValues={profile}
                        profile={profile}
                        onSubmit={onSubmit}
                        onCancel={onCancel}/>
                }
                {
                    isOwner? (!editMode? <Button type="default" onClick={activateEditMode}>Редактировать</Button>:
                    null) : null
                }


        </>
     )
  }
type ProfileDataPropsType = {
    profile: ProfileType
}
const ProfileData:React.FC<ProfileDataPropsType> = (props) => {
    return <>
        <div className={styles.userCardRow}>Имя: {props.profile.fullName}</div>
        <div className={styles.userCardRow}>VK: {props.profile.contacts.vk}</div>
        <div className={styles.userCardRow}>Поиск работы: <span>{ props.profile.lookingForAJob ? "Ищу" : "Не ищу" }</span></div>
    </>
}

type ProfileDataFormEditPropsType = {
    profile: ProfileType,
    initialValues: ProfileType,
    onSubmit: Function,
    onCancel: Function,

}
type ProfileDataFormType = {
    fullName: string,
    vk: string,
    lookingForAJob: string
}
const ProfileDataFormEdit:React.FC<ProfileDataFormEditPropsType> = (props) => {
    
    const {
        register, 
        handleSubmit, 
        formState: {errors},
        reset,
        setValue
    } = useForm<ProfileDataFormType>({
        defaultValues: {
            'fullName': props.profile.fullName,            
            'vk': props.profile.contacts.vk
        },
        mode: 'onSubmit'
    });

    const onFieldInput = useMarkFormFieldWithErrors(errors, 'withError');

    const onSubmit = (data: any) => {
        props.onSubmit(data);
        reset();
    }
    const onCancel = () => {
        props.onCancel();
        reset();
    }
    return <>
         <form onSubmit={ handleSubmit(onSubmit) }
            className={formStyles.editProfileForm}
         >
             <div className={formStyles.formFieldsRow}>
                 <p className={formStyles.formFieldTitle}>Имя:</p>
                 <div className={formStyles.formFieldWrap}>
                    <input
                        className={formStyles.formField}
                        type="text"
                        placeholder="Имя пользователя"
                        {...register('fullName', {
                               required: 'Поле обязательно для заполнения'
                            })
                        }
                        onInput={onFieldInput}
                    />
                     {errors.fullName && errors.fullName.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
                 </div>
             </div>
             <div className={formStyles.formFieldsRow}>
                 <p className={formStyles.formFieldTitle}>VK:</p>
                 <div className={formStyles.formFieldWrap}>
                     <input
                         className={formStyles.formField}
                         type="text"
                         placeholder="Вконтакте"
                         {...register('vk', {
                                 required: 'Поле обязательно для заполнения'
                             })
                         }
                         onInput={onFieldInput}
                     />
                     {errors.vk && errors.vk.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
                 </div>
             </div>
             <div className={formStyles.formFieldsRow}>
                 <p className={formStyles.formFieldTitle}>Поиск работы:</p>
                     <select
                         className={formStyles.formSelect + " " + formStyles.formSelect_fullWidth}
                         placeholder="Поиск работы"
                         {...register('lookingForAJob', {
                                 required: 'Поле обязательно для заполнения'
                             })
                         }
                         onInput={onFieldInput}
                     >
                         <option className={formStyles.formOption} value="true" selected={props.profile.lookingForAJob? true: false}>Ищу</option>
                         <option value="false" selected={!props.profile.lookingForAJob? true: false}>Не ищу</option>
                     </select>
             </div>
             <div>
                <Button type="primary"
                        htmlType={'submit'}
                        className={formStyles.okEditProfileButton}
                >Готово</Button>
                 <Button type="default"
                         onClick={onCancel}
                         className={formStyles.cancelEditProfileButton}
                 >Отмена</Button>
             </div>
            
        </form>
    </>
}

export default ProfileInfo;
