//@ts-ignore
import styles from './profile.module.css';
import PostsContainer from "../posts/posts-container";
import ProfileInfo from "../ProfileInfo/profileInfo";
import {useEffect} from "react";
import {getIsOwner, getProfile} from "../../redux/profile_selectors";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {
	ActionsTypes,
	addActiveDialogActionCreator,
	getAllUsersName
} from "../../redux/dialogs_reducer";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {getIsNewUserAddedToDialogs} from "../../redux/dialogs_selectors";

type ProfilePropsType = {

}
type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

const Profile: React.FC<ProfilePropsType> = (props) => {

	const IsOwner = useSelector(getIsOwner);
	const profile = useSelector(getProfile);
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	const isNewUserAddedToDialogs = useSelector(getIsNewUserAddedToDialogs);
	const navigateTo = (link: string) => {
		navigate(link);
	}

	useEffect(()=>{
		window.scrollTo(0, 0);  //scroll to top
	}, [])

	useEffect(()=>{
		if (isNewUserAddedToDialogs){
			navigateTo('/dialogs')
		}
	}, [isNewUserAddedToDialogs])

	const onWriteTo = (e: React.MouseEvent) => {

		let newUserToDialog = {
			// @ts-ignore
			'name': profile.name,
			// @ts-ignore
			'id': profile.id,
			// @ts-ignore
			'avatarSrc': profile.photos.small
		}


		dispatch(getAllUsersName(newUserToDialog));

		// @ts-ignore
		dispatch(addActiveDialogActionCreator(profile.id));  // set activeDialog to display dialogs with current user after navigateTo()


	}

    return (
    	<div className={styles.userProfile}>
        	<div className={styles.userCard}>
	            <ProfileInfo />
				{ !IsOwner ?
					<Button onClick={ onWriteTo }>Написать</Button>
					:
					null
				}
	        </div>
			{IsOwner ?
				<div className={styles.postsWrap}>
					<PostsContainer/>
				</div>
				:
				null
			}
        </div>
    )
  }

export default Profile;
