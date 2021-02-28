import React from 'react';
import ReactDOM from 'react-dom';

import styles from '../../icebreaker.module.css';

export default function Lobby(props) {
    let { gameId} = props;

    return (
        <div className={styles.basic_col}>
            <h1>
                Icebreaker
        </h1>
            <h2>
                Room Code: {gameId}
            </h2>
            <br />
        </div>
    );

}
