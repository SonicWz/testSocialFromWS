import {UserType, ProfileType} from "../types/types";
import {instance, getAuthAPIResponseType, getItemsAPIResponseType} from "./api";
import {profileAPI} from "./profileAPI";
import {securityAPI} from "./securityAPI";

export type MessagesType = {
    "id": number
    "name": string,
    "messages": any
}
type NewMessageType = {
    'id': number,
    'message': string
}

export const dialogsAPI = {
    getAllUsersName() {
        //let path: string = `dialogs`;
        let path: string = `profile`;
        return instance.get<Array<any>>(path).then((response) => {
            return response.data;
        })
    },
    getMessages(id: number) {
        //let path: string = `dialogs?id=${id}`;
        let path: string = `profile?id=${id}`;
        return instance.get<Array<any>>(path).then((response) => {
            return response.data[0]
        })
    },
    addNewMessage(id: number, newMessage: NewMessageType) {
        
        let data = this.getMessages(id).then((response) =>{

            let messages = response.messages;
            if (messages.length === 0){
                newMessage.id = 1;
            } else {
                newMessage.id = response.messages[response.messages.length - 1].id + 1;
            }
            let newMessages = [...response.messages];
            newMessages.push(newMessage);
            let newMessage_ = {
                ...response,
                "messages": newMessages
            };
            
            return instance.put(`profile/${id}`, newMessage_).then((response) => {
                return response.data;
            })
        });

        return data
    },

    updateMessage(dialogId: number, newMessage: NewMessageType) {

        let data = this.getMessages(dialogId).then((response) =>{

            let newMessages = [...response.messages];
            newMessages.map((elem) => {
                if (elem.id === newMessage.id){
                    elem.message = newMessage.message
                }
                return {
                    "id": elem.id,
                    "message": elem.message 
                }
            });

            let newMessage_ = {
                ...response,
                "messages": newMessages
            };

            return instance.put(`profile/${dialogId}`, newMessage_).then((response) => {
                return response.data;
            })

        });

        return data
    },


    deleteMessage(dialogId: number, messageId: number) {
        let data = this.getMessages(dialogId).then((response) =>{

            let newMessages = [...response.messages];

            let newMessagesFiltered = newMessages.filter((item) => {
                if (item.id != messageId) {
                    return true
                }
            });

            let newMessage_ = {
                ...response,
                "messages": newMessagesFiltered
            };

            return instance.put(`profile/${dialogId}`, newMessage_).then((response) => {
                return response.data;
            })

        });

        return data
    }
}
