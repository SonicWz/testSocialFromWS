import React, {useEffect, useState} from 'react';
// @ts-ignore
import styles from './Paginator.module.css';
// @ts-ignore
import formStyles from "./forms.module.css";
import { Button } from 'antd'
import {ActionsTypes, SetPageSize, SetPortionNumberToStore} from "../redux/users_reducer";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../redux/redux-store";
import {getCurrentPage, getPageSize, getPortionNumberFromStore} from "../redux/users_selectors";

type PropsType = {
    totalUsersCount: number,
    pageSize: number,
    portionSize: number,
    currentPage: number,
    GetUsersFromDb: (page: number) => void
    onChangePageSize: Function
}
type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

let Paginator: React.FC<PropsType> = (props) => {

    const dispatch: AppDispatch = useDispatch();
    const portionNumberFromStore = useSelector(getPortionNumberFromStore);
    const pageSize = useSelector(getPageSize);
    const currentPage = useSelector(getCurrentPage);

	let pagesCount = Math.ceil(props.totalUsersCount / pageSize);
        let pages = [];
        for (let i=1; i <= pagesCount; i++){
            pages.push(i);
    }

     let portionCount = Math.ceil(pagesCount / props.portionSize);
     let [portionNumber, setPortionNumber] = useState(1);

    let startOfPortion = (portionNumberFromStore - 1) * props.portionSize + 1;
    let endOfPortion = portionNumberFromStore * props.portionSize;

    useEffect(() => {
        //set partion number to redux state to use it in top and bottom Paginators
        dispatch( SetPortionNumberToStore(portionNumber) );
    }, [portionNumber])

    const changePageSize = (e: any) => {
        props.onChangePageSize(Number(e.target.value))
    }

    return (
    	<>
            <div className={styles.paginator}>
                <div>
                    <label htmlFor="countSelect" className={formStyles.labelFor}>Показывать по: </label>
                    <select className={formStyles.formSelect} value={pageSize} name="countSelect"  onChange={ (e) => changePageSize(e)}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div className={formStyles.formFieldTitle + " " + styles.paginatorTitle}>
                    <span>{props.currentPage}</span> страница из <span>{ pages[pages.length-1] }</span>
                </div>

                <div className={styles.paginationWrap}>
                    {
                        portionNumberFromStore > 1 ? <Button className={formStyles.button}
                                                             type="default"
                                                             onClick={()=>{

                                                                 if (currentPage == (startOfPortion) ){
                                                                     setPortionNumber(portionNumberFromStore - 1);
                                                                 }
                                                                 props.GetUsersFromDb(currentPage - 1)
                                                            }}
                        >Назад</Button> : null
                    }
                    <ul className={styles.paginationList}>
                    {
                        pages.filter((element)=> element >= startOfPortion && element <= endOfPortion).map((elem) => {

                            return (
                                <li className={  (( elem === props.currentPage ) ? styles.selectedPage : styles.otherPage) + ' ' + styles.paginationItem }
                                    key={elem}
                                    onClick={ () => { props.GetUsersFromDb(elem) } }
                                >
                                    <span>{elem}</span>
                                </li>
                            )
                        })
                    }
                    </ul>
                    {
                        portionCount > portionNumberFromStore ? <Button className={formStyles.button}
                                                                        type="default"
                                                                        onClick={()=>{
                                                                            if (currentPage == (endOfPortion) ){
                                                                                setPortionNumber(portionNumberFromStore + 1);
                                                                            }
                                                                            //@ts-ignore
                                                                            props.GetUsersFromDb(currentPage + 1)
                                                                        }}
                        >Вперед</Button> : null
                    }
                </div>
            </div>
        </>
    )
}

export default Paginator