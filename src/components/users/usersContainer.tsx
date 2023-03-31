import React, {useEffect} from "react";
import './users.module.css';
import {useDispatch, useSelector} from "react-redux";
import {compose} from 'redux';
import {
    getFoundedUsers,
    getUsers
} from "../../redux/users_reducer";
import Users from './users';
import {AppStateType} from "../../redux/redux-store";
import {ThunkDispatch} from "redux-thunk";
import {ActionsTypes, SetPageSize} from "../../redux/users_reducer";
import {
    getCurrentPage, getFilterCity,
    getFilterName,
    getIsFetching,
    getPageSize,
    getTotalUsersCount
} from "../../redux/users_selectors";
import Preloader from "../../common/Preloader";
// @ts-ignore
import styles from './users.module.css';

type PropsType = {}

const UsersContainer: React.FC<PropsType> = (props) => {

    type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>
    const dispatch: AppDispatch = useDispatch();
    const pageSize = useSelector(getPageSize);
    const isFetching = useSelector(getIsFetching);
    const currentPage = useSelector(getCurrentPage);
    const totalUsersCount = useSelector(getTotalUsersCount);
    const filterName = useSelector(getFilterName);
    const filterCity = useSelector(getFilterCity);

    useEffect(() => {
        let options = {
            currentPage: currentPage,
            pageSize: pageSize
        }
        dispatch( getUsers(options) );

    },[]);
    useEffect(() => {
        let options = {
            currentPage: currentPage,
            pageSize: pageSize
        }
        dispatch( getUsers(options) );
    },[pageSize]);

    const onChangePageSize = (pageSize: number) => {
        dispatch( SetPageSize(pageSize) )
    }
    const GetUsersFromDb = (page: number) => {

        if (filterName || filterCity){
            let options = {
                name: filterName,
                city: filterCity,
                currentPage: page,
                pageSize: pageSize
            }
            dispatch( getFoundedUsers(options) )
        } else {
            let options = {
                currentPage: page,
                pageSize: pageSize
            }
            dispatch( getUsers(options) )
        }

        let usersContainer: any = document.querySelector('#usersContainer');
        const coordY = usersContainer.getBoundingClientRect().top + window.scrollY;
        window.scroll({
            top: coordY,
            behavior: 'smooth'
        });
    }
        return (
            <>

                <div className={styles.preloaderWrap}>
                    { isFetching ? <Preloader /> : null }
                    <Users
                        GetUsersFromDb={GetUsersFromDb}
                        onChangePageSize={onChangePageSize}
                    />
                </div>
            </>
        )
}

export default compose(
        //withAuthRedirect,
)(UsersContainer)


