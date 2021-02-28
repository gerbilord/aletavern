import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../../baseComponents/Button'; //TODO make own components for game

import styles from '../../icebreaker.module.css';

export default function Lobby(props) {

    return (
        <div className={styles.basic_col}>
            <h1>
                Icebreaker
            </h1>
            <h2>
                Waiting for game to start.
            </h2>
        </div>
    );
}
