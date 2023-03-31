import React from 'react';
import {PostChangeActionCreator, addPostActionCreator} from "../../redux/profile_reducer";
import Posts from "./posts";
import {connect} from "react-redux";


/*
let mapStateToProps = (state) => {
    return {
        profilePage: state.profilePage
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        AddPost: (newPostText) => {
            let action = addPostActionCreator(newPostText);
            dispatch(action);
        },
        PostChange: (text) => {
            let action = PostChangeActionCreator(text);
            dispatch(action);
        },
    }
}*/
//const PostsContainer = connect(mapStateToProps, mapDispatchToProps)(Posts);
const PostsContainer: React.FC = (props) => {
    return (
        <Posts />
    )
}
export default PostsContainer;
