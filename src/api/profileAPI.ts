import {PostType, ProfileType} from "../types/types";
import {instance} from "./api";
import {EditPostFormDataType} from "../components/posts/Post/post";

export const profileAPI = {
    getProfile(userId: number) {
        return instance.get(`profile/${userId}`).then((response) => {
            return response.data;
        })
    },
    updateProfile(userId: number, newProfile: ProfileType) {

        return instance.put(`profile/${userId}`, newProfile).then((response) => {
            return response;
        })
    },
    sendMainPhoto(file: any) {
        /*
        return instance.get(`profile/${userId}`).then( (response) => {
            return response.data;
        })
        */
    },
    getPosts() {
        return instance.get(`posts/`).then((response) => {
            return response.data;
        })
    },
    getPost(id: number) {
        return instance.get(`posts/${id}`).then((response) => {
            return response.data;
        })

    },

    addNewPost(newPost: PostType) {
        let data = this.getPosts().then((response) =>{
            newPost.id = response[response.length-1].id + 1;
            newPost = {
                "id": newPost.id,
                "title": newPost.title,
                "postText": newPost.postText,
                "likes": 0,
            }
            return instance.post(`posts`, newPost).then((response) => {
                return response.data;
            })
        });
        return data
    },
    deletePost(id: number) {
        return instance.delete(`posts/${id}`).then((response) => {
            return response.data;
        })
    },
    editPost(id: number, postData: EditPostFormDataType) {
        const data =  this.getPost(id).then( (response) => {
            const newPost = {
                "id": id,
                "title": postData.title,
                "postText": postData.content,
                "likes": response.likes
            };
            return instance.put(`posts/${id}`, newPost).then((response) => {
                return response.data;
            })
        });
        return data
    },
    addLikeToPost(id: number, newPost: PostType) {
        return instance.put(`posts/${id}`, newPost).then((response) => {
            return response.data;
        })
    },
}