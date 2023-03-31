import React, {useEffect, useState} from 'react';
import Profile from './profile';
import {useDispatch, useSelector} from "react-redux";
import {compose} from "redux";
import { useParams } from 'react-router-dom'
import {
    getProfile,
    getStatus,
    setUserID,
    SetIsOwner, ActionsTypes
} from "../../redux/profile_reducer";
import {useNavigate} from 'react-router-dom';
import {getAutorizedUserId, getIsAuth} from "../../redux/profile_selectors";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import withAuthRedirect from "../../hoc/withAuthRedirect";

type ProfileContainerPropsType = {
    match: any,
}
const ProfileContainer: React.FC<ProfileContainerPropsType> = (props) => {
    let autorizedUserId = useSelector(getAutorizedUserId);
    let isAuth = useSelector(getIsAuth);
    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();
    let userID = null;

    const [message, setMessage] = useState('');
    const number = useParams();

    const navigate = useNavigate();
    const navigateTo = (link: string) => {
        navigate(link);
    }

    const refreshProfile = () => {
        userID = props.match.params.userID;  // from App.tsx <Route path="profile/:userID"   //Use useParams() UseLocation !

        if (!userID){

            if (!autorizedUserId){
                navigateTo('/');;
            }

            userID = autorizedUserId;
            dispatch(setUserID(userID));
        } else {
            dispatch(setUserID(userID));
        }

        dispatch(getProfile(userID));
        dispatch(getStatus(userID));

        let isOwner = !props.match.params.userID;

        dispatch( SetIsOwner(isOwner) );
    }
    useEffect( () => {
        refreshProfile();

    }, []);

    useEffect( () => {
        refreshProfile();
    }, [props.match.params.userID]);

    useEffect( () => {
        refreshProfile();
    }, [isAuth]);
 
    return (
	        <div>
	            <Profile />
	        </div>
	    )
    }


/* вместо неработающего withRouter для получения параметров через хук useParams() */
export function withRouter(Children: any){
    return (props: any) => {

        const match  = {
            params: useParams()
        };
        
        return <Children {...props}  match = {match}/>
    }
}


export default compose(
        withRouter,
        withAuthRedirect
    // @ts-ignore
)(ProfileContainer)
