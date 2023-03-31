import profileReducer from "./profile_reducer";
import dialogsReducer from "./dialogs_reducer";

const ADD_POST = 'ADD-POST';
const ADD_MESSAGE = 'ADD-MESSAGE';
const UPDATE_NEW_POST_TEXT = 'UPDATE-NEW-POST-TEXT';
const UPDATE_NEW_MESSAGE_TEXT = 'UPDATE-NEW-MESSAGE-TEXT';
let store = {
    _state : {
        profilePage: {
            posts: [
                {id: 1, postText: 'firstText', likes: 4},
                {id: 2, postText: 'secondText', likes: 2},
                {id: 3, postText: 'thirdText', likes: 3}
            ],
            'newPostText': ''
        },
        dialogsPage: {
            dialogs: [
                {id: 1, name: 'Ivan'},
                {id: 2, name: 'John'},
                {id: 3, name: 'Peter'}
            ],
            messages: [
                {id: 1, message: 'hey'},
                {id: 2, message: 'hoy'},
                {id: 3, message: 'hi1'}
            ],
            'newMessageText': ''
        }
    },
    _callSubscriber(){

    },
    getState(){
        return this._state;
    },
    subscribe(observer) {
        this._callSubscriber = observer;
    },
    dispatch(action){
        this._state.profilePage = profileReducer(this._state.profilePage, action);
        this._state.dialogsPage = dialogsReducer(this._state.dialogsPage, action);

        this._callSubscriber(this._state);

    },

}

export default store;
window.store = store;