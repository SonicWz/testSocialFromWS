import React from 'react';
// @ts-ignore
import styles from './Preloader.module.css';
// @ts-ignore
import preloader from './loading.gif'
import { Spin } from 'antd';

let Preloader: React.FC = () => {

	return(
        <div className={styles.preloaderOuter}>
            <img className={styles.preloader} src={preloader} alt=""/>
        </div>
    )
}

export default Preloader