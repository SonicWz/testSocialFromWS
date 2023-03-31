//@ts-ignore
import styles from './post.module.css';
// @ts-ignore
import s from "../../dialogs/dialogs.module.css";
import {DeleteOutlined, EditOutlined, LikeOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../../redux/redux-store";
import {ActionsTypes, deletePost, editPost, addLikeToPost} from "../../../redux/profile_reducer";
import {useForm} from "react-hook-form";
// @ts-ignore
import formStyles from "../../../common/forms.module.css";
import {Button} from "antd";
import {PostType} from "../../../types/types";

type EditPostFormType = {
    oldTitle: string,
    oldContent: string,
    onSubmit: (data: any) => void,
    onCancel: () => void,
}
export type EditPostFormDataType = {
    title: string,
    content: string
}
const EditPostForm: React.FC<EditPostFormType> = (props) => {

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm<EditPostFormDataType>({
        defaultValues: {
            "title": props.oldTitle,
            "content": props.oldContent
        },
        mode: 'onChange'
    });
    const onSubmit = (data: any) => {
        props.onSubmit(data);
        reset();
    }
    const onCancel = (e: any) => {
        e.preventDefault();
        reset();
        props.onCancel();

    }

    return (
        <form className={formStyles.addPostForm} onSubmit={ handleSubmit(onSubmit) }>

            <input
                className={formStyles.formField}
                placeholder="Заголовок"
                {...register('title', {
                    required: 'Заполните поле',
                    //onChange: (e) => {onChange(e.target.value)},
                })
                }
            />
            {errors.title && errors.title.type === "required" && <span>Поле обязательно для заполнения</span> }
            <input
                className={formStyles.formField}
                placeholder="Текста поста"
                {...register('content', {
                    required: 'Заполните поле',
                })
                }
            />
            {errors.content && errors.content.type === "required" && <span>Поле обязательно для заполнения</span> }
            <div className={formStyles.addPostFormControlsWrap}>
                <Button
                    className={formStyles.okAddPostButton}
                    type="primary"
                    htmlType="submit"
                >ОК</Button>
                <Button
                    className={formStyles.cancelAddPostButton}
                    type="default"
                    onClick={ (e) => {onCancel(e)} }
                >Отмена</Button>
            </div>
        </form>
    )
}


type PostPropsType = {
    id: number,
    message: string,
    likeCount: number,
    title: string
}
const Post: React.FC<PostPropsType> = ( { id, message, likeCount, title } ) => {

    let [isPostEditing, SetIsPostEditing] = useState(false);
    let [localLikeCount, SetLocalLikeCount] = useState(likeCount);


    useEffect(() => {
        let post: PostType = {
            id: id,
            postText: message,
            likes: localLikeCount,
            title: title
        }

        dispatch( addLikeToPost(id, post) );
    }, [localLikeCount])

    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();

    const deleteMessage = (id: number) => {
        dispatch( deletePost(id) );
    }
    const editMessage = (id: number) => {
        SetIsPostEditing(true);
    }
    const onSubmit = (data: any) => {
        dispatch( editPost(id, data) );
        SetIsPostEditing(false);
    }
    const onCancel = () => {
        SetIsPostEditing(false);
    }
    const onLikeClick = () => {

        SetLocalLikeCount(localLikeCount+1);

    }

    return (
        <div className={styles.post}>
            <div className={styles.postInner}>
                {isPostEditing ?
                    <EditPostForm
                        oldTitle={title}
                        oldContent={message}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                    :
                    <>
                        <h2 className={styles.postTitle}>{title}</h2>
                        <p className={styles.postMessage}>{message}</p>
                    </>
                }
                <div
                    className={styles.likeCount}
                    onClick={onLikeClick}
                ><LikeOutlined />: {localLikeCount}</div>
            </div>

                <div className={styles.post__controls}>
                    <div className={styles.editMessageButton} onClick={() => {
                        editMessage(id)
                    }}>
                        <EditOutlined />
                    </div>
                    <div className={styles.deleteMessageButton} onClick={() => {
                        deleteMessage(id)
                    }}>
                        <DeleteOutlined/>
                    </div>
                </div>
        </div>
    )
  }

export default Post;
