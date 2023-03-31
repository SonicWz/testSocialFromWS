import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./redux-store";
import { dialogsAPI } from "../api/dialogsAPI";
import {debug} from "util";

const ADD_ACTIVE_DIALOG = 'ADD_ACTIVE_DIALOG';
const ADD_ACTIVE_MESSAGE = 'ADD_ACTIVE_MESSAGE';
const ADD_MESSAGE = 'ADD-MESSAGE';
const UPDATE_NEW_MESSAGE_TEXT = 'UPDATE-NEW-MESSAGE-TEXT';
const SET_MESSAGES = 'SET_MESSAGES';
const SET_ACTIVE_USER_AVATAR = 'SET_ACTIVE_USER_AVATAR';
const SET_USERS_NAME = 'SET_USERS_NAME';
const SET_MESSAGES_LOADING_DONE = 'SET_MESSAGES_LOADING_DONE';
const SET_IS_MESSAGES_EDITING = 'SET_IS_MESSAGES_EDITING';
const SET_NEW_USERS_NAME = 'SET_NEW_USERS_NAME';
const SET_NEW_USER_ADDED_IN_DIALOGS = 'SET_NEW_USER_ADDED_IN_DIALOGS';

type DialogsType = {
    id: number,
    name: string,
    avatarSrc: string;
    messages: Array<MessagesType>
}
type MessagesType = {
    id: number,
    message: string,
    isOwnMessage: boolean
}

let initialState = {
    dialogs: [

    ] as Array<DialogsType>,
    messages: [
        
    ] as Array<MessagesType>,
    "activeUserAvatar": '' as string,
    'newMessageText': '' as string,
    "isMessagesLoadingDone": false,
    "isMessageEditing": {
        "messageId": 1,
        "isMessageEditing": false
    },
    "activeDialog": 1 as number,
    "activeMessage": 1 as number,
    "isNewUserAddedToDialogs": false as boolean,
};

export type InitialStateType = typeof initialState;

const dialogsReducer = (state = initialState, action: any) : InitialStateType => {
    switch(action.type){
        case ADD_MESSAGE: {

            let newMessage = {
                id: 4,
                message: action.data.messages[0],
                isOwnMessage: true
            };
            let stateCopy = { ...state, messages: [...state.messages, newMessage] };
            return stateCopy;
        }
        case ADD_ACTIVE_DIALOG: {
            let stateCopy = { ...state, activeDialog: action.activeDialog };
            return stateCopy;
        }
        case ADD_ACTIVE_MESSAGE: {
            let stateCopy = { ...state, activeMessage: action.activeMessage };
            return stateCopy;
        }
        case UPDATE_NEW_MESSAGE_TEXT: {
            let stateCopy = { ...state, newMessageText: action.text };
            return stateCopy;
        }
        case SET_NEW_USER_ADDED_IN_DIALOGS: {
            let stateCopy = { ...state, isNewUserAddedToDialogs: action.isNewUserAddedToDialogs };
            return stateCopy;
        }
        case SET_MESSAGES: {
            let stateCopy = { ...state, messages: action.data.messages };
            return stateCopy;
        }
        case SET_ACTIVE_USER_AVATAR: {
            let stateCopy = { ...state, activeUserAvatar: action.activeUserAvatar };
            return stateCopy;
        }
        case SET_USERS_NAME: {
            let stateCopy = { ...state, dialogs: action.usersName };
            return stateCopy;
        }
        case SET_NEW_USERS_NAME: {
            let stateDialogsCopy = [ ...state.dialogs ];
            stateDialogsCopy.push(action.newUser);

            let stateCopy = { ...state, dialogs: stateDialogsCopy };
            return stateCopy;
        }
        case SET_MESSAGES_LOADING_DONE: {
            let stateCopy = { ...state, isMessagesLoadingDone: action.isMessagesLoadingDone };
            return stateCopy;
        }
        case SET_IS_MESSAGES_EDITING: {
            let newIsMessageEditing = {
                "messageId": action.messageId,
                "isMessageEditing": action.isMessageEditing 
            }
            let stateCopy = { ...state, isMessageEditing: newIsMessageEditing };
            return stateCopy;
        }
        default: {
            return state;
        }
    }
}
export type ActionsTypes = addMessageActionCreatorActionType |
    MessageChangeActionCreatorActionType |
    addActiveDialogCreatorActionType |
    addActiveMessageCreatorActionType |
    SetIsMessageEditingType |
    SetMessagesActionType |
    SetMessagesLoadingDoneType |
    SetUsersNameActionCreatorType |
    SetActiveUserAvatarActionType |
    SetNewUserNameActionCreatorType |
    SetNewUserNameAddedToDialogType;

type addMessageActionCreatorActionType = {
    type: typeof ADD_MESSAGE,
    newMessageBody: string
}

export const addMessageActionCreator = (newMessageBody: string): addMessageActionCreatorActionType => {
    return {
        type: ADD_MESSAGE,
        newMessageBody: newMessageBody
    }
};

type addActiveDialogCreatorActionType = {
    type: typeof ADD_ACTIVE_DIALOG,
    activeDialog: number
}

export const addActiveDialogActionCreator = (activeDialog: number): addActiveDialogCreatorActionType => {
    return {
        type: ADD_ACTIVE_DIALOG,
        activeDialog: activeDialog
    }
};


type addActiveMessageCreatorActionType = {
    type: typeof ADD_ACTIVE_MESSAGE,
    activeMessage: number
}

export const addActiveMessageActionCreator = (activeMessage: number): addActiveMessageCreatorActionType => {
    return {
        type: ADD_ACTIVE_MESSAGE,
        activeMessage: activeMessage
    }
};


type MessageChangeActionCreatorActionType = {
    type: typeof UPDATE_NEW_MESSAGE_TEXT,
    text: string,
}
export const MessageChangeActionCreator = (text: string): MessageChangeActionCreatorActionType => {
    return {
        type: UPDATE_NEW_MESSAGE_TEXT,
        text: text,
    }
};
type SetMessagesActionType = {
    type: typeof SET_MESSAGES,
    data: any,
}
export const SetMessagesActionCreator = (data: any): SetMessagesActionType => {
    return {
        type: SET_MESSAGES,
        data: data,
    }
};

type SetActiveUserAvatarActionType = {
    type: typeof SET_ACTIVE_USER_AVATAR,
    activeUserAvatar: any,
}
export const SetActiveUserAvatarActionCreator = (activeUserAvatar: any): SetActiveUserAvatarActionType => {
    return {
        type: SET_ACTIVE_USER_AVATAR,
        activeUserAvatar: activeUserAvatar,
    }
};

type SetMessagesLoadingDoneType = {
    type: typeof SET_MESSAGES_LOADING_DONE,
    isMessagesLoadingDone: boolean,
}
export const SetMessagesLoadingDoneActionCreator = (isMessagesLoadingDone: boolean): SetMessagesLoadingDoneType => {
    return {
        type: SET_MESSAGES_LOADING_DONE,
        isMessagesLoadingDone: isMessagesLoadingDone,
    }
};
type SetIsMessageEditingType = {
    type: typeof SET_IS_MESSAGES_EDITING,
    messageId: number,
    isMessageEditing: boolean,
}
export const SetIsMessageEditingActionCreator = (messageId: number, isMessageEditing: boolean): SetIsMessageEditingType => {
    return {
        type: SET_IS_MESSAGES_EDITING,
        messageId: messageId,
        isMessageEditing: isMessageEditing,
    }
};

type usersNameType = {
    "id": number,
    "name": string
}
type userNameType = {
    "id": number,
    "name": string,
    "avatarSrc": string
}
type SetUsersNameActionCreatorType = {
    type: typeof SET_USERS_NAME,
    usersName: Array<usersNameType>,
}
export const SetUsersNameActionCreator = (usersName: Array<usersNameType>): SetUsersNameActionCreatorType => {
    return {
        type: SET_USERS_NAME,
        usersName: usersName,
    }
};
type SetNewUserNameActionCreatorType = {
    type: typeof SET_NEW_USERS_NAME,
    newUser: usersNameType,
}
export const SetNewUserNameActionCreator = (newUser: userNameType): SetNewUserNameActionCreatorType => {
    return {
        type: SET_NEW_USERS_NAME,
        newUser: newUser,
    }
};
type SetNewUserNameAddedToDialogType = {
    type: typeof SET_NEW_USER_ADDED_IN_DIALOGS,
    isNewUserAddedToDialogs: boolean,
}
export const SetNewUserNameAddedToDialog = (isNewUserAddedToDialogs: boolean): SetNewUserNameAddedToDialogType => {
    return {
        type: SET_NEW_USER_ADDED_IN_DIALOGS,
        isNewUserAddedToDialogs: isNewUserAddedToDialogs,
    }
};

export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAllUsersName = (newUserToDialog?: userNameType): ThunkType => async (dispatch, getState) => {

    // get users from DB
    let data = await dialogsAPI.getAllUsersName();

    let usersName: any = [];
    data.forEach((elem) => {
        let newUserName;
        if (elem.messages && elem.messages.length > 0){
            newUserName = {
                                "id": elem.id,
                                "name": elem.name,
                                "avatarSrc": elem.photos.small
                            };
            usersName[usersName.length] = newUserName;
        }

    });

    dispatch(SetUsersNameActionCreator(usersName));
    if (newUserToDialog){
        dispatch(SetNewUserNameActionCreator(newUserToDialog) )
        dispatch(SetNewUserNameAddedToDialog(true))
    }

}

export const getMessages = (id: number): ThunkType => async (dispatch, getState) => {

    // get users from DB
    let data = await dialogsAPI.getMessages(id);

    if (data.messages && data.messages.length > 0){
        dispatch(SetMessagesActionCreator(data));
        dispatch(SetActiveUserAvatarActionCreator(data.photos.small));
    } else{

    }

    dispatch(SetMessagesLoadingDoneActionCreator(true))

}
export type NewMessageType = {
    'id': number,
    'message': string
}
export const addNewMessage = (id: number, newMessage: NewMessageType): ThunkType => async (dispatch, getState) => {

    let data: any = await dialogsAPI.addNewMessage(id, newMessage);

    dispatch(SetMessagesActionCreator(data));

}
export const updateMessage = (id: number, newMessage: NewMessageType): ThunkType => async (dispatch, getState) => {

    let data: any = await dialogsAPI.updateMessage(id, newMessage);

    dispatch(SetMessagesActionCreator(data));
}

export const deleteMessage = (dilalogId: number, messageId: number): ThunkType => async (dispatch, getState) => {

    let data: any = await dialogsAPI.deleteMessage(dilalogId, messageId);

    dispatch(SetMessagesActionCreator(data));
}

export default dialogsReducer;