 import './App.css';
import NavBar from './components/navBar/navBar';
import ProfileContainer from './components/profile/profileContainer';
import {
    BrowserRouter,
    Route,
    Routes, useParams, Navigate
} from 'react-router-dom';
import DialogsContainer from "./components/dialogs/dialogsContainer";
import UsersContainer from "./components/users/usersContainer";
import HeaderContainer from "./components/header/header_Container";
import LoginPage from "./components/login/loginPage";
import React, {useEffect} from "react";
import {connect} from "react-redux";
import {compose} from "redux";
import {getAuth} from "./redux/auth_reducer";
import {initializeApp} from "./redux/app_reducer";
import Preloader from "./common/Preloader";
//@ts-ignore
import styles from './components/header/header.module.css';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

 const { Header, Content, Footer, Sider } = Layout;

 const items2: MenuProps['items'] = [
         {
             "key": 1,
             "icon": React.createElement(LaptopOutlined),
             "label": "option1"
         },
         {
             "key": 2,
             "icon": React.createElement(UserOutlined),
             "label": "option2"
         },
         {
             "key": 3,
             "icon": React.createElement(NotificationOutlined),
             "label": "option3"
         }
 ];


     type AppPropsType = {
    initializeApp: Function,
    initialized: boolean,

}

const App: React.FC<AppPropsType> = (props) => {
        const {
            token: { colorBgContainer },
        } = theme.useToken();

        useEffect( () => {
            props.initializeApp()
        }, []);

        if (!props.initialized){
            return  <Preloader />
        }

    return (

            <BrowserRouter>
                    <div className="main-wrapper">

                        <header className={styles.headerWrap}>
                            <HeaderContainer />
                        </header>
                        <main className="main-content">
                            <div className="container">
                                <div className="contentWrap">
                                    <div className='navWrap'>
                                            <NavBar />
                                    </div>

                                        <section className="content">
                                            <Routes>
                                                <Route path="/" element={
                                                    <LoginPage /> //попробовать withSuspense(Component)
                                                }
                                                />
                                                <Route path="/login" element={<LoginPage />}
                                                />
                                                <Route path="/dialogs" element={<DialogsContainer />}
                                                />
                                                <Route path="/profile/">
                                                    <Route index element={<ProfileContainer />} />
                                                    <Route path=":userID" element={<ProfileContainer />} />
                                                </Route>

                                                <Route path="/users" element={//@ts-ignore
                                                    <UsersContainer />}
                                                />
                                                <Route path="/*" element={<div>404</div>}
                                                />

                                            </Routes>
                                        </section>

                                </div>
                            </div>
                        </main>
                        <div className="footer">
                            <div className="container">
                                <p>2023</p>
                            </div>
                        </div>
                    </div>

            </BrowserRouter>

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

const mapStateToProps = (state: any) => {
    return {
        initialized: state.app.initialized,
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, {initializeApp, getAuth})
)(App);

