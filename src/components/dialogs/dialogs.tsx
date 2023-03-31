import React, {useEffect} from 'react';
import {Navigate} from 'react-router-dom';
// @ts-ignore
import s from './dialogs.module.css';
import DialogElem from './dialog';
import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {
    getDialogPage,
    getIsAuth,
    getIsMessagesLoadingDone,
    getActiveDialog,
    getActiveMessage,
    getIsMessageEditing,
    getActiveUserAvatar, getIsNewUserAddedToDialogs
} from "../../redux/dialogs_selectors";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {
    ActionsTypes,
    addMessageActionCreator,
    getMessages,
    SetMessagesLoadingDoneActionCreator,
    SetIsMessageEditingActionCreator, SetNewUserNameAddedToDialog
} from "../../redux/dialogs_reducer";
import {MessageChangeActionCreator, addActiveDialogActionCreator, addActiveMessageActionCreator, addNewMessage, getAllUsersName, updateMessage} from "../../redux/dialogs_reducer";
import {getFoundedUsers} from "../../redux/users_reducer";
import Preloader from "../../common/Preloader";
//@ts-ignore
import formStyles from "../../common/forms.module.css";
import { Button } from 'antd';
import {getAutorizedUserId, getUserID} from "../../redux/profile_selectors";
import {getProfile} from "../../redux/profile_reducer";
import {debug} from "util";
import {useMarkFormFieldWithErrors} from "../../common/FormHelpers";

type AddNewMessageFormPropsType = {
    onMessageChange: any,
    onSubmit: any,
    newMessageText: string
}
type NewMessageType = {
    'id': number,
    'message': string,
    "isOwnMessage": boolean
}
const AddNewMessageForm: React.FC<AddNewMessageFormPropsType> = (props) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm({
        mode: 'onSubmit'
    });
    const onSubmit = (data: any) => {
        props.onSubmit(data.newMessageBody);
        props.onMessageChange('');
        reset();
    }
    const onChange = (newMessageText: string) => {
        props.onMessageChange(newMessageText)
    }
    const onFieldInput = useMarkFormFieldWithErrors(errors, 'withError');

    return (
        <form className={s.addNewMessageForm} onSubmit={ handleSubmit(onSubmit) }>
            <div className={formStyles.formFieldWrap}>
            <input
                className={formStyles.formField + ' ' + s.addNewMessageField}
                type="text"
                placeholder="Текст сообщения"
                value={props.newMessageText}
                {...register('newMessageBody', {
                    required: true,
                    maxLength: 800,
                    onChange: (e) => {onChange(e.target.value)}
                })
                }
                onInput={onFieldInput}
            />
            {errors.newMessageBody && errors.newMessageBody.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
            {errors.newMessageBody && errors.newMessageBody.type === "maxLength" && <span  className={formStyles.attention_maxLength}>Максимальная длина поля 800 символов</span> }
            </div>
            <Button className={s.addNewMessageButton} type="default" htmlType="submit" >Отправить</Button>
        </form>
    )
}

type DialogsPropsType = {

}
type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

const Dialogs: React.FC<DialogsPropsType> = (props) => {

    const dialogsPage = useSelector(getDialogPage);
    const isMessagesLoadingDone = useSelector(getIsMessagesLoadingDone);
    const isAuth = useSelector(getIsAuth);
    const activeDialog = useSelector(getActiveDialog);
    const activeUserAvatar = useSelector(getActiveUserAvatar);
    const activeMessage = useSelector(getActiveMessage);
    const isMessageEditing = useSelector(getIsMessageEditing);
    const userID = useSelector(getAutorizedUserId);
    const isNewUserAddedToDialogs = useSelector(getIsNewUserAddedToDialogs);
    //const profile = useSelector(getProfile);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {

        // @ts-ignore
        dispatch(getProfile(userID));

    }, [])
    useEffect(() => {

        if (!isNewUserAddedToDialogs){
            dispatch(getAllUsersName());

            //get back authorizedUserId and it profile
            // @ts-ignore
            dispatch(getProfile(userID));

        }
        // make back isNewUserAddedToDialogs = false    to be able to go to the main page (profile)
        dispatch(SetNewUserNameAddedToDialog(false));

    }, [isNewUserAddedToDialogs]);


    useEffect(() => {

        dispatch(getMessages(activeDialog));


    }, [activeDialog]);



    let onMessageChange = (newMessageBody: string) => {
        dispatch(MessageChangeActionCreator(newMessageBody))
    }
    let onSendMessage = (newMessageBody: string) => {
        let newMessage: NewMessageType = {
            "id": activeDialog,
            "message": newMessageBody,
            "isOwnMessage": true
        }
        dispatch(addNewMessage(activeDialog, newMessage));

    }
    let onSubmit = (newMessageBody: string) => {
        onSendMessage(newMessageBody);
    }
    if(!isAuth){
        return <Navigate to={"/login"} />
    }

    let setDialogIsActive = (id: number) => {
        dispatch(addActiveDialogActionCreator(id));  
    }
    
    return (
        <div className={s.dialogsWrap}>
            <div className={s.dialogs}>
                <div className={s.dialogs__inner}>
                        <div className={s.dialogs__userWrap}>
                            <div className={s.dialogs__messagesInner}>
                                {
                                    dialogsPage.dialogs.map((elem)=>{
                                        if ( elem.id != userID ) {
                                            return <div className={(activeDialog === elem.id)? s.dialogs__user_active + " " + s.dialogs__user : s.dialogs__user } key={elem.id}
                                                        onClick={(e) => {setDialogIsActive(elem.id)} }
                                            >
                                                <div className={s.userAvatarWrap}>
                                                    <img className={s.userAvatar}  src={elem.avatarSrc}></img>
                                                </div>
                                                <div className={s.dialogs__userLink} >
                                                    <Link className={s.userlink} to={`/profile/${elem.id}`}>{elem.name}</Link>
                                                </div>
                                            </div>
                                        }

                                    })
                                }
                            </div>
                        </div>
                    <div className={s.dialogs__messagesWrap}>
                        <div className={s.dialogs__messagesInner}>
                        {
                            dialogsPage.messages.map((elem)=>{
                                return (
                                    <DialogElem 
                                        key={elem.id}
                                        elem={elem}
                                        avatarSrc={ activeUserAvatar }
                                    />
                                )


                            })
                        }
                        </div>
                    </div>
                </div>
                { activeDialog != 1?
                    <div className={s.dialogs__controls}>
                        <AddNewMessageForm
                            onSubmit={onSubmit}
                            onMessageChange={onMessageChange}
                            newMessageText={dialogsPage.newMessageText}
                        />
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
  }

export default Dialogs;
