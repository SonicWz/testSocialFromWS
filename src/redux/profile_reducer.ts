import {setCurrentPage, setUsers, toggleIsFetching} from "./users_reducer";
import {PostsType, ProfileType, ContactsType, PhotosType, PostType} from "../types/types";
import {EditPostFormDataType} from '../components/posts/Post/post';
import {promises} from "dns";
import {usersAPI} from "../api/usersAPI";
import {profileAPI} from "../api/profileAPI";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./redux-store";

const ADD_POST = 'ADD-POST';
const ADD_LIKE = 'ADD_LIKE';
const SET_POSTS = 'SET-POSTS';
const UPDATE_NEW_POST_TEXT = 'UPDATE-NEW-POST-TEXT';
const SET_PROFILE = 'SET-PROFILE';
const SET_STATUS = 'SET-STATUS';
const SET_MAIN_PHOTO = 'SET-MAIN-PHOTO';
const SET_USER_ID = 'SET_USER_ID';
const SET_IS_OWNER = 'SET_IS_OWNER';


let initialState = {
    posts: [

    ] as Array<PostsType>,
    profile: null as null | ProfileType,
    userID: null as null | number,
    isOwner: false as boolean,
    status: "" as string,
    'newPostText': '' as string
    
};
type InitialStateType = typeof initialState;

const profileReducer = (state = initialState, action: any): InitialStateType => {

    switch (action.type){
        case SET_POSTS: {
            let stateCopy = {...state, posts: action.posts};
            return stateCopy;
        }
        case ADD_POST: {
            let newPost = {
                id: action.newPost.id,
                title: action.newPost.title,
                postText:  action.newPost.postText,
                likes: action.newPost.likes
            };
            let stateCopy = { ...state, posts: [...state.posts, newPost] }
            return stateCopy;
        }
        case UPDATE_NEW_POST_TEXT: {
            let stateCopy = {...state, 'newPostText': action.text};
            return stateCopy;
        }
        case SET_PROFILE: {
            let stateCopy = {...state, profile: action.profile};
            return stateCopy;
        }
        case SET_STATUS: {
            let stateCopy = {...state, status: action.status};
            return stateCopy;
        }
        case SET_USER_ID: {
            let stateCopy = {...state, userID: action.userID};
            return stateCopy;
        }
        case SET_IS_OWNER: {
            let stateCopy = {...state, isOwner: action.isOwner};
            return stateCopy;
        }
        case SET_MAIN_PHOTO: {
            //let stateCopy = {...state, profile: {...state.profile, photos: {...state.profile.photos, large: action.photo} }  };
            let stateCopy = {...state  };
            return stateCopy;
        }
        default:
            return state;
    }
}
export type ActionsTypes = AddPostActionCreatorType |
    PostChangeActionCreatorType |
    SetProfileType |
    SetStatusType |
    SetMainPhotoType |
    SetUserIDType |
    SetIsOwnerType |
    SetPostsActionCreatorType ;

type AddPostActionCreatorType = {
    type: typeof ADD_POST,
    newPost: PostType
}
export const addPostActionCreator = (newPost: PostType): AddPostActionCreatorType => {
    return {
        type: ADD_POST,
        newPost: newPost
    }
};

type SetPostsActionCreatorType = {
    type: typeof SET_POSTS,
    posts: Array<PostType>
}
export const setPostsActionCreator = (posts: Array<PostType>): SetPostsActionCreatorType => {
    return {
        type: SET_POSTS,
        posts: posts
    }
};

type PostChangeActionCreatorType = {
    type: typeof UPDATE_NEW_POST_TEXT,
    text: string,
}
export const PostChangeActionCreator = (text: string): PostChangeActionCreatorType => {
    return {
        type: UPDATE_NEW_POST_TEXT,
        text: text,
    }
};

type SetProfileType = {
    type: typeof SET_PROFILE,
    profile: ProfileType,
}
export const setProfile = (profile: ProfileType): SetProfileType => {
    return {
        type: SET_PROFILE,
        profile: profile,
    }
};

type SetStatusType = {
    type: typeof SET_STATUS,
    status: string,
}
export const setStatus = (status: string): SetStatusType => {
    return {
        type: SET_STATUS,
        status: status,
    }
};
type SetUserIDType = {
    type: typeof SET_USER_ID,
    userID: number | null,
}
export const setUserID = (userID: number | null): SetUserIDType => {
    return {
        type: SET_USER_ID,
        userID: userID,
    }
};
type SetIsOwnerType = {
    type: typeof SET_IS_OWNER,
    isOwner: boolean,
}
export const SetIsOwner = (isOwner: boolean ): SetIsOwnerType => {
    return {
        type: SET_IS_OWNER,
        isOwner: isOwner,
    }
};
type SetMainPhotoType = {
    type: typeof SET_MAIN_PHOTO,
    photo: any,
}
export const setMainPhoto = (photo: any): SetMainPhotoType => {
    return {
        type: SET_MAIN_PHOTO,
        photo: photo,
    }
};

export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getProfile = (userId: number): ThunkType => async (dispatch) => {

        let response = await usersAPI.getProfile(userId);

        dispatch(setProfile(response));
}

export const getStatus = (userId: number): ThunkType => async (dispatch) => {
        let response = await usersAPI.getStatus(userId);
        dispatch(setStatus(response));
}
export const getAllPosts = (): ThunkType => async (dispatch) => {
    let response = await profileAPI.getPosts();

    dispatch( setPostsActionCreator(response) );
}
export const addNewPost = (newPost: PostType): ThunkType => async (dispatch) => {
    let response = await profileAPI.addNewPost(newPost);
    dispatch(addPostActionCreator(response));
}

export const addLikeToPost = (id:number, newPost: PostType): ThunkType => async (dispatch) => {

    let response = await profileAPI.addLikeToPost(id, newPost);

    dispatch( getAllPosts() );
}

export const sendStatus = (userId: number| null, newStatus: string): ThunkType => async (dispatch) => {
    let response = await usersAPI.getUserData(userId);
        let newUser = {...response};
        newUser.status = newStatus;
            let responseData = await usersAPI.updateUserData(userId, newUser);
            if (responseData.status === 200){
                dispatch(setStatus(newStatus));
            }
}


export const sendMainPhoto = (file: any) => {
    return async (dispatch: any) => {
            let response: any = await profileAPI.sendMainPhoto(file);
            if (response.data.resultCOde === 0){
                let mainPhoto = response.mainPhoto;
                dispatch(setMainPhoto(mainPhoto));
            }
    }
}
export type FormDataType = {
    "fullName": string,
    "vk": string,
    "lookingForAJob": string
}
export const sendProfile = (userId: number, formData: FormDataType) => {
    return async (dispatch: any) => {

        usersAPI.getProfile(userId).then( (response: any) => {
            
            let newProfile = {...response};

            newProfile.fullName = formData.fullName;
            newProfile.contacts.vk = formData.vk;
            newProfile.lookingForAJob = JSON.parse(formData.lookingForAJob) ;

            profileAPI.updateProfile(userId, newProfile).then( (response: any) => {
               
                if (response.status === 200){
                    dispatch(setProfile(response.data));
                } 
                
            })
        })

    }
}

export const deletePost = (postId: number) => {
    return async (dispatch: any) => {

        profileAPI.deletePost(postId).then( (response: any) => {
            dispatch( getAllPosts() );
        })

    }
}
export const editPost = (postId: number, data: EditPostFormDataType) => {
    return async (dispatch: any) => {

        profileAPI.editPost(postId, data).then( (response: any) => {
            dispatch( getAllPosts() );
        })

    }
}


export default profileReducer;