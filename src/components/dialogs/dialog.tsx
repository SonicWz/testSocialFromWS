import React, {useEffect} from 'react';
import {Navigate} from 'react-router-dom';
// @ts-ignore
import s from './dialogs.module.css';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from "react-redux";
import {getDialogPage, getIsAuth, getIsMessagesLoadingDone, getActiveDialog, getActiveMessage, getIsMessageEditing} from "../../redux/dialogs_selectors";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {
    ActionsTypes,
    addMessageActionCreator,
    getMessages,
    SetMessagesLoadingDoneActionCreator,
    SetIsMessageEditingActionCreator,
    deleteMessage
} from "../../redux/dialogs_reducer";
import {MessageChangeActionCreator, addActiveDialogActionCreator, addActiveMessageActionCreator, addNewMessage, getAllUsersName, updateMessage} from "../../redux/dialogs_reducer";
import {getFoundedUsers} from "../../redux/users_reducer";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
// @ts-ignore
import formStyles from "../../common/forms.module.css";
import { Button } from 'antd'
import {getAutorizedUserId, getProfile, getUserID} from "../../redux/profile_selectors";
import {setUserID} from "../../redux/profile_reducer";


type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
type UpdateMessageFormPropsType = {
    onSubmit: any,
    elemId: number,
    oldMessageValue: string
}
const UpdateMessageForm: React.FC<UpdateMessageFormPropsType> = (props) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            "updateMessageText": props.oldMessageValue
        }
    });

    const onSubmit = (data: any) => {
        props.onSubmit(props.elemId, data.updateMessageText);
        reset();
    }
    return (
        <form className={formStyles.editMessageForm} onSubmit={ handleSubmit(onSubmit) }>
            <input
                className={formStyles.formField + " " + formStyles.editMessageFormText}
                type="text"
                {...register('updateMessageText', {
                    required: true,
                    maxLength: 800
                })
                }
            />
            {errors.updateMessageText && errors.updateMessageText.type === "maxLength" && <span>Максимальная длина поля 800 символов</span> }
            <Button type="default" htmlType="submit">ОК</Button>
        </form>
    )
}

type DialogPropsType = {
    "avatarSrc": string,
    "elem": {
        "id": number
        "message": string,
        "isOwnMessage": boolean
    }
}

const DialogElem: React.FC<DialogPropsType> = ({elem, avatarSrc}) => {
    const dispatch: AppDispatch = useDispatch();

    const dialogsPage = useSelector(getDialogPage);
    const isMessagesLoadingDone = useSelector(getIsMessagesLoadingDone);
    const isAuth = useSelector(getIsAuth);
    const activeDialog = useSelector(getActiveDialog);

    const activeMessage = useSelector(getActiveMessage);
    const isMessageEditing = useSelector(getIsMessageEditing);
    const autorizedUserId = useSelector(getAutorizedUserId);

    let userID = autorizedUserId;
    // @ts-ignore
    dispatch( setUserID(userID) );

    const profile = useSelector(getProfile);
    const defaultAvatar = '';
    const ownUserAvatar = profile? profile.photos.small : defaultAvatar;


    let setMessageIsActive = (id: number) => {
        dispatch(addActiveMessageActionCreator(id));  
    }
    let setIsMessageEditing = (id: number, editing: boolean) => {
        dispatch(SetIsMessageEditingActionCreator(id, editing));  
    }
    let updateMessage_ = (id: number, message: string) => {
        let newMessage = {
            "id": id,
            "message": message
        }
        dispatch(updateMessage(activeDialog, newMessage));
        dispatch(getMessages(activeDialog));

        setIsMessageEditing(id, false);
          
    }
    let deleteMessage_ = (messageId: number) => {
        dispatch(deleteMessage(activeDialog, messageId));
        dispatch(getMessages(activeDialog));
    }

    return (
        <div className={s.messageWrap + " " +  (elem.isOwnMessage? s.ownMessageWrap : null) }>

            <div className={s.userAvatarWrap}>
                <img className={s.userAvatar} width={60} height={60}  src={ !elem.isOwnMessage? avatarSrc : ownUserAvatar }></img>
            </div>

            <div 
                className={s.dialogs__message + " " +  (elem.isOwnMessage? s.ownMessage : null) }
                key={elem.id}
                onClick={ () => { setMessageIsActive(elem.id) }}
            >


                {(isMessageEditing.isMessageEditing && elem.id===isMessageEditing.messageId)? 
                    <div>
                        <UpdateMessageForm
                            elemId = { elem.id }
                            oldMessageValue = { elem.message }
                            onSubmit={ updateMessage_ }
                        />

                    </div>
                    : 
                    <div className={s.message}>

                        <div className={s.messageText}>{elem.message}</div>

                        {elem.isOwnMessage? (
                            <div className={s.editMessageButton} onClick={() => {setIsMessageEditing(elem.id, true)}}>
                                <EditOutlined />
                            </div>
                        ) : null}
                        {elem.isOwnMessage? (
                            <div className={s.deleteMessageButton} onClick={() => {deleteMessage_(elem.id)}}>
                                <DeleteOutlined />
                            </div>
                        ) : null}

                    </div>    
                }

            </div>            
        </div>
    )
  }

export default DialogElem;
