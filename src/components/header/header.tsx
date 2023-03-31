// @ts-ignore
import s from './header.module.css';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../redux/auth_reducer";
import {getAuthEmail, getAuthId, getAuthLogin, getIsAuth} from "../../redux/header_selectors";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../../redux/redux-store";
import {ActionsTypes} from "../../redux/auth_reducer";
import { Button } from 'antd';
// @ts-ignore
import logo from '../../assets/images/logo.png'

type HeaderPropsType = {

}

type AppDispatch = ThunkDispatch<AppStateType, any, ActionsTypes>

const Header: React.FC = (props) => {

    let id = useSelector(getAuthId);
    let isAuth = useSelector(getIsAuth);
    let login = useSelector(getAuthLogin);
    let email = useSelector(getAuthEmail);

    const dispatch: AppDispatch = useDispatch();
    let logOutLocal = () => {
        dispatch(logOut());
    }

    return (
        <header className={s.header}>
            <div className="container">
                <div className={s.headerInner}>
                    <div className={s.logoWrap}>
                        <Link to="/"><img src={logo} className={s.logo} alt="На главную"/></Link>
                    </div>
                    <div className={s.loginWrap}>
                        { !isAuth ? <Link to="/login" className={s.login_link}>Войти</Link> :
                            <>
                                <div>Логин: <span className={s.login}>{login}</span></div>
                            </>
                        }
                        <div className={s.buttonLogOutWrap}>
                            { isAuth ? <Button className={s.buttonLogOut} onClick={logOutLocal}>Выйти</Button> : null}

                        </div>
                    </div>
                </div>

            </div>
        </header>
    )
  }

export default Header;