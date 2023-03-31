// @ts-ignore
import s from './navBar.module.css';
import { Link, useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { MailOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {useSelector} from "react-redux";
import {getProfile} from "../../redux/profile_selectors";

const items: MenuProps['items'] = [
    {
        label: (
            <Link className={s.link} to="/profile">Профиль</Link>
        ),
        key: 'profile',
        icon: <ProfileOutlined />,
    },
    {
        label: (
            <Link className={s.link} to="/dialogs">Сообщения</Link>
        ),
        key: 'dialogs',
        icon: <MailOutlined />,
    },
    {
        label: (
            <Link className={s.link} to="/users">Пользователи</Link>
        ),
        key: 'users',
        icon: <UserOutlined />,
    },

];


type NavBarPropsType = {

}

const NavBar: React.FC<NavBarPropsType> = (props) => {

    let path = useLocation();
    // @ts-ignore
    path = path.pathname.split('/')[1];

    const onClick: MenuProps['onClick'] = (e) => {

    };

    return (
      <nav className={s.nav}>
          <Menu
              onClick={onClick}
              style={{ width: '100%' }}
              // @ts-ignore
              defaultSelectedKeys={path}
              // @ts-ignore
              selectedKeys={path}
              mode="inline"
              items={items}
              />

      </nav>
  )
}

export default NavBar;
