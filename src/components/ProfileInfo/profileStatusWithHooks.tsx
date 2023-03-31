import React, {useState, useEffect} from 'react'; 

import {getIsOwner, getProfile, getStatus, getUserID} from "../../redux/profile_selectors";
import {useDispatch, useSelector} from "react-redux";
import {ActionsTypes, sendStatus} from "../../redux/profile_reducer";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
// @ts-ignore
import styles from "../profile/profile.module.css";
// @ts-ignore
import formStyles from "../../common/forms.module.css";
import { Button, Tooltip } from 'antd';

type ProfileStatusWithHooksPropsType = {
    status: string
}

const ProfileStatusWithHooks: React.FC<ProfileStatusWithHooksPropsType> = (props) => {
    let isOwner = useSelector(getIsOwner);
    let userID = useSelector(getUserID);

    let [editMode, setEditMode] = useState(false);
    let [status, setStatus] = useState(props.status);

    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        setStatus(props.status)
    }, [props.status]);

    const activateEditMode = () => {
        setEditMode(true);
    }
    const deactivateEditMode = () => {
        setEditMode(false);
        setStatus(props.status);
    }
    const OnSendStatus = () => {
        dispatch(sendStatus(userID, status) );
        setEditMode(false);
    }
    const changeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    };
        return (
            <>
            <div className={styles.userCardRow} >Статус:
                { (editMode && isOwner) ?
                    <>
                        <div className={formStyles.statusFormWrap}>
                            <input autoFocus
                                   className={formStyles.formField}
                                    value={status}
                                    onChange={changeStatus}
                            />
                            <div>
                                <Button type="primary"
                                        onClick={  OnSendStatus }
                                        className={formStyles.okEditProfileButton}
                                >ОК</Button>
                                <Button type="default"
                                        onClick={  deactivateEditMode }
                                        className={formStyles.okEditProfileButton}
                                >Отмена</Button>
                            </div>
                        </div>
                    </> :
                    ( isOwner?
                        <Tooltip title="Нажмите для редактирования" color="geekblue" placement="topLeft">
                            <span className={styles.userStatus} onClick={activateEditMode}>{props.status}</span>
                        </Tooltip>
                            :
                       <span className="" onClick={activateEditMode}> {props.status}</span>
                    )
                }

            </div>
            
        </>
        )
     
}  

export default ProfileStatusWithHooks;
