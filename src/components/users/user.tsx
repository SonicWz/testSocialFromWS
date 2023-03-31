import React from "react";
// @ts-ignore
import styles from './user.module.css';
import { Link } from 'react-router-dom';
import {onFollow, onUnfollow} from "../../redux/users_reducer";
import {UserType} from "../../types/types";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {ActionsTypes} from "../../redux/users_reducer";
import {useDispatch} from "react-redux";
import {Button} from "antd";
// @ts-ignore
import formStyles from "../../common/forms.module.css";

const UserPhoto = require('../../assets/images/user.jpeg');

type UserPropsType = {
    key: number,
    followingInProgress: Array<number>,
    user: UserType,
    isAuth: boolean
}

let User: React.FC<UserPropsType> = (props) => {
    let user: UserType = props.user;
    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();

    const unFollow = (user: UserType) => {
        dispatch( onUnfollow(user) );
    }
    const follow = (user: UserType) => {
        dispatch( onFollow(user) );
    }

    return (

         <div key={user.id} className={styles.user} >
                <div className={styles.userAvatar}>
                    <div className={styles.userAvatarInner}>
                        <Link to={"/profile/" + user.id}>
                            <img className={styles.userAvatarImg} src={user.photos.small != null ? user.photos.small : UserPhoto } alt=""/>
                        </Link>
                    </div>
                </div>
                <div className={styles.userName}>{user.fullName}</div>
                 <div className={styles.userControls}>
                    {
                        props.isAuth ?
                            user.followed ?
                                 <Button className={formStyles.button}
                                         onClick={ () => {unFollow(user)} }
                                         disabled={props.followingInProgress.some( id => id === user.id )}>
                                     Отписаться
                                 </Button>
                                :
                                 <Button className={formStyles.button}
                                         onClick={ () => {follow(user)} }
                                         disabled={props.followingInProgress.some( id => id === user.id )}>
                                     Подписаться
                                 </Button>
                        : null
                    }
                 </div>
                <ul className={styles.userInfoList}>
                    <li className={styles.userField}>{user.status}</li>
                    <li className={styles.userField}>{user.location.country}, {user.location.city}</li>
                </ul>
        </div>
    )
}

export default User;
