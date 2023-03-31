import React from "react";
import {useState, useEffect, useRef} from "react";
// @ts-ignore
import styles from './users.module.css';
import {useNavigate} from 'react-router-dom';
import User from './user';
import Paginator from '../../common/Paginator';
import {useForm} from 'react-hook-form';
import {getUsersOptionsType, UsersType, UserType} from "../../types/types";
import {ActionsTypes} from "../../redux/users_reducer";
import {AppStateType} from "../../redux/redux-store";
import {ThunkDispatch} from "redux-thunk";
import {useSelector, useDispatch} from 'react-redux';
import {
    getPageSize,
    getTotalUsersCount,
    getCurrentPage,
    getIsFetching,
    getFollowingInProgress,
    getUsersToPropsSuper,
    getFilterName,
    getFilterIsFollowed, getFilterCity
} from "../../redux/users_selectors";
import {
    getUsers,
    getFoundedUsers,
    onFollow,
    filterName,
    filterCity,
    filterIsFollowed
} from "../../redux/users_reducer";
// @ts-ignore
import formStyles from "../../common/forms.module.css";
import { Button } from 'antd'
import {getIsAuth} from "../../redux/profile_selectors";
import useDebouncedFunction from "../../common/Helpers";

type SearchFormValues = {
    'name': string,
};
type FilterFormValues = {
    'isFollowed': boolean
};

type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

type PropsType = {
    GetUsersFromDb: (page: number) => void,
    onChangePageSize: Function
}
type SearchNamePropsType = {}

let SearchNameField: React.FC<SearchNamePropsType> = (props) => {
    
    const currentPage = useSelector(getCurrentPage);
    const pageSize = useSelector(getPageSize);
    const dispatch: AppDispatch = useDispatch();
    const currentFilterName = useSelector(getFilterName);
    const currentFilterCity = useSelector(getFilterCity);
    const form = useRef(null);

    const [searchName, setSearchName] = useState<string>('');

    const {
        register, 
        handleSubmit, 
        formState: {errors},
    } = useForm<SearchFormValues>({
        defaultValues: {
        },
        mode: 'onChange'  
    });

    function onChange (data: any) {
        dispatch(filterName(data.name));
        setSearchName(data.name);
    }
    useEffect(() => {

            let options = {
                name: currentFilterName,
                city: currentFilterCity? currentFilterCity: null,   //if currentFilterCity
                currentPage: currentPage,
                pageSize: pageSize
            }

            dispatch( getFoundedUsers(options) );

    }, [currentFilterName]);


    const onKeyUp = (data: any) => {
        let emptyValue = '';
        //@ts-ignore
        let currentValue = form.current[0].value;

        if (currentValue == emptyValue){
            dispatch(filterName(emptyValue));
            setSearchName(emptyValue);
        }
    }

    return <>
         <form className={formStyles.userSearchForm} ref={form} onChange={ handleSubmit( useDebouncedFunction(onChange, 500, true) ) } >
            <input className={formStyles.formField}

                type="text"
                placeholder="Поиск по имени пользователя"
                {...register('name', {
                        required: true,
                       maxLength: 20
                    })
                }
                onKeyUp={onKeyUp}
            />
            {errors.name && errors.name.type==='maxLength' && <span>Максимальное количество вводимых символов равно 20</span>}
         </form>     
    </>
}

type SearchCityFormValues = {
    'city': string,
};
type SearchCityPropsType = {

};

let SearchCityField: React.FC<SearchCityPropsType> = (props) => {

    const currentPage = useSelector(getCurrentPage);
    const pageSize = useSelector(getPageSize);
    const dispatch: AppDispatch = useDispatch();
    const currentFilterCity = useSelector(getFilterCity);
    const currentFilterName = useSelector(getFilterName);
    const form = useRef(null);

    const [searchCity, setSearchCity] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SearchCityFormValues>({
        defaultValues: {
        },
        mode: 'onChange'
    });

    const onChange = (data: any) => {
        //does not work if delete the last symbol from the input field
        setSearchCity(data.city);

        dispatch(filterCity(data.city));
    }
    useEffect(() => {

        if (searchCity === '') {

        }
        let options = {
            name: currentFilterName? currentFilterName: null,   //if currentFilterName
            city: currentFilterCity,
            currentPage: currentPage,
            pageSize: pageSize
        }

        dispatch( getFoundedUsers(options) );
    }, [currentFilterCity]);

    const onKeyUp = (data: any) => {
        let emptyValue = '';
        //@ts-ignore
        let currentValue = form.current[0].value;

        if (currentValue == emptyValue){
            
            dispatch(filterName(emptyValue));
            setSearchCity(emptyValue);
        }
    }

    return <>
        <form className={formStyles.userSearchForm} ref={form}  onChange={ handleSubmit(  useDebouncedFunction(onChange, 500, true) ) } >
            <input className={formStyles.formField}
                   type="text"
                   placeholder="Поиск по городу"
                   {...register('city', {
                       required: true,
                       maxLength: 30
                   })
                   }
                   onKeyUp={onKeyUp}
            />
            {errors.city && errors.city.type==='maxLength' && <span>Максимальное количество вводимых символов равно 30</span>}
        </form>
    </>
}


let Users: React.FC<PropsType> = (props) => {

    const totalUsersCount = useSelector(getTotalUsersCount);
    const users = useSelector(getUsersToPropsSuper);
    const currentPage = useSelector(getCurrentPage);
    const pageSize = useSelector(getPageSize);
    const isFetching = useSelector(getIsFetching);
    const followingInProgress = useSelector(getFollowingInProgress);
    const currentFilterName = useSelector(getFilterName);
    const currentFilterIsFollowed = useSelector(getFilterIsFollowed);
    const isAuth = useSelector(getIsAuth);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register, 
        handleSubmit, 
        formState: {errors},
        reset,
        setValue
    } = useForm<FilterFormValues>({
        defaultValues: {

        },
        mode: 'onSubmit'  
    });
    
    const onSubmit = (data: any) => {
        dispatch(filterIsFollowed( JSON.parse(data.isFollowed) )); // using JSON.parse for convert string to boolean
        
        if (data.isFollowed === 'null'){
            let options = {
                currentPage: currentPage,
                pageSize: pageSize
            }
            dispatch(getUsers(options))
        } else{
            let options = {
                currentPage: currentPage,
                pageSize: pageSize,
                followed: data.isFollowed
            }
            dispatch(getUsers(options));
        }
                                  
        reset();
    }

    useEffect(() => {

        let searchString = `?name=${currentFilterName}&filter=${currentFilterIsFollowed}`;
        if ( currentFilterIsFollowed === JSON.parse('null') ) {
            searchString = `?name=${currentFilterName}`;
        }
        navigate({
            pathname: '/users',
            search: searchString
        })
    }, [currentFilterIsFollowed]);

    return (
        <>
            <div className={styles.usersWrap}>
                <div className={styles.usersFiltersWrap}>
                    <div className={formStyles.formFieldTitle + " " + styles.filterTitle}>Поиск:</div>
                    <SearchNameField />
                    <SearchCityField />
                    <form onSubmit={ handleSubmit(onSubmit) }>
                        <div className={formStyles.formFieldTitle + " " + styles.filterTitle}>Фильтр:</div>
                        <select className={formStyles.formSelect}
                            {...register("isFollowed", {

                                })
                            }
                        >
                            <option value="null" selected={currentFilterIsFollowed===null? true : undefined}>Все пользователи</option>
                            <option value="true" selected={currentFilterIsFollowed===true? true : undefined}>Вы подписаны</option>
                            <option value="false" selected={currentFilterIsFollowed===false? true : undefined}>Вы не подписаны</option>
                        </select>
                        <Button className={formStyles.button}  type="default" htmlType='submit'>Показать</Button>
                    </form>
                </div>
               <div className={styles.userWrap} id="usersContainer">

                    <Paginator
                        totalUsersCount={totalUsersCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        portionSize={4}
                        GetUsersFromDb={props.GetUsersFromDb}
                        onChangePageSize={props.onChangePageSize}
                    />

                    {
                        users.length != 0?
                            users.map((user) => {
                                return <User
                                    key={user.id}
                                    followingInProgress={followingInProgress}
                                    isAuth={isAuth}
                                    user={user}
                                />
                            })
                        :
                            <p className={formStyles.userSearchFormNotification}>Пользователи не найдены. Попробуйте изменить критерии поиска.</p>
                    }
                </div>
                <Paginator
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    portionSize={4}
                    GetUsersFromDb={props.GetUsersFromDb}
                    onChangePageSize={props.onChangePageSize}
                />
            </div>
        </>
    )
}

export default Users;
