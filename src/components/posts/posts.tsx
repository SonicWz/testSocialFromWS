import React, {memo, useEffect} from 'react';
import Post from './Post/post';
import {useForm} from "react-hook-form";
import {getProfilePage} from "../../redux/posts_selectors";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {ActionsTypes, addNewPost, getAllPosts, setPostsActionCreator} from "../../redux/profile_reducer";
import {addPostActionCreator} from "../../redux/profile_reducer";
import { Button } from 'antd';
// @ts-ignore
import formStyles from "../../common/forms.module.css";
// @ts-ignore
import styles from "./posts.module.css";
import {PostType} from "../../types/types";
import {useMarkFormFieldWithErrors} from "../../common/FormHelpers";

type AddNewPostFormPropsType = {
    newPostText: string,
    onSubmit: (data: newPostFormDataType) => void,
    onPostChange: ( text: string) => void,
}
type newPostFormDataType = {
    newPostText: string,
    newPostTitle: string
}
const AddNewPostForm: React.FC<AddNewPostFormPropsType> = (props) => {

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm<newPostFormDataType>({
        defaultValues: {

        },
        mode: 'onSubmit'
    });
    const onSubmit = (data: any) => {
        props.onSubmit(data);
        reset();
    }
    const onCancel = (e: any) => {
        e.preventDefault();
        setValue('newPostText', '');
        reset();
        props.onPostChange('');
    }
    const onFieldInput = useMarkFormFieldWithErrors(errors, 'withError');

    return (
        <form className={formStyles.addPostForm} onSubmit={ handleSubmit(onSubmit) }>
            <div className={formStyles.formFieldWrap}>
                <input
                    className={formStyles.formField}
                    placeholder="Заголовок публикации"
                    {...register('newPostTitle', {
                        required: true,
                        //onChange: (e) => {onChange(e.target.value)},
                    })
                    }
                    onInput={onFieldInput}
                />
                {errors.newPostTitle && errors.newPostTitle.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
            </div>
            <div className={formStyles.formFieldWrap}>
                <textarea
                    className={formStyles.formField}
                    placeholder="Текст публикации"
                    {...register('newPostText', {
                        required: true,
                        //onChange: (e) => {onChange(e.target.value)},
                    })
                    }
                    onInput={onFieldInput}
                />
                {errors.newPostText && errors.newPostText.type === "required" && <span className={formStyles.attention_requiredIsRequired}>Поле обязательно для заполнения</span> }
            </div>
            <div className={formStyles.addPostFormControlsWrap}>
                <Button 
                    className={formStyles.okAddPostButton}
                    type="primary" 
                    htmlType="submit"
                    >Добавить новый пост</Button>
                <Button
                    className={formStyles.cancelAddPostButton} 
                    type="default" 
                    onClick={ (e) => {onCancel(e)} } 
                    >Отмена</Button>
            </div>
        </form>
    )
}

type Posts = {

}

const Posts: React.FC<Posts> = memo( props => {

    let profilePage = useSelector(getProfilePage);

    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch( getAllPosts() );
    }, []);

    const onAddPost = (newPost: PostType) => {
        dispatch( addNewPost(newPost) );
    }
    let onPostChange = (value: string) => {

    }
    const onSubmit = (values: newPostFormDataType) => {
        let newPost = {
            "id": null,
            "title": values.newPostTitle,
            "postText": values.newPostText,
            "likes": null
         }

        onAddPost(newPost);
    }

    return (
        <div className={styles.postsWrap}>
            <div className={styles.posts}>
                <h2 className={styles.postsTitle}>Публикации</h2>
                <div className={styles.addPostFormWrap}>
                    <AddNewPostForm
                        onPostChange={onPostChange}
                        newPostText={profilePage.newPostText}
                        onSubmit={onSubmit}
                    />
                </div>
                {
                    profilePage.posts.sort((a, b)=>{return b.id - a.id}).map((elem)=>{
                        return (
                        <Post key={elem.id} id={elem.id} message={elem.postText} likeCount={elem.likes} title={elem.title} />
                        )
                    })
                }
            </div>
        </div>    
    )
  })


export default Posts;
